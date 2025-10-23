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
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .addHeader('Access-Control-Allow-Origin', '*');
}

// The doPost function handles POST requests
function doPost(e) {
  // Log every step with timestamps for debugging
  const logPrefix = `[${new Date().toISOString()}] `;
  console.log(logPrefix + 'doPost triggered');
  
  // Handle preflight OPTIONS requests for CORS
  if (e.method === 'OPTIONS') {
    console.log(logPrefix + 'Handling OPTIONS request');
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type')
      .addHeader('Access-Control-Max-Age', '3600');
  }

  try {
    // Log the incoming data for debugging
    console.log(logPrefix + 'Received POST data:', e.postData.contents);
    
    // Parse the request data
    const postData = JSON.parse(e.postData.contents);
    console.log(logPrefix + 'Parsed post data:', JSON.stringify(postData));
    
    // Get the spreadsheet ID from the request or use a default
    const spreadsheetId = postData.spreadsheetId || '1a6dKOXeKyLOR89T5AOWdliGRvcBzhAmWM848DcuhUvw';
    console.log(logPrefix + 'Using spreadsheet ID:', spreadsheetId);
    
    // Check if this is a test request
    if (postData.action === 'test') {
      console.log(logPrefix + 'Received test request');
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Connection test successful',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*');
    }
    
    // Get the row data
    const rowData = postData.data;
    
    if (!rowData || !Array.isArray(rowData)) {
      console.log(logPrefix + 'Invalid data format received:', JSON.stringify(postData));
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid data format',
        receivedData: JSON.stringify(postData),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*');
    }
    
    // Open the spreadsheet
    console.log(logPrefix + 'Opening spreadsheet');
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      console.log(logPrefix + 'Successfully opened spreadsheet: ' + spreadsheet.getName());
      
      // Get the first sheet or create one if it doesn't exist
      let sheet = spreadsheet.getSheetByName('Fire Reports');
      if (!sheet) {
        console.log(logPrefix + 'Creating new Fire Reports sheet');
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
        console.log(logPrefix + 'Headers added to new sheet');
      } else {
        console.log(logPrefix + 'Found existing Fire Reports sheet');
      }
      
      // Log the row data details
      console.log(logPrefix + 'Row data to append:', JSON.stringify(rowData));
      console.log(logPrefix + 'Row data length:', rowData.length);
      
      // Append the data
      sheet.appendRow(rowData);
      console.log(logPrefix + 'Data successfully appended to sheet');
      
      // Return success response
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data added successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*');
      
    } catch (spreadsheetError) {
      console.error(logPrefix + 'Error with spreadsheet operations:', spreadsheetError.toString());
      console.error(logPrefix + 'Error name:', spreadsheetError.name);
      console.error(logPrefix + 'Error message:', spreadsheetError.message);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Spreadsheet error: ' + spreadsheetError.toString(),
        details: {
          errorName: spreadsheetError.name,
          errorMessage: spreadsheetError.message
        },
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*');
    }
  } catch (error) {
    // Log the error details
    console.error(`${logPrefix} Error processing request:`, error.toString());
    console.error(`${logPrefix} Error name:`, error.name);
    console.error(`${logPrefix} Error message:`, error.message);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString(),
      details: {
        errorName: error.name,
        errorMessage: error.message
      },
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*');
  }
}
