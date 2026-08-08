import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import BrandMark from '../components/BrandMark';
import { useIsDark } from '../hooks/useIsDark';
import { BRAND_FULL } from '../lib/brand';
import heroVideo from '../images/motionvibe_pindown.io_1786103963.mp4';

export default function SplashPage() {
  const navigate = useNavigate();
  const isDark = useIsDark();

  return (
    <div
      className={`relative min-h-dvh overflow-hidden ${
        isDark ? 'bg-[#0B1424] text-white' : 'bg-[#F7F1E8] text-[#1A1523]'
      }`}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(to top, rgba(11,20,36,0.92) 0%, rgba(11,20,36,0.55) 38%, rgba(11,20,36,0.28) 68%, rgba(11,20,36,0.4) 100%)'
              : 'linear-gradient(to top, rgba(247,241,232,0.94) 0%, rgba(247,241,232,0.62) 40%, rgba(247,241,232,0.35) 70%, rgba(247,241,232,0.45) 100%)',
          }}
        />
      </div>

      <main className="relative z-10 flex min-h-dvh flex-col justify-end px-6 pb-10 pt-16 sm:px-10 sm:pb-14 md:justify-center md:pb-20 md:pt-20">
        <div className="mx-auto w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-4"
          >
            <BrandMark
              stacked
              align="start"
              size="xl"
              showTagline
              tone={isDark ? 'onDark' : 'onLight'}
              logoClassName="h-28 w-28 rounded-3xl shadow-lg sm:h-36 sm:w-36 md:h-40 md:w-40"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: 'easeOut' }}
            className={`mt-6 max-w-xl font-display text-[clamp(1.35rem,3.6vw,2rem)] font-medium leading-snug tracking-tight ${
              isDark ? 'text-white/90' : 'text-[#1A1523]/90'
            }`}
          >
            Tijaabooyin maskaxeed oo AI ah oo kugu fiiqan.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.26, ease: 'easeOut' }}
            className={`mt-4 max-w-md text-base leading-relaxed sm:text-lg ${
              isDark ? 'text-white/55' : 'text-[#1A1523]/55'
            }`}
          >
            La tartan su&apos;aalo AI ah oo ku saabsan IQ, tiknoolajiyad, saynis iyo wax kale — hel XP, kor u qaado darajadaada.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.36, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className={`group inline-flex h-14 items-center gap-3 px-8 font-display text-base font-semibold transition-[filter,transform] hover:brightness-110 active:scale-[0.98] ${
                isDark
                  ? 'bg-brand-cyan text-[#0B1424]'
                  : 'bg-[#1A1523] text-[#FFF8EF]'
              }`}
            >
              Xiga Arena
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

            <span
              className={`font-mono text-[11px] uppercase tracking-[0.28em] ${
                isDark ? 'text-white/35' : 'text-[#1A1523]/40'
              }`}
            >
              {BRAND_FULL} · 2026
            </span>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
