import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Category, Difficulty, UserProfile } from '../types';
import Layout from '../components/Layout';
import BrandMark from '../components/BrandMark';
import { BRAND_FULL } from '../lib/brand';
import { CategoryIcon } from '../components/icons/CategoryIcons';

interface CategoriesProps {
  profile: UserProfile | null;
}

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'Easy', label: 'Fudud' },
  { id: 'Medium', label: 'Dhexdhexaad' },
  { id: 'Hard', label: 'Adag' },
  { id: 'Expert', label: 'Khubaro' },
];

const GAMES: {
  id: Category;
  title: string;
  blurb: string;
}[] = [
  { id: 'IQ', title: 'IQ & Caqli', blurb: 'Qaabab, xujooyin iyo fikir' },
  { id: 'Math', title: 'Xisaabta', blurb: 'Tirooyin cadaadis ah' },
  { id: 'Science', title: 'Sayniska', blurb: 'Atam, cirka iyo sahamin' },
  { id: 'Technology', title: 'Tiknoolajiyadda', blurb: 'Code, chips iyo cloud' },
  { id: 'Football', title: 'Kubadda Cagta', blurb: 'Naadiyo, koobab iyo halyey' },
  { id: 'Movies', title: 'Filimada', blurb: 'Filimada iyo TV-ga' },
  { id: 'Somalia', title: 'Soomaaliya', blurb: 'Dhaqan, taariikh iyo meelo' },
  { id: 'Islamic Knowledge', title: 'Aqoonta Islaamka', blurb: 'Diin, taariikh iyo dhaqan' },
];

export default function CategoriesPage({ profile }: CategoriesProps) {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const difficultyLabel =
    DIFFICULTIES.find((d) => d.id === difficulty)?.label ?? difficulty;

  const playGame = (category: Category) => {
    navigate(
      `/quiz?category=${encodeURIComponent(category)}&difficulty=${difficulty}`
    );
  };

  return (
    <Layout profile={profile} videoBackground>
      <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-8 sm:px-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-5"
        >
          <BrandMark
            logoClassName="h-16 w-16 rounded-2xl shadow-lg sm:h-20 sm:w-20"
            size="lg"
            showTagline
            stacked
            align="start"
          />

          <div className="space-y-3">
            <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-text-primary sm:text-5xl">
              Dooro ciyaar
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
              Dooro tijaabada maskaxda oo riix Ciyaar — AI waxay kuu samaysaa 10 su&apos;aalood oo waqti leh.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mb-8 space-y-3"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">
            Heerka adkaanta
          </p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(({ id, label }) => {
              const active = difficulty === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDifficulty(id)}
                  className={`h-11 px-5 font-display text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-brand-cyan text-[#0B1424]'
                      : 'border border-border-light bg-surface/50 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="space-y-3">
          {GAMES.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.04 }}
              className="flex items-center gap-3 border border-border-light bg-surface/55 p-3 backdrop-blur-md sm:gap-4 sm:p-4"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-border-light bg-bg-main/60 text-brand-cyan sm:h-16 sm:w-16">
                <CategoryIcon category={game.id} size={28} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-lg font-bold tracking-tight text-text-primary sm:text-xl">
                  {game.title}
                </h2>
                <p className="mt-0.5 truncate text-sm text-text-secondary">
                  {game.blurb} · {difficultyLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={() => playGame(game.id)}
                className="group inline-flex h-12 shrink-0 items-center gap-2 bg-brand-cyan px-4 font-display text-sm font-semibold text-[#0B1424] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] sm:h-14 sm:px-6 sm:text-base"
              >
                <Play className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
                Ciyaar
                <ArrowRight className="hidden h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:block" />
              </button>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary/50">
          {BRAND_FULL} · 2026
        </p>
      </div>
    </Layout>
  );
}
