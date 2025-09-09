import { useState } from 'react';
import type { GameState } from './SnakesAndLaddersGame';

interface GameControlsProps {
  gameState: GameState;
  onStartGame: () => Promise<void>;
  onRollDice: () => Promise<void>;
  onResetGame: () => Promise<void>;
}

export function GameControls({ gameState, onStartGame, onRollDice, onResetGame }: GameControlsProps) {
  const { gameInProgress, isLoading, currentPosition } = gameState;
  const [isRolling, setIsRolling] = useState(false);
  
  const canStartGame = !gameInProgress && !isLoading;
  const canRollDice = gameInProgress && !isLoading && currentPosition < 100;
  const canReset = gameInProgress && !isLoading;
  const hasWon = currentPosition === 100;

  const handleRollDice = async () => {
    setIsRolling(true);
    try {
      await onRollDice();
    } finally {
      setTimeout(() => setIsRolling(false), 1000); // Keep animation for a bit longer
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">Game Controls</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="space-y-4">
        {!gameInProgress && !hasWon && (
          <button
            onClick={onStartGame}
            disabled={!canStartGame}
            className={`
              group relative w-full px-6 py-4 font-bold text-lg rounded-xl transition-all duration-300
              ${canStartGame 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }
              border-2 border-white/20 hover:border-white/40
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            <div className="relative z-10 flex items-center justify-center space-x-3">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Starting Game...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🚀</span>
                  <span>Start Game</span>
                  <div className="bg-white/20 px-2 py-1 rounded-full text-sm">0.01 ETH</div>
                </>
              )}
            </div>
          </button>
        )}
        
        {gameInProgress && !hasWon && (
          <button
            onClick={handleRollDice}
            disabled={!canRollDice}
            className={`
              group relative w-full px-6 py-4 font-bold text-lg rounded-xl transition-all duration-300
              ${canRollDice 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }
              border-2 border-white/20 hover:border-white/40
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            <div className="relative z-10 flex items-center justify-center space-x-3">
              {isLoading || isRolling ? (
                <>
                  <div className={`text-3xl ${isRolling ? 'animate-bounce' : 'animate-spin'}`}>🎲</div>
                  <span>Rolling...</span>
                </>
              ) : (
                <>
                  <span className="text-3xl animate-pulse">🎲</span>
                  <span>Roll Dice</span>
                </>
              )}
            </div>
          </button>
        )}
        
        {hasWon && (
          <div className="text-center space-y-6 p-6 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl border-2 border-yellow-400/30">
            <div className="space-y-2">
              <div className="text-4xl animate-bounce">🏆</div>
              <div className="text-3xl font-black text-yellow-400 drop-shadow-lg animate-pulse">
                You Won!
              </div>
              <p className="text-white/90 text-lg">
                Congratulations! You've conquered the board! 🎉
              </p>
            </div>
            
            <button
              onClick={onStartGame}
              disabled={isLoading}
              className={`
                group relative w-full px-6 py-4 font-bold text-lg rounded-xl transition-all duration-300
                ${!isLoading 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }
                border-2 border-yellow-400/50 hover:border-yellow-400/70
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10 flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Starting New Game...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🔄</span>
                    <span>Play Again</span>
                    <div className="bg-white/20 px-2 py-1 rounded-full text-sm">0.01 ETH</div>
                  </>
                )}
              </div>
            </button>
          </div>
        )}
        
        {gameInProgress && (
          <button
            onClick={onResetGame}
            disabled={!canReset}
            className={`
              w-full px-4 py-2 font-medium text-sm rounded-lg transition-all duration-300
              ${canReset 
                ? 'border-2 border-red-400/50 text-red-400 hover:bg-red-500/10 hover:border-red-400/70' 
                : 'border border-gray-500 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                <span>Resetting...</span>
              </div>
            ) : (
              '🔄 Reset Game'
            )}
          </button>
        )}
      </div>
      
      {gameState.lastDiceRoll && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30 text-center">
          <p className="text-white font-semibold mb-2">Last Roll</p>
          <div className="text-4xl animate-bounce">🎲</div>
          <p className="text-2xl font-black text-blue-400 mt-2">
            {gameState.lastDiceRoll}
          </p>
        </div>
      )}
    </div>
  );
}