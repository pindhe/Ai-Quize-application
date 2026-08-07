import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Zap,
  Database,
  Globe,
  Cpu,
  Terminal,
  Atom,
  Shield,
  Film,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import { Category, Difficulty, UserProfile } from '../types';
import Layout from '../components/Layout';
import BrandLogo from '../components/BrandLogo';

interface CategoriesProps {
  profile: UserProfile | null;
}

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Expert'];

const CATEGORIES: {
  id: Category;
  label: string;
  blurb: string;
  icon: typeof Globe;
  accent: string;
  bars: number;
  thumbnail: string;
}[] = [
  {
    id: 'Football',
    label: 'Athletic Matrix',
    blurb: 'Match IQ & pitch lore',
    icon: Globe,
    accent: 'bg-emerald-400',
    bars: 3,
    thumbnail:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'IQ',
    label: 'Neural Logic',
    blurb: 'Patterns & puzzles',
    icon: Cpu,
    accent: 'bg-brand-cyan',
    bars: 5,
    thumbnail:
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Technology',
    label: 'Sys Architecture',
    blurb: 'Code, chips & clouds',
    icon: Terminal,
    accent: 'bg-sky-400',
    bars: 4,
    thumbnail:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Science',
    label: 'Quantum Shards',
    blurb: 'Labs, atoms & space',
    icon: Atom,
    accent: 'bg-teal-400',
    bars: 4,
    thumbnail:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Somalia',
    label: 'Cultural Heritage',
    blurb: 'History & geography',
    icon: Shield,
    accent: 'bg-amber-400',
    bars: 3,
    thumbnail:
      'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Islamic Knowledge',
    label: 'Eternal Core',
    blurb: 'Faith & tradition',
    icon: Database,
    accent: 'bg-teal-500',
    bars: 3,
    thumbnail:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Movies',
    label: 'Visual Streams',
    blurb: 'Film & TV trivia',
    icon: Film,
    accent: 'bg-rose-400',
    bars: 2,
    thumbnail:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Math',
    label: 'Numerical Void',
    blurb: 'Numbers under pressure',
    icon: Calculator,
    accent: 'bg-indigo-400',
    bars: 5,
    thumbnail:
      'https://images.unsplash.com/photo-1509228468518-180dd482180c?auto=format&fit=crop&q=80&w=800',
  },
];

export default function CategoriesPage({ profile }: CategoriesProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const filtered = CATEGORIES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.blurb.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout profile={profile} videoBackground>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-8 sm:py-10">
        {/* Brand + page purpose */}
        <section className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
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
                  NeuroCore Arena
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">
                  Pick a realm · Play now
                </p>
              </div>
            </div>

            <h1 className="max-w-xl font-display text-4xl font-bold leading-[0.95] tracking-tight text-text-primary sm:text-5xl md:text-6xl">
              Choose your realm
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
              Select a category and difficulty — AI builds a fresh quiz battle for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 rounded-2xl border border-border-light bg-surface/70 px-4 py-3 backdrop-blur-md"
          >
            <Zap className="h-4 w-4 text-brand-cyan" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-text-secondary">
              {filtered.length} realms live
            </span>
          </motion.div>
        </section>

        {/* Controls */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-4"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder="Search realms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-border-light bg-surface/70 pl-11 pr-4 font-display text-sm text-text-primary outline-none backdrop-blur-md transition-colors placeholder:text-text-secondary focus:border-brand-cyan/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {DIFFICULTIES.map((d) => {
              const active = difficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`h-10 shrink-0 px-5 font-display text-xs font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? 'bg-brand-cyan text-[#0B1424]'
                      : 'border border-border-light bg-surface/60 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Realm grid — cards are selection controls */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((cat, idx) => (
              <motion.button
                key={cat.id}
                layout
                type="button"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: Math.min(idx * 0.04, 0.24), duration: 0.4 }}
                onClick={() =>
                  navigate(`/quiz?category=${encodeURIComponent(cat.id)}&difficulty=${difficulty}`)
                }
                className="group relative h-64 overflow-hidden border border-border-light bg-surface/40 text-left outline-none backdrop-blur-sm transition-[transform,border-color] hover:-translate-y-1 hover:border-brand-cyan/50 focus-visible:border-brand-cyan"
              >
                <img
                  src={cat.thumbnail}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1424] via-[#0B1424]/70 to-transparent" />

                <div className="relative z-10 flex h-full flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center border border-white/15 bg-black/35 text-white backdrop-blur-sm">
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                      {cat.id}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                        {cat.label}
                      </h2>
                      <p className="mt-1 text-sm text-white/60">{cat.blurb}</p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                      <div className="flex items-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 w-4 ${
                              i < cat.bars ? cat.accent : 'bg-white/15'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 font-display text-xs font-semibold text-brand-cyan">
                        Play
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-3 py-24 text-center">
              <Database className="h-10 w-10 text-text-secondary opacity-40" />
              <p className="font-display text-sm text-text-secondary">No realms match that search.</p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
