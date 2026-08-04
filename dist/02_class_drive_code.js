"use strict";
const FOLDER = {
    IMPORT: "取り込み用_csv",
    ARCHIVE: "アーカイブ_csv",
    ERROR: "エラー用"
};
class drive {
    constructor(folder_name) {
        const folders = DriveApp.getFoldersByName(folder_name);
        if (!folders.hasNext()) {
            throw new Error(folder_name + "フォルダがみつかりません");
        }
        this.folder = folders.next();
    }
    get_files() {
        return this.folder.getFiles();
    }
    move(file) {
        file.moveTo(this.folder);
    }
}
