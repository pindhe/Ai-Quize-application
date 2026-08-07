import logoLight from '../images/logo-light.jpg';
import logoDark from '../images/logo-dark.png';
import { useIsDark } from '../hooks/useIsDark';

interface BrandLogoProps {
  className?: string;
  alt?: string;
  /** Force a variant (skips theme detection). */
  variant?: 'light' | 'dark';
}

/**
 * App mark that swaps with theme:
 * - Light: cream-backed JPG
 * - Dark: transparent PNG
 */
export default function BrandLogo({
  className = 'h-10 w-10',
  alt = 'NeuroCore',
  variant,
}: BrandLogoProps) {
  const isDark = useIsDark();
  const useDark = variant ? variant === 'dark' : isDark;

  return (
    <img
      src={useDark ? logoDark : logoLight}
      alt={alt}
      className={`object-contain select-none ${className}`}
      draggable={false}
    />
  );
}
