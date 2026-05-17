import { Zap } from 'lucide-react';
import { UserProfile } from '../types';
import { useTranslation } from '../lib/TranslationContext';

interface HeaderProps {
  profile: UserProfile | null;
  title?: string;
  showProfile?: boolean;
}

export default function Header({ profile, title, showProfile = true }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-md border-b border-border-light h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {showProfile && profile ? (
          <>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center overflow-hidden">
                <img 
                  src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-cyan rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm font-mono">
                {profile.level}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-text-primary italic tracking-tight leading-none mb-0.5">{profile.displayName}</span>
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.1em]">{t.dashboard.level} {profile.level}</span>
            </div>
          </>
        ) : (
          <span className="text-sm font-black text-text-primary italic tracking-tighter uppercase">{title}</span>
        )}
      </div>
      
      {profile && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border-light rounded-full shadow-sm">
          <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center shadow-[0_0_8px_rgba(251,191,36,0.3)]">
            <Zap className="w-2.5 h-2.5 text-white fill-white" />
          </div>
          <span className="text-sm font-black text-text-primary tracking-tighter font-mono">{profile.coins.toLocaleString()}</span>
        </div>
      )}
    </header>
  );
}
