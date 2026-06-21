
---
summary: "A temporary, construction-themed login gate for cartercripe.com during development. A clean white page introduces Carter, displays an 'under development' hazard-tape notice, and offers public links (resume PDF, contact email) for employers, friends, and the merely curious. A single shared credential, enforced server-side, unlocks the in-development pages; the login page, resume, and contact remain publicly accessible. Built static-scene-first with crane/letter animation deferred to Post-MVP."
phase: "clarify"
when_to_load:
  - "When defining or reviewing initiative goals, users, scope, success criteria, and risks."
  - "When validating that implementation still aligns with the intended problem and outcomes."
depends_on: []
modules:
  - "Web front-end (landing/login page, construction-themed UI)"
  - "Auth/gating (server-side session enforcement, allowlist of public routes)"
  - "Hosting & deployment"
index:
  executive_summary: "## Executive Summary"
  project_classification: "## Project Classification"
  success_criteria: "## Success Criteria"
  user_journeys: "## User Journeys"
  scope: "## Scope"
  functional_requirements: "## Functional Requirements"
  non_functional_requirements: "## Non-Functional Requirements"
  open_questions: "## Open Questions"
  risk_mitigation: "## Risk Mitigation"
next_section: "Done — ready for UX phase"
---

# PRD: temp-login-page

## Progress

- [x] Executive Summary
- [x] Project Classification
- [x] Success Criteria
- [x] User Journeys
- [x] Scope & Phasing
- [x] Functional Requirements
- [x] Non-Functional Requirements
- [x] Open Questions
- [x] Risk Mitigation

## Executive Summary

A temporary, charming "under construction" landing-and-login page for **cartercripe.com** that keeps the in-development portfolio/workstation private while it's being built — without making the site feel dead or unwelcoming. The page introduces Carter, explains the site is under development, points employers to a resume and friends/colleagues to a contact channel, and gates the not-yet-public pages behind a single shared credential that is enforced server-side.

### What Makes This Special

- **Personality over a wall** — Instead of a sterile "403 Forbidden," visitors get a witty, branded, construction-themed welcome that makes a good first impression on employers and friends alike.
- **Genuinely private, not security theater** — The gate is enforced server-side, so private pages are actually protected, not just visually hidden.
- **Public-friendly by design** — The login page, resume PDF, and contact path stay open to everyone, so the site still does useful work (recruiting, networking) while the rest is locked.
- **Built to graduate** — The gating mechanism is structured so the "temporary" gate can be relaxed page-by-page as parts of the site become public, and upgraded to per-person accounts later without a rewrite.

## Project Classification

**Technical Type:** Personal web front-end with a lightweight server-side auth gate.
**Domain:** Personal brand / portfolio (productivity-adjacent "online workstation" long-term).
**Complexity:** Medium — the UI is simple but design-forward; the real complexity is server-side gating with a public-route allowlist, plus a deferred animation layer.
**Project Context:** Greenfield. The repo currently contains only a Python stub (`main.py`); no web stack, framework, or pages exist yet. Stack selection is the first major tech-design decision.

---

## Success Criteria

### User Success

A user achieves success when they can:

1. **Understand the situation in seconds** — A first-time visitor immediately grasps that the site is under development and who Carter is, without instruction.
2. **Self-route by intent** — An employer finds the resume, a friend/colleague finds the contact path, and anyone curious reads the playful Hogwarts line — all without logging in.
3. **Get in if authorized** — Someone with the shared credential logs in and reaches the previously-private pages; someone without it cannot.

### Technical Success

The system is successful when:

1. **Private routes are unreachable without a valid session** — Direct-URL access to a gated page by an unauthenticated visitor is denied server-side (not merely hidden client-side).
2. **Public allowlist works** — The login page, resume PDF, and contact action are reachable by anyone, while everything not on the allowlist is gated by default.
3. **Sessions persist sensibly** — A logged-in user stays logged in across navigation and reasonable time without re-entering the credential on every page.

### Measurable Outcomes

- Unauthenticated request to any non-allowlisted route returns an auth challenge/redirect (verifiable with `curl`, no browser/JS).
- Time-to-first-meaningful-paint of the landing page is fast on a cold load (target: < 2s on a typical connection; static-first design supports this).
- Zero secrets (the shared password) present in client-shipped source or network responses.

---

## User Journeys

### Journey 1: Dana the Recruiter — "Is this person worth a call?"

Dana is a technical recruiter who got Carter's link from an application or referral. She opens cartercripe.com expecting a portfolio and instead lands on a clean, white, construction-themed page that says the site is under development. Rather than bouncing, she's charmed by the tone, notices the line addressed to potential employers, and clicks through to a hosted resume PDF. She forms a positive impression of Carter's attention to craft and saves the contact for later — all without ever needing a login.

**Requirements Revealed:** public landing page, clear "under development" messaging, employer-targeted copy, public resume PDF link, strong first-impression visual design.

### Journey 2: Sam the Friend/Colleague — "What's Carter building?"

Sam is a friend or former teammate who heard Carter is building something. Sam visits, enjoys the construction gag, reads the message addressed to friends/teammates/colleagues, and taps the contact link, which opens an email to Carter. If Sam has been given the shared credential, Sam can also log in to peek at the in-progress pages. Sam leaves either having reached out, having seen the work-in-progress, or both.

**Requirements Revealed:** friend/colleague-targeted copy, public contact (mailto) action, login affordance, authenticated access to private pages.

### Journey 3: Carter the Owner — "Keep it private, but make it mine."

Carter is actively developing the site and needs the unfinished pages hidden from stray viewers while still being able to share specific things (resume, contact) and selectively grant access. Carter wants to flip a page from "gated" to "public" as it's finished, and eventually move from one shared password to real per-person accounts — without re-architecting. Day to day, Carter logs in once and works on the site behind the gate.

**Requirements Revealed:** server-side gating, public-route allowlist that's easy to edit, single shared credential at MVP, extensibility toward per-person auth, owner login.

### Journey 4: Rhonda the Random Visitor — "Wrong turn."

Rhonda found the domain by accident or curiosity. She sees the page, gets the joke, has no credential, and cannot reach anything private. She either reads the resume/contact links or leaves. Crucially, even if she guesses or pastes a deep URL to a private page, she's denied.

**Requirements Revealed:** default-deny gating, direct-URL protection, graceful denial, no information leakage about private pages.

### Journey Requirements Summary

| User Type | Key Requirements |
|-----------|-----------------|
| **Recruiter (Dana)** | Public landing, under-dev messaging, employer copy, public resume PDF, strong visual |
| **Friend/Colleague (Sam)** | Friend copy, public contact mailto, login affordance, authenticated private access |
| **Owner (Carter)** | Server-side gating, editable allowlist, shared credential, extensibility, owner login |
| **Random (Rhonda)** | Default-deny, direct-URL protection, graceful denial, no private-page leakage |

---

## Scope

### MVP — Minimum Viable Product (v1)

**Core Deliverables:**
- A single, responsive, **static-rendered** landing/login page on a white background with clean lines and a loose construction theme:
  - Large display-font heading: "Hi, my name is Carter Cripe".
  - Yellow/black hazard-tape banner carrying the "x" message.
  - Body copy with three audience lines: employer (→ resume PDF), friend/colleague (→ contact email), and the Hogwarts admissions joke.
  - A centered, simple login form (credential entry + submit).
  - A static illustrated construction motif (e.g., a crane and/or letters being positioned) — **no animation required in MVP**.
- **Server-side auth gate**: a single shared credential validated server-side; a signed/HTTP-only session on success.
- **Public-route allowlist**: login page, resume PDF, and contact action are public; all other routes default-deny for unauthenticated users, enforced server-side (including direct-URL access).
- At least one trivial **placeholder "private" page** to prove the gate works end-to-end.
- **Deployment** to a host serving cartercripe.com over HTTPS.

**Quality Gates:**
- Unauthenticated `curl` to a private route is denied (no reliance on client JS).
- Shared password never appears in client-shipped assets or responses.
- Page renders correctly on mobile and desktop.
- Resume PDF and contact mailto work without login.

### Growth Features (Post-MVP)

**v2: Motion & Polish**
- Animate the construction scene: crane actively hoisting letters into place, letters dangling mid-lift, subtle ambient motion.
- Reduced-motion fallback for accessibility.

**v3: Access Management**
- Move from one shared password to **per-person accounts** (e.g., Supabase Auth), so employers vs. friends can get different access.
- Per-page / per-feature allowlisting UI so Carter can flip pages public as they're finished.

### Vision (Future)

- The gate dissolves into the real cartercripe.com portfolio / "online workstation," retaining only selective privacy for in-progress areas.

---

## Functional Requirements

### 1. Landing & Content

**FR-1.1:** The site MUST serve a public landing page at the site root presenting Carter's introduction, the under-development notice, audience-specific copy, and the login form.
- Heading text: "Hi, my name is Carter Cripe" rendered in a large display font.
- Hazard-tape element contains the "currently under development and not accessible to the public" message.

**FR-1.2:** The landing page MUST include a public link to Carter's resume — a PDF committed to the repo and served as a static public asset (e.g., `/resume.pdf`) — within the employer-directed copy.

**FR-1.3:** The landing page MUST include a public contact action (mailto: carter.cripe@gmail.com) within the friend/colleague-directed copy.

**FR-1.4:** The landing page MUST include the Hogwarts admissions joke line as static copy.

**FR-1.5:** The landing page MUST be responsive (mobile + desktop) on a white background with clean lines and a construction theme.

### 2. Authentication & Session

**FR-2.1:** The system MUST present a login form accepting a shared credential and validate it **server-side**.
- The credential value MUST be stored server-side (env/secret), never shipped to the client.

**FR-2.2:** On successful login, the system MUST establish a session via an HTTP-only (and Secure, over HTTPS) cookie.

**FR-2.3:** On failed login, the system MUST reject access and show a non-revealing error, without leaking whether private pages exist or their URLs.

**FR-2.4:** The session MUST persist across navigation. A persistent "remember me" cookie (~30 days) is preferred if straightforward; a session-only cookie (re-login each visit) is an acceptable fallback. Explicit logout is nice-to-have, not MVP-blocking.

### 3. Gating & Authorization

**FR-3.1:** All routes MUST default to **gated** for unauthenticated users, except those on an explicit public allowlist.

**FR-3.2:** The public allowlist MUST include, at minimum: the landing/login page, the resume PDF, and the contact action.

**FR-3.3:** Gating MUST be enforced server-side such that a direct request (e.g., `curl`, pasted URL) to a non-allowlisted route by an unauthenticated client is denied — not merely visually hidden.

**FR-3.4:** The allowlist MUST be editable in one obvious place so Carter can promote pages from gated to public as they're finished.

**FR-3.5:** There MUST be at least one placeholder private page to demonstrate end-to-end gating.

---

## Non-Functional Requirements

- **Performance:** Static-first landing page; cold-load first meaningful paint target < 2s on a typical connection. Minimal client JS for MVP (login form submission + optional progressive enhancement).
- **Reliability:** Auth failures fail closed (deny access on error). No private content rendered before the session check resolves.
- **Security:** Shared secret server-side only; HTTP-only + Secure session cookie; HTTPS enforced; default-deny routing; no enumeration/leak of private routes; resistance to trivially bypassing the gate by disabling JS or reading source. CSRF considerations for the login POST.
- **Maintainability:** Public allowlist and credential configured in obvious, documented locations. Architecture chosen so the v3 upgrade to per-person accounts (e.g., Supabase) does not require re-platforming the gate.

---

## Open Questions

_All resolved during Clarify review (2026-06-21):_

- **Stack & host:** ✅ **Next.js on Vercel.** Server-side gating via middleware; clean upgrade path to Supabase later.
- **Session duration / logout:** ✅ **Persistent "remember me" if easy** (e.g., ~30-day cookie); acceptable fallback is session-only (login each visit). Logout is nice-to-have, not MVP-blocking. (See FR-2.4.)
- **Resume PDF source:** ✅ **Committed to the repo** (served as a static public asset) — simplest. May swap to an external link later without breaking the allowlist. (See FR-1.2.)
- **Domain/DNS readiness:** ✅ **cartercripe.com is already on Vercel**, currently serving a blank text placeholder page that this initiative will replace. No new DNS needed — we redeploy this project to that domain. The **final task is an interactive setup walkthrough** (Vercel project, env secret, custom-domain swap, Supabase if used).
- **New users:** ✅ Per-person accounts remain **v3**. At MVP a single shared password is used; adding a "new user" later means creating an account in the v3 system.
- **Display font choice:** ✅ **Druk-aatie Burti** ([fontlibrary.org/en/font/drukaatieburti](https://fontlibrary.org/en/font/drukaatieburti)) for decorative/display text — self-hosted from the downloaded files (install steps documented in UX/Tasks). **Inter** for all body/non-decorative text. (See UX spec for font setup + asset list.)

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Client-side-only "gate" leaks private content (security theater) | Med | High | Mandate server-side enforcement (FR-3.3); verify with no-JS `curl` test in quality gates. |
| Animated crane scene balloons scope and delays launch | Med | Med | Tier it: static scene in MVP, animation explicitly Post-MVP (v2). |
| Greenfield stack choice churns / over-engineering | Med | Med | Resolve stack in Tech Design with a bias toward the simplest option that enforces server-side gating and leaves a clean path to Supabase. |
| Secret leakage (password in client bundle/env exposed) | Low | High | Server-side secret only; review build output; HTTP-only cookie; no secret in any client asset. |
| Domain/HTTPS/deploy friction blocks "ship it" | Med | Med | Treat deploy + DNS as an explicit task; pick a host with easy custom-domain + auto-HTTPS. |
| Cute copy/joke ages poorly or reads wrong to an employer | Low | Low | Keep copy editable in one place; Carter reviews final tone in UX. |
