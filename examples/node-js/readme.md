# NODE JS EXAMPLE

## Setup:

-   Provide a valid google credentials json file in `./lib/google_credentials.json`

-   Set-up your sheet Id and a subSheet name inside it (the subSheet will be created if it does not exist) in `./config/index.js`:

```
export  const SHEET_ID = "your sheet id here";
export const SHEET_NAME = "the sheet name you wanna interact with here";
```

## Running

Simply run `npm i`and then `npm run start`.

It should print in the console:

> YOUR DATA
> sheet url: https://docs.google.com/spreadsheets/**\*\***

"YOUR DATA" is fetched from the google sheet, if something else is appearing, it's related to the content of your sheet.
