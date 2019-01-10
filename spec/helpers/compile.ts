import { sync as globSync } from "glob";
import { sync as rimrafSync } from "rimraf";
import { loadSync as tsconfigSync } from "tsconfig";
import * as ts from "typescript";
import { transformer } from "../../src/transformer";
import { baseUrl, outDir } from "./config";

rimrafSync(outDir);

export default function compile(input: string) {
  const loadResult = tsconfigSync(baseUrl);
  const files = globSync(input);

  const { options, errors } = ts.convertCompilerOptionsFromJson(
    loadResult.config.compilerOptions,
    baseUrl
  );
  for (const diagnostic of errors) {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start || -1
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    }
  }
  if (errors.length > 0) {
    return;
  }
  const compilerHost = ts.createCompilerHost(options);
  const program = ts.createProgram(files, options, compilerHost);

  const emitResult = program.emit(undefined, undefined, undefined, undefined, {
    before: [transformer(program)]
  });

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  for (const diagnostic of allDiagnostics) {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start || -1
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    }
  }
}
