import { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import { UserProfile } from '../types';
import heroVideo from '../images/motionvibe_pindown.io_1786103963.mp4';

interface LayoutProps {
  children: ReactNode;
  profile: UserProfile | null;
  title?: string;
  showProfile?: boolean;
  videoBackground?: boolean;
}

export default function Layout({
  children,
  profile,
  title,
  showProfile,
  videoBackground = false,
}: LayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-bg-main">
      {videoBackground && (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-bg-main/75 dark:bg-[#0B1424]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-main/40 via-transparent to-bg-main" />
        </div>
      )}

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header profile={profile} title={title} showProfile={showProfile} />
        <main className="flex-grow pb-32">{children}</main>
        <Navigation />
      </div>
    </div>
  );
}
