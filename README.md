# CrisisCrew - Fire Emergency Data Collection & Response System 🔥

A specialized data collection system for fire emergency response teams in Dhaka, Bangladesh. This application focuses on gathering critical information to coordinate emergency responses efficiently, featuring AI-powered severity assessment, comprehensive data collection, and centralized storage via Google Sheets.

📱 **Live Demo:** [https://crisiscrew-bot.vercel.app/](https://crisiscrew-bot.vercel.app/)

![CrisisCrew Bot Screenshot](https://i.ibb.co/WDpsq7L/crisiscrew-preview.png)
*Visit the live demo to experience the full application*

## Features

✨ **Quick Fire Report** - Instantly send fire details with text, photo, or description
📍 **Auto Location Grab** - Detects location via GPS or manual input (no sign-in needed)
🔍 **AI Severity Detection** - Classifies report as minor/major/critical using Gemini AI
📞 **Emergency Contact Shortcut** - One-tap call to nearest fire service station
🛡️ **Instant Safety Instructions** - Context-aware evacuation + safety steps
🌐 **Bangla + English Support** - Full bilingual interaction for Dhaka users
🤖 **24/7 AI Assistant** - CrisisBot provides fire safety guidance in real-time
📊 **Voice Input Support** - Report incidents using voice recognition in English or Bangla
📑 **Google Sheets Integration** - Automatically save reports to a Google Sheet for tracking

## Run Locally

**Prerequisites:** Node.js 18+

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file with required configuration:

   ```
   # Gemini AI API Key
   VITE_API_KEY=your_gemini_api_key_here

   # Google Sheet Configuration
   VITE_GOOGLE_SHEET_ID=your_google_sheet_id
   VITE_GOOGLE_SCRIPT_URL=your_google_apps_script_url

   # Google OAuth (Optional)
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

   - Get your Gemini API key from: https://ai.google.dev/
   - For Google Sheets setup, follow the instructions in `GOOGLE_SHEETS_SETUP.md`
4. Run the app:

   ```bash
   npm run dev
   ```

## Deployment

This application is currently deployed on Vercel:
[https://crisiscrew-bot.vercel.app/](https://crisiscrew-bot.vercel.app/)

## Emergency Numbers (Bangladesh)

- **Fire Service**: 16163
- **Police**: 999
- **Ambulance**: 199
- **Dhaka Fire Service**: +880-2-9555555

## Tech Stack

- React 19 + TypeScript
- Vite
- Google Gemini AI
- TailwindCSS
- Google Sheets API
- Web Speech API
- Geolocation API
- Vercel (Deployment)

## Primary Purpose

This system is designed specifically for **emergency response coordinators and field personnel** to:

1. **Collect critical fire incident data** efficiently from observation points
2. **Centralize information** for emergency response teams and command centers
3. **Enable data-driven dispatch decisions** based on severity assessment
4. **Track and manage multiple incidents** through a structured database
5. **Support post-incident analysis** with comprehensive data records

## Google Sheets Integration

The application integrates with Google Sheets as a centralized data repository:

1. All incident reports are saved automatically to a Google Sheet for real-time access by response coordinators
2. No authentication required from field personnel, enabling quick data entry
3. Structured data format ensures consistent collection of critical information
4. Supports offline data collection with syncing when connection is restored

## How It Works

1. **Field personnel or coordinator** inputs fire incident data (text/voice/photo)
2. **Critical information collected**: location, building type, hazardous materials, trapped individuals
3. **AI analyzes severity** to help prioritize response (minor/major/critical) 
4. **Precise location data** captured automatically via GPS or manually entered
5. **Complete dataset** saved to Google Sheets for emergency response command center
6. **Resource allocation guidance** provided based on incident specifics
7. **Emergency contacts** accessible for direct communication with relevant authorities

## Additional Features

- **Voice Recognition**: Submit reports using voice in English or Bangla
- **Photo Upload**: Include photo evidence with fire reports
- **Detailed Reporting**: Capture building type, floor number, trapped people, etc.
- **Offline Support**: Basic functionality works without internet connection

## License

MIT
