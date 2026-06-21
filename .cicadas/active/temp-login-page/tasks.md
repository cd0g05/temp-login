
---
summary: "Execution checklist across three sequential partitions. feat/landing-ui: scaffold Next.js, load fonts, port the mock-up into the landing page + LoginForm, add resume/favicon, re-tune the crane/P, verify single-viewport layout. feat/auth-gate: iron-session lib, login/logout routes (constant-time compare, remember-me), default-deny middleware + allowlist, /preview placeholder, curl gate verification. feat/deploy-setup: env/.env.example/README, then the interactive Vercel + domain-swap + font-verify walkthrough. No PRs (direct merges); initiative boundary merges to main and synthesizes canon."
phase: "tasks"
when_to_load:
  - "When selecting the next implementation task or reviewing completion state."
  - "When checking partition progress, PR boundaries, or execution sequencing."
depends_on:
  - "prd.md"
  - "ux.md"
  - "tech-design.md"
  - "approach.md"
modules:
  - "app/ (Next.js)"
  - "lib/session.ts + middleware.ts"
  - "public/ assets + Vercel deploy"
index:
  partition_one: "## Partition: feat/landing-ui"
  partition_two: "## Partition: feat/auth-gate"
  partition_three: "## Partition: feat/deploy-setup"
  initiative_boundary: "## Initiative Boundary"
next_section: "## Partition: feat/landing-ui"
---

# Tasks: temp-login-page

<!-- Lifecycle: no PRs at feature or initiative boundaries (direct merges). -->

## Partition: feat/landing-ui

- [x] Scaffold Next.js App Router + TypeScript (no Tailwind) into the repo; confirm `npm run dev` serves `/` with 200 <!-- id: 1 --> (manual scaffold via package.json; `next build` clean, `/`→200)
- [x] Load fonts: Inter via `next/font/google`; self-host Druk-aatie Burti via `next/font/local` (or `@font-face`) from `public/fonts/` <!-- id: 2 --> (Inter + DrukaatieBurti-Bold.ttf via next/font/local in app/layout.tsx)
- [x] Port `mockups/landing-login.html` markup + CSS into `app/page.tsx` (Server Component) and `app/globals.css` <!-- id: 3 -->
- [x] Extract `app/login-form.tsx` (Client Component) with idle / submitting / error states (not yet wired to a backend) <!-- id: 4 -->
- [x] Add `public/resume.pdf` (placeholder acceptable) and a hard-hat/cone `favicon.ico`; wire resume link to `/resume.pdf` and contact to `mailto:carter.cripe@gmail.com` <!-- id: 5 --> (real resume.pdf already present; favicon = app/icon.svg hard-hat; links verified, /resume.pdf→200 application/pdf)
- [x] Re-tune `.lift-slot` width + `.lifted-p` offset/rotation against the real Druk-aatie Burti so `CARTER CRI_E` + hoisted P look right <!-- id: 6 --> (set Druk-tuned values: slot 0.56em, P bottom 0.5em/12°, crane bottom 1.12em — **final pixel nudge needs human visual review in browser**)
- [~] Verify single-viewport (no-scroll) layout at 1440×900 and 390×844, plus the `max-height:620px` scroll fallback <!-- id: 7 --> (CSS implements it; **HUMAN-GATED visual confirmation in a browser pending** — couldn't render headlessly)
- [x] Reflect + Code Review on `feat/landing-ui`, then merge into `initiative/temp-login-page` <!-- id: 8 --> (Code Review PASS advisory; merged --no-ff)

## Partition: feat/auth-gate

- [x] `npm i iron-session`; write `lib/session.ts` (cookie name, `SESSION_SECRET`, httpOnly/secure/sameSite options, `getSession` helper) <!-- id: 10 --> (iron-session v8; cookie `cc_site`)
- [x] `app/api/login/route.ts`: parse `{password, remember}`, `crypto.timingSafeEqual` vs `SITE_PASSWORD`, seal session with conditional lifetime, redirect to `?from`/`/preview`; 401 + generic error on mismatch (no cookie) <!-- id: 11 --> (constant-time compare; same-site redirect guard; nodejs runtime)
- [x] `app/api/logout/route.ts`: destroy session and redirect to `/` <!-- id: 12 -->
- [x] Wire `LoginForm` submit to `/api/login`; render the 401 error state and the remember-me checkbox <!-- id: 13 --> (fetch + redirect on ok; added "Please log in to view that page" note when ?from present)
- [x] `middleware.ts`: default-deny + `PUBLIC_PATHS` allowlist (`/`, `/api/login`, `/api/logout`, `/resume.pdf`, static/font matcher); redirect unauthenticated to `/?from=…` <!-- id: 14 --> (fail-closed on errors)
- [x] `app/preview/page.tsx`: placeholder gated page proving end-to-end enforcement <!-- id: 15 --> (with logout form)
- [x] Verify gate with curl: `/preview` (no cookie) → redirect; `/` and `/resume.pdf` → 200; correct password grants `/preview`; confirm no secrets in client bundle <!-- id: 16 --> (ALL PASS: 307→/?from; 200/200; 401 wrong; 200 with cookie; Max-Age=2592000 remember vs session cookie; no password in .next/static)
- [x] `.env.example` documenting `SITE_PASSWORD` + `SESSION_SECRET` (no values) <!-- id: 17 -->
- [x] Reflect + Code Review on `feat/auth-gate`, then merge into `initiative/temp-login-page` <!-- id: 18 --> (Code Review PASS advisory; merged --no-ff)

## Partition: feat/deploy-setup

- [x] Write `README.md` setup section (env vars, local run, domain/deploy steps) and any `next.config.js` needed <!-- id: 20 --> (full README written; next.config.mjs present)
- [ ] 🔒 HUMAN-GATED — **Interactive walkthrough with Carter:** create/confirm the Vercel project, set `SITE_PASSWORD` + `SESSION_SECRET` in Vercel (Production), link the repo, run a preview deploy <!-- id: 21 -->
- [ ] 🔒 HUMAN-GATED — Re-point cartercripe.com from the old blank-placeholder deployment to this project (only after preview verification) <!-- id: 22 -->
- [ ] 🔒 HUMAN-GATED — Verify production: curl gate checks on cartercripe.com + visual Druk-aatie Burti font check <!-- id: 23 -->
- [x] Document the v3 Supabase per-person-accounts upgrade path in `README.md` (deferred, no implementation) <!-- id: 24 --> (Roadmap section)
- [ ] Reflect on `feat/deploy-setup`, then merge into `initiative/temp-login-page` <!-- id: 25 --> (after deploy tasks 21–23)

## Initiative Boundary

- [ ] Merge `initiative/temp-login-page` → `main` (direct, no PR per lifecycle), then synthesize canon and archive specs on `main` <!-- id: 100 -->
