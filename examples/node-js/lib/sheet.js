import { SheetManager } from "google-sheet-manager";
import credentials from "./google_credentials.json" assert { type: "json" };
import { SHEET_ID } from "../config/index.js";

const scopes = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
];
const authParams = { scopes, credentials };
const Manager = new SheetManager(authParams, SHEET_ID);

export const readSheet = async (sheetName) => {
    const rows = await Manager.readFromSheet(sheetName, "A2:Z1000");
    return rows.map((r) => r.join(" ")).join("\n");
};

export const writeInSheet = async (sheetName, values) =>
    await Manager.writeToSheetWithCustomRange(sheetName, values, "A2:C3", true);

export const getSheetUrl = async (sheetName) =>
    await Manager.getSheetUrl(sheetName);
