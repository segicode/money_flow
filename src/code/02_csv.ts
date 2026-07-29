function import_csv(){
    const import_folder_name = "取り込み用_csv";
    const archive_folder_name = "アーカイブ_csv";
    const error_folder_name = "エラー用";
    const sheet_name = "csvデータ";
    const fixed_name = "固定出費";

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheet_name);

    if(!sheet){
        throw new Error("「"+sheet_name+"」のシートが見つかりません");
    };
    
    const fixed_sheet = ss.getSheetByName(fixed_name);
    if(!fixed_sheet){
        throw new Error("「"+fixed_name+"」のシートが見つかりません");
    };

    const lastrow = sheet.getLastRow();
    const keyIds = lastrow < 1
        ? []
        : sheet.getRange(1, 4, lastrow).getValues().flat();

    const fixed_data = fixed_sheet.getDataRange().getValues();

    if (!DriveApp.getFoldersByName(import_folder_name).hasNext()){
        throw new Error("「"+import_folder_name+"」フォルダがみつかりません")
    }
    const csv_folder = DriveApp.getFoldersByName(import_folder_name).next();

    if(!DriveApp.getFoldersByName(archive_folder_name).hasNext()){
        throw new Error("「"+archive_folder_name+"」フォルダがみつかりません")
    }
    const archive_folder = DriveApp.getFoldersByName(archive_folder_name).next();

    if(!DriveApp.getFoldersByName(error_folder_name).hasNext()){
        throw new Error("「"+error_folder_name+"」フォルダがみつかりません")
    }
    const error_folder = DriveApp.getFoldersByName(error_folder_name).next();


    const files = csv_folder.getFiles();

    let start_date = null;
    let end_date = null;

    let insert_count = 0;
    let error_text = "";
    

    while (files.hasNext()){
        const file = files.next();
        const file_name = file.getName().toLowerCase();
        if (!file_name.startsWith("transactions") || !file_name.endsWith(".csv")){
            error_text += file_name +"/n";
            file.moveTo(error_folder);
            continue;
        }
        //ここら辺にファイル名でのフィルターを付ける
        const csv_data = Utilities.parseCsv(
            file.getBlob().getDataAsString("UTF-8")
        );

        const dates = csv_data
            .slice(1) // ヘッダー除外
            .map(row => new Date(row[0]).getTime());

            start_date = start_date === null || start_date > Math.min(...dates) ? Math.min(...dates) : start_date;
            end_date   = end_date   === null || end_date   < Math.max(...dates) ? Math.max(...dates) : end_date;

        for (let i = 1; i < csv_data.length; i++){
            const row = csv_data[i];
            /*
            0,利用日 〇
            1,出勤金額 〇
            2,入金金額
            3,海外出金金額
            4,通貨
            5,変換レート
            6,利用国
            7,取引内容 △filter
            8,取引先 〇
            9,取引方法
            10,支払区分
            11,利用者
            12,取引番号 〇
            */

            const date = row[0];
            const expence = Number(row[1].replace(/,/g,""));
            const payment_type = row[7]
            const store = row[8].split("-")[0];
            const keyId = row[12];

            if (payment_type  !== "支払い") continue;
            if (keyIds.includes(keyId)) continue;

            sheet.appendRow([
                date,
                store,
                expence,
                keyId
            ]);

            keyIds.push(keyId);
            insert_count++;
        }

        file.moveTo(archive_folder);
    }

    if(start_date && end_date){
        let current_date = new Date(
            new Date(start_date).getFullYear(),
            new Date(start_date).getMonth(),
            1
        );

        let output  = [];

        while(current_date <= new Date(end_date)){
            fixed_data.forEach((row,index)  => {
                
                const keyid = Number(String(current_date.getFullYear()) + String(current_date.getMonth()).padStart(2,"0") + String(index).padStart(4, "0"));
                if (keyIds.includes(keyid)) return;

                sheet.appendRow([
                    new Date(current_date.getFullYear(), current_date.getMonth()+1, 0),
                    row[0],
                    row[1],
                    keyid
                ])

                keyIds.push(keyid);
                insert_count++;
            })
            current_date.setMonth(current_date.getMonth()+1);
        };
    };

    SpreadsheetApp.flush();

    if(insert_count > 0){
        Logger.log(insert_count+"件の取引を追加しました");
    } else {
        Logger.log("新しい取引はありませんでした");
    };

    return insert_count;
}