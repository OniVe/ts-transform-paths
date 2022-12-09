import * as path from "path";

const SEPARATORS = ["\\", "/"];
const WILDCARDS = ["\\*", "/*"];

export function stripWildcard(path: string): string {
  if (WILDCARDS.indexOf(path.slice(-2)) > -1) {
    return path.substring(0, path.length - 2);
  }

  return path;
}
export function replaceDoubleSlashes(filePath: string) {
  return path.normalize(filePath);
}
export function ensureTrailingPathDelimiter(searchPath: string) {
  if (!searchPath) {
    return "";
  }

  if (SEPARATORS.indexOf(searchPath.charAt(searchPath.length - 1)) < 0) {
    return searchPath + path.sep;
  }

  return searchPath;
}

export function getAlias(requestedModule: string) {
  for (let i = 0; i < requestedModule.length; i++) {
    if (SEPARATORS.indexOf(requestedModule[i]) > -1) {
      return requestedModule.substring(0, i);
    }
  }

  return requestedModule;
}
