/**
 * Google Apps Script for CrisisCrew Bot
 * This script handles requests from the CrisisCrew web app and appends data to a Google Sheet
 * 
 * To set up:
 * 1. Create a new Google Apps Script project (script.google.com)
 * 2. Copy and paste this code
 * 3. Deploy as a web app:
 *    - Click Deploy > New deployment
 *    - Select "Web app" as the type
 *    - Set "Execute as" to "Me"
 *    - Set "Who has access" to "Anyone" or "Anyone with Google account"
 *    - Click "Deploy"
 * 4. Copy the web app URL and add it to your .env file as VITE_GOOGLE_SCRIPT_URL
 */

// The doGet function handles GET requests
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'The CrisisCrew Bot Google Apps Script is running!'
  })).setMimeType(ContentService.MimeType.JSON);
}

// The doPost function handles POST requests
function doPost(e) {
  try {
    // Parse the request data
    const postData = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet ID from the request or use a default
    const spreadsheetId = postData.spreadsheetId || '1FrMux_i7ZVIf8ENkyURLrx3NOgIUAs-9_hLx0lrh-KA';
    
    // Get the row data
    const rowData = postData.data;
    
    if (!rowData || !Array.isArray(rowData)) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid data format'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Get the first sheet or create one if it doesn't exist
    let sheet = spreadsheet.getSheetByName('Fire Reports');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Fire Reports');
      
      // Add headers if this is a new sheet
      sheet.appendRow([
        'Timestamp',
        'Severity',
        'Description',
        'Location Address',
        'Coordinates',
        'Fire Source',
        'People Trapped',
        'Building Type',
        'Floor Number',
        'Hazardous Materials',
        'Hazardous Types',
        'Accessibility Issues',
        'Contact Number',
        'Photo URL'
      ]);
    }
    
    // Append the data
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
