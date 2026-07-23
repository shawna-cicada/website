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
  `CALENDLY_EVENT_URL_EXISTING_CLIENT`.
- Automatic visitor time zone; `embed_type=Inline`; GDPR banner hidden
  (our own consent copy renders beside the embed).
- Signals: `calendly.date_and_time_selected` → `booking_start`,
  `calendly.event_scheduled` → `booking_complete`.
- UTM/referrer: the embed component forwards the visitor's `utm_*` query
  parameters onto the embed URL — Calendly stores them on the invitee.

## Placeholder: Cal.com adapter (not yet implemented)

To switch to Cal.com (D-006 keeps this a lib-level swap):

1. Create `calcom.ts` implementing `BookingProvider`:
   - Env: `CALCOM_EVENT_URL_*` per event type (public event links, e.g.
     `https://cal.com/<user>/<event>`); validate hostname `cal.com` or the
     self-hosted domain.
   - Embed URL: Cal.com supports inline embeds via its embed script or an
     iframe of the event URL with `?embed=true&theme=light`; time zone is
     also automatic.
2. Extend `parseBookingMessage` for Cal.com's postMessage shape
   (`{type: "CAL:bookingSuccessful"}` → `booking_complete`; validate origin).
3. Register it in `PROVIDERS` in `index.ts` and set `BOOKING_PROVIDER=calcom`.

No page or component changes are required.
