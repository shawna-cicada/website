# Booking provider abstraction

`/book` renders whatever `getBookingConfig()` returns; page components never
import a concrete provider. The active provider is chosen with
`BOOKING_PROVIDER` (default `calendly`).

## Contract

A provider implements `BookingProvider` (`types.ts`):

- `getEmbedUrl(eventKey)` — inline-embeddable URL for one of the three
  configured event types, built from environment variables. Return `null`
  when unconfigured; the UI renders the accessible fallback. **Public
  scheduling URLs only — never expose private calendar data.**
- `getFallbackUrl(eventKey)` — direct link for the fallback button.

Funnel signals are normalized in `messages.ts` (`parseBookingMessage`):
map the provider's `postMessage` events to `booking_start` /
`booking_complete`, validating `event.origin` against the provider's domain.

## Current implementation: Calendly (`calendly.ts`)

- Env: `CALENDLY_EVENT_URL_DISCOVERY_CALL`, `CALENDLY_EVENT_URL_ASSESSMENT_DEBRIEF`,
  `CALENDLY_EVENT_URL_COACHING_SESSION`.
- Automatic visitor time zone; `embed_type=Inline`; GDPR banner hidden
  (our own consent copy renders beside the embed).
- Signals: `calendly.date_and_time_selected` → `booking_start`,
  `calendly.event_scheduled` → `booking_complete`.
- UTM/referrer: the embed component forwards the visitor's `utm_*` query
  parameters onto the embed URL — Calendly stores them on the invitee.

## Also implemented: Cal.com (`calcom.ts`)

Activate with `BOOKING_PROVIDER=calcom`.

- The live public event links are committed defaults (D-024):
  discovery `cicadaagility/30min`, debrief `cicadaagility/60min`,
  coaching `cicadaagility/coaching-session`. `CALCOM_EVENT_URL_*` env
  vars override them; every URL (default or override) must be a
  `cal.com` hostname or it is rejected (matches the CSP frame-src).
- Embed: iframe of the event URL with `embed=true&theme=light`; visitor
  time zone is automatic.
- Signals: Cal.com exposes no reliable slot-selected message, so only
  `bookingSuccessful` → `booking_complete` is tracked (origin-validated,
  action-name field read defensively across embed versions).
- Startup env checks (lib/env.ts) follow `BOOKING_PROVIDER`: they demand
  the CALCOM_* names when it's `calcom`, CALENDLY_* otherwise.
