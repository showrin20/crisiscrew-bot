# CrisisCrew - Quick Fire Emergency Reporting 🔥

A rapid fire emergency reporting application for Dhaka, Bangladesh with AI-powered severity detection and bilingual support (English & Bangla).

## Features

✨ **Quick Fire Report** - Instantly send fire details with text, photo, or description
📍 **Auto Location Grab** - Detects location via GPS or manual input (no sign-in needed)
🔍 **AI Severity Detection** - Classifies report as minor/major/critical using Gemini AI
📞 **Emergency Contact Shortcut** - One-tap call to nearest fire service station
🛡️ **Instant Safety Instructions** - Context-aware evacuation + safety steps
🌐 **Bangla + English Support** - Full bilingual interaction for Dhaka users
🤖 **24/7 AI Assistant** - CrisisBot provides fire safety guidance in real-time

## Run Locally

**Prerequisites:** Node.js 18+

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Gemini API key:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```
   Get your API key from: https://ai.google.dev/
   
4. Run the app:
   ```bash
   npm run dev
   ```

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
- Geolocation API

## How It Works

1. User reports fire incident with description/photo
2. AI analyzes severity (minor/major/critical)
3. GPS captures location automatically
4. Instant safety instructions displayed
5. Quick access to emergency contacts
6. AI chatbot available for additional guidance

## License

MIT
