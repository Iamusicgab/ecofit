# Google Sign-In Setup for Expo Go

## Prerequisites

1. Google Cloud Console project
2. Firebase project (already configured)

## Setup Steps

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable the **Google+ API** (if not already enabled)
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > OAuth 2.0 Client IDs**

### 2. Create OAuth 2.0 Client ID

Create a **Web application** client ID:

- **Name**: "Expo AuthSession"
- **Authorized redirect URIs**:
  - Add: `https://auth.expo.io/@your-expo-username/your-app-slug`
  - Replace `your-expo-username` with your Expo username
  - Replace `your-app-slug` with your app slug from `app.json`

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Google OAuth credentials:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
   ```

### 4. Update app.json (if needed)

Make sure your `app.json` has the correct `slug`:

```json
{
	"expo": {
		"slug": "your-app-slug",
		"scheme": "your-app-slug"
	}
}
```

### 5. Test in Expo Go

1. Run `expo start`
2. Open in Expo Go
3. Try Google Sign-In - it should open a web browser for authentication

## How it works

- Uses **Expo AuthSession** which works in Expo Go
- Opens Google OAuth in a web browser
- Returns to your app with authentication tokens
- Exchanges tokens for Firebase credentials

## Troubleshooting

- Make sure redirect URI matches exactly in Google Console
- Check that Web Client ID is correct in `.env`
- Ensure your app slug is correct in `app.json`
- Test on different devices/simulators
