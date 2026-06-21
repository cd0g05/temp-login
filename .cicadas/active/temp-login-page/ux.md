
---
summary: "Single-screen, white, construction-themed landing+login for cartercripe.com. Sticky hazard-tape banner carries the 'under development' notice; a large Druk-aatie Burti display heading reads CARTER CRI_E with a tower crane lifting the real 'P' up out of its slot — cable attached to the top of the P, P tilted right as if dangling under gravity (static in MVP, animated in v2); a hazard-yellow-accented sidebar holds employer/friend/Hogwarts copy with public resume + mailto links; a centered login card with a 'keep me logged in' option gates the rest. Inter for body, Druk-aatie Burti self-hosted for display. WCAG 2.1 AA, reduced-motion respected. Mock-up: mockups/landing-login.html."
phase: "ux"
when_to_load:
  - "When designing or reviewing journeys, flows, states, copy, and interaction constraints."
  - "When implementation questions depend on experience details rather than product goals alone."
depends_on:
  - "prd.md"
modules:
  - "Landing/login page (single screen)"
  - "Hazard-tape + crane construction theme"
  - "Login form + gated-redirect flow"
index:
  design_goals: "## Design Goals & Constraints"
  journeys: "## User Journeys & Touchpoints"
  information_architecture: "## Information Architecture"
  key_flows: "## Key User Flows"
  ui_states: "## UI States"
  copy_tone: "## Copy & Tone"
  visual_design: "## Visual Design Direction"
  mockups: "## HTML/CSS Mock-Ups"
  consistency: "## UX Consistency Patterns"
  accessibility: "## Responsive & Accessibility"
next_section: "Done — ready for Tech Design"
---

# UX Design: temp-login-page

## Progress

- [x] Design Goals & Constraints
- [x] User Journeys & Touchpoints
- [x] Information Architecture
- [x] Key User Flows
- [x] UI States
- [x] Copy & Tone
- [x] Visual Design Direction
- [x] HTML/CSS Mock-Ups
- [x] UX Consistency Patterns
- [x] Responsive & Accessibility

---

## Design Goals & Constraints

**Primary goal:** A visitor should feel *welcomed and amused*, not *blocked*. The emotional arc is "Oh — this person has taste and a sense of humor," even though they've technically hit a wall. The construction theme reframes "you can't come in" as "we're building something."

**Design constraints:**
- **Platform:** Responsive web (mobile + desktop), **single viewport — no scrolling**. The whole experience fits one screen: the login card is the centered focal point, the name + crane sit above it, and the three audience lines flank/sit below it. No app, no multi-page nav for MVP. (Safety net: viewports too short to fit gracefully fall back to scroll rather than clipping — see Responsive.)
- **Design system:** None exists — establish a tiny one here (colors, two fonts, button, form, hazard-tape pattern).
- **Visual rules from the brief:** white background, clean lines, loosely construction-themed. Yellow/black hazard tape for the "under development" notice. **The crane lifts a real letter of the name:** the heading reads `CARTER CRI_E` with the **P** hoisted up out of its slot — cable attached to the top of the P, the P tilted slightly right so it reads as dangling under gravity. *Static for MVP; the hoist animation is deferred to v2.*
- **Technical:** Server-side gating (set in PRD) means the login posts to the server; the page must work and render meaningfully even before/without client JS hydration.

---

## User Journeys & Touchpoints

### Dana the Recruiter — "Is this person worth a call?"
**Entry point:** Direct link from an application/referral.
**First touchpoint:** Hazard-tape banner + big "Hi, my name is Carter Cripe" heading.
**Key moment:** Spots the "potential employer → my resume" line and clicks straight through to the PDF — no login wall.
**Exit state:** Has the resume open and a positive impression of Carter's craft.
**Pain points to design around:** Must not feel like she hit a dead end; the resume link has to be obvious and unblocked.

### Sam the Friend/Colleague — "What's Carter building?"
**Entry point:** Heard about it; types the domain or follows a shared link.
**First touchpoint:** The crane scene + the playful copy.
**Key moment:** Either taps "contact me" (mailto) or, if given the password, logs in to peek at the WIP.
**Exit state:** Reached out and/or got inside.
**Pain points to design around:** The login shouldn't feel mandatory — contact and resume are clearly usable without it.

### Carter the Owner — "Keep it private, but make it mine."
**Entry point:** Direct, repeatedly, during development.
**First touchpoint:** Same page; logs in once.
**Key moment:** "Keep me logged in" means he isn't re-entering the password every dev session.
**Exit state:** Inside the gated site, working.
**Pain points to design around:** Re-auth friction; he's the most frequent visitor.

### Rhonda the Random Visitor — "Wrong turn."
**Entry point:** Accident / curiosity / pasted deep link.
**First touchpoint:** The banner; or a denied private URL that redirects here.
**Key moment:** Gets the joke, has no password, can't get into anything private.
**Exit state:** Reads resume/contact or leaves — but never sees gated content.
**Pain points to design around:** A denied deep link should land softly on this page, not a scary error.

---

## Information Architecture

### Site/App Map

```
cartercripe.com (during development)
│
├── /                     ← PUBLIC: landing + login (this screen)
├── /resume.pdf           ← PUBLIC: static resume asset
├── mailto:               ← PUBLIC: contact action (not a route)
│
└── /* (everything else)  ← GATED: requires valid session
    └── /preview          ← placeholder private page (proves the gate)
```

### Navigation Model
**Primary nav:** None — it's a single landing screen. The only "navigation" is: click resume, click contact, or log in.
**Secondary nav:** None for MVP.
**Key entry points:** `/` (direct), or any gated URL which redirects unauthenticated visitors to `/`.

---

## Key User Flows

### Flow 1: Log in and enter (Happy Path)
1. Visitor lands on `/`, sees banner + hero + login card.
2. Enters the shared password, optionally leaves "Keep me logged in" checked.
3. Submits → server validates against the server-side secret.
4. On success: server sets the session cookie and redirects to the previously-requested gated page (or `/preview` by default).
**Alternate path A:** Wrong password → inline error on the card, field stays focused, no redirect, no info about what's behind the gate.
**Alternate path B:** "Keep me logged in" unchecked → session-only cookie (expires on browser close) instead of the ~30-day cookie.

### Flow 2: Use the public links (no login)
1. Visitor reads the audience copy.
2. Clicks **my resume** → `/resume.pdf` opens (new tab).
3. Or clicks **contact me** → mail client opens to carter.cripe@gmail.com.
**Outcome:** Value delivered without ever touching the gate.

### Flow 3: Blocked deep link (Rhonda)
1. Unauthenticated visitor requests a gated URL (e.g., `/preview`).
2. Server middleware sees no valid session → redirects to `/` (optionally with a soft "Please log in to view that" note).
3. Visitor sees the friendly landing page, not a 403.
**Outcome:** Default-deny enforced server-side, communicated gently.

---

## UI States

### Landing page (whole screen)
| State | Trigger | What the User Sees |
|-------|---------|-------------------|
| **Default** | First visit, unauthenticated | Banner + hero + crane + audience copy + login card |
| **Redirected-from-gate** | Bounced off a private URL | Same page + soft note: "Please log in to view that page." |
| **Already authenticated** | Valid session visits `/` | (Optional) auto-forward to gated home, or show a "You're in — enter the site" button instead of the password field |

### Login card
| State | Trigger | What the User Sees |
|-------|---------|-------------------|
| **Idle** | Page load | Password field, "Keep me logged in" checked, "Enter the site" button |
| **Submitting** | Submit pressed | Button shows a brief loading/disabled state |
| **Error** | Wrong password | Inline red message: "That password didn't work. Try again." Field stays populated/focused |
| **Success** | Correct password | Redirect to gated destination (no lingering success screen needed) |

### Public links
| State | Trigger | What the User Sees |
|-------|---------|-------------------|
| **Resume present** | `/resume.pdf` exists | Working link, opens PDF |
| **Resume missing** | PDF not yet added | Link should be hidden or point to a "coming soon" — avoid a 404 (see Open item for Tech) |

---

## Copy & Tone

**Voice:** Warm, witty, self-aware. Confident but not arrogant. A craftsperson who's enjoying the build.

**Key principles:**
- Lean into the construction metaphor, but don't overdo the puns (one or two, tops).
- Never make the visitor feel unwelcome for not having the password.
- Keep the employer line professional even amid the jokes.

**Critical copy samples:**

| Context | Copy |
|---------|------|
| Banner | `⚠ This website is currently under development and not accessible to the public ⚠` |
| Hero eyebrow | `Hi, my name is` |
| Hero heading | `Carter Cripe` |
| Hero lead | `Welcome to the construction site. The real cartercripe.com is still being built — pardon the dust.` |
| Employer line | `If you are a potential employer, please avail yourself to my resume.` |
| Friend line | `If you are a friend / teammate / colleague, please feel free to contact me.` |
| Hogwarts line | `If you are here on behalf of Hogwarts School of Witchcraft and Wizardry, I humbly accept your admissions offer.` |
| Login heading | `Site Access` |
| Login subtext | `Got the password? Step past the tape.` |
| Primary CTA | `Enter the site` |
| Login error | `That password didn't work. Try again.` |
| Redirect note | `Please log in to view that page.` |
| Footer | `© 2026 Carter Cripe · built in public, one beam at a time` |

---

## Visual Design Direction

**Style:** Clean, editorial, lots of white space, with bold condensed display type and a single hazard-yellow accent. "Construction site by way of a design studio," not a literal clip-art building site.

**Color palette:**
- Background: `#ffffff` (white, per brief)
- Ink (text): `#16181d`
- Soft ink (secondary): `#555b66`
- Hairlines/borders: `#e6e8ec`
- **Hazard yellow (the one accent):** `#f5c518`
- Hazard black (tape stripes): `#16181d`

**Typography:**
- **Display / decorative — Druk-aatie Burti** (from [fontlibrary.org/en/font/drukaatieburti](https://fontlibrary.org/en/font/drukaatieburti)), self-hosted. Used for the hero heading and section/login headings. Condensed, bold, uppercase.
- **Body / UI — Inter.** Everything else (lead, audience copy, form, footer).
- Hierarchy: hero heading `clamp(2.8rem → 5.4rem)`; headings ~1.1–1.2rem uppercase; body ~1rem.

**Spacing & density:** Spacious. Single centered column max-width ~1080px. Generous vertical rhythm.

**Mood reference:** "A construction permit taped to a gallery wall." Hazard tape + crane signal the theme; the white space and type keep it tasteful.

### Font installation (Druk-aatie Burti) — answer to "how do I install it"

> The site **self-hosts** the font; nothing for the visitor to install. Steps for the build:
1. On [fontlibrary.org/en/font/drukaatieburti](https://fontlibrary.org/en/font/drukaatieburti), click **Download** → you get a `.zip` of the font (OTF/TTF files).
2. Unzip; copy the font file(s) into the repo at `public/fonts/` (e.g., `public/fonts/DrukaatieBurti.otf`). _(In Next.js, files under `public/` are served as static assets.)_
3. Optionally convert OTF/TTF → `.woff2` for smaller files (tools: [transfonter.org](https://transfonter.org) or `fonttools`); keep the original as a fallback.
4. Register it in CSS via `@font-face` (or `next/font/local`), e.g.:
   ```css
   @font-face {
     font-family: 'Druk-aatie Burti';
     src: url('/fonts/DrukaatieBurti.woff2') format('woff2'),
          url('/fonts/DrukaatieBurti.otf') format('opentype');
     font-weight: 700;
     font-display: swap;
   }
   ```
5. Set `--display-font: 'Druk-aatie Burti', 'Oswald', 'Arial Narrow', sans-serif;` (Oswald is the mock-up's stand-in and a fine fallback).
6. **Check the license** in the downloaded zip (SIL OFL is typical on Font Library and permits self-hosting — just confirm before shipping).

Inter can be loaded with `next/font/google` (zero-config, self-hosted by Next) — no manual download needed.

### Asset shopping list — answer to "what assets should I get"

**MVP (static):** none strictly required to *buy* — the mock-up draws the crane as inline SVG (clean line-art, matches the "clean lines" brief, scales perfectly, themeable). Recommended MVP assets:
- `public/resume.pdf` — **your actual resume** (the one real content asset MVP needs).
- `favicon` / site icon — a tiny hard-hat or traffic-cone icon ([favicon.io](https://favicon.io) or an emoji-based favicon works).
- (Optional) `public/fonts/DrukaatieBurti.*` — the downloaded display font.

**Optional polish (still static):** if you'd rather have richer art than inline SVG —
- A crane / construction-vehicle **SVG illustration** (vector so it stays crisp; sources: [unDraw](https://undraw.co), [Storyset](https://storyset.com), or [SVGRepo](https://www.svgrepo.com) — search "crane", "construction"). Prefer SVG over PNG for clean lines + theming.
- A subtle hazard-stripe or paper texture if you want more grit (keep it faint to honor "white background, clean lines").

**v2 (animation) assets:** when we animate, the crane is best as a **layered SVG** (separate `<g>` groups for tower / jib / cable / hook / letter) so the hook + letter can be animated independently. We can author this in code — no purchased asset needed. A Lottie file is an alternative if you want pre-made motion.

> Recommendation: **ship MVP with the inline-SVG crane** (already in the mock-up) and just supply `resume.pdf` + a favicon. Treat richer illustrations as optional.

---

## HTML/CSS Mock-Ups

### Mock-Up 1: Landing + Login (single screen)
**Artifact path:** `.cicadas/drafts/temp-login-page/mockups/landing-login.html`
**Viewport target:** Single viewport, no scroll. Vertical flex layout: sticky hazard banner → centered stack (name+crane on top, login card in the middle, audience lines below) → pinned footer. Sizes use `clamp()`/`vh` so it fits common screens; `@media (max-height: 620px)` releases to scroll as a safety net.
**Purpose:** Makes concrete the hazard-tape banner; the display-font hero reading `CARTER CRI_E` with a tower crane lifting the real **P** out of its slot (cable to the top of the P, P tilted right under gravity); the hazard-yellow-accented audience sidebar with public resume/contact links; and the centered login card with "Keep me logged in" + inline error.
**Notes:**
- The lifted **P** and the crane are em-based and anchored to a `.lift-slot` inside the `<h1>`, so they track the heading at every breakpoint. The slot reserves the P's width, producing the `CRI_E` gap. Exact offsets (`--crane bottom`, `.lifted-p bottom/rotation`) are tuned in code against the real display font.
- Display font is stood in with **Oswald** (Druk-aatie Burti not loaded in the draft); swap `--display-font` once installed. The P glyph metrics differ between Oswald and Druk-aatie Burti, so the lift offsets will need a small re-tune at build.
- Inter and Oswald load from Google Fonts **for preview only**; real build self-hosts.
- Crane + P are **static** here; for v2 the cable/hook/P are already isolated so the hoist (P easing up + gentle sway) is a small step.
- Open it directly in a browser to review (`open .cicadas/drafts/temp-login-page/mockups/landing-login.html`).

---

## UX Consistency Patterns

### Button Hierarchy
- **Primary action:** Solid dark (`--ink`) filled button, full-width in the card — "Enter the site". One per screen.
- **Secondary action:** Text links with a hazard-yellow underline (resume, contact).
- **Destructive action:** None in MVP.

### Feedback Patterns
- **Error:** Inline, directly inside the login card above the field. Red text, calm wording.
- **Success:** No toast — success = redirect into the site.
- **Info:** The "Please log in to view that page" redirect note appears inline near the card.

### Form Patterns
- **Validation timing:** On submit (server-validated).
- **Error placement:** Inside the card, above the password field.
- **Required fields:** Single field; no asterisk needed.

### Navigation Patterns
- **Active state:** N/A (single screen).
- **Back navigation:** Browser back; gated pages bounce to `/`.

### Modal & Overlay Patterns
- None in MVP.

---

## Responsive & Accessibility

**Layout model:** Full-height (`100vh`) flex column, `overflow: hidden` — **single viewport, no scroll**. The name+crane, centered login card, and audience lines are vertically centered as one group; the footer is pinned to the bottom.

**Breakpoints:**

| Breakpoint | Condition | Layout |
|-----------|-------|--------|
| Mobile | width < 720px | Name/crane scale down (em-based); audience lines stack full-width; tighter vertical rhythm |
| Desktop | width ≥ 720px | Name/crane on top, login centered, audience as a 3-up row beneath |
| Short screen (safety) | height < 620px | Releases `overflow` to scroll + `height: auto` so content is never clipped on small laptops/landscape phones |

**Accessibility standards:** WCAG 2.1 AA.

**Key requirements:**
- **Keyboard navigation:** Full — links, password field, checkbox, and button all tabbable in logical order.
- **Screen reader support:** Required. Crane SVG is decorative → `aria-hidden="true"`. Banner text is real text (not an image) so it's announced. Login field has an associated label/placeholder + visible label in the real build.
- **Color contrast:** AA minimum. Note: hazard-yellow `#f5c518` is an *accent/background*, not used for body text on white (insufficient contrast); black-on-yellow in the tape passes.
- **Touch targets:** ≥ 44×44px for the button, links, and checkbox on mobile.
- **Reduced motion:** v2 animation MUST respect `prefers-reduced-motion: reduce` and fall back to the static scene.
