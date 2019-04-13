import { promises } from "fs";
import { join, resolve } from "path";
import compile from "../helpers/compile";
import { baseUrl, outDir as actualPath } from "../helpers/config";

const compilePath = resolve(baseUrl, "./actual");
const expectPath = resolve(baseUrl, "./expect");

compile(join(compilePath, "./*.ts"));

async function assertFilesEqual(fileName: string, fileExtension: string) {
  const [expectRaw, actualRaw] = await Promise.all([
    promises.readFile(join(expectPath, `${fileName}${fileExtension}`), {
      encoding: "utf8"
    }),
    promises.readFile(join(actualPath, `${fileName}${fileExtension}`), {
      encoding: "utf8"
    })
  ]);

  expect(expectRaw.trim()).toEqual(actualRaw.trim());
}

describe("import", () => {
  const ext = ".js";

  it("module-file-import-call", async () => {
    await assertFilesEqual("module-file-import-call", ext);
  });
  it("module-file-require-call", async () => {
    await assertFilesEqual("module-file-require-call", ext);
  });
  it("module-file-require-call", async () => {
    await assertFilesEqual("module-file-require-call", ext);
  });

  it("module-dir-import-declaration", async () => {
    await assertFilesEqual("module-dir-import-declaration", ext);
  });

  it("modules-file-import-declaration", async () => {
    await assertFilesEqual("modules-file-import-declaration", ext);
  });

  it("modules-dir-import-declaration", async () => {
    await assertFilesEqual("modules-dir-import-declaration", ext);
  });

  it("legacy-source", async () => {
    await assertFilesEqual("dir/legacy", ext);
  });
  it("legacy-import-declaration", async () => {
    await assertFilesEqual("legacy-import-declaration", ext);
  });
});

describe("export", () => {
  const ext = ".js";

  it("modele-file-export-declaration", async () => {
    await assertFilesEqual("modele-file-export-declaration", ext);
  });
});

describe("declaration", () => {
  const ext = ".d.ts";

  it("modele-file-export-declaration", async () => {
    await assertFilesEqual("modele-file-export-declaration", ext);
  });

  it("legacy-import-declaration", async () => {
    await assertFilesEqual("dir/legacy", ext);
  });
});
