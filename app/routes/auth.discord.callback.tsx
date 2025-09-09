import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

export default function DiscordCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    
    console.log('Discord callback received:', { code: !!code, error, state });
    
    if (error) {
      console.error('Discord OAuth error:', error);
      // Close the popup window if it's a popup
      if (window.opener) {
        window.opener.postMessage({ type: 'DISCORD_AUTH_ERROR', error }, '*');
        setTimeout(() => window.close(), 1000);
      } else {
        navigate('/', { replace: true });
      }
      return;
    }
    
    if (code) {
      console.log('Discord OAuth code received:', code);
      
      // Close the popup window if it's a popup
      if (window.opener) {
        window.opener.postMessage({ type: 'DISCORD_AUTH_SUCCESS', code }, '*');
        setTimeout(() => window.close(), 1000);
      } else {
        // If not in popup, redirect to home with success message
        navigate('/?discord_success=true', { replace: true });
      }
    } else {
      // No code or error, something went wrong
      if (window.opener) {
        window.opener.postMessage({ type: 'DISCORD_AUTH_ERROR', error: 'No code received' }, '*');
        setTimeout(() => window.close(), 1000);
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [searchParams, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">⚡</div>
        <h1 className="text-2xl font-bold text-white mb-2">Processing Discord Login...</h1>
        <p className="text-white/70">This window will close automatically</p>
      </div>
    </div>
  );
}