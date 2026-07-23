import type { ReactNode } from "react";

type ImageFrameProps = {
  /** An <img>, next/image, or placeholder element. */
  children: ReactNode;
  /** wing adds the translucent layered offset panel behind the image */
  treatment?: "plain" | "wing";
  /** Aspect ratio of the frame */
  ratio?: "4/3" | "3/4" | "16/9" | "1/1";
  className?: string;
};

const ratios = {
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "16/9": "aspect-video",
  "1/1": "aspect-square",
} as const;

/**
 * Brand image treatment: restrained radius, editorial crop, and an
 * optional translucent "wing layer" offset inspired by cicada wings.
 * Decorative layers are aria-hidden; the image inside carries the alt text.
 */
export function ImageFrame({
  children,
  treatment = "plain",
  ratio = "4/3",
  className = "",
}: ImageFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {treatment === "wing" ? (
        <div
          aria-hidden="true"
          className="absolute -inset-y-3 -right-3 left-6 rounded-sm bg-melrose/35"
        />
      ) : null}
      <div
        className={`relative overflow-hidden rounded-sm ${ratios[ratio]} [&>img]:h-full [&>img]:w-full [&>img]:object-cover`}
      >
        {children}
      </div>
    </div>
  );
}
