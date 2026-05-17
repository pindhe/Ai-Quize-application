import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  ShieldCheck, 
  Zap,
  Orbit,
  Cpu,
  Hexagon
} from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-white flex flex-col items-center justify-between py-12 px-6">

      {/* ===== Animated 3D Background ===== */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(1000px) rotateX(70deg) scale(2)',
            transformOrigin: 'top'
          }}
        />

        {/* Glow Orbs */}
        <motion.div
          animate={{
            x: [0, 80, -50, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.3, 0.9, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-100 blur-[140px] rounded-full"
        />

        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 70, -50, 0],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100 blur-[140px] rounded-full"
        />

        {/* Floating Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-cyan-200/30 rounded-full -translate-x-1/2 -translate-y-1/2"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute top-1/2 left-1/2 w-[420px] h-[420px] border border-purple-200/30 rounded-full -translate-x-1/2 -translate-y-1/2"
        />

      </div>

      {/* ===== Header ===== */}
      <header className="relative z-10 flex items-center gap-3">

        <motion.div
          animate={{
            rotateY: [0, 180, 360],
            rotateX: [0, 15, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          <BrainCircuit className="w-7 h-7 text-white" />
        </motion.div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Neuro<span className="text-cyan-600">Core</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Quantum Interface
          </p>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="relative z-10 w-full max-w-6xl flex flex-col items-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="px-5 py-2 rounded-full border border-cyan-200 bg-white shadow-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-medium text-slate-600">
              Advanced Neural Learning Platform
            </span>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-6xl md:text-7xl font-black leading-[1] tracking-tight text-slate-900">
            Upgrade Your
            <br />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Cognitive System
            </span>
          </h1>

          <p className="mt-8 text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Experience next-generation neural synchronization with immersive AI-driven learning architecture and futuristic cognitive enhancement systems.
          </p>
        </motion.div>

        {/* Floating 3D Core */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotateY: [0, 180, 360],
            rotateX: [0, 10, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative mt-16 mb-16"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="relative w-48 h-48">

            {/* Core Glow */}
            <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-3xl" />

            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute inset-0 rounded-full border border-cyan-400/20"
            />

            {/* Inner Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute inset-6 rounded-full border border-purple-400/20"
            />

            {/* Center */}
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.4)]">
              <Cpu className="w-14 h-14 text-white" />
            </div>

            {/* Orbit Icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute inset-0"
            >
              <Orbit className="absolute top-0 left-1/2 -translate-x-1/2 text-cyan-400" />
              <Hexagon className="absolute bottom-0 left-1/2 -translate-x-1/2 text-purple-400" />
            </motion.div>

          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">

          {[
            {
              icon: Zap,
              title: 'Fast Neural Sync',
              desc: 'Ultra-speed AI learning synchronization engine.'
            },
            {
              icon: ShieldCheck,
              title: 'Quantum Security',
              desc: 'Military-grade encrypted neural infrastructure.'
            },
            {
              icon: BrainCircuit,
              title: 'Adaptive Intelligence',
              desc: 'Self-evolving cognitive architecture system.'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.3 }}
              whileHover={{
                y: -10,
                scale: 1.03
              }}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50"
            >

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-cyan-50/50 to-purple-50/50" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-200">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>

            </motion.div>
          ))}

        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 w-full max-w-md"
        >
          <button
            onClick={() => navigate('/login')}
            className="group relative overflow-hidden w-full h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all hover:scale-[1.02]"
          >

            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex items-center justify-center gap-3">
              <span>Initialize Core</span>

              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>

          </button>

          <p className="mt-5 text-center text-xs uppercase tracking-[0.25em] text-slate-400">
            System Revision 3.0 Quantum Build
          </p>
        </motion.div>

      </main>

      {/* ===== Footer ===== */}
      <footer className="relative z-10 text-[11px] text-slate-400 uppercase tracking-[0.3em]">
        © 2026 Neural Dynamics Group — All Protocols Active
      </footer>

    </div>
  );
}