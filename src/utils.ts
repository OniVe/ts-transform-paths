import * as path from "path";

const SEPARATORS = ["\\", "/"];
const WILDCARDS = ["\\*", "/*"];

export function stripWildcard(path: string): string {
  if (WILDCARDS.indexOf(path.slice(-2)) >= 0) {
    return path.substr(0, path.length - 2);
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
