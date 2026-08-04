const FOLDER ={
    IMPORT  : "取り込み用_csv",
    ARCHIVE : "アーカイブ_csv",
    ERROR   : "エラー用"
} as const;

class drive {
    private folder : GoogleAppsScript.Drive.Folder;
    constructor(folder_name: typeof FOLDER[keyof typeof FOLDER]) {
        const folders = DriveApp.getFoldersByName(folder_name);
        if(!folders.hasNext()){
            throw new Error(folder_name+"フォルダがみつかりません");
        }
        this.folder = folders.next();
    }

    get_files(){
        return this.folder.getFiles();
    }

    move(file: GoogleAppsScript.Drive.File){
        file.moveTo(this.folder);
    }
}

