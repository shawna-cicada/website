/**
 * First focusable element on every page: lets keyboard users jump
 * straight to content. Visually hidden until focused.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-xs focus-visible:bg-ink focus-visible:px-4 focus-visible:py-3 focus-visible:text-paper"
    >
      Skip to content
    </a>
  );
}
