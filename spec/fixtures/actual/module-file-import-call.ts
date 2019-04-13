async function moduleFileImportCall() {
  const file = import("@module-file");
  const { moduleFile } = await import("@module-file");

  moduleFile();

  const { moduleFile: moduleFile2 } = await file;

  moduleFile2();

  import("@module-file").then(({ moduleFile }) => {
    moduleFile();
  });
}
