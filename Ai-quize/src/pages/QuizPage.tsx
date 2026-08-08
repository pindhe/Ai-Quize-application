import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Question, GameState, UserProfile } from '../types';
import { sounds } from '../lib/sounds';
import { useTranslation } from '../lib/TranslationContext';
import BrandMark from '../components/BrandMark';
import LoadingScreen from '../components/LoadingScreen';
import { isGuestProfile, loadGuestProfile, saveGuestProfile } from '../lib/guestProfile';
import {
  BackArrowIcon,
  BoostZapIcon,
  HintBulbIcon,
  QuestionStackIcon,
  TimerRingIcon,
  TrophyIcon,
} from '../components/icons/QuizIcons';

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
          body: JSON.stringify({
            category: rawCategory,
            difficulty,
            count: 5,
            language: 'Soomaali',
          })
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else if (data.questions && data.questions.length > 0) {
          setGameState(prev => ({ ...prev, questions: data.questions }));
        } else {
          setError('Su\'aalo lama helin. Isku day mar kale.');
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError('Xiriirka ayaa xumaaday. Hubi internetka.');
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
      if (isGuestProfile(profile)) {
        const next = { ...loadGuestProfile(), ...profile, coins: profile.coins - 10 };
        saveGuestProfile(next);
      } else {
        const userRef = doc(db, 'users', profile.id);
        await updateDoc(userRef, {
          coins: increment(-10)
        });
      }
      
      sounds.playWarning();

      setTimeout(() => {
        const question = gameState.questions[gameState.currentQuestionIndex];
        setSelectedOption(question.correctIndex);
        
        setTimeout(() => {
          setIsOverclocking(false);
          handleAnswer(question.correctIndex, true);
        }, 800);
      }, 500);

    } catch (error) {
      if (!isGuestProfile(profile)) {
        handleFirestoreError(error, OperationType.UPDATE, 'users/' + profile.id);
      }
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
      <LoadingScreen />
    );
  }

  if (error || !gameState.questions.length) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-bg-main px-6 py-16 text-center">
        <BrandMark
          stacked
          size="md"
          showTagline
          logoClassName="h-20 w-20 rounded-3xl shadow-xl"
        />
        <div className="mt-8 max-w-sm space-y-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Su&apos;aalaha lama rarayn
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            {error || 'Wax baa qaldamay markii su\'aalaha la samaynayay. Isku day mar kale.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="inline-flex h-12 items-center justify-center bg-brand-cyan px-8 font-display text-sm font-semibold text-[#0B1424] transition-[filter] hover:brightness-110"
          >
            Ku noqo mawduucyada
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const progressPercent = ((gameState.currentQuestionIndex + 1) / gameState.questions.length) * 100;

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border-light bg-surface/80 px-5 backdrop-blur-md sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/categories')}
          className="flex h-10 w-10 items-center justify-center border border-border-light text-text-secondary transition-colors hover:border-brand-cyan hover:text-brand-cyan"
          aria-label="Back"
        >
          <BackArrowIcon size={22} />
        </button>
        <div className="flex flex-col items-center gap-0.5">
          <BrandMark logoClassName="h-7 w-7 rounded-lg" size="sm" showTagline={false} />
          <span className="text-xs font-bold tracking-tight text-text-secondary">{rawCategory}</span>
        </div>
        <div className="flex items-center gap-1.5 border border-border-light bg-bg-main px-3 py-1.5 text-amber-400">
          <TrophyIcon size={16} />
          <span className="font-mono text-xs font-bold text-text-primary">
            {gameState.score.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Progress & Timer Bar */}
      <div className="space-y-3 border-b border-border-light bg-surface px-5 py-3.5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-text-secondary">
            <QuestionStackIcon size={20} className="text-brand-cyan" />
            <p className="text-xs font-bold">
              {t.quiz.question}{' '}
              <span className="text-text-primary">{gameState.currentQuestionIndex + 1}</span>{' '}
              {t.quiz.of} {gameState.questions.length}
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 font-mono text-sm font-bold tabular-nums transition-colors ${
              gameState.timeLeft < 5
                ? 'bg-bauh-red/10 text-bauh-red'
                : 'bg-bg-main text-brand-cyan'
            }`}
          >
            <TimerRingIcon
              size={20}
              progress={gameState.timeLeft / 15}
              urgent={gameState.timeLeft < 5}
            />
            <span>00:{gameState.timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>
        <div className="h-1 w-full overflow-hidden bg-border-light">
          <motion.div
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full bg-brand-cyan"
          />
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
      <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-3 border-t border-border-light bg-surface p-5 sm:gap-4 sm:p-6">
        <button
          type="button"
          className="group flex items-center justify-center gap-3 border border-border-light bg-bg-main py-4 transition-colors hover:border-brand-cyan"
        >
          <span className="flex h-9 w-9 items-center justify-center border border-border-light text-brand-cyan transition-transform group-hover:scale-105">
            <HintBulbIcon size={18} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {t.quiz.hint}
          </span>
        </button>
        <button
          type="button"
          disabled={isAnswering || !profile || profile.coins < 10}
          onClick={handleOverclock}
          className={`group flex items-center justify-center gap-3 border bg-bg-main py-4 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            isOverclocking
              ? 'border-brand-cyan'
              : 'border-border-light hover:border-brand-cyan'
          }`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center border border-border-light text-brand-cyan ${
              isOverclocking ? 'animate-pulse' : 'transition-transform group-hover:scale-105'
            }`}
          >
            <BoostZapIcon size={18} />
          </span>
          <div className="flex flex-col items-start gap-0.5 leading-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary group-hover:text-brand-cyan">
              {t.quiz.overclock}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-brand-cyan">
              10 credit
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
