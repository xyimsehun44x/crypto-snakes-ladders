import { useState } from 'react';
import type { GameProfile } from '../services/discord';
import { PlayerAvatar } from './PlayerAvatar';

interface PlayersPanelProps {
  onlineProfiles: GameProfile[];
  profilesInGame: GameProfile[];
  currentProfile?: GameProfile | null;
}

export function PlayersPanel({ onlineProfiles, profilesInGame, currentProfile }: PlayersPanelProps) {
  const [activeTab, setActiveTab] = useState<'online' | 'playing'>('online');

  const otherOnlineProfiles = onlineProfiles.filter(p => p.id !== currentProfile?.id);
  const otherPlayingProfiles = profilesInGame.filter(p => p.id !== currentProfile?.id);

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 h-fit">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">Players</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('online')}
          className={`
            flex-1 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
            ${activeTab === 'online' 
              ? 'bg-green-500/30 text-green-300 border border-green-400/50' 
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            }
          `}
        >
          <span className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Online ({otherOnlineProfiles.length})</span>
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab('playing')}
          className={`
            flex-1 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
            ${activeTab === 'playing' 
              ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' 
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            }
          `}
        >
          <span className="flex items-center justify-center space-x-2">
            <span className="text-lg">🎮</span>
            <span>Playing ({otherPlayingProfiles.length})</span>
          </span>
        </button>
      </div>

      {/* Players List */}
      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {activeTab === 'online' && (
          <>
            {otherOnlineProfiles.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">👻</div>
                <p className="text-white/60 text-sm">No other players online</p>
              </div>
            ) : (
              otherOnlineProfiles.map((profile) => (
                <PlayerCard key={profile.id} profile={profile} />
              ))
            )}
          </>
        )}

        {activeTab === 'playing' && (
          <>
            {otherPlayingProfiles.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎲</div>
                <p className="text-white/60 text-sm">No players currently in game</p>
              </div>
            ) : (
              otherPlayingProfiles.map((profile) => (
                <PlayerCard key={profile.id} profile={profile} showGameStatus />
              ))
            )}
          </>
        )}
      </div>

      {/* Current Player */}
      {currentProfile && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="text-white/80 text-xs mb-3 font-medium">You</div>
          <PlayerCard profile={currentProfile} isCurrentPlayer showGameStatus />
        </div>
      )}
    </div>
  );
}

interface PlayerCardProps {
  profile: GameProfile;
  isCurrentPlayer?: boolean;
  showGameStatus?: boolean;
}

function PlayerCard({ profile, isCurrentPlayer = false, showGameStatus = false }: PlayerCardProps) {
  const winRate = profile.gamesPlayed > 0 
    ? Math.round((profile.gamesWon / profile.gamesPlayed) * 100) 
    : 0;

  return (
    <div className={`
      relative p-4 rounded-xl border transition-all duration-300 hover:scale-105
      ${isCurrentPlayer 
        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50' 
        : 'bg-white/5 border-white/10 hover:bg-white/10'
      }
    `}>
      <div className="flex items-center space-x-3">
        <PlayerAvatar 
          profile={profile} 
          size="lg" 
          isCurrentPlayer={isCurrentPlayer}
          showTooltip={false}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-white font-semibold truncate">
              {profile.username}
            </h4>
            {profile.discordId && (
              <div className="w-4 h-4 bg-indigo-500 rounded flex items-center justify-center">
                <svg className="w-2 h-2 fill-white" viewBox="0 0 24 24">
                  <path d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475V24l-2.677-2.273-1.47-1.338-1.604-1.398.67 2.205H3.71c-1.402 0-2.54-1.065-2.54-2.476V2.48C1.17 1.142 2.31.003 3.715.003h16.5L20.222 0zm-6.118 5.683h-.03l-.202.2c2.073.6 3.076 1.537 3.076 1.537-1.336-.668-2.54-1.002-3.744-1.137-.87-.135-1.74-.064-2.475 0h-.2c-.47 0-1.47.2-2.81.735-.467.203-.735.336-.735.336s1.002-1.002 3.21-1.537l-.135-.135s-1.672-.064-3.477 1.27c0 0-1.805 3.144-1.805 7.02 0 0 1 1.74 3.743 1.806 0 0 .4-.533.805-1.002-1.54-.4-2.172-1.336-2.172-1.336s.135.064.335.2h.06c.03 0 .044.015.06.03v.006c.016.016.03.03.06.03.33.136.66.27.93.4.466.202 1.065.403 1.8.536.93.135 1.996.2 3.21 0 .6-.135 1.2-.267 1.8-.535.39-.2.87-.4 1.397-.737 0 0-.6.938-2.205 1.338.33.466.795 1 .795 1 2.744-.06 3.81-1.8 3.87-1.726 0-3.87-1.815-7.02-1.815-7.02-1.635-1.214-3.165-1.26-3.435-1.26l.056-.02zm.168 4.413c.703 0 1.27.6 1.27 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.34.002-.74.573-1.338 1.27-1.335zm-4.543 0c.7 0 1.266.6 1.266 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.34 0-.74.57-1.335 1.27-1.335z"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>W/L: {profile.gamesWon}/{profile.gamesPlayed}</span>
            {winRate > 0 && (
              <span className="text-green-400">{winRate}%</span>
            )}
          </div>
          
          {showGameStatus && profile.currentGame && (
            <div className="mt-2 px-2 py-1 bg-orange-500/20 border border-orange-400/30 rounded text-xs text-orange-300">
              🎲 In Game
            </div>
          )}
          
          {profile.totalEarnings !== '0' && (
            <div className="mt-2 text-xs text-emerald-400">
              💎 {parseFloat(profile.totalEarnings).toFixed(4)} ETH
            </div>
          )}
        </div>
      </div>
    </div>
  );
}