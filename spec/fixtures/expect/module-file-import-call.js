function moduleFileImportCall() {
    return __awaiter(this, void 0, void 0, function* () {
        const file = import("./dir/module-file");
        const { moduleFile } = yield import("./dir/module-file");
        moduleFile();
        const { moduleFile: moduleFile2 } = yield file;
        moduleFile2();
        import("./dir/module-file").then(({ moduleFile }) => {
            moduleFile();
        });
    });
}
