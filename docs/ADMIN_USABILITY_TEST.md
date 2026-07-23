# Admin Usability Test — Facilitator Script

Purpose: verify that a **first-time, nontechnical editor** can complete
the entire publishing workflow **without help**. This is the editorial
acceptance test from WEBSITE_REDESIGN.md — the admin experience is not
done until someone passes it.

## Ground rules for the facilitator

- **Observe, don't explain.** Read each task aloud, then stay quiet.
- If the participant asks for help, respond: *"What would you try?"*
- **Any step that requires a verbal explanation is a defect.** Note it,
  simplify the workflow, and re-test.
- Ask the participant to think aloud.
- Session length: ~30 minutes. One participant minimum before launch;
  two is better.

## Setup (before the participant arrives)

- [ ] A test account with the **Editor** role (not Administrator).
- [ ] The Studio reachable at `/admin` with the Sanity project connected.
- [ ] At least one author and two categories already exist.
- [ ] A sample image file on the test machine's desktop.
- [ ] Screen recording on (with the participant's consent).

## The tasks

Read each task exactly as written. Do not demonstrate.

### Task 1 — Sign in
> "Sign in to the website's editing area."

Success: reaches the Cicada dashboard (not a document list).
Watch for: confusion about where /admin is; login friction.

### Task 2 — Create an article from a template
> "Start a new article about leadership using one of the prepared
> templates."

Success: uses **Create a New Article**, picks a template, sees the
outline with ✎ prompts, writes a title and replaces at least one prompt.
Watch for: hunting for "New document"; not understanding the ✎ prompts.

### Task 3 — Add an image
> "Add a picture to the top of the article."

Success: uploads via the image field **and fills in the description**.
Watch for: skipping the description; confusion about what it is for.

### Task 4 — Preview it
> "Check what the article will look like to readers — on a computer and
> on a phone."

Success: uses Preview; views both sizes (browser resize or phone).
Watch for: not finding Preview; mistaking the editor for the preview.

### Task 5 — Prepare the LinkedIn copy
> "Get a LinkedIn post ready for this article."

Success: uses **Copy LinkedIn Post** (or the Promotion tab), sees the
generated text, understands they would paste it into LinkedIn.
Watch for: expecting the system to post to LinkedIn by itself — the
correct understanding is *generated copy, manual posting*.

### Task 6 — Schedule it
> "Arrange for this article to go live next Monday at 9 in the morning."

Success: uses **Schedule**, picks the future date/time. If the checklist
blocks scheduling, the participant understands each message and fixes the
items without help.
Watch for: checklist messages that confuse; date picker friction.
(Note: as an Editor, the participant may be told scheduling needs a
Publisher — the success criterion is that the message makes sense to them
and they know what to do next.)

### Task 7 — Find it and change it
> "Close everything. Now find the article you just made and change its
> title."

Success: returns via the dashboard lists or Edit Existing Content, edits
the title, sees it autosave.
Watch for: getting lost; searching in the wrong place.

## Scoring

For each task record: **completed unaided / completed with hints /
failed**, time taken, quotes, and friction points.

**Pass = all seven tasks completed unaided.** Anything else: fix the
friction, then run the test again with a fresh participant.

## Debrief questions

1. What almost stopped you?
2. Was any message confusing? Which words?
3. If you had to do this weekly, what would annoy you?
4. What did you expect to happen that didn't?
