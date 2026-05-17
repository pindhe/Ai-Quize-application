import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from './types';
import './index.css';

// Pages
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const language = (profile?.settings?.language as Language) || 'EN';

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      // Clean up previous snapshot listener if it exists
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      setUser(u);
      if (u) {
        // Fetch or create profile
        const userRef = doc(db, 'users', u.uid);
        unsubscribeSnapshot = onSnapshot(userRef, async (snap) => {
          if (snap.exists()) {
            setProfile({ id: u.uid, ...snap.data() } as UserProfile);
            setLoading(false);
          } else {
            // Initial profile creation
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
                { id: 'daily_wins_1', label: 'Achieve Perfect Sync', target: 3, current: 0, reward: 50, completed: false, lastGenerated: new Date().toISOString() },
                { id: 'daily_accuracy', label: 'Accumulate 20 Correct Answers', target: 20, current: 0, reward: 30, completed: false, lastGenerated: new Date().toISOString() }
              ],
              settings: {
                audio: true,
                notifications: true,
                darkMode: true,
                language: 'EN',
                securityProtocol: 'MANDATORY'
              }
            };
            try {
              await setDoc(userRef, newProfile);
            } catch (e) {
              handleFirestoreError(e, OperationType.WRITE, 'users/' + u.uid);
              setLoading(false);
            }
          }
        }, (error) => {
          // Only report error if we still think we are that user
          if (auth.currentUser?.uid === u.uid) {
            handleFirestoreError(error, OperationType.GET, 'users/' + u.uid);
          }
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  useEffect(() => {
    if (profile?.settings?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile?.settings?.darkMode]);

  return (
    <BrowserRouter>
      {loading ? (
        <SplashPage />
      ) : (
        <TranslationProvider language={language}>
          <div className="min-h-screen bg-bg-main text-text-primary selection:bg-brand-cyan/30 selection:text-brand-cyan font-sans">
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <SplashPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={user ? <DashboardPage profile={profile} /> : <Navigate to="/login" />} />
              <Route path="/categories" element={user ? <CategoriesPage profile={profile} /> : <Navigate to="/login" />} />
              <Route path="/quiz" element={user ? <QuizPage profile={profile} /> : <Navigate to="/login" />} />
              <Route path="/rewards" element={user ? <RewardsPage /> : <Navigate to="/login" />} />
              <Route path="/leaderboard" element={user ? <LeaderboardPage profile={profile} /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <ProfilePage currentUserProfile={profile} /> : <Navigate to="/login" />} />
              <Route path="/profile/:uid" element={user ? <ProfilePage currentUserProfile={profile} /> : <Navigate to="/login" />} />
              <Route path="/assets" element={user ? <AssetsPage profile={profile} /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <SettingsPage profile={profile} /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </TranslationProvider>
      )}
    </BrowserRouter>
  );
}
