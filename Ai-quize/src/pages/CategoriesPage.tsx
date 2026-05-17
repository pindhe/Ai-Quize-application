import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Database, Globe, Cpu, Terminal, Atom, Shield, Film, Calculator } from 'lucide-react';
import { Category, Difficulty } from '../types';
import { useState } from 'react';
import { useTranslation } from '../lib/TranslationContext';
import Layout from '../components/Layout';
import { UserProfile } from '../types';

interface CategoriesProps {
  profile: UserProfile | null;
}

export default function CategoriesPage({ profile }: CategoriesProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");

  const CATEGORIES: { id: Category, label: string, icon: any, color: string, glow: string, difficulty: number, thumbnail: string }[] = [
    { id: "Football", label: "Athletic Matrix", icon: Globe, color: "from-emerald-500", glow: "shadow-emerald-500/20", difficulty: 3, thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=500" },
    { id: "IQ", label: "Neural Logic", icon: Cpu, color: "from-brand-purple", glow: "shadow-brand-purple/20", difficulty: 5, thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=500" },
    { id: "Technology", label: "Sys-Architecture", icon: Terminal, color: "from-blue-500", glow: "shadow-blue-500/20", difficulty: 4, thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=500" },
    { id: "Science", label: "Quantum Shards", icon: Atom, color: "from-brand-cyan", glow: "shadow-brand-cyan/20", difficulty: 4, thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=500" },
    { id: "Somalia", label: "Cultural Heritage", icon: Shield, color: "from-amber-600", glow: "shadow-amber-600/20", difficulty: 3, thumbnail: "https://images.unsplash.com/photo-1584933333293-2d7a2b1a1c2a?auto=format&fit=crop&q=80&w=500" },
    { id: "Islamic Knowledge", label: "Eternal Core", icon: Database, color: "from-teal-600", glow: "shadow-teal-600/20", difficulty: 3, thumbnail: "https://images.unsplash.com/photo-1564769643124-797773514631?auto=format&fit=crop&q=80&w=500" },
    { id: "Movies", label: "Visual Streams", icon: Film, color: "from-rose-500", glow: "shadow-rose-500/20", difficulty: 2, thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500" },
    { id: "Math", label: "Numerical Void", icon: Calculator, color: "from-indigo-600", glow: "shadow-indigo-600/20", difficulty: 5, thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd482180c?auto=format&fit=crop&q=80&w=500" },
  ];

  const filtered = CATEGORIES.filter(c => c.label.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout profile={profile}>
      <main className="p-4 sm:p-10 max-w-6xl mx-auto space-y-12">
        {/* Cinematic Header */}
        <div className="space-y-4 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-cyan/10 blur-[100px] pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_8px_#00c2ff]" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] font-mono leading-none">Dataset_Vault_Alpha</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tighter italic uppercase leading-tight">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-blue-500 to-brand-purple drop-shadow-[0_0_15px_rgba(0,194,255,0.1)]">Realm</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-text-secondary font-bold uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
              Select a training dataset to synchronize with your <span className="text-text-primary">core architecture</span>.
            </p>
        </div>

        {/* Global Controls */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4">
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-brand-cyan transition-colors" />
                <input 
                    type="text" 
                    placeholder="SCAN NETWORK FOR DATASETS..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-14 bg-surface/50 border border-border-light rounded-3xl pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-brand-cyan/5 focus:border-brand-cyan/30 transition-all outline-none backdrop-blur-xl"
                />
            </div>

            <div className="flex gap-1.5 p-1.5 bg-surface border border-border-light rounded-3xl overflow-x-auto scrollbar-hide">
                {["Easy", "Medium", "Hard", "Expert"].map((d: any) => (
                    <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            difficulty === d 
                                ? 'bg-text-primary text-white shadow-xl shadow-black/20' 
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-main'
                        }`}
                    >
                        {d}
                    </button>
                ))}
            </div>
        </div>

        {/* Categories Perspective Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 [perspective:1200px]">
            <AnimatePresence mode="popLayout">
                {filtered.map((cat, idx) => (
                    <motion.button
                        layout
                        initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05, type: 'spring', damping: 25 }}
                        key={cat.id}
                        onClick={() => {
                            navigate(`/quiz?category=${cat.id}&difficulty=${difficulty}`);
                        }}
                        className="group relative h-72 w-full [transform-style:preserve-3d] hover:[transform:rotateX(8deg)_translateY(-12px)] transition-all duration-700 outline-none"
                    >
                        {/* High-Brightness Spectral Aura */}
                        <div className="absolute inset-0 bg-white/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                        
                        <div className="absolute inset-0 bg-surface border border-border-light rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group-hover:border-white/50 group-hover:shadow-[0_40px_80px_rgba(255,255,255,0.1),0_40px_80px_rgba(0,0,0,0.4)]">
                            {/* Thumbnail background with gradient */}
                            <div className="absolute inset-0 z-0">
                                <img src={cat.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
                            </div>
                            
                            {/* Static Gradient Pulse */}
                            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${cat.color} opacity-[0.15] group-hover:opacity-[0.4] transition-opacity blur-3xl z-1`} />
                            
                            {/* White Glow / Specular Highlight */}
                            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 blur-[80px] group-hover:translate-x-1/2 group-hover:translate-y-1/2 transition-transform duration-700 pointer-events-none" />
                            
                            <div className="relative h-full p-8 flex flex-col justify-between items-start z-10">
                                <div className="space-y-6">
                                  <div className={`w-16 h-16 rounded-[1.5rem] bg-bg-main border border-border-light flex items-center justify-center text-text-primary group-hover:scale-110 group-hover:bg-text-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]`}>
                                      <cat.icon className="w-8 h-8" />
                                  </div>
                                  <div className="text-left">
                                      <h3 className="text-2xl font-black text-text-primary tracking-tighter italic uppercase leading-none group-hover:text-brand-cyan transition-colors">{cat.label}</h3>
                                      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-3">{cat.id}</p>
                                  </div>
                                </div>

                                <div className="w-full space-y-4">
                                  <div className="flex justify-between items-end">
                                      <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">Sync Complexity</span>
                                      <div className="flex gap-1">
                                          {[...Array(5)].map((_, i) => (
                                              <div key={i} className={`w-3.5 h-1.5 rounded-full ${i < cat.difficulty ? 'bg-brand-cyan' : 'bg-border-light/20'}`} />
                                          ))}
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-4 border-t border-border-light/40">
                                      <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                          <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em]">Stable</span>
                                      </div>
                                      <Zap className="w-4 h-4 text-brand-cyan opacity-20 group-hover:opacity-100 group-hover:animate-pulse" />
                                  </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Holographic Reflection Overlay */}
                        <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
                    </motion.button>
                ))}
            </AnimatePresence>
            
            {filtered.length === 0 && (
                <div className="col-span-full py-32 text-center space-y-6">
                    <div className="inline-flex w-16 h-16 rounded-full bg-surface border-2 border-dashed border-border-light items-center justify-center opacity-30">
                        <Database className="w-8 h-8 text-text-secondary" />
                    </div>
                    <p className="text-[11px] font-black text-text-secondary uppercase tracking-[0.4em] italic">No active data streams detected...</p>
                </div>
            )}
        </div>
      </main>
    </Layout>
  );
}
