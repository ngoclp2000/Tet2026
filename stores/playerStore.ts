export interface PlayerProfile {
  id: string;
  displayName: string;
  avatar: string;
}

export interface PlayerProgress {
  dailyStreak: number;
  totalCoins: number;
}

export interface PlayerStore {
  profile: PlayerProfile;
  progress: PlayerProgress;
  addCoins: (amount: number) => void;
  incrementStreak: () => void;
}

export const createPlayerStore = (profile: PlayerProfile): PlayerStore => {
  const progress: PlayerProgress = {
    dailyStreak: 0,
    totalCoins: 0,
  };

  const addCoins = (amount: number) => {
    progress.totalCoins += amount;
  };

  const incrementStreak = () => {
    progress.dailyStreak += 1;
  };

  return {
    profile,
    progress,
    addCoins,
    incrementStreak,
  };
};
