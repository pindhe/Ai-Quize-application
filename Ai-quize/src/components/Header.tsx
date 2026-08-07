import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';
import BrandLogo from './BrandLogo';

interface HeaderProps {
  profile: UserProfile | null;
  title?: string;
  showProfile?: boolean;
}

export default function Header(_props: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Core', path: '/dashboard' },
    { label: 'Arena', path: '/categories' },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border-light/60 bg-bg-main/55 px-4 backdrop-blur-xl sm:px-6">
      <div className="relative mx-auto flex h-full max-w-5xl items-center justify-center">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute left-0 top-1/2 -translate-y-1/2"
          aria-label="NeuroCore home"
        >
          <BrandLogo className="h-9 w-9 rounded-xl" />
        </button>

        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                className={`h-10 min-w-[96px] px-5 font-display text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-brand-cyan text-[#0B1424]'
                    : 'border border-border-light bg-surface/50 text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
