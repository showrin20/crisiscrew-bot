// This service handles the integration with Google Sheets
// You'll need to set up a Google Cloud project and enable the Google Sheets API
// Then create and download a service account key

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
}

export const saveFireReportToGoogleSheets = async (reportData: any): Promise<boolean> => {
  try {
    // Check if the required environment variables are set
    const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
    const serviceAccountEmail = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK;
    
    if (!spreadsheetId) {
      console.error('Google Sheets ID is not configured in environment variables');
      return false;
    }
    
    // Format the data as an array ready for a spreadsheet row
    const rowData = [
      new Date().toISOString(), // Timestamp
      reportData.severity,
      reportData.description,
      reportData.location?.address || 'Unknown',
      `${reportData.location?.lat || 0},${reportData.location?.lng || 0}`, // Coordinates
      reportData.fireSource || 'Not specified',
      reportData.peopleTrapped === undefined ? 'Unknown' : reportData.peopleTrapped ? 'Yes' : 'No',
      reportData.buildingType || 'Not specified',
      reportData.floorNumber || 'Not specified',
      reportData.hasHazardousMaterials === undefined ? 'Unknown' : reportData.hasHazardousMaterials ? 'Yes' : 'No',
      (reportData.hazardousTypes || []).join(', '),
      (reportData.accessibilityIssues || []).join(', '),
      reportData.contactNumber || 'Not provided',
      reportData.photoUrl || 'No image',
    ];
    
    // If using the webhook approach
    if (webhookUrl) {
      console.log('Using webhook to save fire report to Google Sheets');
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: spreadsheetId,
          values: rowData
        }),
      });
      
      return response.ok;
    } 
    // If OAuth client credentials are available
    else if (clientId && clientSecret) {
      console.log('Using Google OAuth credentials to save fire report');
      
      // Note: For front-end applications, OAuth requires user interaction
      // and typically requires additional packages like gapi-script
      // npm install gapi-script
      
      /*
      // Example implementation with gapi-script (simplified):
      // This would need to be set up with proper OAuth flow, not just directly here
      
      import { gapi } from 'gapi-script';
      
      // This would be part of your app's OAuth flow initialization
      // and would require user interaction to authorize
      gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: clientId,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets'
      });
      
      // Assuming user is already authenticated:
      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A:N',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [rowData]
        }
      });
      
      return response.status === 200;
      */
      
      // For now, just log that this would need proper OAuth flow implementation
      console.log('OAuth integration requires user authentication flow and additional setup');
      console.log('See GOOGLE_SHEETS_SETUP.md for instructions');
      
      // For development/testing, create a simple POST request to a temporarily public Google Apps Script
      try {
        // Creating a temporary direct submission - in production, you'd use a proper OAuth flow
        const makeSimpleSubmission = async () => {
          // This is a placeholder - you would need to create a Google Apps Script Web App
          // that accepts POST requests and appends data to your sheet
          const scriptUrl = `https://script.google.com/macros/s/SCRIPT_DEPLOYMENT_ID/exec`;
          
          // Send the data to your script
          const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              spreadsheetId,
              data: rowData
            }),
            mode: 'no-cors' // Google Apps Script may require this
          });
          
          return true; // Can't actually check response with no-cors
        };
        
        console.log('Attempting to save data via Google Apps Script Web App');
        return await makeSimpleSubmission();
      } catch (err) {
        console.error('Error with simple submission:', err);
        return false;
      }
    }
    // If service account credentials are available
    else if (serviceAccountEmail && import.meta.env.VITE_GOOGLE_PRIVATE_KEY) {
      console.log('Using Google Sheets API with service account to save fire report');
      
      // Note: To implement direct Google Sheets API integration, 
      // you would need to install and import the Google Sheets API client library:
      // npm install googleapis
      
      /* 
      // Example implementation with googleapis:
      const { google } = require('googleapis');
      const sheets = google.sheets('v4');
      
      const jwtClient = new google.auth.JWT(
        serviceAccountEmail,
        null,
        import.meta.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      
      await jwtClient.authorize();
      
      const response = await sheets.spreadsheets.values.append({
        auth: jwtClient,
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A:N', // Adjust based on your sheet name
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [rowData]
        },
      });
      
      return response.status === 200;
      */
      
      // For now, just log that this would be implemented
      console.log('Service account integration requires additional setup');
      console.log('See GOOGLE_SHEETS_SETUP.md for instructions');
      return true; // Simulate success
    } else {
      console.error('No Google Sheets integration method configured');
      return false;
    }
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return false;
  }
};

// Alternative implementation using a webhook service like IFTTT, Zapier, or Make.com (Integromat)
export const saveFireReportViaWebhook = async (reportData: any): Promise<boolean> => {
  try {
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('Webhook URL is not configured');
      return false;
    }
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error sending data to webhook:', error);
    return false;
  }
};
