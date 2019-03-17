import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import {
  ensureTrailingPathDelimiter,
  getAlias,
  replaceDoubleSlashes,
  stripWildcard
} from "./utils";

const REGEXP_ALL_BACKSLASH = /\\/g;

export interface ITransformerOptions {}

export class ProjectOptions {
  public readonly baseUrl: string;
  public readonly outDir: string;

  private aliases: string[] = [];
  private paths: string[] = [];

  constructor(compilerOptions: ts.CompilerOptions) {
    this.baseUrl = compilerOptions.baseUrl || __dirname;
    this.outDir = compilerOptions.outDir || this.baseUrl;
    this.processMappings(compilerOptions.paths || {});
  }

  public getMapping(requestedModule: string) {
    const alias = getAlias(requestedModule);

    const index = this.aliases.indexOf(alias);
    if (index < 0) {
      return null;
    }

    let mapping = this.paths[index];

    mapping = requestedModule.replace(alias, mapping);
    mapping = replaceDoubleSlashes(mapping);
    mapping = ensureTrailingPathDelimiter(mapping);

    return mapping;
  }

  private processMappings(paths: any) {
    for (const alias in paths) {
      this.aliases.push(stripWildcard(alias));
      this.paths.push(stripWildcard(paths[alias][0]));
    }
  }
}

export class PathAliasResolver {
  readonly srcPath: string;
  readonly outPath: string;
  readonly options: ProjectOptions;

  constructor(compilerOptions: ts.CompilerOptions) {
    const projectPath = process.cwd();

    this.options = new ProjectOptions(compilerOptions);
    this.srcPath = path.normalize(path.resolve(projectPath, this.options.baseUrl || "."));
    this.outPath = path.normalize(path.resolve(projectPath, this.options.outDir || "."));
  }

  public resolve(fileName: string, requestedModule: string) {
    const mapping = this.options.getMapping(requestedModule);
    if (mapping) {
      const absoluteJsRequire = path.join(this.srcPath, mapping);
      const sourceDir = path.dirname(fileName);

      let relativePath = path.relative(sourceDir, absoluteJsRequire);

      /* If the path does not start with .. it´ not a sub directory
       * as in ../ or ..\ so assume it´ the same dir...
       */
      if (relativePath[0] != ".") {
        relativePath = "." + path.sep + relativePath;
      }

      return relativePath.replace(REGEXP_ALL_BACKSLASH, "/");
    } else {
      if (this.srcPath != this.outPath && requestedModule[0] == ".") {
        const normalizedFileName = path.normalize(fileName);
        
        let relativeModulePath = normalizedFileName.replace(this.srcPath, "");

        let lookupFile = requestedModule;

        if (!lookupFile.endsWith(".js")) {
          lookupFile = `${requestedModule}.js`;
        }

        const relativeSrcModulePath = path.join(
          this.srcPath,
          path.dirname(relativeModulePath),
          lookupFile
        );

        console.log(requestedModule, relativeSrcModulePath);

        if (fs.existsSync(relativeSrcModulePath)) {
          // if a JS file exists in path within src directory, assume it will not be transpiled
          return path
            .relative(
              normalizedFileName.replace(this.srcPath, this.outPath),
              relativeSrcModulePath
            )
            .replace(/^\.\.\//g, "");
        }
      }

      return requestedModule;
    }
  }
}
