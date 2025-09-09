import { useState, useEffect } from 'react';
import type { GameProfile } from '../services/discord';
import { PlayerAvatar } from './PlayerAvatar';

interface GameBoardProps {
  currentPosition: number;
  gameInProgress: boolean;
  currentProfile?: GameProfile | null;
  otherPlayersInGame?: GameProfile[];
}

// Define snakes and ladders positions
const SNAKES = {
  16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
};

const LADDERS = {
  1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
};

export function GameBoard({ currentPosition, gameInProgress, currentProfile, otherPlayersInGame = [] }: GameBoardProps) {
  const [animatingTo, setAnimatingTo] = useState<number | null>(null);

  useEffect(() => {
    if (currentPosition > 0) {
      setAnimatingTo(currentPosition);
      const timer = setTimeout(() => setAnimatingTo(null), 500);
      return () => clearTimeout(timer);
    }
  }, [currentPosition]);

  const renderSquare = (number: number) => {
    const isPlayerHere = currentPosition === number;
    const isAnimatingHere = animatingTo === number;
    const isSnakeHead = number in SNAKES;
    const isLadderBottom = number in LADDERS;
    
    // Find other players at this position
    const otherPlayersHere = otherPlayersInGame.filter(player => {
      // For demo purposes, simulate some players at different positions
      const simulatedPosition = (parseInt(player.id.slice(-2)) || 1) % 100;
      return simulatedPosition === number;
    });
    
    let bgColor = 'bg-gradient-to-br from-slate-100 to-slate-200';
    let textColor = 'text-slate-700';
    let borderColor = 'border-slate-300/50';
    let specialEffect = '';
    
    if (number === 100) {
      bgColor = 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500';
      textColor = 'text-yellow-900';
      borderColor = 'border-yellow-400';
      specialEffect = 'shadow-lg shadow-yellow-400/50 animate-pulse';
    } else if (isSnakeHead) {
      bgColor = 'bg-gradient-to-br from-red-300 to-red-500';
      textColor = 'text-red-900';
      borderColor = 'border-red-400';
      specialEffect = 'shadow-md shadow-red-400/30';
    } else if (isLadderBottom) {
      bgColor = 'bg-gradient-to-br from-emerald-300 to-emerald-500';
      textColor = 'text-emerald-900';
      borderColor = 'border-emerald-400';
      specialEffect = 'shadow-md shadow-emerald-400/30';
    }

    return (
      <div
        key={number}
        className={`
          relative aspect-square border-2 flex items-center justify-center
          text-sm font-bold transition-all duration-500 hover:scale-105
          rounded-lg backdrop-blur-sm
          ${bgColor} ${textColor} ${borderColor} ${specialEffect}
          ${isPlayerHere ? 'ring-4 ring-cyan-400 ring-opacity-70 shadow-xl shadow-cyan-400/50' : ''}
          ${isAnimatingHere ? 'scale-125 rotate-12' : ''}
          ${gameInProgress && !isPlayerHere ? 'hover:shadow-lg' : ''}
        `}
        style={{
          transform: isAnimatingHere ? 'scale(1.25) rotate(12deg)' : undefined,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <span className="z-10 drop-shadow-sm">{number}</span>
        
        {/* Current player token */}
        {isPlayerHere && gameInProgress && currentProfile && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <PlayerAvatar 
              profile={currentProfile}
              size="md"
              position={number}
              isCurrentPlayer={true}
            />
          </div>
        )}
        
        {/* Other players at this position */}
        {otherPlayersHere.length > 0 && (
          <div className="absolute top-1 left-1 z-10">
            <div className="flex -space-x-1">
              {otherPlayersHere.slice(0, 3).map((player, index) => (
                <div 
                  key={player.id} 
                  className="transform transition-all duration-300 hover:scale-110"
                  style={{ zIndex: 10 + index }}
                >
                  <PlayerAvatar 
                    profile={player}
                    size="sm"
                    position={number}
                  />
                </div>
              ))}
              {otherPlayersHere.length > 3 && (
                <div className="w-6 h-6 bg-white/20 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-bold">+{otherPlayersHere.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Snake indicator */}
        {isSnakeHead && (
          <div className="absolute -top-1 -right-1 animate-wiggle">
            <span className="text-2xl drop-shadow-lg filter">🐍</span>
          </div>
        )}
        
        {/* Ladder indicator */}
        {isLadderBottom && (
          <div className="absolute -top-1 -right-1 animate-bounce">
            <span className="text-2xl drop-shadow-lg filter">🪜</span>
          </div>
        )}
        
        {/* Special effects for winning square */}
        {number === 100 && (
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shine" />
          </div>
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const board = [];
    
    // Create 10x10 board (numbers 1-100)
    for (let row = 0; row < 10; row++) {
      const squares = [];
      
      for (let col = 0; col < 10; col++) {
        let number;
        
        // Snake pattern: odd rows go left to right, even rows go right to left
        if (row % 2 === 0) {
          // Even rows (0, 2, 4, 6, 8): left to right
          number = (9 - row) * 10 + col + 1;
        } else {
          // Odd rows (1, 3, 5, 7, 9): right to left
          number = (9 - row) * 10 + (9 - col) + 1;
        }
        
        squares.push(renderSquare(number));
      }
      
      board.push(
        <div key={row} className="grid grid-cols-10 gap-1">
          {squares}
        </div>
      );
    }
    
    return board;
  };

  return (
    <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">Game Board</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="space-y-2 mb-6 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
        {renderBoard()}
      </div>
      
      <div className="flex justify-center flex-wrap gap-6 text-sm mb-4">
        <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full border border-white/20">
          <span className="text-2xl">🐍</span>
          <span className="text-white font-medium">Snake</span>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full border border-white/20">
          <span className="text-2xl">🪜</span>
          <span className="text-white font-medium">Ladder</span>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full border border-white/20">
          <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium">Your Position</span>
        </div>
      </div>
      
      {currentPosition > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-6 py-3 rounded-full border border-cyan-400/30">
            <p className="text-lg font-bold text-white">
              Current Position: <span className="text-cyan-400 text-xl">{currentPosition}</span>
              <span className="text-white/60 ml-2">/ 100</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}