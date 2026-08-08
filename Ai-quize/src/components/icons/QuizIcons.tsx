import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, className, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className,
    'aria-hidden': true as const,
    ...rest,
  };
}

/** Stacked question cards — quiz progress */
export function QuestionStackIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 9.5h6M9 13h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="17.5" cy="6.5" r="3.25" fill="currentColor" className="text-brand-cyan" />
      <path
        d="M17.5 5.2v.2M17.5 7.8v.2"
        stroke="#0B1424"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Stopwatch with live ring progress (0–1) */
export function TimerRingIcon({
  progress = 1,
  urgent = false,
  size = 22,
  className,
  ...rest
}: IconProps & { progress?: number; urgent?: boolean }) {
  const r = 8.5;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = c * (1 - clamped);
  const stroke = urgent ? '#ff3b30' : '#00C2FF';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M9.5 3.5h5"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13" r={r} stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <circle
        cx="12"
        cy="13"
        r={r}
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 12 13)"
      />
      <path
        d="M12 13V9.8"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M8 4h8v3a4 4 0 0 1-8 0V4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 6H5.5A2.5 2.5 0 0 0 8 8.5M16 6h2.5A2.5 2.5 0 0 1 16 8.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M12 11v3M9.5 20h5M10.5 17h3l.5 3h-4l.5-3Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function HintBulbIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M9 18h6M10 21h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8.2 14.2A5.5 5.5 0 1 1 15.8 14.2c-.7.9-1.3 1.7-1.5 2.8H9.7c-.2-1.1-.8-1.9-1.5-2.8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M12 8.5v2.2M10.4 9.6l1.6 1.1M13.6 9.6l-1.6 1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BoostZapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M13.2 3.5 6.8 13.2h4.2L10.5 20.5l6.8-10.2h-4.3L13.2 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BackArrowIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M14.5 6.5 9 12l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.2 12H19" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  );
}

export function StreakFlameIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M12 21c3.6 0 6-2.4 6-5.6 0-2.6-1.5-4.2-3.1-5.6-.3 1.7-1.2 2.5-2.4 2.7 1-2.6.4-4.7-1.7-6.5-1.4 2.5-3.8 3.9-3.8 7.4C7 18.2 9 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
