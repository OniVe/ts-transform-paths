import * as ts from "typescript";
import { ITransformerOptions, PathAliasResolver } from "./types";

export default function transformer(
  program: ts.Program,
  options?: ITransformerOptions
): ts.TransformerFactory<ts.SourceFile> {
  const aliasResolver = new PathAliasResolver(program.getCompilerOptions());

  function visitNode(node: ts.Node, program: ts.Program): ts.Node {
    if (!isImportPath(node)) {
      return node;
    }

    return ts.createStringLiteral(
      aliasResolver.resolve(node.getSourceFile().fileName, node.text)
    );
  }

  function visitNodeAndChildren(
    node: ts.SourceFile,
    program: ts.Program,
    context: ts.TransformationContext
  ): ts.SourceFile;
  function visitNodeAndChildren(
    node: ts.Node,
    program: ts.Program,
    context: ts.TransformationContext
  ): ts.Node;
  function visitNodeAndChildren(
    node: ts.Node,
    program: ts.Program,
    context: ts.TransformationContext
  ): ts.Node {
    return ts.visitEachChild(
      visitNode(node, program),
      (childNode) => visitNodeAndChildren(childNode, program, context),
      context
    );
  }

  return (context: ts.TransformationContext) => (file: ts.SourceFile) =>
    visitNodeAndChildren(file, program, context);
}

function isImportPath(node: ts.Node): node is ts.StringLiteral {
  return (
    node.kind === ts.SyntaxKind.StringLiteral &&
    node.parent &&
    node.parent.kind === ts.SyntaxKind.ImportDeclaration
  );
}
