# Google Sheets Integration Troubleshooting Guide

This guide will help you fix issues with the Google Sheets integration for CrisisCrew.

## Step 1: Deploy Updated Google Apps Script

The first step is to update and redeploy your Google Apps Script with our enhanced version:

1. Go to [Google Apps Script](https://script.google.com/)
2. Open your existing CrisisCrew script project
3. Replace the entire code with the updated code from `google_apps_script.js` in this repository
4. Save the script (Ctrl+S or Cmd+S)
5. Click on the "Deploy" button at the top right
6. Select "New deployment"
7. For the deployment type, select "Web app"
8. Fill in the following settings:
   - Description: "CrisisCrew Bot v2 with enhanced logging" (or any description you prefer)
   - Execute as: "Me" (your Google account)
   - Who has access: "Anyone" (this is important to allow requests from your app)
9. Click "Deploy"
10. You'll be shown a new URL - **copy this URL**

## Step 2: Update your environment variables

1. Open your `.env` file in the project root
2. Replace the value of `VITE_GOOGLE_SCRIPT_URL` with the new URL you copied
3. Save the file
4. Restart your development server if it's running

```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your-new-deployment-id/exec
```

## Step 3: Test with the Enhanced Debugger

We've added a new "Send Test Data" button to the Google Sheets Debugger to help diagnose issues:

1. Run your app
2. Click the "Debug Google Sheets" button at the bottom
3. First click "Test Connection" to verify the basic connection works
4. If the connection is successful, click "Send Test Data" to attempt sending actual data
5. Check the browser console (F12 or Cmd+Option+J) for detailed logs

## Step 4: Check Google Apps Script Logs

The enhanced script has detailed logging:

1. Go to your Google Apps Script editor
2. Click on "Execution logs" in the left sidebar
3. Look for any errors or issues in the logs
4. Pay attention to specific steps where the process might be failing

## Common Issues & Solutions

### 1. Permission Issues

**Symptoms:** Connection test works but data doesn't appear in the sheet.

**Solution:** 
- Make sure the Google account running the Apps Script has edit access to the spreadsheet
- In the Google Sheet, share it with your Google account and set permissions to "Editor"

### 2. Deployment Issues

**Symptoms:** Previous connection worked, but stopped working after code changes.

**Solution:**
- Each time you update the Apps Script code, you need to create a new deployment
- Make sure you're using the latest deployment URL in your .env file

### 3. CORS Issues

**Symptoms:** Seeing CORS errors in the browser console.

**Solution:**
- The updated script includes proper CORS headers
- Make sure you're using the latest deployment with these changes
- Some browsers may cache previous failed requests; try in incognito mode

### 4. Data Format Issues

**Symptoms:** Connection succeeds but no data appears, or errors in the logs about data format.

**Solution:**
- Check the exact format of the data being sent in the browser console
- Make sure it matches the expected format for a spreadsheet row
- Look for any undefined values or incorrect types

## Advanced Debugging

If you're still having issues:

1. Use browser network tab (F12 > Network) to inspect the actual requests
2. Look at both the request payload and response
3. Try making a request to the Google Apps Script URL directly using a tool like Postman
4. Add more detailed logging at specific points in your client code

Remember that changes to Google Apps Script can take a few minutes to propagate, so wait 1-2 minutes after deploying before testing.
