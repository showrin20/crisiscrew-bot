# Google Sheets Integration for CrisisBot

This document explains how to set up the Google Sheets integration for storing fire emergency reports.

## Setup Instructions

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API for your project

### 2. Set Up Service Account
1. In your Google Cloud project, go to "IAM & Admin" > "Service Accounts"
2. Create a new service account
3. Give it a name like "crisiscrew-bot"
4. Grant it the "Editor" role for Google Sheets
5. Create and download the JSON key file

### 3. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Add the following headers in row 1:
   - Timestamp
   - Severity
   - Description
   - Location
   - Coordinates
   - Fire Source
   - People Trapped
   - Building Type
   - Floor Number
   - Hazardous Materials
   - Hazardous Types
   - Accessibility Issues
   - Contact Number
   - Photo URL
4. Share the spreadsheet with the email address of your service account (with Editor permissions)

### 4. Configure Environment Variables
Add these variables to your `.env` file:

```
VITE_GOOGLE_SHEET_ID=your_sheet_id
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
VITE_GOOGLE_PRIVATE_KEY=your_private_key
```

Alternatively, you can use a webhook service:

```
VITE_WEBHOOK_URL=your_webhook_url
```

## Webhook Integration Options

Instead of directly integrating with Google Sheets API, you can use these services:

1. **IFTTT**: Create an applet that receives a webhook and adds a row to Google Sheets
2. **Zapier**: Create a zap with a webhook trigger and Google Sheets action
3. **Make.com** (formerly Integromat): Create a scenario with webhook and Google Sheets modules
4. **Google Apps Script**: Deploy a web app that receives POST requests and adds data to your sheet

## Data Structure

The following data fields are collected and stored:

| Field | Description |
|-------|-------------|
| Timestamp | When the report was submitted |
| Severity | Classification: minor, major, or critical |
| Description | User's description of the fire |
| Location | Address or coordinates |
| Coordinates | Latitude and longitude |
| Fire Source | Suspected cause of the fire |
| People Trapped | Yes, No, or Unknown |
| Building Type | Type of building structure |
| Floor Number | Where the fire is occurring |
| Hazardous Materials | Yes, No, or Unknown |
| Hazardous Types | Types of hazardous materials present |
| Accessibility Issues | Issues that might hinder emergency response |
| Contact Number | Reporter's contact information |
| Photo URL | Link to image if provided |

## Security Considerations

- The Google Sheets API key and service account credentials should be kept secure
- For production, consider using server-side code to handle the Google Sheets API calls
- Implement rate limiting to prevent API abuse
