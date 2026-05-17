import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { Wallet, Trophy, ShieldCheck, Cpu, Box, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';

interface AssetsPageProps {
  profile: UserProfile | null;
}

export default function AssetsPage({ profile }: AssetsPageProps) {
  const { t } = useTranslation();

  if (!profile) return null;

  const shardsCount = profile.achievements.length;
  
  return (
    <Layout profile={profile} title="Neural Assets">
      <div className="p-6 max-w-2xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="space-y-2 text-center py-4">
            <h2 className="text-4xl font-black text-text-primary tracking-tighter italic">Neural Assets</h2>
            <p className="text-sm text-text-secondary font-medium italic">Monitoring acquired digital fragments and credentials.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
            <div className="main-card p-6 flex flex-col items-center gap-2 bg-gradient-to-br from-surface to-brand-cyan/5">
                <div className="w-10 h-10 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-2">
                    <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] leading-none">Core Credits</span>
                <span className="text-2xl font-black text-text-primary italic">{profile.coins.toLocaleString()}</span>
            </div>
            <div className="main-card p-6 flex flex-col items-center gap-2 bg-gradient-to-br from-surface to-brand-purple/5">
                <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-2">
                    <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] leading-none">Data Shards</span>
                <span className="text-2xl font-black text-text-primary italic">{shardsCount}</span>
            </div>
        </div>

        {/* Inventory Section */}
        <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Inventory Manifest</h3>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{shardsCount} Items</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.achievements.length > 0 ? (
                    profile.achievements.map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="main-card p-6 flex items-start gap-4 group hover:bg-bg-main transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-surface border border-border-light flex items-center justify-center relative group-hover:scale-105 transition-transform overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Trophy className="w-6 h-6 text-amber-500 relative z-10" />
                                <Sparkles className="absolute top-1 right-1 w-3 h-3 text-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex flex-col justify-center h-14">
                                <p className="text-sm font-black text-text-primary italic tracking-tight">{item}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em]">Verified Fragment</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-border-light rounded-[3rem] bg-surface/30">
                        <div className="w-20 h-20 bg-bg-main border border-border-light rounded-[2.5rem] flex items-center justify-center text-text-secondary opacity-20">
                            <Box className="w-10 h-10" />
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-sm font-black text-text-primary uppercase tracking-widest italic">Manifest Empty</p>
                            <p className="text-[10px] text-text-secondary font-medium">Complete sync sessions to acquire assets.</p>
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* Security / Proof Section */}
        <section className="main-card p-8 bg-text-primary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-6">
                <div className="space-y-1">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Neural Verification</span>
                    <h4 className="text-2xl font-black italic tracking-tighter">Ownership Protocol</h4>
                </div>
                <p className="text-xs text-white/60 font-medium leading-relaxed max-w-md">
                    All assets listed are crypthographically bound to your neural signature. 
                    Redistribution requires a high-level clearance reset.
                </p>
                <div className="pt-2">
                    <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">
                        Inspect Signature
                    </button>
                </div>
            </div>
        </section>
      </div>
    </Layout>
  );
}
