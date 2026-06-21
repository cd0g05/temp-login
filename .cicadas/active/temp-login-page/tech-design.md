
---
summary: "Next.js (App Router, TypeScript) on Vercel. A single shared password (server-side env SITE_PASSWORD) is checked in a Route Handler with a constant-time compare; on success an encrypted, HTTP-only, Secure session cookie is sealed via iron-session (secret SESSION_SECRET). Gating is enforced in middleware.ts with default-deny + an explicit PUBLIC_PATHS allowlist (/, /resume.pdf, /api/login, /api/logout, static/font assets), so any non-allowlisted route is unreachable without a valid session — verified with a no-JS curl. 'Remember me' toggles cookie maxAge (~30d vs session). Landing UI is a Server Component porting the approved mockup; Inter via next/font, Druk-aatie Burti self-hosted; crane+P are inline SVG/CSS. No DB at MVP; Supabase per-person accounts deferred to v3."
phase: "tech"
when_to_load:
  - "When implementing or reviewing architecture, interfaces, data models, conventions, and sequencing."
  - "When checking whether changes still conform to the agreed technical approach."
depends_on:
  - "prd.md"
  - "ux.md"
modules:
  - "Next.js app (app/, middleware.ts)"
  - "Auth (api/login, api/logout, lib/session)"
  - "public/ assets (resume.pdf, fonts)"
index:
  overview: "## Overview & Context"
  stack: "## Tech Stack & Dependencies"
  structure: "## Project / Module Structure"
  adrs: "## Architecture Decisions (ADRs)"
  data_models: "## Data Models"
  interfaces: "## API & Interface Design"
  conventions: "## Implementation Patterns & Conventions"
  security_performance: "## Security & Performance"
  implementation_sequence: "## Implementation Sequence"
next_section: "Done — ready for Approach"
---

# Tech Design: temp-login-page

## Progress

- [x] Overview & Context
- [x] Tech Stack & Dependencies
- [x] Project / Module Structure
- [x] Architecture Decisions (ADRs)
- [x] Data Models
- [x] API & Interface Design
- [x] Implementation Patterns & Conventions
- [x] Security & Performance
- [x] Implementation Sequence

---

## Overview & Context

**Summary:** A small **Next.js (App Router, TypeScript)** application deployed on **Vercel** (which already serves cartercripe.com). The public landing page is a Server Component that renders the approved construction-themed mock-up. Authentication is a **single shared password** validated **server-side** in a Route Handler; on success the app seals an **encrypted, HTTP-only cookie session** (via `iron-session`). Access control is enforced once, centrally, in **`middleware.ts`**: every request is **denied by default** unless its path is on an explicit **public allowlist** or it carries a valid session. This guarantees the "genuinely private" requirement — a non-allowlisted route is unreachable without logging in, even via direct `curl` with JS disabled.

The architecture is deliberately the *minimum* that enforces real server-side gating while leaving a clean upgrade path to per-person accounts (Supabase) in v3 — no database is introduced now.

### Cross-Cutting Concerns

1. **Server-side enforcement** — Gating lives in middleware, not in client code. No private content is ever sent to an unauthenticated client.
2. **Secret hygiene** — `SITE_PASSWORD` and `SESSION_SECRET` exist only as server env vars; they are never imported into client components or shipped in the bundle.
3. **Default-deny allowlist** — Adding a new page is automatically gated; you must *opt a path into* `PUBLIC_PATHS` to make it public. Forgetting = safe (private), not leaky.
4. **Edge-compatibility** — Middleware runs on Vercel's Edge runtime; session verification there must use Edge-safe crypto (`iron-session` v8 / Web Crypto).

### Brownfield Notes

Effectively greenfield: the repo currently holds only a Python stub (`main.py`, `pyproject.toml`) which is unrelated and can remain or be removed. cartercripe.com is already a Vercel project serving a blank placeholder; **this app replaces that deployment** (domain re-point happens in the deploy/setup partition, not a code change).

---

## Tech Stack & Dependencies

| Category | Selection | Rationale |
|----------|-----------|-----------|
| **Language/Runtime** | TypeScript, Node 20+ (Next.js) | Type safety; Vercel-native. |
| **Framework** | Next.js (App Router) | Server Components + Middleware give server-side gating with zero custom server; first-class on Vercel. |
| **Hosting** | Vercel | Already hosts cartercripe.com; auto-HTTPS, env-var secrets, edge middleware. |
| **Database** | None (MVP) | Single shared password needs no persistence. Supabase deferred to v3. |
| **Auth** | Shared password + sealed cookie (`iron-session`) | Simplest *real* server-side gate; stateless (no DB); clean upgrade path. |
| **Styling** | Plain CSS (CSS Modules or global) | Mock-up is hand-written CSS; no framework needed for one screen. |
| **Fonts** | `next/font/google` (Inter), self-hosted `@font-face`/`next/font/local` (Druk-aatie Burti) | Inter zero-config; Druk-aatie Burti per UX license/self-host. |
| **Testing** | Manual + a `curl` gate check | Tiny surface; the critical test is "private route denied without JS". Optional Playwright later. |

**New dependencies introduced:**
- `next`, `react`, `react-dom` — the framework.
- `iron-session` (^8) — encrypts/signs a stateless session cookie; Edge-compatible; minimal API. Chosen over hand-rolled JWT for safer defaults.
- `typescript`, `@types/*`, `eslint`, `eslint-config-next` (dev) — standard Next tooling.

**Dependencies explicitly rejected (for MVP):**
- `@supabase/supabase-js` / Supabase Auth — real per-person accounts, but unnecessary for a shared password; deferred to v3.
- `next-auth` — heavier than needed for a single shared secret with no providers.
- Vercel "Password Protection" (project-level) — gates the *entire* deployment including `/` and `/resume.pdf`, which conflicts with the public-allowlist requirement.

---

## Project / Module Structure

```
temp-work-login/
├── app/
│   ├── layout.tsx              # Root layout; loads Inter + Druk-aatie Burti, global CSS
│   ├── page.tsx                # PUBLIC landing/login (Server Component) — ports the mock-up
│   ├── globals.css             # Styles ported from mockups/landing-login.html
│   ├── login-form.tsx          # Client Component: password field, remember-me, submit + error state
│   ├── preview/
│   │   └── page.tsx            # GATED placeholder private page (proves the gate)
│   └── api/
│       ├── login/route.ts      # POST: validate password (constant-time), seal session
│       └── logout/route.ts     # POST: destroy session
├── lib/
│   └── session.ts              # iron-session config (cookie name, secret, options) + helpers
├── middleware.ts               # Default-deny gate + PUBLIC_PATHS allowlist
├── public/
│   ├── resume.pdf              # PUBLIC static resume (committed)
│   ├── favicon.ico             # hard-hat / cone favicon
│   └── fonts/
│       └── DrukaatieBurti.woff2 (+ .otf fallback)   # self-hosted display font
├── .env.local                  # SITE_PASSWORD, SESSION_SECRET (gitignored)
├── .env.example                # documents required env vars (no secrets)
├── next.config.js
├── package.json
└── tsconfig.json
```

**Key structural decisions:**
- Auth config centralized in `lib/session.ts`; both the API routes and middleware import from it (single source of truth for cookie name/options).
- The allowlist (`PUBLIC_PATHS`) is a single constant in `middleware.ts` — the one obvious place to promote a page from gated → public (FR-3.4).
- The login form is the only Client Component; the page shell stays a Server Component for fast static-first render (NFR perf).

---

## Architecture Decisions (ADRs)

### ADR-1: Next.js App Router on Vercel (not a static site)
**Decision:** Build as a Next.js App Router app deployed on Vercel.
**Rationale:** The "genuinely private + public allowlist" requirement needs **server-side, per-route** enforcement. A purely static site can only hide content client-side (security theater). Next middleware gives a single server-side choke point; Vercel already serves the domain.
**Affects:** Entire project; `middleware.ts`.

### ADR-2: Shared password + sealed cookie (iron-session), no database
**Decision:** Validate one shared password (`SITE_PASSWORD`) and issue an encrypted `iron-session` cookie. No DB.
**Rationale:** Meets "genuinely private" without the weight of accounts/DB. Stateless and trivial to operate. Per-person accounts (Supabase) are an additive v3 change, not a rewrite.
**Affects:** `lib/session.ts`, `app/api/login/route.ts`, `app/api/logout/route.ts`.

### ADR-3: Default-deny in middleware with an explicit allowlist
**Decision:** `middleware.ts` denies every route by default and redirects unauthenticated users to `/`; only paths in `PUBLIC_PATHS` (and static/font assets) are public.
**Rationale:** Fail-safe. A forgotten page stays private rather than leaking. One place to reason about access (FR-3.1, FR-3.3, FR-3.4).
**Affects:** `middleware.ts`; every future route.

### ADR-4: Constant-time password comparison; secrets server-only
**Decision:** Compare the submitted password to `SITE_PASSWORD` with a constant-time comparison (`crypto.timingSafeEqual`) in the Node-runtime login route. Secrets live only in env, never client-imported.
**Rationale:** Avoids timing side-channels and secret leakage (NFR security).
**Affects:** `app/api/login/route.ts`.

### ADR-5: "Remember me" via conditional cookie lifetime
**Decision:** When "Keep me logged in" is checked, set a ~30-day persistent cookie; otherwise a session-only cookie (expires on browser close).
**Rationale:** Satisfies FR-2.4's preferred persistent behavior with a graceful session-only fallback; one boolean flips `maxAge`/`ttl`.
**Affects:** `app/api/login/route.ts`, `lib/session.ts`.

### ADR-6: Crane + lifted "P" as inline SVG + CSS (not an image)
**Decision:** Keep the tower crane and the hoisted P as inline SVG/CSS anchored to the heading, exactly as in the approved mock-up.
**Rationale:** Clean lines, resolution-independent, themeable, and already structured so the v2 hoist animation is a small step. No raster assets to source.
**Affects:** `app/page.tsx`, `app/globals.css`.

---

## Data Models

No persistent models at MVP. The only "model" is the in-cookie session payload:

```ts
// lib/session.ts
export interface SessionData {
  authed: true;        // present + true only after a successful password check
  at: number;          // issued-at epoch ms (informational)
}
```

**Key field decisions:**
- `authed` — the sole authorization signal middleware checks. Absence/false ⇒ unauthenticated.
- No user identity stored (single shared credential). v3 will add a `userId`/role here when Supabase accounts land.

**Migrations:** none.

---

## API & Interface Design

### New Endpoints

```
POST /api/login
Request:  { password: string, remember?: boolean }   (form POST or JSON)
Success:  302 -> redirect target (?from= or /preview), Set-Cookie: <sealed session>
Failure:  401, generic error; NO Set-Cookie; no indication of valid paths
Notes:    constant-time compare; runs on Node runtime

POST /api/logout
Request:  (none)
Success:  302 -> /, Set-Cookie cleared (session destroyed)
```

### Middleware contract

```ts
// middleware.ts (Edge)
const PUBLIC_PATHS = new Set(['/', '/api/login', '/api/logout', '/resume.pdf']);
// + always allow: /_next/*, /favicon.ico, /fonts/*  (via matcher / prefix checks)
// Logic:
//   if path is public asset/allowlisted -> next()
//   else read session; if session.authed -> next()
//   else -> redirect to `/?from=<original path>`  (soft note)
export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
```

### Backward Compatibility
N/A (greenfield). The only external contract is the public URL surface: `/`, `/resume.pdf`, `mailto:` — all preserved/added.

---

## Implementation Patterns & Conventions

### Naming Conventions
| Construct | Convention | Example |
|-----------|-----------|---------|
| Components | PascalCase file/exports | `LoginForm` in `login-form.tsx` |
| Functions | camelCase | `getSession()` |
| Constants | UPPER_SNAKE | `PUBLIC_PATHS`, `SITE_PASSWORD` |
| Routes | App Router conventions | `app/api/login/route.ts` |

### Error Handling Pattern
- Login failure returns a **generic** 401 ("That password didn't work") — never reveal whether private routes exist or their URLs (FR-2.3).
- Middleware/auth errors **fail closed**: any exception ⇒ treat as unauthenticated ⇒ redirect to `/`.
- Never log secret values.

### Testing Pattern
- **Critical gate test (manual/CI):** with no session cookie and JS irrelevant:
  ```
  curl -i https://<host>/preview        # expect 307/302 redirect to /
  curl -i https://<host>/resume.pdf     # expect 200 (public)
  curl -i https://<host>/               # expect 200 (public)
  ```
- Optional later: Playwright for the login happy-path + remember-me.
**Coverage expectations:** Focus on the gate (the security-critical path) over UI snapshotting.

---

## Security & Performance

### Security
| Concern | Mitigation |
|---------|-----------|
| Auth/Authz | Default-deny middleware; sealed cookie is the only access token |
| Secrets | `SITE_PASSWORD`, `SESSION_SECRET` server-env only; `.env.local` gitignored; never client-imported |
| Session cookie | `httpOnly`, `secure`, `sameSite=lax`, encrypted (iron-session) |
| Timing attack | `crypto.timingSafeEqual` on password compare |
| CSRF (login POST) | `sameSite=lax` cookie + same-origin form; optional Origin header check |
| Info leakage | Generic 401; redirect (not 404/403 with detail) for gated paths; no private route list shipped to client |
| Brute force | Out of scope for MVP (single user-base); note as v2 (rate-limit login) |

### Performance
| Concern | Target | Approach |
|---------|--------|---------|
| Landing FMP | < 2s cold | Server Component, static-first, system fallback fonts via `font-display: swap` |
| Middleware overhead | negligible | Edge runtime, in-memory allowlist check + cookie decrypt |

### Observability
- **Logs:** log auth *failures* count (no values) if convenient; Vercel request logs cover the rest. Nothing security-sensitive logged.
- **Metrics/Traces:** none for MVP.

---

## Implementation Sequence

1. **Scaffold** *(blocking)* — `create-next-app` (TS, App Router), commit baseline; wire fonts + global CSS skeleton.
2. **Landing UI** *(depends on 1)* — port `mockups/landing-login.html` into `app/page.tsx` + `globals.css`; add `LoginForm` client component (no backend yet); add `public/resume.pdf` placeholder + favicon. Re-tune the P/crane offsets against the real Druk-aatie Burti font.
3. **Session lib + auth routes** *(depends on 1)* — `lib/session.ts`, `app/api/login`, `app/api/logout`; wire `LoginForm` to `/api/login`; remember-me.
4. **Middleware gate** *(depends on 3)* — `middleware.ts` default-deny + `PUBLIC_PATHS`; `app/preview/page.tsx` placeholder; verify with `curl`.
5. **Deploy & setup** *(depends on 4)* — Vercel env vars, domain re-point from the old placeholder, font verification, `.env.example`; interactive walkthrough with Carter. Note v3 (Supabase) pointers.

**Parallel work opportunities:** Steps 2 (UI) and 3 (auth routes) can proceed in parallel after the scaffold; step 4 needs 3.

**Known implementation risks:**
- **Font re-tune:** Druk-aatie Burti metrics differ from the Oswald stand-in → P lift/slot offsets need adjustment (explicitly a task).
- **iron-session in Edge middleware:** confirm v8 Edge compatibility; if any issue, fall back to verifying a `jose` HS256 JWT in middleware (same cookie idea).
