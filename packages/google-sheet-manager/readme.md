# GOOGLE SHEET MANAGER

This package is an abstraction of [googleapis](npm%20i%20googleapis) that lets you simply use a Google Sheet to read and write content.

You can create, read and write sub-sheets within a Google Sheet.

## Requirements

- Create a google sheet inside your Google drive
- Create a service account and get its credentials ([Guide](https://medium.com/@a.marenkov/how-to-get-credentials-for-google-sheets-456b7e88c430))
- Retrieve your sheet identifier within the url (`https://docs.google.com/spreadsheets/d/<your identifier>/*`)

## How it works

**Google-sheet-manager** provides a class named SheetManager, you need to instanciate it with the same auth params you would provide to GoogleAuth (e.g: an array of scopes and the credentials JSON file of an account service) plus the Google Sheet identifier you want to interact with.

Example:

    import { SheetManager } from  "google-sheet-manager";
    import  credentials  from  "./google_credentials.json"  assert { type: "json" };
    import { SHEET_ID } from  "../config/index.js";
    
    const  scopes  = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
    ];
    const  authParams  = { scopes, credentials };
    const  Manager  =  new  SheetManager(authParams, SHEET_ID);

With the following code, you are able to create, write and read any sub-sheets inside the sheet corresponding to **SHEET_ID** through Manager.

## Methods

The SheetManager instance has access to the following methods:

- **writeToSheetWithCustomRange(sheetName, values, range, checkIfSheetExists?)** 

| Parameter| Type | DefaultValue | Description
|--|--|--|--|
| sheetName | string | None | The sub sheet name you are writting in
| values| string[] | None | Each index of the array correspond to a cell 
| range| string | None | Example: "A2:C3"
| checkIfSheetExists | boolean | true | Will check before inserting the values if the sheet exists, if not, it will create it first

Returns nothing.

- **readFromSheet(sheetName, range?)** 

| Parameter| Type | DefaultValue | Description
|--|--|--|--|
| sheetName | string | None | The sub sheet name you want to get content
| range| string | "A2:Z1000"| Example: "A2:C3"

Returns an array of string arrays

## Example of usage

NodeJS project with the following structure:

![structure](https://images2.imgbox.com/11/34/cqerntfm_o.png)

```./config/index.js```
![config](https://images2.imgbox.com/53/9b/4pj6UpHx_o.png)

```./lib/sheet.js```
![lib_sheet](https://images2.imgbox.com/5e/9c/9iG2VSW7_o.png)

```./index.js```
![index](https://images2.imgbox.com/b1/24/EqxSsvOB_o.png)

It's a basic usage and of course the sheet name can be dynamic, so you can use others with the same instance of SheetManager.