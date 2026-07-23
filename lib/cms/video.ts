/**
 * Convert a pasted YouTube or Vimeo link into an embeddable player URL.
 * Returns null for anything unrecognized — the article page then renders
 * a plain outbound link instead of an iframe. Only the two providers the
 * CSP allows (frame-src) can ever be embedded; arbitrary URLs never are.
 * YouTube embeds use the privacy-enhanced youtube-nocookie.com host.
 */
export function toVideoEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com"
  ) {
    const id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : matchPathId(url.pathname, ["embed", "shorts", "live"]);
    return isYouTubeId(id) ? youTubeEmbed(id) : null;
  }

  if (host === "youtu.be") {
    const id = url.pathname.split("/")[1];
    return isYouTubeId(id) ? youTubeEmbed(id) : null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:$|\/)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  }

  return null;
}

function matchPathId(pathname: string, prefixes: string[]): string | null {
  const [, first, second] = pathname.split("/");
  return first && second && prefixes.includes(first) ? second : null;
}

function isYouTubeId(id: string | null | undefined): id is string {
  return typeof id === "string" && /^[A-Za-z0-9_-]{6,20}$/.test(id);
}

function youTubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}
