"use strict";
function get_expence_data() {
    const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("csvデータ");
    if (!ss) {
        throw new Error("not sheet found");
    }
    ;
    const data = ss.getRange("A1:D" + ss.getLastRow()).getValues();
    data.sort((a, b) => a[0] - b[0]);
    data.forEach(row => {
        row[0] = Utilities.formatDate(row[0], "Asia/Tokyo", "yyyy/MM/dd");
    });
    const ss_genre = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ジャンル");
    if (!ss_genre) {
        throw new Error("not sheet found");
    }
    ;
    const genre_data = ss_genre.getDataRange().getValues();
    const genre_obj = {};
    genre_data.forEach(row => {
        row.slice(1).forEach(value => {
            if (value !== "")
                genre_obj[value] = row[0];
        });
    });
    console.log(genre_obj);
    return { data, genre_obj };
}
;
function get_genre() {
    const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ジャンル");
    if (!ss) {
        throw new Error("not sheet found");
    }
    ;
    const data = ss.getRange("A1:D" + ss.getLastRow()).getValues();
    return data;
}
function add_genre_value(genre, value) {
    const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ジャンル");
    if (!ss) {
        throw new Error("not sheet found");
    }
    ;
    const data = ss.getDataRange().getValues();
    const row = data.findIndex(r => r[0] === genre) + 1;
    if (row) {
        const values = ss.getRange(row, 1, 1, ss.getLastColumn()).getValues()[0].filter(v => v !== "");
        values.push(value);
        ss.getRange(row, 1, 1, values.length).setValues([values]);
    }
    else {
        ss.appendRow([genre, value]);
    }
    ;
}
