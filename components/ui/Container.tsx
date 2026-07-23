import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** Rendered element; defaults to div. Use section/article for landmarks. */
  as?: ElementType;
  /** narrow = prose measure, default = content, wide = full editorial bleed */
  width?: "narrow" | "default" | "wide";
  className?: string;
  /** Anchor target (e.g. nav dropdown deep links). */
  id?: string;
};

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  as: Tag = "div",
  width = "default",
  className = "",
  id,
}: ContainerProps) {
  return (
    <Tag id={id} className={`mx-auto w-full px-gutter ${widths[width]} ${className}`}>
      {children}
    </Tag>
  );
}
