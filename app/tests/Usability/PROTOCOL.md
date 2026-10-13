# FE-015 · Usability test: citizen submission flow

**Requirement (NFR-030):** 90% of first-time users submit a report in **≤ 3 taps**.
**Flow under test (PRD UJ-001):** photograph the uncollected waste → location is captured automatically → submit → see a reference number.

Two parts measure this:

| Part | What it proves | Where |
|---|---|---|
| Automated | The *minimum* taps the screens require. Fails the build if a change adds a tap. | `tests/e2e/citizen-submission.spec.ts` |
| Human test | What *real first-time users* actually do (wrong turns, hesitation). Gives the 90% figure. | this protocol + `analyze.mjs` |

## Decide first (these change the result, so settle them before testing)

1. **Do the native camera taps count?** Shutter and confirm in the phone's camera app are 1–2 extra taps outside our UI.
   *Default used here:* not counted in the headline, but always recorded (`taps_camera`) and shown as the strict figure.
2. **Do sign-in and consent count for a first-time user?** A new citizen meets sign-in and consent screens before the report screen.
   *Default used here:* not counted in the headline, but recorded (`taps_onboarding`) and shown in the strict figure.
3. **What is a tap?** Any touch that activates something (button, link, option, photo control). Scrolling, zooming and typing are not taps. Typing is recorded in `notes`: the flow should need none.

If the strict figure is the one that matters to the client, ask the product owner **before** the test. Record the decision here: `____________`.

## Participants

- At least **10 first-time users** (never used NASAFISHA). Fewer than 10 is flagged as indicative only.
- Residents of Nakuru, mixed ages, at least half on low-end Android phones. No staff and no one who helped build the app.
- One session = one person = one attempt. Never reuse a participant.

## Setup (every session)

- Fresh state: clear site data / use a new browser profile, so the app looks like a first visit.
- Real mobile data connection, not office Wi-Fi. Location switched on.
- Put a pile of rubbish (or a printed photo of one) where the participant can photograph it.
- One facilitator reads the task and times; one observer counts taps (or record the screen and count afterwards).

## Task script (read exactly; Kiswahili version in brackets)

> "Your rubbish was not collected today. Use this app to report it to the county."
> ["Taka zako hazikuchukuliwa leo. Tumia programu hii kuripoti kwa kaunti."]

Then say nothing else. Start timing at the participant's first touch on the report screen. Stop at the confirmation with a reference.

## Facilitator rules

- **No hints.** If they ask "what do I do?", say "Do what you would normally do." If stuck for 60 seconds, record `submitted = no`, then help.
- Do not describe the screens or point at anything.
- If they need help to finish, record `needed_help = yes`. If they could not finish without a hint, record `submitted = no`.

## What to record (one row per participant in `results.template.csv`)

| Column | Meaning |
|---|---|
| `participant_id` | P01, P02 … |
| `date` | YYYY-MM-DD |
| `first_time` | `yes` / `no`. Only `yes` rows are scored |
| `device` | Phone model |
| `submitted` | `yes` if a reference number was reached without a hint |
| `taps_in_app` | Taps on **our** screens from the report screen to the reference |
| `taps_camera` | Taps inside the native camera app |
| `taps_onboarding` | Taps on sign-in / consent screens before the report screen |
| `seconds` | Time to the reference |
| `needed_help` | `yes` / `no` |
| `notes` | Wrong turns, confusion, quotes, anything typed |

## Result

```bash
node tests/usability/analyze.mjs results.csv
```

It prints the headline rate (in-app taps), the strict rate (all taps), and warns if there are fewer than 10 people.
Exit code `0` = headline meets 90%; `1` = it does not. The "95% lower bound" shows what the sample supports: with 10 people, 9 passing does **not** statistically prove 90%, so it is evidence, not a guarantee.

## If it fails: where the taps usually go

1. A home screen that needs a tap before the photo step → make the primary button open the camera directly.
2. A "choose issue type" step → default it to "Uncollected waste" and make changing it optional.
3. A separate confirm / review screen → submit straight from the photo preview.
4. Location asked for by hand → it must be automatic (GPS), with a clear message if permission is blocked.
5. Consent and sign-in repeated → ask once, remember it.