import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Zap } from 'lucide-react';
import { UserProfile } from '../types';
import BrandMark from './BrandMark';
import { BRAND_FULL } from '../lib/brand';

interface HeaderProps {
  profile: UserProfile | null;
  title?: string;
  showProfile?: boolean;
}

export default function Header(_props: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Core', path: '/dashboard', icon: Home },
    { label: 'Arena', path: '/categories', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border-light/60 bg-bg-main/55 px-4 backdrop-blur-xl sm:px-6">
      <div className="relative mx-auto flex h-full max-w-5xl items-center justify-center">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <BrandMark
            logoClassName="h-9 w-9 rounded-xl"
            size="sm"
            showTagline={false}
            onClick={() => navigate('/')}
            className="max-w-[160px] sm:max-w-none"
          />
        </div>
        <span className="sr-only">{BRAND_FULL}</span>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                aria-label={link.label}
                title={link.label}
                className={`inline-flex h-10 w-10 items-center justify-center transition-colors ${
                  active
                    ? 'bg-brand-cyan text-[#0B1424]'
                    : 'border border-border-light bg-surface/50 text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
