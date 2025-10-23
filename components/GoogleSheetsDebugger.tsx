import React, { useState, useEffect } from 'react';
import { debugGoogleSheetsConfig, testGoogleSheetsConnection, saveFireReportToGoogleSheets } from '../services/googleSheetsService';

interface GoogleSheetsDebuggerProps {
  className?: string;
}

const GoogleSheetsDebugger: React.FC<GoogleSheetsDebuggerProps> = ({ className = '' }) => {
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);
  const [config, setConfig] = useState<ReturnType<typeof debugGoogleSheetsConfig>>();
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  useEffect(() => {
    if (showDebugger) {
      setConfig(debugGoogleSheetsConfig());
    }
  }, [showDebugger]);
  
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult('Testing connection...');
    
    try {
      // Show config before test
      const currentConfig = debugGoogleSheetsConfig();
      console.log('Current Google Sheets Config:', currentConfig);
      
      // Run test with detailed logging
      console.log('Starting Google Sheets connection test...');
      const result = await testGoogleSheetsConnection();
      console.log('Google Sheets connection test result:', result);
      
      // Display detailed results
      setTestResult(
        result.success 
          ? `✅ Success: ${result.message}` 
          : `❌ Error: ${result.message}`
      );
      
      // If test was successful but real data isn't working, show this note
      if (result.success) {
        console.log('Note: Test successful but if real data still isn\'t working, check:');
        console.log('1. Data format being sent');
        console.log('2. Google account running the script has edit access to the spreadsheet');
        console.log('3. Check the Script logs in Google Apps Script editor');
      }
    } catch (error) {
      console.error('Test connection error details:', error);
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  // Add function to send test data to Google Sheets
  const sendTestData = async () => {
    setIsSendingTest(true);
    setTestResult('Sending test data to Google Sheets...');
    
    try {
      const testData = {
        severity: 'Medium',
        description: 'TEST REPORT - please ignore',
        location: {
          address: 'Test Address',
          lat: 0,
          lng: 0
        },
        fireSource: 'Test',
        peopleTrapped: false,
        buildingType: 'Test Building',
        floorNumber: '1',
        hasHazardousMaterials: false,
        hazardousTypes: [],
        accessibilityIssues: [],
        contactNumber: '555-123-4567',
        photoUrl: 'https://example.com/test.jpg'
      };
      
      console.log('Sending test data to Google Sheets:', testData);
      const result = await saveFireReportToGoogleSheets(testData);
      console.log('Test data send result:', result);
      
      setTestResult(
        result 
          ? `✅ Test data sent successfully. Check your Google Sheet.` 
          : `❌ Failed to send test data. Check console for errors.`
      );
    } catch (error) {
      console.error('Send test data error:', error);
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSendingTest(false);
    }
  };
  
  if (!showDebugger) {
    return (
      <div className={`mb-4 ${className}`}>
        <button 
          onClick={() => setShowDebugger(true)}
          className="text-xs text-gray-400 hover:text-white bg-gray-800/70 hover:bg-gray-700/70 px-3 py-1 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Debug Google Sheets
        </button>
      </div>
    );
  }
  
  return (
    <div className={`bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50 p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium text-gray-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Google Sheets Connection
        </h3>
        <button 
          onClick={() => setShowDebugger(false)}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {config && (
        <div className="mb-4 text-xs text-gray-300">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-700/50 p-2 rounded">
              <p className="font-semibold mb-1">Google Script URL:</p>
              <p className={config.scriptUrlConfigured ? "text-green-400" : "text-red-400"}>
                {config.scriptUrlConfigured ? config.scriptUrlValue : "Not configured"}
              </p>
            </div>
            <div className="bg-gray-700/50 p-2 rounded">
              <p className="font-semibold mb-1">Google Sheet ID:</p>
              <p className={config.sheetIdConfigured ? "text-green-400" : "text-red-400"}>
                {config.sheetIdConfigured ? config.sheetIdValue : "Not configured"}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <div className="flex space-x-2">
          <button
            onClick={handleTestConnection}
            disabled={isTesting || isSendingTest}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded disabled:opacity-50"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button
            onClick={sendTestData}
            disabled={isSendingTest || isTesting}
            className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded disabled:opacity-50"
          >
            {isSendingTest ? 'Sending...' : 'Send Test Data'}
          </button>
        </div>
        
        {testResult && (
          <div className="mt-2 p-2 bg-gray-700/50 rounded text-sm">
            {testResult}
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400">
          <p>If connection test fails, please check:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Google Apps Script is deployed as a web app</li>
            <li>Web app is accessible to "Anyone"</li>
            <li>The correct URL is in your .env file</li>
            <li>Google Sheet ID is correct and accessible</li>
            <li>Check browser console for detailed error messages</li>
            <li>Try the "Send Test Data" button to test actual data submission</li>
          </ul>
          
          <div className="mt-2 p-2 bg-yellow-800/30 border border-yellow-700/30 rounded">
            <p className="font-medium text-yellow-500 mb-1">Troubleshooting Tips:</p>
            <ol className="list-decimal pl-5">
              <li>Verify your Google account has edit access to the sheet</li>
              <li>Check the execution logs in Google Apps Script editor</li>
              <li>Try redeploying the Google Apps Script as a new version</li>
              <li>Make sure the sheet has the correct column headers</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsDebugger;
