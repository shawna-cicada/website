import { publishGate } from "@/lib/editorial/checklist";
import { can } from "@/lib/editorial/permissions";
import { ensureUniqueSlug } from "@/lib/editorial/slug";
import { seoDefaults } from "@/lib/editorial/seo";
import { readingTimeMinutes } from "@/lib/editorial/text";
import type { EditorialDoc, EditorialRole } from "@/lib/editorial/types";

/**
 * Workflow transitions. Every function is pure: it returns either an
 * updated document or a plain-language problem — the Studio actions are
 * thin wrappers around these, which is what makes them testable.
 */

export type TransitionResult =
  | { ok: true; doc: EditorialDoc; notes: string[] }
  | { ok: false; problems: string[] };

/** Autofill technical fields the editor never has to think about. */
export function applyAutomaticFields(
  doc: EditorialDoc,
  existingSlugs: string[] = [],
): { doc: EditorialDoc; notes: string[] } {
  const notes: string[] = [];
  const next: EditorialDoc = { ...doc };

  if (!next.slug && next.title) {
    const result = ensureUniqueSlug(next.title, existingSlugs);
    next.slug = result.slug;
    if (result.warning) notes.push(result.warning);
  }
  if (!next.seoTitle || !next.seoDescription) {
    const defaults = seoDefaults({ title: next.title, summary: next.summary });
    next.seoTitle = next.seoTitle || defaults.seoTitle;
    next.seoDescription = next.seoDescription || defaults.seoDescription;
  }
  return { doc: next, notes };
}

export function publishDoc(
  doc: EditorialDoc,
  role: EditorialRole,
  options: { now?: Date; existingSlugs?: string[] } = {},
): TransitionResult {
  if (!can(role, "publish")) {
    return {
      ok: false,
      problems: [
        "Publishing needs a Publisher or Administrator account. Your draft is safe — ask a Publisher to review and publish it.",
      ],
    };
  }
  const gate = publishGate(doc);
  if (!gate.canPublish) {
    return {
      ok: false,
      problems: gate.blockers.map((item) => `${item.label}: ${item.fix}`),
    };
  }
  const { doc: filled, notes } = applyAutomaticFields(doc, options.existingSlugs);
  return {
    ok: true,
    doc: {
      ...filled,
      status: "published",
      publishedAt: (options.now ?? new Date()).toISOString(),
      scheduledAt: undefined,
    },
    notes,
  };
}

export function scheduleDoc(
  doc: EditorialDoc,
  role: EditorialRole,
  when: Date,
  options: { now?: Date; existingSlugs?: string[] } = {},
): TransitionResult {
  if (!can(role, "schedule")) {
    return {
      ok: false,
      problems: [
        "Scheduling needs a Publisher or Administrator account. Save your draft and ask them to schedule it.",
      ],
    };
  }
  const now = options.now ?? new Date();
  if (when.getTime() <= now.getTime()) {
    return {
      ok: false,
      problems: [
        "The scheduled time is in the past. Pick a future date and time, or use Publish Now instead.",
      ],
    };
  }
  const gate = publishGate(doc);
  if (!gate.canPublish) {
    return {
      ok: false,
      problems: gate.blockers.map((item) => `${item.label}: ${item.fix}`),
    };
  }
  const { doc: filled, notes } = applyAutomaticFields(doc, options.existingSlugs);
  return {
    ok: true,
    doc: { ...filled, status: "scheduled", scheduledAt: when.toISOString() },
    notes,
  };
}

/**
 * Hand a piece to a Publisher without publishing anything. Any editor
 * can do it — it's the everyday finish line for Editor accounts, and
 * the reverse (back to draft) uses the same permission.
 */
export function sendForReview(
  doc: EditorialDoc,
  role: EditorialRole,
): TransitionResult {
  if (!can(role, "edit-draft")) {
    return {
      ok: false,
      problems: ["Sending for review needs an editor account."],
    };
  }
  if (doc.status === "published") {
    return {
      ok: false,
      problems: [
        "This piece is already live. Edit it and publish the changes, or unpublish it first.",
      ],
    };
  }
  return {
    ok: true,
    doc: { ...doc, status: "needs-review", scheduledAt: undefined },
    notes: [
      "Moved to Waiting for review — Publishers see it on the dashboard and in the review list.",
    ],
  };
}

/** The counterpart: pull a piece out of review back to plain draft. */
export function backToDraft(
  doc: EditorialDoc,
  role: EditorialRole,
): TransitionResult {
  if (!can(role, "edit-draft")) {
    return {
      ok: false,
      problems: ["Editing needs an editor account."],
    };
  }
  return {
    ok: true,
    doc: { ...doc, status: "draft", scheduledAt: undefined },
    notes: ["Back to draft — keep writing and send it for review when ready."],
  };
}

export function unpublishDoc(
  doc: EditorialDoc,
  role: EditorialRole,
): TransitionResult {
  if (!can(role, "unpublish")) {
    return { ok: false, problems: ["Unpublishing needs a Publisher or Administrator account."] };
  }
  return {
    ok: true,
    doc: { ...doc, status: "draft", publishedAt: undefined, scheduledAt: undefined },
    notes: ["The piece is off the website and saved as a draft — nothing was deleted."],
  };
}

/**
 * Archiving requires explicit confirmation (archive, never delete —
 * an archived piece can always be restored).
 */
export function archiveDoc(
  doc: EditorialDoc,
  role: EditorialRole,
  options: { confirmed: boolean },
): TransitionResult | { ok: false; needsConfirmation: true; message: string } {
  if (!can(role, "archive")) {
    return { ok: false, problems: ["Archiving needs a Publisher or Administrator account."] };
  }
  if (!options.confirmed) {
    return {
      ok: false,
      needsConfirmation: true,
      message:
        "Archive this piece? It will come off the website but nothing is deleted — you can restore it any time from the Archived list.",
    };
  }
  return {
    ok: true,
    doc: { ...doc, status: "archived", scheduledAt: undefined },
    notes: ["Archived. Restore it any time from the Archived list."],
  };
}

/** Restore the current document to a prior revision's content. */
export function restoreVersion(
  doc: EditorialDoc,
  role: EditorialRole,
  revision: EditorialDoc,
): TransitionResult {
  if (!can(role, "restore-version")) {
    return { ok: false, problems: ["Restoring a previous version needs a Publisher or Administrator account."] };
  }
  return {
    ok: true,
    doc: { ...revision, status: "draft" },
    notes: [
      "The previous version is restored as a draft — review it, then publish when ready.",
    ],
  };
}

/** Reading-time recomputation on save (autosave path). */
export function withReadingTime(doc: EditorialDoc): EditorialDoc & { readingTime: number } {
  return { ...doc, readingTime: readingTimeMinutes(doc.body) };
}
