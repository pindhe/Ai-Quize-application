import BrandLogo from './BrandLogo';
import { BRAND_NAME, BRAND_TAGLINE } from '../lib/brand';

interface BrandMarkProps {
  /** Logo size classes */
  logoClassName?: string;
  /** Outer wrapper */
  className?: string;
  /** Show "Brain Test" under the name */
  showTagline?: boolean;
  /** Stack logo above text (hero) */
  stacked?: boolean;
  /** Alignment when stacked */
  align?: 'center' | 'start';
  /** Larger display type */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Text color for dark video / light cream surfaces */
  tone?: 'default' | 'onDark' | 'onLight';
  onClick?: () => void;
}

const nameSize = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl sm:text-3xl',
  xl: 'text-[clamp(2.5rem,10vw,5.5rem)]',
} as const;

const tagSize = {
  sm: 'text-[9px] tracking-[0.22em]',
  md: 'text-[10px] tracking-[0.24em]',
  lg: 'text-xs tracking-[0.28em]',
  xl: 'text-sm tracking-[0.3em] sm:text-base',
} as const;

export default function BrandMark({
  logoClassName = 'h-10 w-10 rounded-xl',
  className = '',
  showTagline = true,
  stacked = false,
  align = 'center',
  size = 'md',
  tone = 'default',
  onClick,
}: BrandMarkProps) {
  const nameColor =
    tone === 'onDark'
      ? 'text-white'
      : tone === 'onLight'
        ? 'text-[#1A1523]'
        : 'text-text-primary';
  const tagColor =
    tone === 'onDark'
      ? 'text-white/55'
      : tone === 'onLight'
        ? 'text-[#1A1523]/55'
        : 'text-text-secondary';

  const content = (
    <>
      <BrandLogo className={logoClassName} />
      <div className={stacked ? (align === 'start' ? 'text-left' : 'text-center') : 'min-w-0 text-left'}>
        <p
          className={`font-display font-bold leading-tight tracking-tight ${nameColor} ${nameSize[size]}`}
        >
          {BRAND_NAME}
        </p>
        {showTagline && (
          <p className={`mt-0.5 font-mono uppercase ${tagColor} ${tagSize[size]}`}>
            {BRAND_TAGLINE}
          </p>
        )}
      </div>
    </>
  );

  const layout = stacked
    ? `flex flex-col gap-3 ${align === 'start' ? 'items-start' : 'items-center'} ${className}`
    : `flex items-center gap-2.5 ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={layout} aria-label={BRAND_NAME}>
        {content}
      </button>
    );
  }

  return <div className={layout}>{content}</div>;
}
