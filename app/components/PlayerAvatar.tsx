import type { GameProfile } from '../services/discord';

interface PlayerAvatarProps {
  profile: GameProfile;
  size?: 'sm' | 'md' | 'lg';
  position?: number;
  isCurrentPlayer?: boolean;
  showTooltip?: boolean;
}

export function PlayerAvatar({ 
  profile, 
  size = 'md', 
  position, 
  isCurrentPlayer = false,
  showTooltip = true 
}: PlayerAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const ringClasses = isCurrentPlayer 
    ? 'ring-4 ring-cyan-400 ring-opacity-70' 
    : 'ring-2 ring-white/50';

  return (
    <div className="relative group">
      <div className={`
        ${sizeClasses[size]} rounded-full ${ringClasses} 
        overflow-hidden transition-all duration-300 hover:scale-110
        ${isCurrentPlayer ? 'animate-pulse' : ''}
        ${profile.isOnline ? 'opacity-100' : 'opacity-50'}
      `}>
        <img
          src={profile.avatar}
          alt={profile.username}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to generated avatar
            const target = e.target as HTMLImageElement;
            target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.id}`;
          }}
        />
        
        {/* Online status indicator */}
        {profile.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        )}
        
        {/* Current player indicator */}
        {isCurrentPlayer && (
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping"></div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          <div className="bg-black/90 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
            <div className="font-bold">{profile.username}</div>
            {position !== undefined && (
              <div className="text-cyan-400">Position: {position}</div>
            )}
            <div className="text-gray-300">
              Games: {profile.gamesWon}/{profile.gamesPlayed}
            </div>
            {profile.totalEarnings !== '0' && (
              <div className="text-green-400">
                Earned: {parseFloat(profile.totalEarnings).toFixed(4)} ETH
              </div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}