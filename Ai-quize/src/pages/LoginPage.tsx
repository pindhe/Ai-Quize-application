import { motion } from 'motion/react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 relative bg-bg-main">
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-cyan/10 blur-[80px] rounded-full" />
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-purple/10 blur-[80px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm main-card p-10 relative z-10"
      >
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-text-secondary hover:text-brand-cyan transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-10 mt-4">
          <div className="w-16 h-16 bg-surface border border-border-light rounded-2xl flex items-center justify-center mb-6 shadow-sm group hover:scale-110 transition-transform">
            <UserCheck className="w-8 h-8 text-brand-cyan" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Access Protocol</h2>
          <p className="text-sm text-text-secondary mt-2 text-center font-medium">Verify your identity to sync with the core</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full h-14 bg-surface border border-border-light hover:border-brand-cyan text-text-primary font-semibold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-brand-purple" />
          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Identity synchronization protected</span>
        </div>
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Neural Dynamics Authentication Service</p>
      </div>
    </div>
  );
}
