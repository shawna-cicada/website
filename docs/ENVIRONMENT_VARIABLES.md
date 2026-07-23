# Environment Variables

Every variable the site reads. Set these in Vercel (Project → Settings →
Environment Variables). None are committed; `.env.example` mirrors this
list. Startup validation (`lib/env.ts`, run via `instrumentation.ts`)
logs any gaps — critical ones fail the launch checklist.

## Critical for launch

| Variable | Used by | Effect when unset |
|---|---|---|
| `CALENDLY_EVENT_URL_DISCOVERY_CALL` | /book | Primary booking pathway shows fallback instead of scheduler |
| `BOOKING_CONTACT_EMAIL` | /book fallback | No contact email offered when scheduling is unavailable |

## Recommended for launch

| Variable | Used by | Effect when unset |
|---|---|---|
| `ASSESSMENT_URL_GROWTH_STAGE` | /assessments, homepage | Featured assessment renders "available soon" |
| `CALENDLY_EVENT_URL_ASSESSMENT_DEBRIEF` | /book | Event type falls back to email |
| `CALENDLY_EVENT_URL_EXISTING_CLIENT` | /book | Event type falls back to email |
| `CALENDLY_EVENT_URL_COACHING_SESSION` | /book | Event type falls back to email |
| `ASSESSMENT_URL_FOUNDER_GROWTH` | /assessments | Card renders "available soon" |
| `ASSESSMENT_URL_LEADERSHIP_ALIGNMENT` | /assessments | Card renders "available soon" |
| `ASSESSMENT_URL_AI_READINESS` | /assessments | Card renders "available soon" |

## Content & admin

| Variable | Used by | Effect when unset |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Optional override (D-020) | Defaults to the committed live project `66n8qkam` |
| `NEXT_PUBLIC_SANITY_DATASET` | Optional override (D-020) | Defaults to `production` |

## Operations

| Variable | Used by | Effect when unset |
|---|---|---|
| `ERROR_MONITORING_WEBHOOK` | instrumentation, error pages | Server errors log to console only |
| `BOOKING_PROVIDER` | /book | Defaults to `calendly` |
| `SOCIAL_PUBLISH_MODE` | LinkedIn workflow | Defaults to `manual` (never auto-posts) |
| `SOCIAL_PUBLISH_PROVIDER` | LinkedIn workflow | Defaults to `manual-linkedin` |
| `ASSESSMENT_URL_ORG_EFFECTIVENESS` | inactive seed record | None (record inactive) |

## Rules

- Assessment and Calendly URLs must be full `https://` links; Calendly
  URLs are hostname-validated (`calendly.com` only) before embedding.
- Never put provider URLs, tokens, or emails in the repo — env only.
- After changing env vars in Vercel, redeploy: values are read at build
  time for static pages.
