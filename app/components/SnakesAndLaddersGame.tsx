import { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { WalletConnect } from './WalletConnect';
import { DiscordLogin } from './DiscordLogin';
import { GameControls } from './GameControls';
import { GameInfo } from './GameInfo';
import { PlayersPanel } from './PlayersPanel';
import { useWallet } from '../hooks/useWallet';
import { useGame } from '../hooks/useGame';
import { useProfile } from '../hooks/useProfile';
import type { DiscordUser } from '../services/discord';

export interface GameState {
  gameInProgress: boolean;
  currentPosition: number;
  prizePool: string;
  isLoading: boolean;
  lastDiceRoll?: number;
  message: string;
}

export function SnakesAndLaddersGame() {
  const [isBrowser, setIsBrowser] = useState(false);
  
  const { 
    account, 
    isConnected, 
    isCorrectNetwork, 
    connectWallet, 
    switchNetwork 
  } = useWallet();
  
  const {
    profile,
    onlineProfiles,
    profilesInGame,
    createProfileFromWallet,
    createProfileFromDiscord,
    linkDiscordAccount,
    updateGameStats,
    setCurrentGame
  } = useProfile();
  
  const {
    gameState,
    startGame,
    rollDice,
    resetGame,
    refreshGameState
  } = useGame(account);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Create profile when wallet connects
  useEffect(() => {
    if (isBrowser && isConnected && account && !profile) {
      createProfileFromWallet(account);
    }
  }, [isBrowser, isConnected, account, profile, createProfileFromWallet]);

  // Handle Discord login
  const handleDiscordLogin = async (discordUser: DiscordUser) => {
    try {
      if (profile) {
        await linkDiscordAccount(discordUser);
      } else {
        await createProfileFromDiscord(discordUser, account || undefined);
      }
    } catch (error) {
      console.error('Discord login failed:', error);
    }
  };

  // Update game stats when game ends
  useEffect(() => {
    if (gameState.currentPosition === 100 && profile) {
      updateGameStats(true, gameState.prizePool);
      setCurrentGame(undefined);
    }
  }, [gameState.currentPosition, gameState.prizePool, profile, updateGameStats, setCurrentGame]);

  // Set current game when game starts
  useEffect(() => {
    if (gameState.gameInProgress && profile && !profile.currentGame) {
      setCurrentGame(`game-${Date.now()}`);
    }
  }, [gameState.gameInProgress, profile, setCurrentGame]);

  useEffect(() => {
    if (isBrowser && isConnected && account) {
      refreshGameState();
    }
  }, [isBrowser, isConnected, account, refreshGameState]);

  if (!isBrowser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="text-8xl animate-bounce mb-4">🎲</div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-8 max-w-2xl">
            <div className="animate-fade-in-down">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-8xl animate-float">🐍</div>
                <div>
                  <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600">
                    Crypto Snakes
                  </h1>
                  <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    & Ladders
                  </h2>
                </div>
                <div className="text-8xl animate-float animation-delay-1000">🪜</div>
              </div>
              
              <p className="text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium">
                Play the classic game on the blockchain! Experience the thrill of Web3 gaming with real rewards.
              </p>
            </div>
            
            <div className="animate-fade-in-up space-y-4">
              <WalletConnect onConnect={connectWallet} />
              <div className="text-center">
                <div className="text-white/60 text-sm mb-4">or</div>
                <DiscordLogin onDiscordLogin={handleDiscordLogin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-8">
            <div className="animate-fade-in-down">
              <div className="text-8xl mb-6 animate-wiggle">⚠️</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-4">
                Wrong Network
              </h1>
              <p className="text-xl text-white/90 max-w-md mx-auto leading-relaxed">
                Please switch to Sepolia testnet to play the game.
              </p>
            </div>
            
            <div className="animate-fade-in-up">
              <button
                onClick={switchNetwork}
                className="group relative px-8 py-4 font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  <span className="text-2xl">🔄</span>
                  <span>Switch to Sepolia</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        <header className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="text-6xl animate-bounce">🎲</div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600">
              Crypto Snakes & Ladders
            </h1>
            <div className="text-6xl animate-bounce animation-delay-1000">🐍</div>
          </div>
          
          <div className="backdrop-blur-sm bg-white/10 rounded-full px-6 py-2 border border-white/20 inline-block">
            <p className="text-white/90 font-medium">
              <span className="text-green-300">●</span> Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Game Board */}
          <div className="xl:col-span-3 animate-fade-in-left">
            <GameBoard 
              currentPosition={gameState.currentPosition}
              gameInProgress={gameState.gameInProgress}
              currentProfile={profile}
              otherPlayersInGame={profilesInGame.filter(p => p.id !== profile?.id)}
            />
          </div>

          {/* Game Controls and Info */}
          <div className="space-y-6 animate-fade-in-right">
            <GameInfo 
              gameState={gameState}
              account={account || ''}
            />
            
            <GameControls
              gameState={gameState}
              onStartGame={startGame}
              onRollDice={rollDice}
              onResetGame={resetGame}
            />
            
            {/* Discord Integration */}
            {profile && !profile.discordId && (
              <div className="backdrop-blur-md bg-white/10 p-4 rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-4">
                  <h4 className="text-white font-bold mb-2">🎮 Show Your Profile</h4>
                  <p className="text-white/70 text-sm">Connect Discord to display your avatar on the game board</p>
                </div>
                <DiscordLogin onDiscordLogin={handleDiscordLogin} />
              </div>
            )}
          </div>

          {/* Players Panel */}
          <div className="animate-fade-in-right animation-delay-1000">
            <PlayersPanel 
              onlineProfiles={onlineProfiles}
              profilesInGame={profilesInGame}
              currentProfile={profile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}