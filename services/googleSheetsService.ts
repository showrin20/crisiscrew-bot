// This service handles the integration with Google Sheets
// Using a Google Apps Script web app to append data to a single Google Sheet

import { getValidAccessToken } from './googleAuthService';

// Get the Google Sheet ID from environment variables
const FIRE_REPORTS_SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || '1FrMux_i7ZVIf8ENkyURLrx3NOgIUAs-9_hLx0lrh-KA';
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

/**
 * Save fire report data to Google Sheets using Google Apps Script web app
 * This approach doesn't require OAuth authentication on the client side
 * @param reportData - The fire report data to save
 */
export const saveFireReportToGoogleSheets = async (reportData: any): Promise<boolean> => {
  try {
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

    // Use the Google Apps Script URL from environment variables
    if (!GOOGLE_SCRIPT_URL) {
      console.error('Google Apps Script URL is not configured in environment variables');
      return false;
    }
    
    // Send the data to your Google Apps Script web app
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spreadsheetId: FIRE_REPORTS_SHEET_ID,
        data: rowData
      }),
      mode: 'no-cors' // Google Apps Script requires this
    });
    
    // Since we're using no-cors, we can't actually check the response status
    // We'll assume it succeeded if no error was thrown
    console.log('Data sent to Google Apps Script web app');
    return true;
  } catch (error) {
    console.error('Error saving to Fire Reports sheet:', error);
    return false;
  }
};

/**
 * Check if the user has permission to write to the Fire Reports sheet
 */
export const checkGoogleSheetsAccess = async (): Promise<boolean> => {
  try {
    const accessToken = await getValidAccessToken();
    
    if (!accessToken) {
      return false;
    }
    
    // Try to get spreadsheet metadata to check access
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${FIRE_REPORTS_SHEET_ID}?fields=properties.title`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );
    
    return response.ok;
  } catch (error) {
    console.error('Error checking Fire Reports sheet access:', error);
    return false;
  }
};

/**
 * Check if the Google Apps Script URL is configured
 */
export const isGoogleSheetsConfigured = (): boolean => {
  return !!GOOGLE_SCRIPT_URL;
};

/**
 * Get a friendly name for the Google Sheet
 */
export const getGoogleSheetInfo = (): { name: string, id: string } => {
  return {
    name: 'Fire Reports',
    id: FIRE_REPORTS_SHEET_ID
  };
};
