export default function TestDiscord() {
  const testCallback = () => {
    // Simulate visiting the callback URL
    window.location.href = '/auth/discord/callback?code=test123&state=teststate';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">Discord Route Test</h1>
        <p className="text-white/80">Test if the Discord callback route is working</p>
        
        <div className="space-y-4">
          <button
            onClick={testCallback}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Test Discord Callback Route
          </button>
          
          <div className="text-white/60 text-sm">
            <p>This will test if /auth/discord/callback is working</p>
          </div>
        </div>
        
        <div className="mt-8">
          <a 
            href="/" 
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            ← Back to Game
          </a>
        </div>
      </div>
    </div>
  );
}