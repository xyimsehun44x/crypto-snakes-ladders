import type { GameState } from './SnakesAndLaddersGame';

interface GameInfoProps {
  gameState: GameState;
  account: string;
}

export function GameInfo({ gameState, account }: GameInfoProps) {
  const { gameInProgress, currentPosition, prizePool, message } = gameState;
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getGameStatus = () => {
    if (!gameInProgress) {
      return currentPosition === 100 ? "Game Won! 🎉" : "Ready to Start";
    }
    return "Game In Progress";
  };

  const getStatusColor = () => {
    if (!gameInProgress) {
      return currentPosition === 100 ? "text-yellow-400" : "text-cyan-400";
    }
    return "text-orange-400";
  };

  const getStatusIcon = () => {
    if (!gameInProgress) {
      return currentPosition === 100 ? "🏆" : "⚡";
    }
    return "🎮";
  };

  const progressPercentage = Math.max(0, Math.min(100, (currentPosition / 100) * 100));

  return (
    <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">Game Info</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="space-y-4">
        {/* Player Info Card */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">Player</span>
          </div>
          <div className="font-mono text-white text-lg font-bold">
            {formatAddress(account)}
          </div>
        </div>

        {/* Game Status Card */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm font-medium">Status</span>
            <span className="text-2xl">{getStatusIcon()}</span>
          </div>
          <div className={`font-bold text-lg ${getStatusColor()}`}>
            {getGameStatus()}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-sm font-medium">Progress</span>
            <span className="text-white font-bold">
              {currentPosition === 0 ? "Not Started" : `${currentPosition}/100`}
            </span>
          </div>
          
          <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          
          {currentPosition > 0 && (
            <p className="text-white/60 text-xs mt-2">
              {100 - currentPosition} squares to victory!
            </p>
          )}
        </div>

        {/* Prize Pool Card */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4 rounded-xl border border-emerald-400/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm font-medium">Prize Pool</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-emerald-400 font-bold text-xl">
            {prizePool} ETH
          </div>
        </div>

        {/* Network Info */}
        <div className="flex items-center justify-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-white/80 text-sm font-medium">Sepolia Testnet</span>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
      
      {message && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl">
          <div className="flex items-start space-x-3">
            <span className="text-2xl flex-shrink-0 mt-1">💬</span>
            <p className="text-yellow-300 font-medium leading-relaxed">{message}</p>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="text-center mb-4">
          <h4 className="text-white font-bold text-lg mb-2">🎮 How to Play</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: "💎", text: "Pay 0.01 ETH to start the game" },
            { icon: "🎲", text: "Roll dice to move forward" },
            { icon: "🪜", text: "Climb ladders, slide down snakes" },
            { icon: "🏆", text: "Land exactly on 100 to win!" },
            { icon: "💰", text: "Winner gets the prize pool" }
          ].map((rule, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
              <span className="text-xl flex-shrink-0">{rule.icon}</span>
              <span className="text-white/80 text-sm">{rule.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}