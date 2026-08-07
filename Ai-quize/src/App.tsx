import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from './types';
import { loadGuestProfile } from './lib/guestProfile';
import './index.css';

import SplashPage from './pages/SplashPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import QuizPage from './pages/QuizPage';
import RewardsPage from './pages/RewardsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AssetsPage from './pages/AssetsPage';

import { TranslationProvider } from './lib/TranslationContext';
import { Language } from './lib/translations';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => loadGuestProfile());
  const [loading, setLoading] = useState(true);

  const language = (profile?.settings?.language as Language) || 'EN';
  const activeProfile = profile ?? loadGuestProfile();

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u: User | null) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (u) {
        const userRef = doc(db, 'users', u.uid);
        unsubscribeSnapshot = onSnapshot(
          userRef,
          async (snap) => {
            if (snap.exists()) {
              setProfile({ id: u.uid, ...snap.data() } as UserProfile);
              setLoading(false);
            } else {
              const newProfile = {
                displayName: u.displayName || 'Pilot_' + u.uid.slice(0, 4),
                photoURL: u.photoURL,
                xp: 0,
                level: 1,
                coins: 0,
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
              try {
                await setDoc(userRef, newProfile);
              } catch (e) {
                handleFirestoreError(e, OperationType.WRITE, 'users/' + u.uid);
                setLoading(false);
              }
            }
          },
          (error) => {
            if (auth.currentUser?.uid === u.uid) {
              handleFirestoreError(error, OperationType.GET, 'users/' + u.uid);
            }
            setProfile(loadGuestProfile());
            setLoading(false);
          }
        );
      } else {
        setProfile(loadGuestProfile());
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  useEffect(() => {
    const preferDark = activeProfile?.settings?.darkMode ?? true;
    document.documentElement.classList.toggle('dark', preferDark);
  }, [activeProfile?.settings?.darkMode]);

  return (
    <BrowserRouter>
      {loading ? (
        <SplashPage />
      ) : (
        <TranslationProvider language={language}>
          <div className="min-h-screen bg-bg-main text-text-primary selection:bg-brand-cyan/30 selection:text-brand-cyan font-sans">
            <Routes>
              <Route path="/" element={<SplashPage />} />
              <Route path="/login" element={<Navigate to="/categories" replace />} />
              <Route path="/dashboard" element={<DashboardPage profile={activeProfile} />} />
              <Route path="/categories" element={<CategoriesPage profile={activeProfile} />} />
              <Route path="/quiz" element={<QuizPage profile={activeProfile} />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage profile={activeProfile} />} />
              <Route path="/profile" element={<ProfilePage currentUserProfile={activeProfile} />} />
              <Route path="/profile/:uid" element={<ProfilePage currentUserProfile={activeProfile} />} />
              <Route path="/assets" element={<AssetsPage profile={activeProfile} />} />
              <Route path="/settings" element={<SettingsPage profile={activeProfile} />} />
            </Routes>
          </div>
        </TranslationProvider>
      )}
    </BrowserRouter>
  );
}
