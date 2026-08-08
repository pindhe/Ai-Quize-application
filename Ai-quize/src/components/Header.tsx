import { useNavigate } from 'react-router-dom';
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

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border-light/60 bg-bg-main/55 px-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex h-full max-w-5xl items-center">
        <BrandMark
          logoClassName="h-9 w-9 rounded-xl"
          size="sm"
          showTagline={false}
          onClick={() => navigate('/')}
          className="max-w-[200px]"
        />
        <span className="sr-only">{BRAND_FULL}</span>
      </div>
    </header>
  );
}
