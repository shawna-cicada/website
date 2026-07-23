"use client";

import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { useRouter } from "sanity/router";
import { badgeFor } from "@/lib/editorial/statuses";
import { publishGate } from "@/lib/editorial/checklist";
import type { EditorialDoc, WorkflowStatus } from "@/lib/editorial/types";

/**
 * The branded Cicada Agility editorial dashboard — the first thing an
 * editor sees after signing in (never a generic document list).
 * Big plain-language actions on top; recent content below.
 */

type RecentDoc = {
  _id: string;
  title?: string;
  workflowStatus?: WorkflowStatus;
  scheduledAt?: string;
  _updatedAt?: string;
  lastEditor?: string;
  slug?: string;
  summary?: string;
  authorName?: string;
  categoryName?: string;
  imageRef?: string;
  imageAlt?: string;
};

const QUERY = `*[_type == "insight"] | order(_updatedAt desc)[0...30]{
  _id, title, workflowStatus, scheduledAt, _updatedAt, summary,
  "slug": slug.current,
  "lastEditor": coalesce(lastEditor, "—"),
  "authorName": author->name,
  "categoryName": category->title,
  "imageRef": mainImage.asset._ref,
  "imageAlt": mainImage.alt
}`;

const ACTIONS: Array<{
  label: string;
  intent: "create" | "browse" | "external";
  detail: string;
  template?: string;
  type?: string;
  href?: string;
}> = [
  { label: "Create a New Article", intent: "create", type: "insight", template: "insight-leadership-insight", detail: "Start from a template with writing prompts" },
  { label: "Add a Video", intent: "create", type: "insight", template: "insight-video-post", detail: "Share a video or recorded conversation" },
  { label: "Edit Existing Content", intent: "browse", type: "insight", detail: "Find and update anything already written" },
  { label: "Schedule a Post", intent: "browse", type: "insight", detail: "Open a draft, then choose Schedule" },
  { label: "Update Homepage Content", intent: "browse", type: "homepage", detail: "Change what the homepage features" },
  { label: "Manage Assessments", intent: "browse", type: "assessment", detail: "Edit assessment cards and links" },
  { label: "Manage Client Logos", intent: "browse", type: "clientLogo", detail: "Add logos and confirm permissions" },
  { label: "Preview the Website", intent: "external", href: "/", detail: "See the live site in a new tab" },
];

function toEditorial(doc: RecentDoc): EditorialDoc {
  return {
    title: doc.title,
    summary: doc.summary,
    authorName: doc.authorName,
    category: doc.categoryName,
    slug: doc.slug,
    mainImage: doc.imageRef
      ? { assetRef: doc.imageRef, alt: doc.imageAlt }
      : undefined,
    // Body completeness is validated in the editor; the dashboard's
    // "missing information" list keys off the other critical fields.
    body: [{ _type: "block", children: [{ _type: "span", text: "…" }] }],
  };
}

export function CicadaDashboard() {
  const client = useClient({ apiVersion: "2025-01-01" });
  const router = useRouter();
  const [docs, setDocs] = useState<RecentDoc[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<RecentDoc[]>(QUERY)
      .then((result) => {
        if (!cancelled) setDocs(result);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const drafts = (docs ?? []).filter((doc) => (doc.workflowStatus ?? "draft") === "draft");
  const scheduled = (docs ?? []).filter((doc) => doc.workflowStatus === "scheduled");
  const published = (docs ?? []).filter((doc) => doc.workflowStatus === "published");
  const missingInfo = (docs ?? []).filter(
    (doc) => !publishGate(toEditorial(doc)).canPublish && doc.workflowStatus !== "archived",
  );

  function open(doc: RecentDoc) {
    router.navigateIntent("edit", { id: doc._id.replace(/^drafts\./, ""), type: "insight" });
  }

  function runAction(action: (typeof ACTIONS)[number]) {
    if (action.intent === "external" && action.href) {
      window.open(action.href, "_blank", "noopener");
      return;
    }
    if (action.intent === "create" && action.type) {
      router.navigateIntent("create", {
        type: action.type,
        template: action.template,
      });
      return;
    }
    if (action.type) {
      router.navigateUrl({ path: `/structure/${action.type}` });
    }
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px", fontFamily: "'Open Sans Variable', system-ui, sans-serif" }}>
      <header style={{ marginBottom: 28 }}>
        <p style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "#0d7263", margin: 0 }}>
          Cicada Agility
        </p>
        <h1 style={{ fontSize: 28, margin: "6px 0 4px" }}>Editorial dashboard</h1>
        <p style={{ color: "#4c5872", margin: 0 }}>
          What would you like to do? Pick an action — no technical knowledge needed.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12, marginBottom: 36 }}>
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => runAction(action)}
            style={{
              textAlign: "left",
              padding: "18px 16px",
              borderRadius: 4,
              border: "1px solid rgba(30,42,68,0.15)",
              background: "#fafbfc",
              cursor: "pointer",
              minHeight: 88,
            }}
          >
            <span style={{ display: "block", fontWeight: 700, marginBottom: 4, color: "#1e2a44" }}>
              {action.label}
            </span>
            <span style={{ fontSize: 12, color: "#4c5872" }}>{action.detail}</span>
          </button>
        ))}
      </div>

      {error ? (
        <p style={{ color: "#8f4f24" }}>
          The content lists could not load — check your connection and refresh.
          The actions above still work.
        </p>
      ) : null}
      {!docs && !error ? <p style={{ color: "#4c5872" }}>Loading recent content…</p> : null}

      {docs ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          <RecentList title="Recent drafts" docs={drafts} onOpen={open} empty="No drafts right now — create something new above." />
          <RecentList title="Scheduled posts" docs={scheduled} onOpen={open} empty="Nothing scheduled." showSchedule />
          <RecentList title="Recently published" docs={published} onOpen={open} empty="Nothing published yet." showLive />
          <RecentList title="Needs attention (missing required info)" docs={missingInfo} onOpen={open} empty="Everything has what it needs. 🎉" />
        </div>
      ) : null}
    </div>
  );
}

function RecentList({
  title,
  docs,
  onOpen,
  empty,
  showLive,
  showSchedule,
}: {
  title: string;
  docs: RecentDoc[];
  onOpen: (doc: RecentDoc) => void;
  empty: string;
  showLive?: boolean;
  showSchedule?: boolean;
}) {
  return (
    <section>
      <h2 style={{ fontSize: 15, margin: "0 0 10px", color: "#1e2a44" }}>{title}</h2>
      {docs.length === 0 ? (
        <p style={{ fontSize: 13, color: "#4c5872" }}>{empty}</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
          {docs.slice(0, 5).map((doc) => {
            const badge = badgeFor(doc.workflowStatus);
            return (
              <li
                key={doc._id}
                style={{ border: "1px solid rgba(30,42,68,0.12)", borderRadius: 4, padding: "10px 12px", background: "#fff" }}
              >
                <button
                  type="button"
                  onClick={() => onOpen(doc)}
                  style={{ background: "none", border: 0, padding: 0, cursor: "pointer", textAlign: "left", width: "100%" }}
                >
                  <span style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                    <span style={{ fontWeight: 600, color: "#1e2a44" }}>
                      {doc.title || "(untitled)"}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: badge.color,
                        color: badge.textColor,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {badge.label}
                    </span>
                  </span>
                  <span style={{ display: "block", fontSize: 12, color: "#4c5872", marginTop: 4 }}>
                    Last edited {doc._updatedAt ? new Date(doc._updatedAt).toLocaleString() : "—"}
                    {doc.lastEditor && doc.lastEditor !== "—" ? ` by ${doc.lastEditor}` : ""}
                    {showSchedule && doc.scheduledAt
                      ? ` · goes live ${new Date(doc.scheduledAt).toLocaleString()}`
                      : ""}
                  </span>
                </button>
                {showLive && doc.slug ? (
                  <a
                    href={`https://www.cicadaagility.com/insights/${doc.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "#0d7263" }}
                  >
                    View live page ↗
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
