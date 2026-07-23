import { useState } from "react";
import {
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from "sanity";
import { publishGate } from "@/lib/editorial/checklist";
import { applyAutomaticFields } from "@/lib/editorial/workflow";
import { generateLinkedInPost } from "@/lib/editorial/linkedin";
import { previewUrl } from "@/lib/editorial/preview";
import type { EditorialDoc } from "@/lib/editorial/types";

/**
 * Custom document actions for Articles & Videos. Thin wrappers around
 * the tested logic in lib/editorial — the Studio supplies UI, the logic
 * decides. Wording is plain language throughout.
 */

type SanityInsight = Record<string, unknown> & {
  title?: string;
  summary?: string;
  slug?: { current?: string };
  workflowStatus?: string;
  linkedInPostText?: string;
};

/** Map a Sanity document to the editorial logic shape. */
function toEditorialDoc(doc: SanityInsight | null): EditorialDoc {
  if (!doc) return {};
  const image = doc.mainImage as
    | { asset?: { _ref?: string }; alt?: string }
    | undefined;
  const authorRef = doc.author as { _ref?: string } | undefined;
  return {
    contentType: doc.contentType as EditorialDoc["contentType"],
    title: doc.title,
    summary: doc.summary,
    authorName: authorRef?._ref ? "set" : undefined,
    category: (doc.category as { _ref?: string } | undefined)?._ref
      ? "set"
      : undefined,
    mainImage: image?.asset?._ref
      ? { assetRef: image.asset._ref, alt: image.alt }
      : undefined,
    body: doc.body as EditorialDoc["body"],
    videoUrl: doc.videoUrl as string | undefined,
    slug: doc.slug?.current,
    previewedAt: doc.previewedAt as string | undefined,
    linkedInPostText: doc.linkedInPostText,
  };
}

/** Publish Now — blocked (with plain-language reasons) until the checklist passes. */
export const PublishWithChecklist: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const { publish, patch } = useDocumentOperation(props.id, props.type);
  const [showProblems, setShowProblems] = useState(false);
  const doc = toEditorialDoc(props.draft as SanityInsight | null);
  const gate = publishGate(doc);

  return {
    label: "Publish Now",
    tone: "positive",
    disabled: Boolean(publish.disabled) && !props.draft,
    onHandle: () => {
      if (!gate.canPublish) {
        setShowProblems(true);
        return;
      }
      const { doc: filled } = applyAutomaticFields(doc);
      patch.execute([
        {
          set: {
            workflowStatus: "published",
            publishedAt: new Date().toISOString(),
            seoTitle: filled.seoTitle,
            seoDescription: filled.seoDescription,
            // The Promotion tab's "generated for you" promise: publishing
            // leaves a ready-to-edit LinkedIn suggestion with no extra
            // clicks. Never overwrites text an editor already wrote.
            ...(doc.linkedInPostText?.trim() || !filled.slug
              ? {}
              : {
                  linkedInPostText: generateLinkedInPost({
                    title: filled.title ?? "",
                    summary: filled.summary ?? "",
                    slug: filled.slug,
                    baseUrl: window.location.origin,
                  }),
                }),
          },
        },
      ]);
      publish.execute();
      props.onComplete();
    },
    dialog: showProblems && {
      type: "dialog",
      header: "Almost there — a few things first",
      onClose: () => setShowProblems(false),
      content: (
        <ul style={{ lineHeight: 1.6, paddingLeft: "1.2em" }}>
          {gate.blockers.map((item) => (
            <li key={item.key}>
              <strong>{item.label}.</strong> {item.fix}
            </li>
          ))}
          {gate.advisories.map((item) => (
            <li key={item.key} style={{ opacity: 0.7 }}>
              (Optional) {item.fix}
            </li>
          ))}
        </ul>
      ),
    },
  };
};

/**
 * One-click handoff between Draft and Waiting for review. Works on the
 * draft only — nothing is published — so Editor accounts can use it as
 * their finish line. Mirrors sendForReview/backToDraft in
 * lib/editorial/workflow.ts, where the logic is tested.
 */
export const SendForReviewAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const doc = (props.draft ?? props.published) as SanityInsight | null;
  const status = (doc?.workflowStatus as string | undefined) ?? "draft";
  const inReview = status === "needs-review";
  return {
    label: inReview ? "Back to Draft" : "Send for Review",
    disabled: !doc || status === "published",
    onHandle: () => {
      patch.execute([
        { set: { workflowStatus: inReview ? "draft" : "needs-review" } },
        { unset: ["scheduledAt"] },
      ]);
      props.onComplete();
    },
  };
};

/** Schedule — pick a future time; publishing itself is finished by the checklist gate. */
export const ScheduleAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const [open, setOpen] = useState(false);
  const [when, setWhen] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const doc = toEditorialDoc(props.draft as SanityInsight | null);
  const gate = publishGate(doc);

  return {
    label: "Schedule",
    onHandle: () => setOpen(true),
    dialog: open && {
      type: "dialog",
      header: "When should this go live?",
      onClose: () => setOpen(false),
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          {!gate.canPublish ? (
            <div>
              <p>Before scheduling, finish these:</p>
              <ul style={{ lineHeight: 1.6, paddingLeft: "1.2em" }}>
                {gate.blockers.map((item) => (
                  <li key={item.key}>
                    <strong>{item.label}.</strong> {item.fix}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <label htmlFor="schedule-at">Date and time (your local time)</label>
              <input
                id="schedule-at"
                type="datetime-local"
                value={when}
                onChange={(event) => setWhen(event.target.value)}
              />
              {problem ? <p style={{ color: "#8f4f24" }}>{problem}</p> : null}
              <button
                type="button"
                onClick={() => {
                  const date = new Date(when);
                  if (!when || Number.isNaN(date.getTime()) || date <= new Date()) {
                    setProblem(
                      "The scheduled time is in the past (or empty). Pick a future date and time, or use Publish Now instead.",
                    );
                    return;
                  }
                  patch.execute([
                    {
                      set: {
                        workflowStatus: "scheduled",
                        scheduledAt: date.toISOString(),
                      },
                    },
                  ]);
                  setOpen(false);
                  props.onComplete();
                }}
              >
                Schedule
              </button>
            </>
          )}
        </div>
      ),
    },
  };
};

/** Archive — always asks first; nothing is ever deleted. */
export const ArchiveAction: DocumentActionComponent = (props) => {
  const { patch, unpublish } = useDocumentOperation(props.id, props.type);
  const [confirming, setConfirming] = useState(false);

  return {
    label: "Archive",
    tone: "caution",
    onHandle: () => setConfirming(true),
    dialog: confirming && {
      type: "confirm",
      message:
        "Archive this piece? It will come off the website, but nothing is deleted — you can restore it any time from the Archived list.",
      onCancel: () => setConfirming(false),
      onConfirm: () => {
        patch.execute([{ set: { workflowStatus: "archived" } }]);
        if (!unpublish.disabled) unpublish.execute();
        setConfirming(false);
        props.onComplete();
      },
    },
  };
};

/** Unpublish — takes it off the site, keeps it as a draft. */
export const UnpublishToDraft: DocumentActionComponent = (props) => {
  const { patch, unpublish } = useDocumentOperation(props.id, props.type);
  return {
    label: "Unpublish",
    tone: "caution",
    disabled: Boolean(unpublish.disabled),
    onHandle: () => {
      patch.execute([{ set: { workflowStatus: "draft" } }, { unset: ["publishedAt"] }]);
      unpublish.execute();
      props.onComplete();
    },
  };
};

/** View the live article on the website. */
export const ViewLiveAction: DocumentActionComponent = (props) => {
  const slug = (props.published as SanityInsight | null)?.slug?.current;
  return {
    label: "View Live Article",
    disabled: !slug,
    onHandle: () => {
      // Same-origin path: works on today's Vercel URL and on the real
      // domain after cutover alike.
      if (slug) window.open(`/insights/${slug}`, "_blank", "noopener");
      props.onComplete();
    },
  };
};

/** Preview the draft (also stamps previewedAt for the checklist). */
export const PreviewDraftAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const draft = props.draft as SanityInsight | null;
  const slug = draft?.slug?.current ?? (props.published as SanityInsight | null)?.slug?.current;
  return {
    label: "Preview",
    disabled: !slug,
    onHandle: () => {
      if (slug) {
        patch.execute([{ set: { previewedAt: new Date().toISOString() } }]);
        window.open(
          previewUrl(slug, { baseUrl: window.location.origin }),
          "_blank",
          "noopener",
        );
      }
      props.onComplete();
    },
  };
};

/** Generate + copy the LinkedIn post with one click. */
export const CopyLinkedInPostAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const doc = (props.draft ?? props.published) as SanityInsight | null;
  const [message, setMessage] = useState<string | null>(null);

  return {
    label: "Copy LinkedIn Post",
    disabled: !doc?.title || !doc?.summary || !doc?.slug?.current,
    onHandle: async () => {
      if (!doc?.title || !doc.summary || !doc.slug?.current) return;
      const text =
        doc.linkedInPostText?.trim() ||
        generateLinkedInPost({
          title: doc.title,
          summary: doc.summary,
          slug: doc.slug.current,
          baseUrl: window.location.origin,
        });
      // Save FIRST: the Promotion tab must hold the text even when the
      // browser refuses programmatic clipboard access.
      patch.execute([
        { set: { linkedInPostText: text, linkedInPostStatus: "ready" } },
      ]);
      try {
        await navigator.clipboard.writeText(text);
        setMessage(
          "Copied. Paste it into a new post on the Cicada Agility LinkedIn page, then paste the post's URL into the Promotion tab and mark it as posted.",
        );
      } catch {
        setMessage(
          "Your browser blocked automatic copying — the text is saved in the Promotion tab, select and copy it from there.",
        );
      }
    },
    dialog: message
      ? {
          type: "dialog",
          header: "LinkedIn post ready",
          onClose: () => {
            setMessage(null);
            props.onComplete();
          },
          content: <p style={{ lineHeight: 1.6 }}>{message}</p>,
        }
      : false,
  };
};
