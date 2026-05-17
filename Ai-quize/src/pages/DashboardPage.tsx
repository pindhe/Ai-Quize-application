import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, User, Zap, Cpu, ChevronRight, LayoutGrid, Heart, Activity, Shield, Terminal, ZapOff } from 'lucide-react';
import { UserProfile } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import Layout from '../components/Layout';

interface DashboardProps {
  profile: UserProfile | null;
}

export default function DashboardPage({ profile }: DashboardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!profile) return null;

  const xpPercent = (profile.xp % 1000) / 10;

  return (
    <Layout profile={profile}>
      <main className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Intelligence Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Status Module */}
          <div className="lg:col-span-2 main-card p-0 overflow-hidden bg-gradient-to-br from-surface to-bg-main border-2 border-border-light relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 blur-[100px] pointer-events-none" />
            
            <div className="p-5 sm:p-8 border-b border-border-light/50 flex flex-col sm:flex-row justify-between items-start gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_8px_#00c2ff]" />
                  <span className="text-[9px] sm:text-[10px] font-black text-brand-cyan uppercase tracking-[0.3em] font-mono">Neural_Link_Stable</span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-4xl font-black text-text-primary tracking-tighter italic uppercase leading-none">{t.dashboard.activeStatus}</h2>
                  <p className="text-[11px] sm:text-xs text-text-secondary font-medium tracking-tight max-w-sm">System performance at peak synchronization. Cognitive bandwidth optimal.</p>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-border-light/30 pt-4 sm:pt-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-bg-main border border-border-light flex items-center justify-center text-brand-purple sm:mb-2">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest font-mono">Uptime</span>
                  <span className="text-lg sm:text-xl font-black text-text-primary italic font-mono">{profile.dailyStreak}d</span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 bg-surface/30 backdrop-blur-sm grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="space-y-1">
                <span className="text-[8px] sm:text-[9px] font-bold text-text-secondary uppercase tracking-widest block">Accuracy</span>
                <p className="text-base sm:text-lg font-black text-text-primary font-mono tracking-tighter">98.4%</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] sm:text-[9px] font-bold text-text-secondary uppercase tracking-widest block">Latency</span>
                <p className="text-base sm:text-lg font-black text-text-primary font-mono tracking-tighter">12ms</p>
              </div>
              <div className="col-span-2 space-y-1.5 sm:space-y-1">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[8px] sm:text-[9px] font-bold text-text-secondary uppercase tracking-widest">Level Progress</span>
                  <span className="text-[9px] sm:text-[10px] font-black text-brand-purple font-mono">{xpPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-bg-main rounded-full overflow-hidden border border-border-light p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full shadow-[0_0_10px_rgba(0,194,255,0.4)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="main-card p-6 bg-text-primary text-white space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 transition-transform group-hover:rotate-0">
                <Zap className="w-20 h-20 fill-white" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] font-mono">Current_Balance</span>
                <div className="space-y-0.5">
                  <p className="text-3xl sm:text-4xl font-black italic tracking-tighter">{profile.coins.toLocaleString()}</p>
                  <p className="text-[10px] text-brand-cyan font-bold uppercase tracking-widest">+1,240 Today</p>
                </div>
                <button 
                  onClick={() => navigate('/rewards')}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Exchange Credits
                </button>
              </div>
            </div>

            <div className="main-card p-5 border border-dashed border-border-light flex items-center justify-between group hover:border-brand-cyan transition-colors h-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan group-hover:text-white transition-all">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-black text-text-primary uppercase tracking-tight">Global Rank</p>
                  <p className="text-[9px] sm:text-[10px] text-text-secondary font-bold font-mono">#024 / 1.2k</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary opacity-30 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </section>

        {/* Primary Action Zone */}
        <section className="relative px-2 sm:px-0">
          <div className="absolute inset-0 bg-brand-cyan/20 blur-[80px] sm:blur-[120px] rounded-full opacity-40" />
          <motion.button 
            whileHover={{ scale: 1.01, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/categories')}
            className="w-full bg-surface border-2 sm:border-4 border-text-primary rounded-[2rem] sm:rounded-[3rem] p-1.5 flex items-center justify-between shadow-2xl relative z-10 group"
          >
            <div className="flex-1 flex items-center gap-4 sm:gap-8 pl-6 sm:pl-10 h-20 sm:h-24">
              <div className="hidden md:flex flex-col items-start gap-1">
                <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-brand-cyan/20 rounded-full" />)}
                </div>
                <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.4em] font-mono leading-none">Ready_To_Sync</span>
              </div>
              
              <div className="text-left flex flex-col justify-center">
                <span className="text-text-primary text-xl sm:text-3xl font-black tracking-tighter italic uppercase leading-none mb-1 group-hover:text-brand-cyan transition-colors">Initiate Brain Sync</span>
                <span className="text-[9px] sm:text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em]">{t.dashboard.title} Protocol v4.2</span>
              </div>
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] bg-text-primary flex items-center justify-center shadow-lg group-hover:bg-brand-cyan transition-all">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white fill-white translate-x-0.5 sm:translate-x-1" />
            </div>
          </motion.button>
        </section>

        {/* Information Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-1 gap-6 pb-12">
          {/* Active Challenges Module */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-brand-purple" />
                <h3 className="text-[11px] sm:text-xs font-black text-text-primary uppercase tracking-[0.2em] italic">{t.dashboard.challenges}</h3>
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold text-text-secondary uppercase tracking-widest bg-surface px-2 py-0.5 rounded border border-border-light font-mono">2_Active</span>
            </div>
            
            <div className="space-y-3">
              {(profile.challenges || []).map((challenge) => (
                <div key={challenge.id} className="main-card p-4 sm:p-5 group flex items-center gap-4 hover:border-brand-purple transition-all relative overflow-hidden">
                  {challenge.completed && (
                    <div className="absolute top-0 right-0 w-10 sm:w-12 h-10 sm:h-12 bg-bauh-green/10 flex items-center justify-center rounded-bl-2xl sm:rounded-bl-3xl">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-bauh-green fill-bauh-green" />
                    </div>
                  )}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${challenge.completed ? 'bg-bauh-green/10 text-bauh-green' : 'bg-bg-main border border-border-light text-text-secondary group-hover:text-brand-purple'}`}>
                    <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between items-start pr-8">
                       <p className="text-[10px] sm:text-xs font-black text-text-primary italic tracking-tight uppercase leading-tight">
                         {challenge.id === 'daily_wins_1' ? t.dashboard.perfectSync : challenge.id === 'daily_accuracy' ? t.dashboard.accuracyChallenge : challenge.label}
                       </p>
                       <span className="text-[9px] sm:text-[10px] font-black text-amber-500 font-mono tracking-tighter">+{challenge.reward}</span>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-1.5">
                       <div className="flex justify-between text-[7px] sm:text-[8px] font-black text-text-secondary uppercase tracking-widest font-mono">
                          <span>Progress</span>
                          <span>{challenge.current} / {challenge.target}</span>
                       </div>
                       <div className="h-1 w-full bg-bg-main rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full rounded-full transition-all duration-1000 ${challenge.completed ? 'bg-bauh-green' : 'bg-brand-purple'}`}
                            style={{ width: `${Math.min(100, (challenge.current / challenge.target) * 100)}%` }}
                          />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Logs / Network Status */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border-light pt-8 pb-12">
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-2">
                <Terminal className="w-4 h-4 text-brand-cyan" />
                <h3 className="text-[11px] sm:text-xs font-black text-text-primary uppercase tracking-[0.2em] italic">System Metrics</h3>
             </div>
             
             <div className="main-card p-5 sm:p-6 bg-surface/50 border-2 border-dashed border-border-light flex flex-col gap-5 sm:gap-6">
                <div className="flex items-center justify-between border-b border-border-light pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                         <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-black text-text-primary uppercase tracking-widest">Neural Encryption</span>
                   </div>
                   <span className="text-[8px] sm:text-[9px] font-black text-emerald-500 font-mono italic">ACTIVE_SECURE</span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em]">Synapse Latency</span>
                      <div className="text-[9px] sm:text-[10px] font-bold text-brand-cyan font-mono">0.002ms</div>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em]">Packet Drop Rate</span>
                      <div className="text-[9px] sm:text-[10px] font-bold text-brand-purple font-mono">0.00%</div>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em]">Core Temperature</span>
                      <div className="text-[9px] sm:text-[10px] font-bold text-amber-500 font-mono">36.5°C</div>
                   </div>
                </div>

                <div className="pt-2">
                   <button 
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 text-[8px] font-black text-text-secondary uppercase tracking-[0.3em] hover:text-brand-cyan transition-colors"
                   >
                      <ZapOff className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      De-Synchronize Node
                   </button>
                </div>
             </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
