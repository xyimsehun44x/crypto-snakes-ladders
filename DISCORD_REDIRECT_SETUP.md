# Quick Discord Redirect Setup

## 🚀 Add These Redirect URIs to Your Discord App

**Go to**: [Discord Developer Portal](https://discord.com/developers/applications/1414845018161676339/oauth2/general)

**In the "Redirects" section, add these URLs:**

```
http://localhost:5173/auth/discord/callback
http://localhost:5174/auth/discord/callback
http://localhost:3000/auth/discord/callback
http://localhost:8080/auth/discord/callback
```

## ✅ That's it! 

Your Discord integration will now work on any of these localhost ports:
- ✅ `http://localhost:5173` (common Vite default)
- ✅ `http://localhost:5174` (your current port) 
- ✅ `http://localhost:3000` (common React/Next.js default)
- ✅ `http://localhost:8080` (common dev server port)

The app automatically detects which port you're using and sends the correct redirect URI to Discord.

## 🎮 Test It

1. Start your dev server on any port
2. Click "Connect Discord" 
3. It should work regardless of which localhost port you're using!

**Note**: Make sure to click "Save Changes" in Discord after adding the redirect URIs.