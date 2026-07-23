# Rollback Plan

Two independent safety nets: Vercel deployment rollback (site bugs) and
DNS rollback (full retreat to the old Wix site). Both are reversible.

## 1. Rolling back a bad deployment (minutes, no DNS involved)

Every push creates an immutable Vercel deployment. If a release breaks:

1. Vercel dashboard → Project → Deployments.
2. Find the last good deployment (each links to its git commit).
3. ⋯ menu → **Instant Rollback** (or "Promote to Production").
4. Verify the site; the bad commit stays in git for a proper fix.

Zero downtime, no cache issues. Use for any post-launch regression.

## 2. Rolling back the DNS cutover (retreat to Wix)

Precondition (done during cutover prep): the complete pre-cutover DNS
zone is exported and saved, and the Wix site remains published and
untouched — do not cancel or unpublish Wix until the new site has been
stable for at least 30 days.

1. At the DNS host, restore the previous records for `cicadaagility.com`
   and `www` (the Wix A record / CNAME from the saved zone export).
2. Leave every **MX and email-related record untouched** — email must
   never be affected by web rollback (they are separate records; the
   cutover plan forbids editing them in the first place).
3. Wait for TTL propagation (set TTLs to 300s before cutover so both
   directions propagate in minutes).
4. Verify: `dig www.cicadaagility.com`, then load the site from a fresh
   network; confirm the Wix site serves.
5. The Vercel deployment stays live at its `*.vercel.app` URL for
   diagnosis; nothing is lost.

## 3. Content rollback (CMS)

Individual documents: Sanity keeps full revision history — restore any
prior version from the document's history panel (see EDITOR_GUIDE.md).
Nothing in the editorial workflow deletes content (archive only).

## Decision guide

| Symptom | Action |
|---|---|
| Page broken after deploy | §1 Instant Rollback |
| Wrong/missing content | §3 restore revision (or fix in Studio) |
| Booking/assessment link wrong | Fix env var in Vercel, redeploy |
| Site fundamentally unusable, fix unknown | §1 first; §2 only if the last good deployment is also unusable |
