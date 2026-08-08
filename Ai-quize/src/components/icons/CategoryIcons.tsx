import type { ReactElement, SVGProps } from 'react';
import type { Category } from '../../types';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function shell({ size = 28, className, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 32 32',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className,
    'aria-hidden': true as const,
    ...rest,
  };
}

export function IqIcon(props: IconProps) {
  return (
    <svg {...shell(props)}>
      <path
        d="M16 5c-4.2 0-7.5 3-7.5 7.2 0 2.6 1.3 4.5 3 5.8V21h9v-3c1.7-1.3 3-3.2 3-5.8C23.5 8 20.2 5 16 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M13 24h6M14 27h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="13.5" cy="12" r="1.2" fill="currentColor" />
      <circle cx="18.5" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function MathIcon(props: IconProps) {
  return (
    <svg {...shell(props)}>
      <rect x="5" y="5" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 12h5M12.5 9.5v5M17.5 20.5l4-4M21.5 20.5l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ScienceIcon(props: IconProps) {
  return (
    <svg {...shell(props)}>
      <ellipse cx="16" cy="16" rx="10" ry="4" stroke="currentColor" strokeWidth="1.7" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="10" ry="4" stroke="currentColor" strokeWidth="1.7" transform="rotate(-60 16 16)" />
      <ellipse cx="16" cy="16" rx="10" ry="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16" cy="16" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function TechIcon(props: IconProps) {
  return (
    <svg {...shell(props)}>
      <rect x="6" y="8" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 22h10M12 12h3M12 15.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function FootballIcon(props: IconProps) {
  return (
    <svg {...shell(props)}>
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 8.5 19.2 11l-.8 3.8H13.6L12.8 11 16 8.5ZM16 23.5l-3.2-2.5.8-3.8h4.8l.8 3.8L16 23.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoviesIcon(props: IconProps) {
  return (
    <svg {...shell(props)}>
      <rect x="5" y="8" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 12h22M5 20h22M9 8v16M23 8v16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 14.5 19 16l-5.5 1.5v-3Z" fill="currentColor" />
    </svg>
  );
}

export function SomaliaIcon(props: IconProps) {
  return (
    <svg {...shell(props)}>
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 9.5l1.4 2.9 3.2.4-2.4 2.2.6 3.1L16 16.5l-2.8 1.6.6-3.1-2.4-2.2 3.2-.4L16 9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IslamicIcon(props: IconProps) {
  return (
    <svg {...shell(props)}>
      <path
        d="M10 24V10.5c0-1.2.7-2.3 1.8-2.8L16 6l4.2 1.7c1.1.5 1.8 1.6 1.8 2.8V24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M13 14h6M13 18h6M16 10.5V24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const MAP: Record<Category, (p: IconProps) => ReactElement> = {
  IQ: IqIcon,
  Math: MathIcon,
  Science: ScienceIcon,
  Technology: TechIcon,
  Football: FootballIcon,
  Movies: MoviesIcon,
  Somalia: SomaliaIcon,
  'Islamic Knowledge': IslamicIcon,
};

export function CategoryIcon({
  category,
  ...props
}: IconProps & { category: Category }) {
  const Comp = MAP[category] || IqIcon;
  return <Comp {...props} />;
}
