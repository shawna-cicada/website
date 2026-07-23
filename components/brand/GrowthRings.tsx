type GrowthRingsProps = {
  className?: string;
  /** Accent ring color defaults to chartreuse */
  size?: number;
};

/**
 * Concentric growth rings — stages of growth made visible.
 * Decorative: always aria-hidden.
 */
export function GrowthRings({ className = "", size = 120 }: GrowthRingsProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
    >
      <circle cx="60" cy="60" r="18" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="32" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.25" />
      <circle cx="60" cy="60" r="45" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="60" cy="60" r="57" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="60" cy="60" r="4" fill="var(--color-chartreuse)" />
    </svg>
  );
}
