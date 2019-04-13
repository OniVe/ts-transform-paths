import * as ts from "typescript";
import AliasResolver from "./alias-resolver";
import { chainBundle, isImportCall, isRequireCall } from "./ts-helpers";
import { ITransformerOptions, Transformer, TransformerNode } from "./types";

export default function transformer(
  program?: ts.Program,
  options?: ITransformerOptions
): Transformer {
  function optionsFactory<T extends TransformerNode>(
    context: ts.TransformationContext
  ): ts.Transformer<T> {
    return transformerFactory(context, options);
  }

  return {
    before: [optionsFactory],
    afterDeclarations: [optionsFactory]
  };
}

export function transformerFactory<T extends TransformerNode>(
  context: ts.TransformationContext,
  options?: ITransformerOptions
): ts.Transformer<T> {
  const aliasResolver = new AliasResolver(context.getCompilerOptions());

  function transformSourceFile(sourceFile: ts.SourceFile) {
    function getResolvedPathNode(node: ts.StringLiteral) {
      const resolvedPath = aliasResolver.resolve(
        sourceFile.fileName,
        node.text
      );
      return resolvedPath !== node.text
        ? ts.createStringLiteral(resolvedPath)
        : null;
    }

    function pathReplacer(node: ts.Node): ts.Node {
      if (ts.isStringLiteral(node)) {
        return getResolvedPathNode(node) || node;
      }
      return ts.visitEachChild(node, pathReplacer, context);
    }

    function visitor(node: ts.Node): ts.Node {
      /**
       * e.g.
       * - const x = require('path');
       * - const x = import('path');
       */
      if (isRequireCall(node, false) || isImportCall(node)) {
        return ts.visitEachChild(node, pathReplacer, context);
      }

      /**
       * e.g.
       * - import * as x from 'path';
       * - import { x } from 'path';
       */
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        return ts.visitEachChild(node, pathReplacer, context);
      }

      /**
       * e.g.
       * - export { x } from 'path';
       */
      if (
        ts.isExportDeclaration(node) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        return ts.visitEachChild(node, pathReplacer, context);
      }

      return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitEachChild(sourceFile, visitor, context);
  }

  return chainBundle(transformSourceFile);
}
