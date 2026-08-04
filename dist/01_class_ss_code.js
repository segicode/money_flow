"use strict";
const SHEETS = {
    CSV: "csvデータ",
    CATEGORY: "カテゴリー",
    FIXED: "固定費"
};
class ss {
    constructor(sheetname) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetname);
        if (!sheet) {
            throw new Error(sheetname + "シートが見つかりません");
        }
        ;
        this.sheet = sheet;
    }
    get_data() {
        const data = this.sheet.getDataRange().getValues();
        return data;
    }
    get_expencedata() {
        const data = this.get_data();
        data.forEach(row => {
            row[0] = Utilities.formatDate(new Date(row[0]), "Asia/Tokyo", "yyyy/MM/dd");
        });
        return data;
    }
    get_genre() {
        const data = this.get_data();
        const genre_obj = {};
        data.forEach(row => {
            row.slice(1).forEach(value => {
                if (value !== "")
                    genre_obj[value] = row[0];
            });
        });
        return genre_obj;
    }
    add_genre(genre, value) {
        const data = this.get_data();
        const row = data.findIndex(r => r[0] === genre);
        if (row) {
            const values = this.sheet.getRange(row + 1, 1, 1, this.sheet.getLastColumn()).getValues()[0].filter(v => v !== "");
            values.push(value);
            this.sheet.getRange(row, 1, 1, values.length).setValues([values]);
        }
        else {
            this.sheet.appendRow([genre, value]);
        }
        ;
    }
    appendrow(array) {
        this.sheet.appendRow(array);
    }
}
