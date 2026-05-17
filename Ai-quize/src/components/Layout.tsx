import { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import { UserProfile } from '../types';

interface LayoutProps {
  children: ReactNode;
  profile: UserProfile | null;
  title?: string;
  showProfile?: boolean;
}

export default function Layout({ children, profile, title, showProfile }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Header profile={profile} title={title} showProfile={showProfile} />
      <main className="flex-grow pb-32">
        {children}
      </main>
      <Navigation />
    </div>
  );
}
