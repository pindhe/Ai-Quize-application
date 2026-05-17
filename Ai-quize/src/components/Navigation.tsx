import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Zap, Trophy, User, Wallet } from 'lucide-react';
import { useTranslation } from '../lib/TranslationContext';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Core', path: '/dashboard' },
    { id: 'arena', icon: Zap, label: 'Arena', path: '/categories' },
    { id: 'leaderboard', icon: Trophy, label: 'Rankings', path: '/leaderboard' },
    { id: 'profile', icon: User, label: 'Stats', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-50 glass-panel rounded-[2rem] h-20 flex justify-around items-center px-4 shadow-2xl border border-white/20">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button 
            key={item.id} 
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1.5 transition-all relative flex-1 ${isActive ? 'text-brand-cyan scale-110' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {isActive && (
              <div className="absolute -top-10 w-12 h-12 bg-brand-cyan/20 blur-xl rounded-full" />
            )}
            <item.icon className={`w-6 h-6 transition-transform ${isActive ? 'fill-brand-cyan/10 drop-shadow-[0_0_8px_rgba(0,194,255,0.4)]' : ''}`} />
            <span className={`text-[9px] font-black tracking-widest uppercase transition-all ${isActive ? 'opacity-100 mt-0.5' : 'opacity-60'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-2 w-1 h-1 bg-brand-cyan rounded-full shadow-[0_0_5px_#00c2ff]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
