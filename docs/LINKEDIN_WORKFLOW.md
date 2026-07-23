# LinkedIn Publishing Workflow

How Cicada Agility insights get to LinkedIn. The article on
cicadaagility.com is always created **first** — its public URL is the
canonical source LinkedIn points back to.

## Today: Phase 1 — generated copy, manual posting

The site/Studio **never talks to LinkedIn**. The flow:

1. Publish the article or video on cicadaagility.com.
2. In the Studio, use **Copy LinkedIn Post** — suggested copy is
   generated from the title, excerpt, content type, and canonical URL
   (`lib/editorial/linkedin.ts` via the `manual-linkedin` publisher),
   stored on the document, and copied to the clipboard.
3. The editor edits the suggestion if desired (Promotion tab), posts it
   manually on the Cicada Agility LinkedIn company page.
4. The editor pastes the LinkedIn post's URL back into the document and
   marks the status **posted**.

Status field: `not-ready` → `ready` → `posted`.

## The abstraction

`lib/linkedin/` defines a provider-neutral `SocialPublisher` interface:

- `createDraft(input)` → formatted post text + canonical URL
- `publish(input)` → in manual mode, returns `awaiting-manual-post` with
  the draft and human instructions; automated modes would return
  `submitted`/`scheduled`/`failed`
- `getStatus(slug, stored)` → current post status

`ManualLinkedInPublisher` is the only implementation. It makes **no
network calls of any kind** — enforced by tests
(`tests/unit/linkedin-publisher.test.ts` fails the build if `fetch` or
`XMLHttpRequest` is ever touched in manual mode).

### Safety interlock

`getSocialPublisher()` returns the manual publisher unless **both**:

1. `SOCIAL_PUBLISH_MODE=automated` is set in the environment, **and**
2. `SOCIAL_PUBLISH_PROVIDER` names a registered implementation whose
   `automated` flag is true.

No such implementation exists, so automation is impossible today even if
the env flag flips. Defaults in `.env.example` are manual.

## Later phases (implement behind the same interface)

### Phase 2a — Zapier
Sanity webhook (on publish) → Zapier "Catch Hook" → *human-approved*
draft post via Zapier's LinkedIn Pages integration. Implement
`ZapierPublisher.publish()` as a POST to the Zapier hook URL
(`ZAPIER_HOOK_URL` env); status stays manual-confirmed until a person
approves in Zapier. Zapier needs the LinkedIn Pages connection authorized
by a company-page admin.

### Phase 2b — Make (Integromat)
Same shape as Zapier: webhook trigger → scenario with an approval step →
LinkedIn "Create a Page Post" module. `MAKE_WEBHOOK_URL` env.

### Phase 2c — Serverless webhook
A small function (Vercel route or worker) receives the Sanity webhook,
creates a *pending* post record, and notifies a human (email/Slack) with
an approve link. On approval it calls the LinkedIn API. Requires the
Phase 3 prerequisites below; the function holds the tokens, never the
browser.

### Phase 3 — Direct LinkedIn API
Only after Cicada Agility has: a LinkedIn Developer application, the
**Community Management** (Pages) API product approved, admin consent on
the company page, and OAuth tokens stored server-side
(`LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` / refresh token in the
deployment's secret store — never in the repo). Do **not** assume this
access exists; LinkedIn approval is a review process and can be declined.
Implement `LinkedInApiPublisher` with `automated: true`, register it, and
keep the human-approval step unless the team explicitly decides
otherwise.

## Rules that hold in every phase

- Canonical URL always points at cicadaagility.com.
- A human approves anything that posts automatically.
- Posting failures must never block site publishing.
- The provider can change without touching Studio or site components.
