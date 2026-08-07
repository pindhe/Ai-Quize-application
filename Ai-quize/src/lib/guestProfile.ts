import { UserProfile } from '../types';

const GUEST_KEY = 'neurocore_guest_profile';

export function createGuestProfile(): UserProfile {
  return {
    id: 'guest-local',
    displayName: 'Guest Pilot',
    photoURL: undefined,
    xp: 0,
    level: 1,
    coins: 100,
    rank: 'BRONZE I',
    achievements: [],
    dailyStreak: 1,
    lastActive: new Date().toISOString(),
    totalWins: 0,
    totalGames: 0,
    challenges: [
      {
        id: 'daily_wins_1',
        label: 'Achieve Perfect Sync',
        target: 3,
        current: 0,
        reward: 50,
        completed: false,
        lastGenerated: new Date().toISOString(),
      },
      {
        id: 'daily_accuracy',
        label: 'Accumulate 20 Correct Answers',
        target: 20,
        current: 0,
        reward: 30,
        completed: false,
        lastGenerated: new Date().toISOString(),
      },
    ],
    settings: {
      audio: true,
      notifications: true,
      darkMode: true,
      language: 'EN',
      securityProtocol: 'MANDATORY',
    },
  };
}

export function loadGuestProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (raw) {
      return { ...createGuestProfile(), ...JSON.parse(raw), id: 'guest-local' };
    }
  } catch {
    /* ignore */
  }
  return createGuestProfile();
}

export function saveGuestProfile(profile: UserProfile) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export function isGuestProfile(profile: UserProfile | null | undefined) {
  return !profile || profile.id === 'guest-local' || profile.id.startsWith('guest-');
}
