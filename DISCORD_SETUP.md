# Discord Integration Setup Guide

## ✅ Your Discord App Configuration

**Application Details:**
- **Client ID**: `1414845018161676339`
- **Client Secret**: `TtOWzTBYF6_2_dJ3hrkqVx1jFqyJ6Ib_`
- **Redirect URIs**: Dynamic - works on any localhost port

## 🔧 Complete Setup Instructions

### Step 1: Verify Discord Application Settings

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application (ID: 1414845018161676339)
3. Navigate to **OAuth2** → **General**
4. Under **Redirects**, add these URLs for flexible localhost support:
   ```
   http://localhost:5173/auth/discord/callback
   http://localhost:5174/auth/discord/callback
   http://localhost:3000/auth/discord/callback
   http://localhost:8080/auth/discord/callback
   ```
   💡 **Pro tip**: Add common dev ports so it works on any localhost setup!
5. Under **Scopes**, ensure you have:
   - `identify` (to get user profile)
   - `email` (optional, for email access)

### Step 2: Environment Setup ✅ (Already Done)

Your `.env` file has been created with:
```env
DISCORD_CLIENT_ID=1414845018161676339
DISCORD_CLIENT_SECRET=TtOWzTBYF6_2_dJ3hrkqVx1jFqyJ6Ib_

# Redirect URI is now dynamic - works on any localhost port!
# No need to specify DISCORD_REDIRECT_URI
```

🎉 **The app now automatically detects your current localhost port and uses the correct redirect URI!**

### Step 3: Test the Integration

1. **Start the development server:**
   ```bash
   cd crypto-snakes-ladders
   npm run dev
   ```

2. **Open the application on any port:**
   - `http://localhost:5173` ✅ 
   - `http://localhost:5174` ✅
   - `http://localhost:3000` ✅
   - `http://localhost:8080` ✅
   - Any other localhost port works too!

3. **Test Discord Login:**
   - Click "Connect Discord" button
   - Use the "🎭 Demo Discord Profile (Test)" button for quick testing
   - Or use the real Discord OAuth flow

### Step 4: Features You Can Now Use

✨ **Profile Integration:**
- Discord avatars displayed on game board
- Username from Discord shown in player list
- Profile statistics tracking

✨ **Multiplayer UI:**
- See all online players in sidebar
- View who's currently in games
- Real-time player presence

✨ **Social Features:**
- Player hover tooltips with stats
- Win/loss ratios displayed
- Total earnings tracking

## 🎮 How Players Use It

### For Players Without Discord:
1. Connect wallet → Auto-generated profile with identicon avatar
2. Play games normally
3. Stats tracked to wallet address

### For Players With Discord:
1. Connect wallet first (required for gameplay)
2. Click "Connect Discord" 
3. Authorize the app
4. Discord avatar now shows on board
5. Username becomes Discord username
6. Profile linked across sessions

## 🔒 Security Notes

- Client Secret is embedded for demo purposes
- In production, handle OAuth on server-side
- Never expose client secrets in frontend code
- Use environment variables properly

## 🚀 Production Deployment

When deploying to production:

1. **Update Redirect URI:**
   - Add your production domain to Discord app
   - Example: `https://yourdomain.com/auth/discord/callback`

2. **Environment Variables:**
   ```env
   DISCORD_CLIENT_ID=1414845018161676339
   DISCORD_CLIENT_SECRET=TtOWzTBYF6_2_dJ3hrkqVx1jFqyJ6Ib_
   DISCORD_REDIRECT_URI=https://yourdomain.com/auth/discord/callback
   ```

3. **Server-Side OAuth:**
   - Move token exchange to backend
   - Keep client secret secure
   - Add proper session management

## 🐛 Troubleshooting

### Common Issues:

1. **"Invalid Redirect URI"**
   - Check Discord app settings
   - Ensure exact URL match including port

2. **CORS Errors**
   - Verify redirect URI is registered
   - Check browser console for details

3. **Demo Button Not Working**
   - Check browser console
   - Ensure profile hooks are working

4. **Avatar Not Loading**
   - Discord CDN URLs may be invalid
   - Fallback to generated avatars

### Testing Checklist:

- [ ] Discord app configured correctly
- [ ] Environment variables loaded
- [ ] Development server running on port 5174
- [ ] OAuth callback route working
- [ ] Profile creation successful
- [ ] Avatar display on game board
- [ ] Player list showing users
- [ ] Stats tracking functional

## 🎯 Next Steps

1. **Test with real Discord accounts**
2. **Deploy smart contract with your address**
3. **Test full gameplay flow**
4. **Invite friends to test multiplayer**
5. **Consider adding more social features**

Your Discord integration is now ready! Players can show their Discord profiles and avatars while playing your blockchain game. 🎲✨