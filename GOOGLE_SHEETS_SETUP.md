# Google Sheets Setup for CrisisCrew Bot

This guide explains how to set up Google Sheets integration for the CrisisCrew Bot to save fire reports directly to your Google Sheet.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet
2. Note the spreadsheet ID from the URL:
   - Example URL: `https://docs.google.com/spreadsheets/d/1FrMux_i7ZVIf8ENkyURLrx3NOgIUAs-9_hLx0lrh-KA/edit`
   - Spreadsheet ID: `1FrMux_i7ZVIf8ENkyURLrx3NOgIUAs-9_hLx0lrh-KA`
3. Add this ID to your `.env` file as `VITE_GOOGLE_SHEET_ID`

## Step 2: Create a Google Apps Script

1. Go to [Google Apps Script](https://script.google.com) and create a new project
2. Copy the contents of `google_apps_script.js` from this repository into the script editor
3. Save the project with a name like "CrisisCrew Bot - Google Sheets Integration"

## Step 3: Deploy the Script as a Web App

1. In the Google Apps Script editor, click on "Deploy" > "New deployment"
2. Select "Web app" as the deployment type
3. Configure the following settings:
   - Description: "CrisisCrew Bot Web App"
   - Execute as: "Me" (your Google account)
   - Who has access: "Anyone" (if you want to allow public access without authentication)
4. Click "Deploy" and authorize the app when prompted
5. Copy the Web app URL that appears after deployment

## Step 4: Configure the CrisisCrew Bot

1. Add the Web app URL to your `.env` file as `VITE_GOOGLE_SCRIPT_URL`:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec
   ```

2. Make sure your `.env` file has the required variables:
   ```
   VITE_GOOGLE_SHEET_ID=your_sheet_id
   VITE_GOOGLE_SCRIPT_URL=your_script_url
   ```

## How It Works

When a user submits a fire report in the CrisisCrew Bot app:

1. The app sends the report data to your Google Apps Script web app
2. The script receives the data and appends it as a new row in your Google Sheet
3. All reports are stored in the "Fire Reports" sheet within your spreadsheet

This approach doesn't require OAuth authentication since the web app is run under your Google account's permissions.

## Troubleshooting

- If you're not seeing data in your sheet, check the browser console for any errors
- Make sure your Google Sheet and Google Apps Script are both deployed and accessible
- Try visiting the web app URL directly in your browser to verify it's working
