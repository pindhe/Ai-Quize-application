import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, Zap, Wallet, ChevronRight, CheckCircle, Cpu, Star, ArrowRight, Share2 } from 'lucide-react';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { sounds } from '../lib/sounds';
import { useTranslation } from '../lib/TranslationContext';
import { loadGuestProfile, saveGuestProfile } from '../lib/guestProfile';
import { LoadingDots } from '../components/LoadingScreen';

export default function RewardsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [results, setResults] = useState<any>(null);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('lastGameResults');
    if (data) {
      setResults(JSON.parse(data));
      sounds.playLevelUp();
    } else {
      navigate('/categories');
    }
  }, []);

  const handleClaim = async () => {
    if (claimed || !results) return;
    setClaimed(true);

    const xpReward = results.score;
    const coinsReward = Math.floor(results.score / 10);

    try {
      if (!auth.currentUser) {
        const guest = loadGuestProfile();
        const challenges = (guest.challenges || []).map((c) => {
          if (c.completed) return c;
          let newCurrent = c.current;
          if (c.id === 'daily_wins_1' && results.correctCount === results.totalQuestions) {
            newCurrent += 1;
          }
          if (c.id === 'daily_accuracy') {
            newCurrent += results.correctCount;
          }
          return { ...c, current: newCurrent, completed: newCurrent >= c.target };
        });
        saveGuestProfile({
          ...guest,
          xp: guest.xp + xpReward,
          coins: guest.coins + coinsReward,
          totalGames: guest.totalGames + 1,
          totalWins:
            guest.totalWins + (results.correctCount === results.totalQuestions ? 1 : 0),
          level: Math.floor((guest.xp + xpReward) / 1000) + 1,
          lastActive: new Date().toISOString(),
          challenges,
        });
        sessionStorage.removeItem('lastGameResults');
        navigate('/categories');
        return;
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const dataDoc = await getDoc(userRef);
      let challenges = dataDoc.data()?.challenges || [];
      
      challenges = challenges.map((c: any) => {
        if (c.completed) return c;
        
        let newCurrent = c.current;
        if (c.id === 'daily_wins_1' && results.correctCount === results.totalQuestions) {
            newCurrent += 1;
        }
        if (c.id === 'daily_accuracy') {
            newCurrent += results.correctCount;
        }
        
        const completed = newCurrent >= c.target;
        return { ...c, current: newCurrent, completed };
      });

      await updateDoc(userRef, {
        xp: increment(xpReward),
        coins: increment(coinsReward),
        totalGames: increment(1),
        totalWins: results.correctCount === results.totalQuestions ? increment(1) : increment(0),
        lastActive: new Date().toISOString(),
        challenges
      });

      sessionStorage.removeItem('lastGameResults');
      navigate('/categories');
    } catch (error) {
      if (auth.currentUser) {
        handleFirestoreError(error, OperationType.UPDATE, 'users/' + auth.currentUser.uid);
      }
      setClaimed(false);
    }
  };

  if (!results) return null;

  return (
    <div className="min-h-screen bg-bg-main flex flex-col pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/10 blur-[100px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-light h-16 flex items-center justify-center px-6 text-text-primary">
        <h1 className="text-sm font-bold tracking-tight">{t.rewards.completed}</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-12 relative z-10 max-w-lg mx-auto w-full">
        <div className="relative text-center">
             <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-32 h-32 bg-surface border border-border-light rounded-[2.5rem] flex items-center justify-center shadow-xl mx-auto mb-8 relative"
             >
                <div className="absolute inset-0 bg-brand-cyan/5 rounded-[2.5rem] group hover:scale-105 transition-transform" />
                <Trophy className="w-14 h-14 text-brand-cyan relative z-10" />
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-4 -right-4 bg-brand-purple text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-lg"
                >
                    +{results.score} XP
                </motion.div>
             </motion.div>

             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
             >
                <h1 className="text-4xl font-black text-text-primary tracking-tighter">{t.rewards.perfect}</h1>
                <p className="text-sm font-medium text-text-secondary">{t.rewards.processed}</p>
             </motion.div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
            <div className="main-card p-6 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest leading-none">{t.rewards.accuracy}</span>
                <span className="text-2xl font-black text-text-primary italic">
                    {Math.round((results.correctCount / results.totalQuestions) * 100)}%
                </span>
            </div>
            <div className="main-card p-6 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest leading-none">{t.rewards.correct}</span>
                <span className="text-2xl font-black text-brand-cyan italic">
                    {results.correctCount}/{results.totalQuestions}
                </span>
            </div>
        </div>

        {/* Rewards Section */}
        <div className="w-full space-y-6">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest text-center">{t.rewards.distribution}</h3>
            <div className="main-card p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-brand-cyan" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-text-primary leading-none mb-1">{t.rewards.xp}</p>
                            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">{t.rewards.xpDesc}</span>
                        </div>
                    </div>
                    <span className="text-xl font-bold font-mono text-brand-cyan">+{results.score}</span>
                </div>
                
                <div className="h-[1px] w-full bg-border-light" />
                
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-text-primary leading-none mb-1">{t.rewards.credits}</p>
                            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">{t.rewards.creditsDesc}</span>
                        </div>
                    </div>
                    <span className="text-xl font-bold font-mono text-amber-500">+{Math.floor(results.score / 10)}</span>
                </div>
            </div>
        </div>

        <div className="w-full space-y-4 pt-4">
            <button
                onClick={handleClaim}
                disabled={claimed}
                className="btn-primary w-full h-16 flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {claimed ? (
                    <LoadingDots size="md" className="brightness-200" />
                ) : (
                    <>
                        <span className="text-sm font-bold uppercase tracking-widest">{t.rewards.claim}</span>
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
            
            <button className="w-full h-14 bg-surface border border-border-light rounded-2xl flex items-center justify-center gap-2 text-text-secondary text-sm font-bold hover:bg-bg-main transition-colors">
                <Share2 className="w-4 h-4" />
                <span>{t.rewards.share}</span>
            </button>
        </div>
      </main>
    </div>
  );
}
