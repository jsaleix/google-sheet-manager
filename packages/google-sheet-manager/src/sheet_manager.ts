import { GoogleAuth, GoogleAuthOptions } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";

export class SheetManager {
    private auth: GoogleAuth;
    private sheetId: string;

    constructor(authParams: GoogleAuthOptions, sheetId: string) {
        const newAuth = new google.auth.GoogleAuth({ ...authParams });
        this.auth = newAuth;
        this.sheetId = sheetId;
    }

    private getSheets(): sheets_v4.Sheets {
        return google.sheets({ version: "v4", auth: this.auth });
    }

    getSpreadSheetUrl(childSheetId?: string): string {
        return `https://docs.google.com/spreadsheets/d/${this.sheetId}${
            childSheetId ? `/edit#gid=${childSheetId}` : ""
        }}`;
    }

    async getChildSheetId(sheetName: string) {
        const sheets = this.getSheets();
        const res = await sheets.spreadsheets.get({
            spreadsheetId: this.sheetId,
        });
        if (!res.data.sheets) throw new Error("SpreadsheetId not found");
        const sheet = res.data.sheets.find(
            (sheet: sheets_v4.Schema$Sheet) =>
                sheet?.properties?.title === sheetName
        );
        if (!sheet || !sheet.properties) throw new Error("No sheet found");
        return sheet.properties.sheetId;
    }

    async getSheetUrl(sheetName: string) {
        const sheetId = await this.getChildSheetId(sheetName);
        if (!sheetId) throw new Error("No sheet found");
        const sheetUrl = this.getSpreadSheetUrl(sheetId.toString());
        return sheetUrl;
    }

    private async checkIfSheetExists(
        sheets: sheets_v4.Sheets,
        sheetName: string
    ) {
        const res = await sheets.spreadsheets.get({
            spreadsheetId: this.sheetId,
        });
        if (!res.data.sheets) throw new Error("SpreadsheetId not found");
        const sheetExists = res.data.sheets.some(
            (sheet: sheets_v4.Schema$Sheet) =>
                sheet?.properties?.title === sheetName
        );

        if (!sheetExists) {
            await this.createSheet(sheetName);
        }
    }

    async createSheet(sheetName: string) {
        const sheets = await this.getSheets();
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.sheetId,
            requestBody: {
                requests: [{ addSheet: { properties: { title: sheetName } } }],
            },
        });
    }

    async readFromSheet(sheetName: string, range: string = "A2:Z1000") {
        const sheets = this.getSheets();
        await this.checkIfSheetExists(sheets, sheetName);
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: this.sheetId,
            range: `${sheetName}!${range}`,
        });
        return response.data.values;
    }

    async writeToSheetWithCustomRange(
        sheetName: string,
        values: any[],
        range: string,
        checkIfSheetExists: boolean = true
    ) {
        try {
            if (!range || range.indexOf(":") === -1)
                throw new Error("Invalid range");
            const sheets = await this.getSheets();
            if (checkIfSheetExists)
                await this.checkIfSheetExists(sheets, sheetName);
            sheets.spreadsheets.values.append({
                spreadsheetId: this.sheetId,
                range: `${sheetName}!${range}`,
                valueInputOption: "USER_ENTERED",
                insertDataOption: "INSERT_ROWS",
                requestBody: {
                    values: [values],
                },
            });
        } catch (e) {
            console.log(e);
        }
    }
}
