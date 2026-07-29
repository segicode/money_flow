"use strict";
const ss = SpreadsheetApp.getActiveSpreadsheet();
const SHEET_NAMES = {};
function getsheet(key) {
    const sheet = ss.getSheetByName(SHEET_NAMES[key]);
    if (!sheet)
        throw new Error('Sheet not found');
    return sheet;
}
;
