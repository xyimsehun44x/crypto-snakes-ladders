import { useState } from 'react';

interface WalletConnectProps {
  onConnect: () => Promise<void>;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 p-10 rounded-3xl shadow-2xl border border-white/20 max-w-md animate-fade-in-up">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 mb-4 animate-bounce">
          <span className="text-4xl">🦊</span>
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-white mb-3 drop-shadow-lg">Connect Your Wallet</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Connect your MetaMask wallet to start playing the most exciting blockchain game!
          </p>
        </div>
        
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`
            group relative w-full px-8 py-4 font-bold text-lg rounded-2xl 
            transition-all duration-300 transform hover:scale-105
            ${isConnecting 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
            }
            text-white flex items-center justify-center space-x-3
            border-2 border-white/20 hover:border-white/40
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          
          {isConnecting ? (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span>Connect MetaMask</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>
        
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>MetaMask Required</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span>Sepolia Testnet</span>
            </div>
          </div>
          
          <p className="text-white/60 text-sm">
            Get free testnet ETH from <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Sepolia Faucet</a>
          </p>
        </div>
      </div>
    </div>
  );
}