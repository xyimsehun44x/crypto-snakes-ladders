import { useState } from 'react';
import { DiscordAuthService } from '../services/discord';

interface DiscordLoginProps {
  onDiscordLogin: (discordUser: any) => Promise<void>;
  isLoading?: boolean;
}

export function DiscordLogin({ onDiscordLogin, isLoading = false }: DiscordLoginProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleDiscordLogin = () => {
    setIsConnecting(true);
    
    // Create the Discord OAuth URL
    const authURL = DiscordAuthService.getAuthURL();
    
    // Create popup window
    const popup = window.open(
      authURL,
      'discord-login',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for messages from the popup (OAuth callback)
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'DISCORD_AUTH_SUCCESS') {
        const { code } = event.data;
        handleOAuthCallback(code);
        window.removeEventListener('message', handleMessage);
        setIsConnecting(false);
      } else if (event.data.type === 'DISCORD_AUTH_ERROR') {
        console.error('Discord OAuth error:', event.data.error);
        window.removeEventListener('message', handleMessage);
        setIsConnecting(false);
      }
    };

    window.addEventListener('message', handleMessage);

    // Check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        setIsConnecting(false);
      }
    }, 1000);
  };

  const handleOAuthCallback = async (code: string) => {
    try {
      // Exchange code for access token
      const accessToken = await DiscordAuthService.exchangeCodeForToken(code);
      
      // Get user info
      const discordUser = await DiscordAuthService.getUserInfo(accessToken);
      
      // Call the parent callback
      onDiscordLogin(discordUser);
    } catch (error) {
      console.error('Failed to complete Discord OAuth:', error);
      
      // For demo purposes, create a mock user if OAuth fails
      const mockDiscordUser = {
        id: `demo-${Date.now()}`,
        username: 'DemoPlayer',
        discriminator: '0001',
        avatar: 'a_d5efa99b3eeaa7dd43acca82f5692432',
        email: 'demo@example.com'
      };
      
      onDiscordLogin(mockDiscordUser);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-white/80 text-sm mb-4">
          Connect with Discord to show your profile on the game board
        </div>
      </div>
      
      <button
        onClick={handleDiscordLogin}
        disabled={isConnecting || isLoading}
        className={`
          group relative w-full px-6 py-4 font-bold text-lg rounded-2xl 
          transition-all duration-300 transform hover:scale-105
          ${isConnecting || isLoading
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }
          text-white flex items-center justify-center space-x-3
          border-2 border-white/20 hover:border-white/40
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {isConnecting ? (
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Connecting to Discord...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475V24l-2.677-2.273-1.47-1.338-1.604-1.398.67 2.205H3.71c-1.402 0-2.54-1.065-2.54-2.476V2.48C1.17 1.142 2.31.003 3.715.003h16.5L20.222 0zm-6.118 5.683h-.03l-.202.2c2.073.6 3.076 1.537 3.076 1.537-1.336-.668-2.54-1.002-3.744-1.137-.87-.135-1.74-.064-2.475 0h-.2c-.47 0-1.47.2-2.81.735-.467.203-.735.336-.735.336s1.002-1.002 3.21-1.537l-.135-.135s-1.672-.064-3.477 1.27c0 0-1.805 3.144-1.805 7.02 0 0 1 1.74 3.743 1.806 0 0 .4-.533.805-1.002-1.54-.4-2.172-1.336-2.172-1.336s.135.064.335.2h.06c.03 0 .044.015.06.03v.006c.016.016.03.03.06.03.33.136.66.27.93.4.466.202 1.065.403 1.8.536.93.135 1.996.2 3.21 0 .6-.135 1.2-.267 1.8-.535.39-.2.87-.4 1.397-.737 0 0-.6.938-2.205 1.338.33.466.795 1 .795 1 2.744-.06 3.81-1.8 3.87-1.726 0-3.87-1.815-7.02-1.815-7.02-1.635-1.214-3.165-1.26-3.435-1.26l.056-.02zm.168 4.413c.703 0 1.27.6 1.27 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.34.002-.74.573-1.338 1.27-1.335zm-4.543 0c.7 0 1.266.6 1.266 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.34 0-.74.57-1.335 1.27-1.335z"/>
              </svg>
            </div>
            <span>Connect Discord</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>
      
      <div className="text-center text-white/60 text-xs">
        <p>Optional - Your Discord profile will be visible to other players</p>
      </div>

      {/* Demo/Test Button */}
      <button
        onClick={() => {
          const demoUser = {
            id: `demo-${Date.now()}`,
            username: 'YourUsername',
            discriminator: '1234', 
            avatar: 'a_d5efa99b3eeaa7dd43acca82f5692432',
            email: 'demo@example.com'
          };
          onDiscordLogin(demoUser);
        }}
        className="w-full px-4 py-2 text-sm bg-gray-600/50 text-white/80 rounded-lg hover:bg-gray-600/70 transition-colors border border-white/10"
      >
        🎭 Demo Discord Profile (Test)
      </button>
    </div>
  );
}