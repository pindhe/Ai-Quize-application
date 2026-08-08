import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy, Search, Globe, Users, TrendingUp } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useTranslation } from '../lib/TranslationContext';
import Layout from '../components/Layout';
import LoadingScreen from '../components/LoadingScreen';
import { UserProfile } from '../types';

interface LeaderboardEntry {
  displayName: string;
  xp: number;
  level: number;
  rank: string;
  photoURL?: string;
  uid: string;
}

interface LeaderboardProps {
  profile: UserProfile | null;
}

export default function LeaderboardPage({ profile }: LeaderboardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'global' | 'friends'>('global');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as LeaderboardEntry));
        setEntries(data);
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'users');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const filteredEntries = entries.filter(e => 
    e.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout profile={profile} title="Leaderboard">
      <main className="p-6 max-w-2xl mx-auto space-y-8">
        <div className="space-y-2 text-center py-4">
            <h2 className="text-4xl font-black text-text-primary tracking-tighter italic uppercase">{t.leaderboard.globalTitle}</h2>
            <p className="text-sm text-text-secondary font-medium italic">{t.leaderboard.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                    type="text" 
                    placeholder={t.leaderboard.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 bg-surface border border-border-light rounded-2xl pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all outline-none"
                />
            </div>

            <div className="bg-bg-main p-1 rounded-2xl border border-border-light flex gap-1">
                <button 
                  onClick={() => setTab('global')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${tab === 'global' ? 'bg-surface shadow-sm border border-border-light text-brand-purple' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{t.leaderboard.globalTab}</span>
                </button>
                <button 
                  onClick={() => setTab('friends')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${tab === 'friends' ? 'bg-white shadow-sm border border-border-light text-brand-purple' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>{t.leaderboard.friendsTab}</span>
                </button>
            </div>
        </div>

        {loading ? (
            <LoadingScreen compact />
        ) : (
            <div className="space-y-8">
                {/* Podium for top 3 */}
                {!searchQuery && filteredEntries.length >= 3 && (
                    <div className="flex items-end justify-center gap-4 px-2 pt-10 pb-4 h-72">
                        {/* Rank 2 */}
                        <div className="flex-1 flex flex-col items-center">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative mb-4 group"
                            >
                                <div className="w-16 h-16 rounded-2xl border-2 border-slate-300 p-0.5 bg-surface shadow-md relative z-10">
                                    <img src={filteredEntries[1].photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${filteredEntries[1].uid}`} alt="" className="w-full h-full rounded-xl object-cover" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-slate-400 text-white text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20">2</div>
                            </motion.div>
                            <div className="w-full bg-surface border border-border-light rounded-t-3xl h-24 flex flex-col items-center justify-center shadow-sm p-4">
                                <span className="text-[10px] font-bold text-text-primary truncate w-full text-center mb-1">{filteredEntries[1].displayName}</span>
                                <span className="text-lg font-black text-slate-500 tracking-tighter">{(filteredEntries[1].xp / 1000).toFixed(1)}K</span>
                            </div>
                        </div>

                        {/* Rank 1 */}
                        <div className="flex-[1.2] flex flex-col items-center z-10 -translate-y-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative mb-6 group"
                            >
                                <div className="w-24 h-24 rounded-3xl border-4 border-amber-400 p-0.5 bg-surface shadow-2xl relative z-10">
                                    <img src={filteredEntries[0].photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${filteredEntries[0].uid}`} alt="" className="w-full h-full rounded-2xl object-cover" />
                                </div>
                                <div className="absolute -bottom-3 -right-3 bg-amber-400 text-white text-[12px] font-black w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-20">
                                   <Trophy className="w-5 h-5 fill-white" />
                                </div>
                            </motion.div>
                            <div className="w-full bg-surface border border-amber-200 rounded-t-[2.5rem] h-36 flex flex-col items-center justify-center shadow-xl shadow-amber-400/10 p-4">
                                <span className="text-xs font-bold text-text-primary truncate w-full text-center mb-1">{filteredEntries[0].displayName}</span>
                                <span className="text-3xl font-black text-amber-500 tracking-tighter">{(filteredEntries[0].xp / 1000).toFixed(1)}K</span>
                            </div>
                        </div>

                        {/* Rank 3 */}
                        <div className="flex-1 flex flex-col items-center">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative mb-4 group"
                            >
                                <div className="w-16 h-16 rounded-2xl border-2 border-orange-200 p-0.5 bg-surface shadow-md relative z-10">
                                    <img src={filteredEntries[2].photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${filteredEntries[2].uid}`} alt="" className="w-full h-full rounded-xl object-cover" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-orange-400 text-white text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20">3</div>
                            </motion.div>
                            <div className="w-full bg-surface border border-border-light rounded-t-3xl h-20 flex flex-col items-center justify-center shadow-sm p-4">
                                <span className="text-[10px] font-bold text-text-primary truncate w-full text-center mb-1">{filteredEntries[2].displayName}</span>
                                <span className="text-lg font-black text-orange-400 tracking-tighter">{(filteredEntries[2].xp / 1000).toFixed(1)}K</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* List portion */}
                <div className="space-y-3">
                    {(searchQuery ? filteredEntries : filteredEntries.slice(3)).map((entry, idx) => (
                        <motion.button 
                            key={entry.uid}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => navigate(`/profile/${entry.uid}`)}
                            className="w-full main-card p-4 flex items-center gap-4 hover:border-brand-cyan transition-all group"
                        >
                            <div className="w-8 flex items-center justify-center">
                                <span className="text-xs font-black text-text-secondary opacity-40">
                                    {searchQuery ? entries.findIndex(e => e.uid === entry.uid) + 1 : idx + 4}
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-xl border border-border-light overflow-hidden group-hover:scale-105 transition-transform">
                                <img src={entry.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.uid}`} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow text-left">
                                <h4 className="text-sm font-bold text-text-primary tracking-tight leading-none mb-1">{entry.displayName}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest leading-none">Level {entry.level} Node</span>
                                    <TrendingUp className="w-2.5 h-2.5 text-brand-cyan" />
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-base font-black text-brand-purple tracking-tighter leading-none">{entry.xp.toLocaleString()}</span>
                                <span className="text-[8px] font-bold text-text-secondary uppercase tracking-[0.15em] mt-1">{t.leaderboard.xpUnits}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        )}
      </main>
    </Layout>
  );
}
