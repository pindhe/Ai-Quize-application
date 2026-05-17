import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Lightbulb, BrainCircuit, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Question, GameState, UserProfile } from '../types';
import { sounds } from '../lib/sounds';
import { useTranslation } from '../lib/TranslationContext';

interface QuizProps {
  profile: UserProfile | null;
}

export default function QuizPage({ profile }: QuizProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const rawCategory = searchParams.get('category') || 'General';
  const difficulty = searchParams.get('difficulty') || 'Medium';

  // Translate category label for display
  const categoryLabel = rawCategory; // In a real app, you'd map this better

  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    questions: [],
    score: 0,
    streak: 0,
    timeLeft: 15,
    isFinished: false,
    correctAnswers: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isOverclocking, setIsOverclocking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: rawCategory, difficulty, count: 5 })
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else if (data.questions && data.questions.length > 0) {
          setGameState(prev => ({ ...prev, questions: data.questions }));
        } else {
          setError("No data streams detected");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Network uplink failure");
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [rawCategory, difficulty]);

  // Timer Logic
  useEffect(() => {
    if (!loading && !gameState.isFinished && !isAnswering) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 0) {
            sounds.playIncorrect();
            handleAnswer(-1); // Timeout as wrong answer
            return prev;
          }
          if (prev.timeLeft <= 5) {
            sounds.playWarning();
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, gameState.isFinished, isAnswering, gameState.currentQuestionIndex]);

  const handleOverclock = async () => {
    if (isAnswering || !profile || profile.coins < 10) return;

    setIsAnswering(true);
    setIsOverclocking(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    try {
      // Deduct Credits
      const userRef = doc(db, 'users', profile.id);
      await updateDoc(userRef, {
        coins: increment(-10)
      });
      
      sounds.playWarning(); // Play tech/overclock sound

      // Reveal correct answer after a short neural delay
      setTimeout(() => {
        const question = gameState.questions[gameState.currentQuestionIndex];
        setSelectedOption(question.correctIndex);
        
        setTimeout(() => {
          setIsOverclocking(false);
          handleAnswer(question.correctIndex, true); // True flag to skip the "double answer" check
        }, 800);
      }, 500);

    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users/' + profile.id);
      setIsAnswering(false);
      setIsOverclocking(false);
    }
  };

  const handleAnswer = (index: number, skipWait = false) => {
    if (isAnswering && !skipWait) return;
    setIsAnswering(true);
    setSelectedOption(index);
    if (timerRef.current) clearInterval(timerRef.current);

    const question = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
        sounds.playCorrect();
    } else {
        sounds.playIncorrect();
    }

    setTimeout(() => {
        setGameState(prev => {
          // Overclock gives score based on remaining time but deducts cost separately
          const newScore = isCorrect ? prev.score + (100 * prev.timeLeft) : prev.score;
          const newStreak = isCorrect ? prev.streak + 1 : 0;
          const newCorrect = isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers;
          const nextIndex = prev.currentQuestionIndex + 1;
          const isFinished = nextIndex >= prev.questions.length;

          if (isFinished) {
              sessionStorage.setItem('lastGameResults', JSON.stringify({
                  score: newScore,
                  correctCount: newCorrect,
                  totalQuestions: prev.questions.length,
                  streak: newStreak
              }));
              setTimeout(() => navigate('/rewards'), 1000);
          }

          return {
            ...prev,
            score: newScore,
            streak: newStreak,
            correctAnswers: newCorrect,
            currentQuestionIndex: isFinished ? prev.currentQuestionIndex : nextIndex,
            isFinished,
            timeLeft: 15
          };
        });
        setSelectedOption(null);
        setIsAnswering(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-10 space-y-8 bg-bg-main">
        <div className="relative w-32 h-32 flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                className="absolute inset-0 border-4 border-brand-cyan/20 border-t-brand-cyan rounded-full" 
            />
            <div className="w-16 h-16 bg-surface border border-border-light rounded-3xl flex items-center justify-center shadow-lg transform rotate-6">
                <NeuralCircuit className="w-8 h-8 text-brand-purple animate-pulse" />
            </div>
        </div>
        <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-text-primary tracking-tight">{t.quiz.syncing}</h2>
            <p className="text-sm text-text-secondary font-medium">{t.quiz.downloading.replace('{category}', rawCategory)}</p>
        </div>
      </div>
    );
  }

  if (error || !gameState.questions.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-10 space-y-8 bg-bg-main text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
            <BrainCircuit className="w-10 h-10 text-rose-500" />
        </div>
        <div className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-2xl font-black text-text-primary uppercase italic tracking-tight">Sync_Interrupted</h2>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">{error || "Neural link state: Offline"}</p>
            </div>
            <button 
                onClick={() => navigate('/categories')}
                className="px-8 py-3 bg-text-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:scale-105 transition-transform"
            >
                Return to Hub
            </button>
        </div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const progressPercent = ((gameState.currentQuestionIndex + 1) / gameState.questions.length) * 100;

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-light h-16 flex items-center justify-between px-6">
        <button onClick={() => navigate('/categories')} className="text-text-secondary hover:text-brand-cyan transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-0.5">{t.quiz.arenaSync}</span>
            <span className="text-sm font-bold text-text-primary tracking-tight italic">{rawCategory}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-surface border border-border-light rounded-full shadow-sm">
           <Trophy className="w-3 h-3 text-amber-500" />
           <span className="text-xs font-bold font-mono">{gameState.score.toLocaleString()}</span>
        </div>
      </header>

      {/* Progress & Timer Bar */}
      <div className="bg-surface border-b border-border-light p-4 space-y-4">
          <div className="flex justify-between items-center px-2">
             <div className="text-xs font-bold text-text-secondary">
                {t.quiz.question} <span className="text-text-primary">{gameState.currentQuestionIndex + 1}</span> {t.quiz.of} {gameState.questions.length}
             </div>
             <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-black font-mono transition-colors ${
                 gameState.timeLeft < 5 ? 'bg-rose-50 text-rose-500 animate-pulse' : 'bg-bg-main text-brand-cyan'
             }`}>
                <Timer className="w-4 h-4" />
                <span>00:{gameState.timeLeft.toString().padStart(2, '0')}</span>
             </div>
          </div>
          <div className="px-2">
            <div className="h-1.5 w-full bg-bg-main border border-border-light rounded-full overflow-hidden p-0.5">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-brand-cyan rounded-full shadow-[0_0_8px_rgba(0,194,255,0.3)]"
                />
            </div>
          </div>
      </div>

      <main className="flex-grow flex flex-col p-6 max-w-2xl mx-auto w-full space-y-8">
        {/* Question Area */}
        <div className="main-card p-10 relative group">
           <div className="absolute top-[-12px] left-8 px-5 py-1.5 bg-brand-purple text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg transform -rotate-1 group-hover:rotate-0 transition-transform">
              {t.quiz.neuralQuery} {gameState.currentQuestionIndex + 1}
           </div>
           
            <AnimatePresence mode="wait">
              <div key={gameState.currentQuestionIndex} className="space-y-6">
                {currentQuestion.imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full aspect-video rounded-3xl overflow-hidden border border-border-light shadow-inner relative group/img"
                  >
                    <img 
                      src={currentQuestion.imageUrl} 
                      alt="Question context" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </motion.div>
                )}
                
                <motion.h2 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-2xl font-black text-text-primary leading-[1.3] tracking-tight italic"
                >
                  {currentQuestion.text}
                </motion.h2>
              </div>
            </AnimatePresence>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                const showStatus = isAnswering;
                
                let btnClass = "bg-surface border-border-light text-text-primary hover:border-brand-cyan hover:shadow-md";
                let labelClass = "bg-bg-main border-border-light text-text-secondary";

                if (showStatus) {
                    if (isCorrect) {
                        btnClass = "bg-bauh-green/5 border-bauh-green shadow-sm";
                        labelClass = "bg-bauh-green text-white border-bauh-green";
                    } else if (isSelected) {
                        btnClass = "bg-bauh-red/5 border-bauh-red shadow-sm";
                        labelClass = "bg-bauh-red text-white border-bauh-red";
                    }
                }

                return (
                    <motion.button
                        layout
                        key={option + idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={isAnswering}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`group relative p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${btnClass}`}
                    >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border flex-shrink-0 transition-all ${labelClass}`}>
                            {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="flex-grow">
                            <span className={`text-[15px] font-bold tracking-tight italic ${showStatus && isCorrect ? 'text-bauh-green' : 'text-text-primary'}`}>
                                {option}
                            </span>
                        </div>
                        {showStatus && isCorrect && (
                            <CheckCircle className="w-5 h-5 text-bauh-green" />
                        )}
                        {showStatus && isSelected && !isCorrect && (
                             <XCircle className="w-5 h-5 text-bauh-red" />
                        )}
                    </motion.button>
                );
            })}
        </div>
      </main>

      {/* Lifelines Area */}
      <div className="bg-surface border-t border-border-light p-6 mx-auto w-full max-w-2xl grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 py-4 bg-bg-main border border-border-light rounded-2xl hover:border-brand-purple hover:bg-white transition-all group overflow-hidden">
              <Lightbulb className="w-5 h-5 text-brand-purple group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t.quiz.hint}</span>
          </button>
          <button 
            disabled={isAnswering || !profile || profile.coins < 10}
            onClick={handleOverclock}
            className={`flex items-center justify-center gap-3 py-4 bg-bg-main border border-border-light rounded-2xl hover:border-brand-cyan hover:bg-white transition-all group overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed ${isOverclocking ? 'border-brand-cyan shadow-[0_0_15px_rgba(0,194,255,0.2)] animate-pulse' : ''}`}
          >
              <Zap className={`w-5 h-5 text-brand-cyan group-hover:scale-110 transition-transform ${isOverclocking ? 'animate-bounce' : ''}`} />
              <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary group-hover:text-brand-cyan">{t.quiz.overclock}</span>
                <span className="text-[8px] font-bold text-brand-cyan group-hover:text-text-primary">COST: 10 CREDITS</span>
              </div>
          </button>
      </div>
    </div>
  );
}

const NeuralCircuit = ({ className }: { className?: string }) => (
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
const Trophy = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V18"/><path d="M14 22V18"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4Z"/></svg>
);
