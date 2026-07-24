"use client";

import { useState, type CSSProperties } from "react";
import { set, useFormValue, type StringInputProps } from "sanity";
import { generateLinkedInPost } from "@/lib/editorial/linkedin";
import { slugify } from "@/lib/editorial/slug";

const buttonBase: CSSProperties = {
  borderRadius: 999,
  padding: "7px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  border: "1px solid transparent",
};

const primaryButton: CSSProperties = {
  ...buttonBase,
  background: "#18b698",
  color: "#1e2a44",
};

const secondaryButton: CSSProperties = {
  ...buttonBase,
  background: "transparent",
  color: "#0d7263",
  borderColor: "#0d726355",
};

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.5,
  color: "#4c5872",
};

/**
 * Custom input for the "Suggested LinkedIn post" field: puts Generate
 * and Copy buttons directly on the field instead of hiding the flow in
 * the document actions menu. Uses the same tested generator as the
 * publish action; generated links use the Studio's own origin so they
 * work before and after the domain cutover.
 */
export function LinkedInPostInput(props: StringInputProps) {
  const title = useFormValue(["title"]) as string | undefined;
  const summary = useFormValue(["summary"]) as string | undefined;
  const slugValue = useFormValue(["slug"]) as { current?: string } | undefined;
  const kind = useFormValue(["contentType"]) as string | undefined;
  const [note, setNote] = useState<string | null>(null);

  const ready = Boolean(title?.trim() && summary?.trim());
  // Fall back to the slug the title WILL get (same slugify publish uses).
  const slug = slugValue?.current || (title ? slugify(title) : "");
  const hasText = Boolean(props.value?.trim());

  function generate() {
    if (!ready || !slug) return;
    if (
      hasText &&
      !window.confirm("Replace the current text with a fresh suggestion?")
    ) {
      return;
    }
    const text = generateLinkedInPost({
      title: title!.trim(),
      summary: summary!.trim(),
      slug,
      kind,
      baseUrl: window.location.origin,
    });
    props.onChange(set(text));
    setNote("Suggestion written — edit it freely, it's yours now.");
  }

  async function copy() {
    const text = props.value?.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setNote("Copied — paste it into a new LinkedIn post.");
    } catch {
      setNote("Your browser blocked copying — select the text and copy it.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button
          type="button"
          onClick={generate}
          disabled={!ready}
          style={{ ...primaryButton, opacity: ready ? 1 : 0.5 }}
        >
          {hasText ? "Regenerate suggestion" : "Generate suggestion"}
        </button>
        <button
          type="button"
          onClick={copy}
          disabled={!hasText}
          style={{ ...secondaryButton, opacity: hasText ? 1 : 0.5 }}
        >
          Copy to clipboard
        </button>
      </div>
      {!ready ? (
        <p style={hintStyle}>
          Add a title and summary first — the suggestion is written from
          them.
        </p>
      ) : null}
      {note ? <p style={hintStyle}>{note}</p> : null}
      {props.renderDefault(props)}
    </div>
  );
}
