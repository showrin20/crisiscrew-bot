// Google Auth Service
// Handles OAuth2 authentication with Google

// Constants for Google OAuth
const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
].join(' ');

// Get client ID from env variables
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin;

// Storage keys
const TOKEN_STORAGE_KEY = 'google_oauth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'google_oauth_refresh_token';
const EXPIRY_TIME_STORAGE_KEY = 'google_oauth_expiry';

/**
 * Generate OAuth URL for Google authentication
 */
export const getGoogleAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    access_type: 'offline',
    prompt: 'consent',
  });
  
  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
};

/**
 * Process the OAuth callback from Google
 * @param code - The authorization code from Google
 */
export const processGoogleAuthCallback = async (code: string): Promise<boolean> => {
  try {
    const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to exchange code for token:', await tokenResponse.text());
      return false;
    }

    const tokenData = await tokenResponse.json();
    
    // Store tokens in localStorage (in a real app, consider more secure storage)
    localStorage.setItem(TOKEN_STORAGE_KEY, tokenData.access_token);
    if (tokenData.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokenData.refresh_token);
    }
    
    const expiryTime = Date.now() + (tokenData.expires_in * 1000);
    localStorage.setItem(EXPIRY_TIME_STORAGE_KEY, expiryTime.toString());
    
    return true;
  } catch (error) {
    console.error('Error processing Google auth callback:', error);
    return false;
  }
};

/**
 * Get a valid access token, refreshing if necessary
 */
export const getValidAccessToken = async (): Promise<string | null> => {
  try {
    const expiryTime = Number(localStorage.getItem(EXPIRY_TIME_STORAGE_KEY)) || 0;
    const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    
    // Check if token exists and is still valid (with 5-min buffer)
    if (currentToken && expiryTime > Date.now() + 5 * 60 * 1000) {
      return currentToken;
    }
    
    // If we have a refresh token, try to get a new access token
    if (refreshToken) {
      const refreshResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });
      
      if (!refreshResponse.ok) {
        console.error('Token refresh failed:', await refreshResponse.text());
        return null;
      }
      
      const refreshData = await refreshResponse.json();
      localStorage.setItem(TOKEN_STORAGE_KEY, refreshData.access_token);
      
      const newExpiryTime = Date.now() + (refreshData.expires_in * 1000);
      localStorage.setItem(EXPIRY_TIME_STORAGE_KEY, newExpiryTime.toString());
      
      return refreshData.access_token;
    }
    
    // No valid token or refresh token
    return null;
  } catch (error) {
    console.error('Error getting valid access token:', error);
    return null;
  }
};

/**
 * Check if user is authenticated with Google
 */
export const isGoogleAuthenticated = async (): Promise<boolean> => {
  const token = await getValidAccessToken();
  return !!token;
};

/**
 * Logout from Google by removing stored tokens
 */
export const googleLogout = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(EXPIRY_TIME_STORAGE_KEY);
};
