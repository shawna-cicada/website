type WingLayersProps = {
  className?: string;
  width?: number;
};

/**
 * Overlapping translucent arcs suggesting cicada wing membranes —
 * abstraction, not an insect illustration. Decorative: aria-hidden.
 */
export function WingLayers({ className = "", width = 220 }: WingLayersProps) {
  const height = Math.round(width * 0.55);
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox="0 0 220 120"
      fill="none"
      className={className}
    >
      <path
        d="M8 112 C 30 30, 120 6, 212 14 C 150 40, 70 70, 8 112 Z"
        fill="var(--color-melrose)"
        fillOpacity="0.35"
      />
      <path
        d="M8 112 C 44 48, 120 28, 200 40 C 140 62, 66 84, 8 112 Z"
        fill="var(--color-meadow)"
        fillOpacity="0.3"
      />
      <path
        d="M8 112 C 56 66, 122 52, 184 62 C 132 80, 64 96, 8 112 Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path
        d="M8 112 C 60 84, 118 74, 168 80"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
    </svg>
  );
}
