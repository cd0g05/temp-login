---
boundary: partition-complete
initiative: temp-login-page
---

# Handoff — implementation complete, deploy pending

## Just completed (autonomous /loop run)
- **feat/landing-ui** ✅ built + merged: Next.js App Router scaffold, Inter + self-hosted Druk-aatie Burti, ported mock-up into `app/page.tsx` + `globals.css`, inline-SVG crane lifting the real **P** out of `CARTER CRI_E`, single-viewport layout, hard-hat favicon, resume/contact links. `next build` clean, `/`→200.
- **feat/auth-gate** ✅ built + merged: `lib/session.ts` (iron-session, cookie `cc_site`), `/api/login` (constant-time compare, remember-me lifetime), `/api/logout`, default-deny `middleware.ts` + `PUBLIC_PATHS`, gated `/preview`, wired `LoginForm`. Gate verified by curl (see tasks 16).
- **feat/deploy-setup** 🚧 docs only: `README.md` (setup + deploy walkthrough + v3 Supabase roadmap) written. Branch is **checked out, committed, NOT merged**.

## Current state
- On branch `feat/deploy-setup`. Both feature branches already merged into `initiative/temp-login-page`.
- Local secrets in `.env.local` (gitignored): `SITE_PASSWORD=open-sesame` (test), random `SESSION_SECRET`. **Change before production.**
- No git remote configured yet.

## Next actions — ALL HUMAN-GATED
1. **Task 21** — Vercel: create/confirm project, set `SITE_PASSWORD` + `SESSION_SECRET` (Production), link repo (needs a GitHub remote), preview deploy. *Interactive walkthrough with Carter; steps in README.*
2. **Task 22** — Re-point cartercripe.com off the old placeholder to this project (after preview looks right).
3. **Task 23** — Verify production: curl gate checks + visual font/layout check.
4. **Task 25** — Reflect + merge `feat/deploy-setup` → `initiative/temp-login-page`.
5. **Task 100** — Merge `initiative/temp-login-page` → `main`, synthesize canon, archive specs. *Canon commit + archive need Builder approval (autonomy table).*
6. **Visual confirmations** (browser): task 7 single-viewport layout, task 6 final P/crane pixel nudge against the real font.

## Reload list
- `.cicadas/active/temp-login-page/tasks.md` (Partition: feat/deploy-setup + Initiative Boundary)
- `README.md` (deploy walkthrough)
- `.cicadas/active/temp-login-page/tech-design.md` (if revisiting gate/session)

## Carry forward
- 2 moderate transitive npm vulnerabilities — run `npm audit` before launch (don't `--force` blindly).
- `public/Crane.svg` is unused (crane is inline SVG, per decision).
- iron-session works in edge middleware (ADR-2 jose fallback NOT needed).
