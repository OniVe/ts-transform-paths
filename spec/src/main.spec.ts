import { promises } from "fs";
import { join, resolve, sep } from "path";
import compile from "../helpers/compile";
import { baseUrl, outDir as actualPath } from "../helpers/config";

const compilePath = resolve(baseUrl, "./actual");
const expectPath = resolve(baseUrl, "./expect");

compile(join(compilePath, "./*.ts"));

async function assertFilesEqual(fileName: string) {
  let [actualRaw, expectRaw] = await Promise.all([
    promises.readFile(join(actualPath, fileName), { encoding: "utf8" }),
    promises.readFile(join(expectPath, fileName), { encoding: "utf8" })
  ]);

  if (sep === "\\") {
    actualRaw = actualRaw.replace(/\\\\/g, "/");
  }

  expect(actualRaw).toEqual(expectRaw);
}

describe("paths", () => {
  it("main", async () => {
    await assertFilesEqual("main.js");
  });
});

describe("dir-paths", () => {
  it("const-file", async () => {
    await assertFilesEqual("dir/const-file.js");
  });
  it("const-index", async () => {
    await assertFilesEqual("dir/const-index.js");
  });
  it("module-file", async () => {
    await assertFilesEqual("dir/module-file.js");
  });
  it("module-index", async () => {
    await assertFilesEqual("dir/module-index.js");
  });
});

describe("sub-dir-paths", () => {
  it("const-file", async () => {
    await assertFilesEqual("dir/subdir/const-file.js");
  });
  it("const-index", async () => {
    await assertFilesEqual("dir/subdir/const-index.js");
  });
  it("module-file", async () => {
    await assertFilesEqual("dir/subdir/module-file.js");
  });
  it("module-index", async () => {
    await assertFilesEqual("dir/subdir/module-index.js");
  });
});
