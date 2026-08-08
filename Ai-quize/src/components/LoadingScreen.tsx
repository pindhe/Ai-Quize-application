import loadingSvg from '../images/8StwFKN366.svg';

const SIZE_CLASS = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-36 w-36 sm:h-44 sm:w-44',
} as const;

interface LoadingScreenProps {
  /** Compact inline variant (no full viewport) */
  compact?: boolean;
  /** SVG only — for buttons / tiny inline loaders */
  dotsOnly?: boolean;
  size?: keyof typeof SIZE_CLASS;
}

/** Animated brand loader dots (same asset as full screen) */
export function LoadingDots({
  size = 'md',
  className = '',
}: {
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}) {
  return (
    <img
      src={loadingSvg}
      alt=""
      aria-hidden="true"
      className={`${SIZE_CLASS[size]} object-contain ${className}`}
      draggable={false}
    />
  );
}

export default function LoadingScreen({
  compact = false,
  dotsOnly = false,
  size = 'lg',
}: LoadingScreenProps) {
  if (dotsOnly) {
    return <LoadingDots size={size} />;
  }

  const content = (
    <div className="relative flex items-center justify-center" aria-busy="true" aria-label="Loading">
      <div className="absolute inset-0 scale-110 rounded-full bg-brand-cyan/10 blur-2xl" />
      <img
        src={loadingSvg}
        alt=""
        className={`relative object-contain ${SIZE_CLASS.lg}`}
        draggable={false}
      />
    </div>
  );

  if (compact) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-16 px-6">
        {content}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg-main px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 42%, rgba(0,194,255,0.1) 0%, transparent 55%), radial-gradient(ellipse 40% 30% at 50% 55%, rgba(37,216,167,0.08) 0%, transparent 50%)',
        }}
      />
      <div className="relative z-10">{content}</div>
    </div>
  );
}
