import * as ts from "typescript";

export function isRequireCall(
  node: ts.Node,
  checkArgumentIsStringLiteralLike: boolean
): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) {
    return false;
  }
  const { expression, arguments: args } = node;
  if (!ts.isIdentifier(expression) || expression.escapedText !== "require") {
    return false;
  }
  if (args.length !== 1) {
    return false;
  }
  const [arg] = args;

  return !checkArgumentIsStringLiteralLike || ts.isStringLiteralLike(arg);
}

export function isImportCall(node: ts.Node): node is ts.CallExpression {
  return (
    ts.isCallExpression(node) &&
    node.expression.kind === ts.SyntaxKind.ImportKeyword
  );
}

export function chainBundle<T extends ts.SourceFile | ts.Bundle>(
  transformSourceFile: (x: ts.SourceFile) => ts.SourceFile
): (x: T) => T {
  function transformBundle(node: ts.Bundle) {
    return ts.factory.createBundle(
      node.sourceFiles.map(transformSourceFile),
      node.prepends
    );
  }

  return function transformSourceFileOrBundle(node: T) {
    return ts.isSourceFile(node)
      ? (transformSourceFile(node) as T)
      : (transformBundle(node as ts.Bundle) as T);
  };
}
