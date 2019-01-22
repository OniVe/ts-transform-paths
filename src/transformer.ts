import * as ts from "typescript";
import { ITransformerOptions, PathAliasResolver } from "./types";

export default function transformer(
  program: ts.Program,
  options?: ITransformerOptions
): ts.TransformerFactory<ts.SourceFile> {
  return function optionsFactory(context: ts.TransformationContext) {
    return transformerFactory(context, options);
  };
}

export function transformerFactory(
  context: ts.TransformationContext,
  options?: ITransformerOptions
) {
  const aliasResolver = new PathAliasResolver(context.getCompilerOptions());

  function visitNode(node: ts.Node): ts.Node {
    if (!isImportPath(node)) {
      return node;
    }

    return ts.createStringLiteral(
      aliasResolver.resolve(node.getSourceFile().fileName, node.text)
    );
  }

  function visitNodeAndChildren(
    node: ts.SourceFile,
    context: ts.TransformationContext
  ): ts.SourceFile;
  function visitNodeAndChildren(
    node: ts.Node,
    context: ts.TransformationContext
  ): ts.Node;
  function visitNodeAndChildren(
    node: ts.Node,
    context: ts.TransformationContext
  ): ts.Node {
    return ts.visitEachChild(
      visitNode(node),
      (childNode) => visitNodeAndChildren(childNode, context),
      context
    );
  }

  return (file: ts.SourceFile) => visitNodeAndChildren(file, context);
}

function isImportPath(node: ts.Node): node is ts.StringLiteral {
  return (
    node.kind === ts.SyntaxKind.StringLiteral &&
    node.parent &&
    node.parent.kind === ts.SyntaxKind.ImportDeclaration
  );
}
