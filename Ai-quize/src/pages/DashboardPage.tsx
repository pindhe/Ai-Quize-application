import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import Layout from '../components/Layout';
import BrandMark from '../components/BrandMark';

interface DashboardProps {
  profile: UserProfile | null;
}

export default function DashboardPage({ profile }: DashboardProps) {
  const navigate = useNavigate();

  return (
    <Layout profile={profile} videoBackground>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8"
        >
          <BrandMark
            stacked
            size="lg"
            showTagline
            logoClassName="h-20 w-20 rounded-3xl shadow-lg sm:h-24 sm:w-24"
          />

          <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            Welcome to game
          </h1>

          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="group inline-flex h-14 items-center gap-3 bg-brand-cyan px-8 font-display text-base font-semibold text-[#0B1424] transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
          >
            <Play className="h-5 w-5 fill-current" />
            Start games
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
