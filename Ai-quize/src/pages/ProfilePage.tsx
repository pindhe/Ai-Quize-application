import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, LogOut, Grid, Trophy, Cpu, Zap, Wallet, BarChart3, Settings, Moon, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from '../lib/TranslationContext';
import Layout from '../components/Layout';

interface ProfileProps {
  currentUserProfile: UserProfile | null;
}

export default function ProfilePage({ currentUserProfile }: ProfileProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { uid } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(!!uid);

  useEffect(() => {
    if (uid) {
      async function fetchOtherProfile() {
        try {
          const docRef = doc(db, 'users', uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, 'users/' + uid);
        } finally {
          setLoading(false);
        }
      }
      fetchOtherProfile();
    } else {
      setProfile(currentUserProfile);
    }
  }, [uid, currentUserProfile]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-10 text-center gap-6">
        <div className="w-20 h-20 bg-surface border border-border-light rounded-[2rem] flex items-center justify-center shadow-sm">
            <Cpu className="w-10 h-10 text-text-secondary opacity-20" />
        </div>
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary italic tracking-tight">{t.profile.notLocated}</h2>
            <p className="text-sm text-text-secondary font-medium">{t.profile.notLocatedDesc}</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn-primary px-8">{t.common.return}</button>
    </div>
  );

  const isOwnProfile = !uid || uid === currentUserProfile?.id;

  const handleSignOut = () => {
    auth.signOut();
    navigate('/login');
  };

  const stats = [
    { label: t.profile.training, value: profile.totalGames, icon: Grid, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: t.profile.wins, value: profile.totalWins, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: t.profile.accuracy, value: profile.totalGames > 0 ? `${Math.round((profile.totalWins / profile.totalGames) * 100)}%` : '0%', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: t.dashboard.dailyStreak, value: profile.dailyStreak, icon: Zap, color: 'text-brand-purple', bg: 'bg-brand-purple/5' },
  ];

  return (
    <Layout profile={currentUserProfile} title={isOwnProfile ? "Stats" : "Neural Profile"} showProfile={!isOwnProfile}>
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate(-1)} className="text-text-secondary hover:text-brand-cyan transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary italic">
            {isOwnProfile ? 'IDENT_LOCAL_CORE' : 'REMOTE_DATA_SEGMENT'}
        </span>
        {isOwnProfile ? (
            <button onClick={() => navigate('/settings')} className="w-9 h-9 rounded-xl bg-surface border border-border-light flex items-center justify-center text-text-secondary hover:bg-bg-main transition-colors">
              <Settings className="w-4 h-4" />
            </button>
        ) : (
            <div className="w-9 h-9" />
        )}
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-10">
        {/* User Hero Section */}
        <section className="flex flex-col items-center text-center">
            <div className="relative mb-6">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-[-16px] border border-brand-cyan/20 rounded-full border-dashed"
                />
                <div className="relative w-32 h-32 rounded-[2.5rem] p-4 bg-surface border border-border-light shadow-xl">
                    <img 
                      src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`} 
                      alt="" 
                      className="w-full h-full object-cover rounded-[1.5rem] bg-bg-main"
                    />
                    {profile.dailyStreak > 0 && (
                        <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-brand-cyan rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                            <Zap className="w-4 h-4 text-white fill-white" />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="space-y-3">
                <h2 className="text-4xl font-black text-text-primary tracking-tighter italic">{profile.displayName}</h2>
                <div className="flex items-center justify-center gap-2">
                    <span className="px-4 py-1.5 bg-brand-purple text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-brand-purple/20">
                         {t.profile.clearance}: {profile.rank}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border-light rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest leading-none">{t.dashboard.activeStatus}</span>
                    </div>
                </div>
            </div>
        </section>

        {/* Core Stats Overview */}
        <section className="main-card p-8 group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-32 h-32 text-brand-cyan" />
            </div>
            <div className="flex justify-between items-end mb-6 relative z-10">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t.profile.maturity}</span>
                    <h3 className="text-4xl font-black text-text-primary tracking-tighter italic leading-none">{t.dashboard.level} {profile.level}</h3>
                </div>
                <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{t.profile.totalXp}</span>
                    <span className="text-2xl font-bold text-brand-cyan tracking-tight font-mono">{profile.xp.toLocaleString()}</span>
                </div>
            </div>
            <div className="relative z-10">
                <div className="h-2.5 w-full bg-bg-main rounded-full overflow-hidden border border-border-light p-0.5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(profile.xp % 1000) / 10}%` }}
                        className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full"
                    />
                </div>
            </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
            {stats.map((s, idx) => (
                <div key={idx} className="main-card p-6 flex flex-col items-center gap-3 hover:border-brand-purple/40 transition-colors">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                        <s.icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">{s.label}</span>
                        <span className="text-2xl font-black text-text-primary italic tracking-tighter">{s.value}</span>
                    </div>
                </div>
            ))}
        </section>

        {/* Achievements Section */}
        <section className="space-y-5">
            <div className="flex justify-between items-center pl-2">
                 <h3 className="text-sm font-bold text-text-primary">{t.profile.assets}</h3>
                 <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">{profile.achievements.length} Assets</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.achievements.length > 0 ? (
                    profile.achievements.map((ach, i) => (
                        <div key={i} className="main-card p-5 flex items-center gap-4 group hover:bg-bg-main transition-colors">
                            <div className="w-12 h-12 bg-surface border border-border-light rounded-xl flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-text-primary tracking-tight">{ach}</p>
                                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Fragment Verified</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full main-card p-12 flex flex-col items-center justify-center gap-4 text-center border-dashed bg-transparent border-border-light">
                        <div className="w-16 h-16 bg-bg-main rounded-3xl flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-text-secondary opacity-20" />
                        </div>
                        <p className="text-sm font-bold text-text-secondary italic">No achievements synchronized to this hardware yet.</p>
                    </div>
                )}
            </div>
        </section>

        {isOwnProfile && (
            <div className="pt-6 space-y-4">
                <button
                    onClick={handleSignOut}
                    className="w-full h-16 bg-surface border border-rose-100 dark:border-rose-900/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] font-bold text-xs uppercase tracking-widest shadow-sm shadow-rose-500/5"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t.profile.logout}</span>
                </button>
            </div>
        )}
      </main>
    </Layout>
  );
}

const BrainCircuit = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.243A3 3 0 1 0 12 19V5z"/>
    <path d="M9 13a4.5 4.5 0 0 0 3-4"/>
    <path d="M6.003 5.125A3 3 0 1 0 12.007 5"/>
    <path d="M12 18.5a3 3 0 1 0 5.997-.125 4 4 0 0 0 2.526-5.77 4 4 0 0 0-.52-8.243A3 3 0 1 0 12 5v13.5z"/>
    <path d="M15 11a4.5 4.5 0 0 0-3 4"/>
    <path d="M17.997 18.875A3 3 0 1 0 11.993 19"/>
  </svg>
);
