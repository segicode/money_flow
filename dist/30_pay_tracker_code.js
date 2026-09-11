"use strict";
function get_pay_data() {
    const expense_data = [];
    const category_obj = get_category_obj();
    const data = new ss(SHEETS.CSV).get_data().map(row => row.slice(0, 4));
    data.forEach(row => {
        if (!row[0])
            return;
        const date = Utilities.formatDate(new Date(row[0]), "Asia/Tokyo", "yyyy/MM/dd");
        const store = row[1] == null ? "" : row[1];
        const category = Object.keys(category_obj).find(key => category_obj[key].data.includes(store)) || "???";
        const color = category !== "???" ? category_obj[category]?.color || "#EF9A9A" : "#EF9A9A";
        const expense = row[2] == null ? "" : String(row[2]);
        expense_data.push([false, date, store, category, String(color), expense, "0"]);
    });
    return { expense_data, category_obj };
}
function get_category_obj() {
    const data = new ss(SHEETS.CATEGORY).get_data();
    const category_obj = {};
    data.forEach(row => {
        category_obj[String(row[0])] = { logo: String(row[1]), color: String(row[2]), data: [] };
        row.slice(3).forEach(value => {
            if (value !== "")
                category_obj[String(row[0])].data.push(String(value));
        });
    });
    return category_obj;
}
function add_genre(genre, value) {
    new ss(SHEETS.CATEGORY).add_genre(genre, value);
}
function import_csv() {
    const csv_sheet = new ss(SHEETS.CSV);
    const keyids = csv_sheet.get_data().map(row => row[3]);
    const fixed_data = new ss(SHEETS.FIXED).get_data();
    const import_folder = new drive(FOLDER.IMPORT);
    const archive_folder = new drive(FOLDER.ARCHIVE);
    const error_folder = new drive(FOLDER.ERROR);
    let start_date = null;
    let end_date = null;
    let insert_count = 0;
    let error_text = "";
    const files = import_folder.get_files();
    while (files.hasNext()) {
        const file = files.next();
        const file_name = file.getName().toLowerCase();
        if (!file_name.startsWith("transactions") || !file_name.endsWith(".csv")) {
            error_text += file_name + "/n";
            error_folder.move(file);
            continue;
        }
        ;
        const csv_data = Utilities.parseCsv(file.getBlob().getDataAsString("UTF-8"));
        const dates = csv_data.slice(1).map(row => new Date(row[0]).getTime());
        start_date = start_date === null || start_date > Math.min(...dates) ? Math.min(...dates) : start_date;
        end_date = end_date === null || end_date < Math.max(...dates) ? Math.max(...dates) : end_date;
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
        csv_data.forEach(row => {
            const date = row[0];
            const expence = Number(row[1].replace(/,/g, ""));
            const payment_type = row[7];
            const store = row[8].split("-")[0];
            const keyId = row[12];
            if (payment_type !== "支払い")
                return;
            if (keyids.includes(keyId))
                return;
            csv_sheet.appendrow([
                date,
                store,
                expence,
                keyId
            ]);
            keyids.push(keyId);
            insert_count++;
        });
        archive_folder.move(file);
    }
    if (start_date && end_date) {
        let current_date = new Date(new Date(start_date).getFullYear(), new Date(start_date).getMonth(), 1);
        let output = [];
        while (current_date <= new Date(end_date)) {
            fixed_data.forEach((row, index) => {
                const keyid = Number(String(current_date.getFullYear()) + String(current_date.getMonth()).padStart(2, "0") + String(index).padStart(4, "0"));
                if (keyids.includes(keyid))
                    return;
                csv_sheet.appendrow([
                    new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0),
                    row[0],
                    row[1],
                    keyid
                ]);
                keyids.push(keyid);
                insert_count++;
            });
            current_date.setMonth(current_date.getMonth() + 1);
        }
        ;
    }
    ;
    SpreadsheetApp.flush();
    if (insert_count > 0) {
        Logger.log(insert_count + "件の取引を追加しました");
    }
    else {
        Logger.log("新しい取引はありませんでした");
    }
    ;
    return insert_count;
}
