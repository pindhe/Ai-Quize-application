import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Trophy,
  Zap,
  Flame,
  Target,
  ArrowRight,
  CheckCircle2,
  Settings,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import Layout from '../components/Layout';
import BrandLogo from '../components/BrandLogo';

interface DashboardProps {
  profile: UserProfile | null;
}

export default function DashboardPage({ profile }: DashboardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!profile) return null;

  const xpIntoLevel = profile.xp % 1000;
  const xpPercent = Math.min(100, Math.round(xpIntoLevel / 10));
  const accuracy =
    profile.totalGames > 0
      ? Math.round((profile.totalWins / profile.totalGames) * 100)
      : 0;
  const challenges = profile.challenges || [];
  const activeCount = challenges.filter((c) => !c.completed).length;

  const challengeLabel = (id: string, fallback: string) => {
    if (id === 'daily_wins_1') return t.dashboard.perfectSync;
    if (id === 'daily_accuracy') return t.dashboard.accuracyChallenge;
    return fallback;
  };

  return (
    <Layout profile={profile} videoBackground>
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-8 sm:py-10">
        {/* Hero */}
        <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <BrandLogo className="h-14 w-14 rounded-2xl shadow-md sm:h-16 sm:w-16" />
              <div>
                <p className="font-display text-sm font-semibold tracking-wide text-brand-cyan">
                  NeuroCore
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">
                  {t.dashboard.welcome}
                </p>
              </div>
            </div>

            <div>
              <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-text-primary sm:text-5xl">
                Welcome back,{' '}
                <span className="text-brand-cyan">
                  {profile.displayName.split(' ')[0]}
                </span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
                Level {profile.level} · {profile.rank}. Jump into a quiz battle or track today’s objectives.
              </p>
            </div>
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            onClick={() => navigate('/categories')}
            className="group inline-flex h-14 shrink-0 items-center gap-3 bg-brand-cyan px-7 font-display text-base font-semibold text-[#0B1424] transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
          >
            <Play className="h-5 w-5 fill-current" />
            Play Arena
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        </section>

        {/* Stats strip */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          {[
            {
              label: t.dashboard.level,
              value: String(profile.level),
              icon: Target,
              hint: profile.rank,
            },
            {
              label: t.dashboard.xp,
              value: profile.xp.toLocaleString(),
              icon: Zap,
              hint: `${xpPercent}% to next`,
            },
            {
              label: 'Coins',
              value: profile.coins.toLocaleString(),
              icon: Zap,
              hint: 'Spend in battle',
            },
            {
              label: t.dashboard.dailyStreak,
              value: `${profile.dailyStreak}d`,
              icon: Flame,
              hint: 'Keep it going',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-border-light bg-surface/55 p-4 backdrop-blur-md sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <stat.icon className="h-4 w-4 text-brand-cyan" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                  {stat.hint}
                </span>
              </div>
              <p className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </motion.section>

        {/* Progress + quick links */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="border border-border-light bg-surface/55 p-5 backdrop-blur-md sm:p-6 lg:col-span-3"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-text-primary">
                  Level progress
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {xpIntoLevel} / 1000 XP toward level {profile.level + 1}
                </p>
              </div>
              <span className="font-mono text-sm font-bold text-brand-cyan">{xpPercent}%</span>
            </div>

            <div className="h-2 w-full overflow-hidden bg-bg-main/80">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-brand-cyan"
              />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border-light pt-5">
              <div>
                <p className="font-display text-lg font-bold text-text-primary">{accuracy}%</p>
                <p className="text-[11px] text-text-secondary">Win rate</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-text-primary">{profile.totalGames}</p>
                <p className="text-[11px] text-text-secondary">Games played</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-text-primary">{profile.totalWins}</p>
                <p className="text-[11px] text-text-secondary">Perfect runs</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3 lg:col-span-2"
          >
            <button
              type="button"
              onClick={() => navigate('/leaderboard')}
              className="group flex flex-1 items-center justify-between border border-border-light bg-surface/55 p-5 text-left backdrop-blur-md transition-colors hover:border-brand-cyan/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center bg-brand-cyan/15 text-brand-cyan">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-text-primary">Rankings</p>
                  <p className="text-xs text-text-secondary">See global standings</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-brand-cyan" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="group flex flex-1 items-center justify-between border border-border-light bg-surface/55 p-5 text-left backdrop-blur-md transition-colors hover:border-brand-cyan/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden bg-bg-main">
                  <img
                    src={
                      profile.photoURL ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
                    }
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-text-primary">Your stats</p>
                  <p className="text-xs text-text-secondary">{profile.rank}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-brand-cyan" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="group flex items-center justify-between border border-border-light bg-surface/55 px-5 py-4 text-left backdrop-blur-md transition-colors hover:border-brand-cyan/50"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-text-secondary" />
                <span className="font-display text-sm font-medium text-text-primary">Settings</span>
              </div>
              <ArrowRight className="h-4 w-4 text-text-secondary transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        </section>

        {/* Challenges */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-0.5">
            <h2 className="font-display text-xl font-bold tracking-tight text-text-primary">
              {t.dashboard.challenges}
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              {activeCount} active
            </span>
          </div>

          <div className="space-y-3">
            {challenges.length === 0 ? (
              <div className="border border-dashed border-border-light bg-surface/40 px-5 py-10 text-center backdrop-blur-md">
                <p className="text-sm text-text-secondary">No objectives yet — play a match to unlock daily goals.</p>
              </div>
            ) : (
              challenges.map((challenge) => {
                const progress = Math.min(
                  100,
                  Math.round((challenge.current / challenge.target) * 100)
                );
                return (
                  <div
                    key={challenge.id}
                    className="border border-border-light bg-surface/55 p-4 backdrop-blur-md sm:p-5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center ${
                            challenge.completed
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : 'bg-brand-cyan/15 text-brand-cyan'
                          }`}
                        >
                          {challenge.completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Target className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-display text-sm font-semibold text-text-primary sm:text-base">
                            {challengeLabel(challenge.id, challenge.label)}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-text-secondary">
                            {challenge.current} / {challenge.target}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-bold text-amber-500">
                        +{challenge.reward}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden bg-bg-main/80">
                      <div
                        className={`h-full transition-all duration-500 ${
                          challenge.completed ? 'bg-emerald-500' : 'bg-brand-cyan'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
