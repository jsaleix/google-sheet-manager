import { SHEET_NAME } from "./config/index.js";
import { writeInSheet, readSheet, getSheetUrl } from "./lib/sheet.js";

writeInSheet(SHEET_NAME, ["YOUR", "DATA"])
    .then(() => readSheet(SHEET_NAME))
    .then(console.log)
    .then(() => getSheetUrl(SHEET_NAME))
    .then((v) => console.log(`sheet url: ${v}`));
