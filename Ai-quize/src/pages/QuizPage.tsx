import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Lightbulb, CheckCircle, XCircle, ArrowLeft, Trophy, Flame } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Question, GameState, UserProfile } from '../types';
import { sounds } from '../lib/sounds';
import { useTranslation } from '../lib/TranslationContext';
import BrandMark from '../components/BrandMark';
import LoadingScreen from '../components/LoadingScreen';
import { isGuestProfile, loadGuestProfile, saveGuestProfile } from '../lib/guestProfile';

interface QuizProps {
  profile: UserProfile | null;
}

const DIFFICULTY_SO: Record<string, string> = {
  Easy: 'Fudud',
  Medium: 'Dhexdhexaad',
  Hard: 'Adag',
  Expert: 'Khubaro',
};

const TIMER_SECONDS = 15;

export default function QuizPage({ profile }: QuizProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const rawCategory = searchParams.get('category') || 'General';
  const difficulty = searchParams.get('difficulty') || 'Medium';
  const difficultyLabel = DIFFICULTY_SO[difficulty] || difficulty;

  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    questions: [],
    score: 0,
    streak: 0,
    timeLeft: TIMER_SECONDS,
    isFinished: false,
    correctAnswers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isOverclocking, setIsOverclocking] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answeringRef = useRef(false);
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

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
          }),
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else if (data.questions && data.questions.length > 0) {
          setGameState((prev) => ({ ...prev, questions: data.questions }));
        } else {
          setError("Su'aalo lama helin. Isku day mar kale.");
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Xiriirka ayaa xumaaday. Hubi internetka.');
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [rawCategory, difficulty]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const advanceAfterAnswer = (index: number) => {
    const prev = gameStateRef.current;
    const question = prev.questions[prev.currentQuestionIndex];
    const isCorrect = index === question.correctIndex;
    const newScore = isCorrect ? prev.score + 100 * prev.timeLeft : prev.score;
    const newStreak = isCorrect ? prev.streak + 1 : 0;
    const newCorrect = isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers;
    const nextIndex = prev.currentQuestionIndex + 1;
    const isFinished = nextIndex >= prev.questions.length;

    if (isFinished) {
      sessionStorage.setItem(
        'lastGameResults',
        JSON.stringify({
          score: newScore,
          correctCount: newCorrect,
          totalQuestions: prev.questions.length,
          streak: newStreak,
        })
      );
      setTimeout(() => navigate('/rewards'), 900);
    }

    setGameState({
      ...prev,
      score: newScore,
      streak: newStreak,
      correctAnswers: newCorrect,
      currentQuestionIndex: isFinished ? prev.currentQuestionIndex : nextIndex,
      isFinished,
      timeLeft: TIMER_SECONDS,
    });
    setSelectedOption(null);
    setIsAnswering(false);
    answeringRef.current = false;
    setShowExplanation(false);
    setHiddenOptions([]);
  };

  const handleAnswer = (index: number, skipWait = false) => {
    if (answeringRef.current && !skipWait) return;
    answeringRef.current = true;
    setIsAnswering(true);
    setSelectedOption(index);
    clearTimer();

    const question = gameStateRef.current.questions[gameStateRef.current.currentQuestionIndex];
    const isCorrect = index === question.correctIndex;

    if (isCorrect) sounds.playCorrect();
    else sounds.playIncorrect();

    if (question.explanation) setShowExplanation(true);

    setTimeout(() => advanceAfterAnswer(index), skipWait ? 600 : 1600);
  };

  useEffect(() => {
    if (loading || gameState.isFinished || isAnswering) return;

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 1) {
          clearTimer();
          sounds.playIncorrect();
          queueMicrotask(() => handleAnswer(-1));
          return { ...prev, timeLeft: 0 };
        }
        if (prev.timeLeft <= 5) sounds.playWarning();
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return clearTimer;
  }, [loading, gameState.isFinished, isAnswering, gameState.currentQuestionIndex]);

  const handleHint = () => {
    if (hintUsed || isAnswering || answeringRef.current) return;
    const question = gameState.questions[gameState.currentQuestionIndex];
    const wrong = question.options
      .map((_, i) => i)
      .filter((i) => i !== question.correctIndex);
    const shuffled = [...wrong].sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(shuffled);
    setHintUsed(true);
    sounds.playWarning();
  };

  const handleOverclock = async () => {
    if (isAnswering || answeringRef.current || !profile || profile.coins < 10) return;

    answeringRef.current = true;
    setIsAnswering(true);
    setIsOverclocking(true);
    clearTimer();

    try {
      if (isGuestProfile(profile)) {
        const next = { ...loadGuestProfile(), ...profile, coins: profile.coins - 10 };
        saveGuestProfile(next);
      } else {
        const userRef = doc(db, 'users', profile.id);
        await updateDoc(userRef, { coins: increment(-10) });
      }

      sounds.playWarning();
      const question = gameState.questions[gameState.currentQuestionIndex];

      setTimeout(() => {
        setSelectedOption(question.correctIndex);
        setShowExplanation(true);
        setTimeout(() => {
          setIsOverclocking(false);
          handleAnswer(question.correctIndex, true);
        }, 700);
      }, 400);
    } catch (err) {
      if (!isGuestProfile(profile)) {
        handleFirestoreError(err, OperationType.UPDATE, 'users/' + profile.id);
      }
      setIsAnswering(false);
      answeringRef.current = false;
      setIsOverclocking(false);
    }
  };

  if (loading) return <LoadingScreen />;

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
            {error || "Wax baa qaldamay markii su'aalaha la samaynayay. Isku day mar kale."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-12 items-center justify-center bg-brand-cyan px-8 font-display text-sm font-semibold text-[#0B1424] transition-[filter] hover:brightness-110"
            >
              Isku day mar kale
            </button>
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="inline-flex h-12 items-center justify-center border border-border-light px-8 font-display text-sm font-semibold text-text-primary transition-colors hover:border-brand-cyan"
            >
              Ku noqo mawduucyada
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const qNum = gameState.currentQuestionIndex + 1;
  const qTotal = gameState.questions.length;
  const progressPercent = (qNum / qTotal) * 100;
  const timerRatio = gameState.timeLeft / TIMER_SECONDS;
  const timerUrgent = gameState.timeLeft <= 5;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-bg-main">
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,194,255,0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 100% 80%, rgba(0,194,255,0.05) 0%, transparent 50%)',
        }}
      />

      {/* Top progress */}
      <div className="relative z-20 h-1 w-full bg-border-light">
        <motion.div
          className="h-full bg-brand-cyan"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </div>

      <header className="relative z-20 flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/categories')}
          className="flex h-11 w-11 items-center justify-center border border-border-light bg-surface/60 text-text-secondary backdrop-blur-md transition-colors hover:border-brand-cyan hover:text-brand-cyan"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate font-display text-sm font-bold tracking-tight text-text-primary sm:text-base">
            {rawCategory}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
            {difficultyLabel} · {qNum}/{qTotal}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {gameState.streak > 0 && (
            <div className="hidden items-center gap-1 border border-border-light bg-surface/60 px-2.5 py-2 backdrop-blur-md sm:flex">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-mono text-xs font-bold text-text-primary">{gameState.streak}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 border border-border-light bg-surface/60 px-3 py-2 backdrop-blur-md">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono text-xs font-bold tabular-nums text-text-primary">
              {gameState.score.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* Timer strip */}
      <div className="relative z-20 mx-auto flex w-full max-w-2xl items-center gap-4 px-5 pb-2 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              {t.quiz.question} {qNum} {t.quiz.of} {qTotal}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums ${
                timerUrgent ? 'text-bauh-red' : 'text-brand-cyan'
              }`}
            >
              <Timer className={`h-3.5 w-3.5 ${timerUrgent ? 'animate-pulse' : ''}`} />
              00:{gameState.timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden bg-border-light">
            <motion.div
              className={`h-full origin-left ${timerUrgent ? 'bg-bauh-red' : 'bg-brand-cyan'}`}
              initial={false}
              animate={{ scaleX: timerRatio }}
              transition={{ duration: 0.35, ease: 'linear' }}
            />
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-5 sm:px-6 sm:py-7">
        <AnimatePresence mode="wait">
          <motion.section
            key={gameState.currentQuestionIndex}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mb-6 border border-border-light bg-surface/55 p-6 backdrop-blur-md sm:p-8"
          >
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-brand-cyan">
              {t.quiz.neuralQuery} {qNum}
            </p>

            {currentQuestion.imageUrl && (
              <div className="mb-5 aspect-video w-full overflow-hidden border border-border-light">
                <img
                  src={currentQuestion.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
                  }}
                />
              </div>
            )}

            <h2 className="font-display text-xl font-bold leading-snug tracking-tight text-text-primary sm:text-2xl">
              {currentQuestion.text}
            </h2>

            {showExplanation && currentQuestion.explanation && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 border-l-2 border-brand-cyan/60 pl-3 text-sm leading-relaxed text-text-secondary"
              >
                {currentQuestion.explanation}
              </motion.p>
            )}
          </motion.section>
        </AnimatePresence>

        <div className="grid flex-1 grid-cols-1 content-start gap-3">
          {currentQuestion.options.map((option, idx) => {
            if (hiddenOptions.includes(idx)) return null;

            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctIndex;
            const showStatus = isAnswering;

            let stateClass =
              'border-border-light bg-surface/50 hover:border-brand-cyan/70 hover:bg-surface';
            let letterClass = 'border-border-light bg-bg-main/80 text-text-secondary';

            if (showStatus) {
              if (isCorrect) {
                stateClass = 'border-bauh-green bg-bauh-green/10';
                letterClass = 'border-bauh-green bg-bauh-green text-white';
              } else if (isSelected) {
                stateClass = 'border-bauh-red bg-bauh-red/10';
                letterClass = 'border-bauh-red bg-bauh-red text-white';
              } else {
                stateClass = 'border-border-light bg-surface/30 opacity-40';
              }
            }

            return (
              <motion.button
                key={`${gameState.currentQuestionIndex}-${idx}`}
                type="button"
                onClick={() => handleAnswer(idx)}
                disabled={isAnswering}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.3 }}
                className={`group flex w-full items-center gap-4 border p-4 text-left transition-colors disabled:cursor-default sm:p-5 ${stateClass}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center border font-display text-sm font-bold transition-colors ${letterClass}`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span
                  className={`min-w-0 flex-1 font-display text-[15px] font-semibold tracking-tight sm:text-base ${
                    showStatus && isCorrect ? 'text-bauh-green' : 'text-text-primary'
                  }`}
                >
                  {option}
                </span>
                {showStatus && isCorrect && <CheckCircle className="h-5 w-5 shrink-0 text-bauh-green" />}
                {showStatus && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 shrink-0 text-bauh-red" />
                )}
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Lifelines */}
      <footer className="relative z-20 mx-auto w-full max-w-2xl border-t border-border-light bg-surface/70 px-5 py-4 backdrop-blur-md sm:px-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleHint}
            disabled={hintUsed || isAnswering}
            className="flex h-14 items-center justify-center gap-2.5 border border-border-light bg-bg-main/50 transition-colors hover:border-brand-cyan disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Lightbulb className="h-4 w-4 text-brand-cyan" />
            <div className="text-left leading-tight">
              <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-text-primary">
                {t.quiz.hint}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                {hintUsed ? 'La isticmaalay' : '50 / 50'}
              </span>
            </div>
          </button>

          <button
            type="button"
            disabled={isAnswering || !profile || profile.coins < 10}
            onClick={handleOverclock}
            className={`flex h-14 items-center justify-center gap-2.5 border transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
              isOverclocking
                ? 'border-brand-cyan bg-brand-cyan/10'
                : 'border-border-light bg-bg-main/50 hover:border-brand-cyan'
            }`}
          >
            <Zap className={`h-4 w-4 text-brand-cyan ${isOverclocking ? 'animate-pulse' : ''}`} />
            <div className="text-left leading-tight">
              <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-text-primary">
                {t.quiz.overclock}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                10 credit
              </span>
            </div>
          </button>
        </div>
      </footer>
    </div>
  );
}
