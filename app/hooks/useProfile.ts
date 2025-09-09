import { useState, useEffect, useCallback } from 'react';
import type { DiscordUser, GameProfile } from '../services/discord';
import { DiscordAuthService, profileStore } from '../services/discord';

export function useProfile() {
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<GameProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to profile store updates
  useEffect(() => {
    const unsubscribe = profileStore.subscribe((profiles) => {
      setAllProfiles(profiles);
    });
    
    // Initial load
    setAllProfiles(profileStore.getAllProfiles());
    
    return unsubscribe;
  }, []);

  const createProfileFromWallet = useCallback((walletAddress: string) => {
    const existingProfile = profileStore.getProfileByWallet(walletAddress);
    if (existingProfile) {
      setProfile(existingProfile);
      return existingProfile;
    }

    const newProfile: GameProfile = {
      id: `wallet-${walletAddress}`,
      walletAddress,
      username: `Player ${walletAddress.slice(0, 6)}`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${walletAddress}`,
      isOnline: true,
      gamesPlayed: 0,
      gamesWon: 0,
      totalEarnings: '0'
    };

    profileStore.addProfile(newProfile);
    setProfile(newProfile);
    return newProfile;
  }, []);

  const linkDiscordAccount = useCallback(async (discordUser: DiscordUser) => {
    if (!profile) return;

    setIsLoading(true);
    try {
      const updatedProfile: GameProfile = {
        ...profile,
        discordId: discordUser.id,
        username: `${discordUser.username}#${discordUser.discriminator}`,
        avatar: DiscordAuthService.getAvatarURL(discordUser)
      };

      profileStore.updateProfile(profile.id, updatedProfile);
      setProfile(updatedProfile);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const createProfileFromDiscord = useCallback(async (discordUser: DiscordUser, walletAddress?: string) => {
    const existingProfile = profileStore.getProfileByDiscord(discordUser.id);
    if (existingProfile) {
      if (walletAddress && !existingProfile.walletAddress) {
        profileStore.updateProfile(existingProfile.id, { walletAddress });
      }
      setProfile(existingProfile);
      return existingProfile;
    }

    const newProfile: GameProfile = {
      id: `discord-${discordUser.id}`,
      discordId: discordUser.id,
      walletAddress,
      username: `${discordUser.username}#${discordUser.discriminator}`,
      avatar: DiscordAuthService.getAvatarURL(discordUser),
      isOnline: true,
      gamesPlayed: 0,
      gamesWon: 0,
      totalEarnings: '0'
    };

    profileStore.addProfile(newProfile);
    setProfile(newProfile);
    return newProfile;
  }, []);

  const updateGameStats = useCallback((gameWon: boolean, earnings: string) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      gamesPlayed: profile.gamesPlayed + 1,
      gamesWon: gameWon ? profile.gamesWon + 1 : profile.gamesWon,
      totalEarnings: (parseFloat(profile.totalEarnings) + parseFloat(earnings)).toString()
    };

    profileStore.updateProfile(profile.id, updatedProfile);
    setProfile(updatedProfile);
  }, [profile]);

  const setOnlineStatus = useCallback((isOnline: boolean) => {
    if (!profile) return;
    
    profileStore.updateProfile(profile.id, { isOnline });
    setProfile({ ...profile, isOnline });
  }, [profile]);

  const setCurrentGame = useCallback((gameId?: string) => {
    if (!profile) return;
    
    profileStore.updateProfile(profile.id, { currentGame: gameId });
    setProfile({ ...profile, currentGame: gameId });
  }, [profile]);

  const getOnlineProfiles = useCallback(() => {
    return profileStore.getOnlineProfiles();
  }, []);

  const getProfilesInGame = useCallback(() => {
    return allProfiles.filter(p => p.currentGame && p.isOnline);
  }, [allProfiles]);

  return {
    profile,
    allProfiles,
    onlineProfiles: getOnlineProfiles(),
    profilesInGame: getProfilesInGame(),
    isLoading,
    createProfileFromWallet,
    createProfileFromDiscord,
    linkDiscordAccount,
    updateGameStats,
    setOnlineStatus,
    setCurrentGame
  };
}