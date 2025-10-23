// This service handles the integration with Google Sheets
// Using a Google Apps Script web app to append data to a single Google Sheet

import { getValidAccessToken } from './googleAuthService';

// Get the Google Sheet ID from environment variables
const FIRE_REPORTS_SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || '1a6dKOXeKyLOR89T5AOWdliGRvcBzhAmWM848DcuhUvw';
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

// For debugging in console
console.log('Google Sheets Configuration:');
console.log('- Sheet ID:', FIRE_REPORTS_SHEET_ID);
console.log('- Script URL:', GOOGLE_SCRIPT_URL || 'Not configured');

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

    // Validate configuration
    if (!GOOGLE_SCRIPT_URL) {
      console.error('Google Apps Script URL is not configured in environment variables');
      return false;
    }
    
    if (!FIRE_REPORTS_SHEET_ID) {
      console.error('Google Sheet ID is not configured in environment variables');
      return false;
    }
    
    console.log('Sending data to Google Apps Script:', {
      url: GOOGLE_SCRIPT_URL,
      sheetId: FIRE_REPORTS_SHEET_ID,
      dataLength: rowData.length,
      timestamp: new Date().toISOString()
    });
    
    // Log the actual data being sent for debugging
    console.log('Row data being sent:', JSON.stringify(rowData));
    
    // First try to send with standard CORS to get a proper response
    try {
      console.log('Attempting standard fetch request...');
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: FIRE_REPORTS_SHEET_ID,
          data: rowData
        }),
      });
      
      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', [...response.headers.entries()]);
      
      const responseText = await response.text();
      console.log('Google Apps Script response:', responseText);
      
      try {
        // Try to parse the response as JSON
        const jsonResponse = JSON.parse(responseText);
        console.log('Parsed JSON response:', jsonResponse);
        
        if (jsonResponse.status === 'error') {
          console.error('Google Apps Script returned error:', jsonResponse.message);
          return false;
        }
        
        return true;
      } catch (parseError) {
        console.warn('Response is not valid JSON:', parseError);
        // Even if not JSON, we got a response, so it might have worked
        return response.ok;
      }
    } catch (corsError) {
      console.warn('CORS issue with Google Apps Script, error details:', corsError);
      console.log('Falling back to no-cors mode...');
      
      // Log complete details of the error
      if (corsError instanceof Error) {
        console.error('Error name:', corsError.name);
        console.error('Error message:', corsError.message);
        console.error('Error stack:', corsError.stack);
      }
      
      try {
        // Fall back to no-cors mode
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spreadsheetId: FIRE_REPORTS_SHEET_ID,
            data: rowData
          }),
          mode: 'no-cors' // Use no-cors mode as fallback
        });
        
        console.log('Data sent to Google Apps Script web app in no-cors mode');
        console.log('Note: With no-cors mode, we cannot verify if the request succeeded');
        return true;
      } catch (noCorsError) {
        console.error('Even no-cors mode failed:', noCorsError);
        return false;
      }
    }
  } catch (error) {
    console.error('Error saving to Fire Reports sheet:', error);
    // Log complete details of the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
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

/**
 * Returns the Google Sheets configuration for debugging purposes
 * Used by the GoogleSheetsDebugger component
 */
export const debugGoogleSheetsConfig = () => {
  return {
    scriptUrlConfigured: !!GOOGLE_SCRIPT_URL,
    scriptUrlValue: GOOGLE_SCRIPT_URL,
    sheetIdConfigured: !!FIRE_REPORTS_SHEET_ID,
    sheetIdValue: FIRE_REPORTS_SHEET_ID,
    scriptUrlMasked: GOOGLE_SCRIPT_URL ? 
      `${GOOGLE_SCRIPT_URL.substring(0, 20)}...${GOOGLE_SCRIPT_URL.substring(GOOGLE_SCRIPT_URL.length - 20)}` : 
      'Not configured'
  };
};

/**
 * Test the connection to the Google Apps Script
 * Sends a test request to verify connectivity
 * @returns Result of the connection test
 */
export const testGoogleSheetsConnection = async (): Promise<{success: boolean; message: string; details?: any}> => {
  // Log the configuration for debugging
  const config = debugGoogleSheetsConfig();
  console.log('Google Sheets Configuration for test:', config);
  
  if (!GOOGLE_SCRIPT_URL) {
    return {
      success: false,
      message: 'Google Apps Script URL is not configured'
    };
  }

  if (!FIRE_REPORTS_SHEET_ID) {
    return {
      success: false,
      message: 'Google Sheet ID is not configured'
    };
  }

  try {
    // Try with standard CORS first to get proper response
    try {
      console.log(`Sending test request to: ${GOOGLE_SCRIPT_URL}`);
      
      const testPayload = {
        spreadsheetId: FIRE_REPORTS_SHEET_ID,
        action: 'test',
        testData: 'Connection test from CrisisCrew',
        timestamp: new Date().toISOString()
      };
      
      console.log('Test payload:', testPayload);
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });
      
      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', [...response.headers.entries()]);
      
      // If we get a response, parse it
      const responseText = await response.text();
      console.log('Test connection response text:', responseText);
      
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('Parsed JSON response:', jsonResponse);
        
        return {
          success: true,
          message: jsonResponse.message || 'Connection successful',
          details: jsonResponse
        };
      } catch (parseError) {
        console.warn('Response is not valid JSON:', parseError);
        
        // Response is not valid JSON but we got a response
        return {
          success: response.ok,
          message: response.ok 
            ? 'Connection successful but response was not JSON' 
            : `HTTP error: ${response.status}`,
          details: {
            responseText,
            parseError: parseError instanceof Error ? parseError.message : String(parseError)
          }
        };
      }
    } catch (corsError) {
      console.warn('CORS issue with test connection:', corsError);
      
      // Log complete details of the error
      if (corsError instanceof Error) {
        console.error('Error name:', corsError.name);
        console.error('Error message:', corsError.message);
        console.error('Error stack:', corsError.stack);
      }
      
      console.log('Falling back to no-cors mode...');
      
      try {
        // Try with no-cors as fallback
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spreadsheetId: FIRE_REPORTS_SHEET_ID,
            action: 'test',
            testData: 'Connection test from CrisisCrew',
            timestamp: new Date().toISOString()
          }),
          mode: 'no-cors'
        });
        
        // Since we can't actually check the response with no-cors,
        // we'll assume it worked if no error was thrown
        console.log('No-cors test request completed without errors');
        return {
          success: true,
          message: 'Connection test sent in no-cors mode (unable to verify actual result)',
          details: {
            usedNoCors: true,
            originalError: corsError instanceof Error ? corsError.message : String(corsError)
          }
        };
      } catch (noCorsError) {
        console.error('Even no-cors mode failed:', noCorsError);
        return {
          success: false,
          message: 'Both CORS and no-CORS requests failed',
          details: {
            corsError: corsError instanceof Error ? corsError.message : String(corsError),
            noCorsError: noCorsError instanceof Error ? noCorsError.message : String(noCorsError)
          }
        };
      }
    }
  } catch (error) {
    console.error('Error testing Google Sheets connection:', error);
    
    // Log complete details of the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      details: error
    };
  }
};
