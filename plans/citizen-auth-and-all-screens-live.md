# Plan: Citizen login/register choice + every screen live

## Current state (verified)

- Live router is `app/src/router/index.ts` (Vite prefers `.ts`, so legacy `router/index.js` is dead — `vite.config.ts:10`).
- Citizen journey is already wired end-to-end: `/citizen/welcome` → `/citizen/login` → `/citizen/login/otp` → `/citizen/onboarding/permissions` → `/citizen/onboarding/all-set` → `/citizen` → `/citizen/report-new` → `/citizen/reports/sent/:reference` (the wrap screen showing the reference) → `/citizen/reports/:reference` → `/citizen/reports/:reference/resolved`.
- **~45 view files are not registered** in any route (real screens + empty placeholders + dead legacy UI).

### Defects found that block "all screens live"

| # | Defect | Location |
|---|---|---|
| 1 | No login/register choice; no register screen at all | `LanguageView.vue:65` goes straight to `/citizen/login` |
| 2 | `fetchReportByReference` is a TODO stub that always throws → **ResolvedConfirmation wrap card can never render** (shows error/notFound) | `composables/CitizenAdapters.ts:16` |
| 3 | `newReportRoute()` returns `/citizen/report` but route is `/citizen/report-new` | `CitizenAdapters.ts:23` |
| 4 | Route **name** contracts missing: components link to `admin-tickets`, `admin-ticket-detail`, `field-tickets`, `field-ticket-detail`, `field-close-ticket`, `field-reset-pin`, `field-crews` — none registered (existing names are PascalCase: `AdminTickets`, `FieldTickets`); nothing else references the PascalCase names so they can be renamed | `AdminTicketDetailView.vue:21`, `TicketQueueTable.vue:25`, `CloseTicketView.vue:73`, `TicketCard.vue:12`, `TicketDetailView.vue:29`, `ResetPinView.vue:30`, `ApproveClosingView.vue:37` |
| 5 | `AdminLogin.vue` cannot compile if wired: calls `auth.loginAdmin()` (doesn't exist), imports `ADMIN_HOME_PATH` (not exported by `config/roles.ts`), uses `adminLogin.*` i18n keys (undefined) | `views/auth/AdminLogin.vue:6,43,44` |
| 6 | Two **0-line files** — cannot be compiled as routes: `field/supervisor_login.vue`, `field/supervisorCrewsView.vue` | — |
| 7 | Citizen bell button goes to reports instead of a notifications screen | `CitizenLayout.vue:45` |

## Login entry points — recommendation

| Role | Canonical URL | Screen | Credentials | Lands on |
|---|---|---|---|---|
| Citizen | `/citizen/auth-choice` (new) → `/citizen/login` or `/citizen/register` | AuthChoiceView / PhoneView / RegisterView | phone + OTP (name+phone for register) | permissions → all-set → `/citizen` |
| Field officer | `/field/login` (keep) | `auth/FieldLogin.vue` | Employee ID + 6-digit PIN | `/field/tickets` |
| Contractor | `/contractor/login` (keep) | `auth/ContractorLogin.vue` | work email + password | `/contractor/scorecard` |
| Admin | `/login` (keep, canonical) | `auth/StaffLogin.vue` | staff email + password | `/admin` |

Additional decisions:
- **Fix `AdminLogin.vue`** (3 small fixes: `loginAdmin` → `auth.login({role:'admin'})`, `ADMIN_HOME_PATH` → `homeRouteFor('admin')`, add `adminLogin.*` i18n keys) and wire it as the alternate admin login at **`/login/admin`**; `/login` stays canonical per `config/roles.ts:23`.
- Make all four portals discoverable: new **AuthChoiceView footer** gets links to `/login` (County staff), `/field/login`, `/contractor/login`; existing cross-links on the other login pages stay.
- Logout from citizen portal returns to `/citizen/auth-choice` (not directly to phone sign-in).

## Work items

### W1 — Citizen login/register choice (new screens)
1. Create `src/views/citizen/onboarding/AuthChoiceView.vue` — `CitizenOnboardLayout`, two buttons: Sign in → `/citizen/login`, Create account → `/citizen/register`; footer links to staff/field/contractor portals.
2. Create `src/views/citizen/onboarding/RegisterView.vue` — name + phone form; stores `sessionStorage`: `ns_auth_mode=register`, `ns_name`, `ns_phone`; routes to `/citizen/login/otp`.
3. Register routes in `src/router/index.ts` (both `guestOnly`): `/citizen/auth-choice` (`CitizenAuthChoice`), `/citizen/register` (`CitizenRegister`).
4. Reroute: `LanguageView.vue:65` → `/citizen/auth-choice`; `PhoneView` back-link → `/citizen/auth-choice`; `CitizenLayout` logout → `/citizen/auth-choice`.
5. `OtpView.vue` confirm: when `ns_auth_mode === 'register'`, set session with the entered name (same mock-session pattern already used at `OtpView.vue:131`), then continue → permissions. Login path unchanged.
6. i18n: add `choice.*` + `register.*` blocks (EN + Kiswahili) to `src/i18n/onboarding.messages.ts`.

### W2 — Fix broken contracts
1. `CitizenAdapters.ts:23`: `/citizen/report` → `/citizen/report-new`.
2. `CitizenAdapters.ts:16`: implement `fetchReportByReference` — try `reportsApi.list()` match by `reference`; on network failure fall back to a mock `CitizenReport` (fallback timeline already exists in `ReportDetailView.vue:60`); `code:'NETWORK'` throw only when offline. This unblocks the **Resolved wrap card**.
3. Fix `AdminLogin.vue` (see recommendation) — add `adminLogin.*` keys to `src/i18n/index.ts`.
4. Rename route names to match component contracts: `AdminTickets` → `admin-tickets`, `FieldTickets` → `field-tickets` (verified: nothing references the PascalCase names besides the definitions).

### W3 — Wire citizen remainder
Add to `citizen.routes.ts` children (all under `/citizen`, auth/RBAC inherited from parent):
- `notifications` → `NotificationsView` (name `CitizenNotifications`) — bell in `CitizenLayout.vue:45` now pushes here.
- `payments/history` → `PaymentHistoryView` (+ small link from `PaymentView`).
- `cleanup-events` → `CleanupEventsView` (+ link from `CommunityView`).
- `disposal-guidance` → `DisposalGuidanceView` (+ link from `HomeView` quick actions or ReportIssue footer).
- `consent` → `ConsentView` — wrap the `perm.dataPolicy` text in `PermissionsView` into a router-link.
- `citizen_report.vue` → legacy (W6), it's an old duplicate of report-new.

### W4 — Wire field screens
Add to `field.routes.ts` (children under `/field` inherit auth+roles):
- `tickets/:id` name **`field-ticket-detail`** → `TicketDetailView`
- `tickets/:id/close` name **`field-close-ticket`** → `CloseTicketView`
- `crew/:crewId?/reset-pin` name **`field-reset-pin`** → `ResetPinView` (param must be optional — `ResetPinView.vue:30` pushes it with no params)
- `crews` name **`field-crews`** → redirect to `/field/tickets` (the real supervisor crews screen is a 0-line file; redirect satisfies `ApproveClosingView.vue:37`)
- `alerts` → `crewAlerts.vue` (name `FieldCrewAlerts`)
- `shift` → `ShiftView`, `attendance` → `AttendanceView` (placeholders, route-only)
- Make `MyTicketsView` rows link to `field-ticket-detail` so the field chain (tickets → detail → close → back) is walkable.

### W5 — Wire admin screens
Add to `admin.routes.ts` children (parent meta gives `roles:['admin']`):
- `tickets/:id` name **`admin-ticket-detail`** → `AdminTicketDetailView` (required by `TicketQueueTable.vue:25`, already rendered by `admin/TicketsView`)
- `accounts` → `UsersRolesView` (matches `config/adminNav.ts:17`)
- Placeholders (route-only, kebab paths): `zoning`, `trends`, `spatial-ledger`, `shifts`, `safety-alerts`, `payments`, `payment-compliance`, `notifications`, `hotspots`, `finance`, `efficiency-index`, `dumping-sites`, `attendance` → their respective `views/admin/*View.vue`.

### W6 — Wire auth alternates + legacy screens
1. `/login/admin` → fixed `AdminLogin` (AuthLayout child, `guestOnly`).
2. Legacy screens under **`/legacy/*`** (approved), no `requiresAuth` (demo screens; the old `nasafisha_logged_in` cookie is not the active guard):
   - `/legacy` index (simple link list view) → `dashboard`, `operations`, `fleet`, `tickets`, `dumping-sites`, `accounts`, `login` (old LoginView), `landing`, `home`, `details`, `posts`, `pinia`, `api-test`, `citizen-report`, `contractor-login` (from `contractors/ContractorLoginView.vue`, fixed to use `authStore.login` so the session actually sticks), `contractor-ledger` (from `contractors/`).
   - Compat aliases (no clash with new routes) so links **inside** legacy screens work: `/dashboard`, `/operations`, `/fleet`, `/tickets`, `/dumping-sites`, `/accounts` → their legacy screens. **Not** `/login` (that's the staff login).

### W7 — Exclusions (cannot go live)
- `field/supervisor_login.vue`, `field/supervisorCrewsView.vue` — **0-line files**, Vue SFC compile errors. Left untouched (documented); building them is separate work.
- `views/auth/StaffPinForm.vue` — child component (props/emits), not a page; embedded later if a supervisor login is built.
- `AppSidebar.vue` / `adminNav.ts` paths (`/admin/ops/*`) — sidebar component is unused; `ADMIN_NAV` targets are only a type import. Not wired.

### W8 — Tests
- Update `tests/unit/citizen/onboardingFlow.spec.ts`: add `/citizen/auth-choice`, `/citizen/register` to `ONBOARDING_PATHS` and the chain assertion.
- Add `tests/unit/routeCoverage.spec.ts`: assert every newly wired path exists in `router.getRoutes()`, and assert the critical names resolve (`admin-ticket-detail`, `field-ticket-detail`, `field-close-ticket`, `field-tickets`, `admin-tickets`, `field-reset-pin`, `field-crews`).
- Existing specs (`admin-rbac`, `citizenConfirmMessages`, `onboardingMessages`, `layout-render`) rely on unchanged paths — should stay green; fix only if the choice-screen reroute breaks an assertion.

## Verification

1. Baseline first: `npm run test` (record pre-existing failures before touching anything).
2. After changes: `npm run test`, `npm run lint`, `npx vue-tsc --noEmit` (no typecheck script exists; run directly — report pre-existing errors separately from new ones), `npm run build`.
3. Smoke-check the walkable chains via route assertions in `routeCoverage.spec.ts` (no browser automation added).

## Order of execution

W2 (fixes) → W1 (choice/register) → W3 → W4 → W5 → W6 → W8 → verification.
