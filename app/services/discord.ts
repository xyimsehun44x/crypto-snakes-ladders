// Discord OAuth Configuration
const DISCORD_CLIENT_ID = '1414845018161676339'; // Public - safe to expose
// Note: Client Secret should NOT be in frontend code for production
// For demo purposes only - in production, handle OAuth on server-side

// Dynamic redirect URI based on current location
const getRedirectUri = (): string => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/discord/callback`;
  }
  // Fallback for server-side
  return 'http://localhost:5174/auth/discord/callback';
};

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
}

export interface GameProfile {
  id: string;
  walletAddress?: string;
  discordId?: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  currentGame?: string;
  gamesPlayed: number;
  gamesWon: number;
  totalEarnings: string;
}

export class DiscordAuthService {
  static getAuthURL(): string {
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: getRedirectUri(),
      response_type: 'code',
      scope: 'identify email',
      state: Math.random().toString(36).substring(2, 15), // CSRF protection
    });
    
    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch('/api/discord/exchange-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Failed to exchange code for token: ${errorData.error}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  static async getUserInfo(accessToken: string): Promise<DiscordUser> {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return await response.json();
  }

  static getAvatarURL(user: DiscordUser, size: number = 128): string {
    if (!user.avatar) {
      // Default Discord avatar
      const defaultAvatarNumber = parseInt(user.discriminator) % 5;
      return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    }
    
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }
}

// In-memory storage for demo purposes (replace with proper database in production)
class ProfileStore {
  private profiles: Map<string, GameProfile> = new Map();
  private listeners: Set<(profiles: GameProfile[]) => void> = new Set();

  addProfile(profile: GameProfile): void {
    this.profiles.set(profile.id, profile);
    this.notifyListeners();
  }

  updateProfile(id: string, updates: Partial<GameProfile>): void {
    const profile = this.profiles.get(id);
    if (profile) {
      this.profiles.set(id, { ...profile, ...updates });
      this.notifyListeners();
    }
  }

  getProfile(id: string): GameProfile | undefined {
    return this.profiles.get(id);
  }

  getProfileByWallet(walletAddress: string): GameProfile | undefined {
    return Array.from(this.profiles.values()).find(p => p.walletAddress === walletAddress);
  }

  getProfileByDiscord(discordId: string): GameProfile | undefined {
    return Array.from(this.profiles.values()).find(p => p.discordId === discordId);
  }

  getAllProfiles(): GameProfile[] {
    return Array.from(this.profiles.values());
  }

  getOnlineProfiles(): GameProfile[] {
    return this.getAllProfiles().filter(p => p.isOnline);
  }

  subscribe(callback: (profiles: GameProfile[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const profiles = this.getAllProfiles();
    this.listeners.forEach(callback => callback(profiles));
  }
}

export const profileStore = new ProfileStore();

