import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Zap } from 'lucide-react';
import BrandMark from './BrandMark';

/** Mobile-only footer: brand + Core / Arena icon buttons. */
export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Core', path: '/dashboard', icon: Home },
    { label: 'Arena', path: '/categories', icon: Zap },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 flex h-14 w-[92%] max-w-md -translate-x-1/2 items-center justify-between gap-2 rounded-full border border-white/15 bg-surface/70 px-3 shadow-xl backdrop-blur-xl md:hidden">
      <BrandMark
        logoClassName="h-8 w-8 shrink-0 rounded-lg"
        size="sm"
        showTagline={false}
        className="min-w-0 flex-1 overflow-hidden"
        onClick={() => navigate('/')}
      />

      <div className="flex shrink-0 items-center gap-1">
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
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                active
                  ? 'bg-brand-cyan text-[#0B1424]'
                  : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
              }`}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
