# cartercripe.com — temporary login gate

A small Next.js app that puts a friendly, construction-themed **landing + login
page** in front of cartercripe.com while it's under development. The landing
page, the resume, and the contact link are public; everything else is gated
behind a single shared password, enforced **server-side**.

- **Framework:** Next.js (App Router, TypeScript)
- **Auth:** one shared password + an encrypted session cookie (`iron-session`) — no database
- **Gating:** default-deny `middleware.ts` with an explicit public allowlist
- **Hosting:** Vercel

---

## Local development

**Prerequisites:** Node 20+ and npm.

```bash
npm install
cp .env.example .env.local      # then edit .env.local (see below)
npm run dev                     # http://localhost:3000
```

Production build / preview:

```bash
npm run build
npm run start
```

### Environment variables

Set these in `.env.local` for local dev and in **Vercel → Project → Settings →
Environment Variables** for production. Never commit real values (`.env*.local`
is gitignored).

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_PASSWORD` | yes | The shared password visitors type to get past the gate. |
| `SESSION_SECRET` | yes | Secret used to encrypt the session cookie. **Must be ≥ 32 characters.** |

Generate a strong `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## How the gate works

`middleware.ts` denies every route by default. A route is public only if it is in
`PUBLIC_PATHS` or is a static asset. Current public surface:

- `/` — the landing + login page
- `/resume.pdf` — the resume
- `/api/login`, `/api/logout`
- static assets (`/_next/*`, `/fonts/*`, favicon, images, PDFs)

Everything else (e.g. `/preview`) requires a valid session; unauthenticated
requests are redirected to `/?from=<path>` and shown a soft "please log in" note.

**To make a new page public**, add its path to `PUBLIC_PATHS` in `middleware.ts`.
Forgetting to is safe — the page simply stays private.

**To change the password**, update `SITE_PASSWORD` (locally in `.env.local`, in
production in Vercel) and redeploy. Rotating `SESSION_SECRET` invalidates all
existing logins.

### Verify the gate

```bash
curl -i https://<host>/preview     # expect 307 redirect to /
curl -i https://<host>/            # expect 200
curl -i https://<host>/resume.pdf  # expect 200
```

---

## Deploying to Vercel (cartercripe.com)

> cartercripe.com is already a Vercel project serving a placeholder page. These
> steps replace that deployment with this app. Do the domain swap **last**,
> after a preview deploy looks right.

1. **Push to GitHub** (recommended for auto-deploys):
   ```bash
   git remote add origin git@github.com:<you>/<repo>.git
   git push -u origin main
   ```
2. **Import / link the project in Vercel** (`vercel` CLI or the dashboard → New
   Project → import the repo). Framework preset: **Next.js**.
3. **Set environment variables** in Vercel (Production + Preview):
   `SITE_PASSWORD` and `SESSION_SECRET`.
4. **Preview deploy** and check it:
   ```bash
   curl -i https://<preview-url>/preview    # 307 -> /
   curl -i https://<preview-url>/            # 200
   ```
   Also open it in a browser to confirm the font, crane/P alignment, and the
   single-viewport layout.
5. **Promote to production** and **re-point the domain**: in Vercel → the project
   → Settings → Domains, move `cartercripe.com` (and `www`) to this project.
   HTTPS is automatic.
6. **Verify production:** rerun the curl checks against `https://cartercripe.com`
   and confirm Druk-aatie Burti renders.

---

## Fonts & assets

- **Display font:** Druk-aatie Burti (SIL OFL), self-hosted from
  `public/fonts/DrukaatieBurti-0.14.1/` via `next/font/local` in `app/layout.tsx`.
- **Body font:** Inter via `next/font/google`.
- **Resume:** `public/resume.pdf` (served at `/resume.pdf`).
- **Crane:** inline SVG in `app/page.tsx` (the heading reads `CARTER CRI_E` with
  the real **P** hoisted by the crane). `public/Crane.svg` is unused.

---

## Roadmap

- **v2 — Motion:** animate the crane hoisting the P (the cable/hook/P are already
  isolated). Respect `prefers-reduced-motion`.
- **v3 — Per-person accounts:** replace the single shared password with real
  accounts via **Supabase Auth**, so different people (e.g. employers vs.
  friends) get different access. The session shape in `lib/session.ts` gains a
  `userId`/role; the middleware gate stays the same. No re-platforming required.

---

## Project structure

```
app/
  layout.tsx          # fonts + root layout
  page.tsx            # public landing/login (Server Component)
  login-form.tsx      # client login form (states + fetch /api/login)
  globals.css         # ported styles
  icon.svg            # hard-hat favicon
  preview/page.tsx    # gated placeholder page
  api/login/route.ts  # password check + session seal
  api/logout/route.ts # destroy session
lib/session.ts        # iron-session config (single source of truth)
middleware.ts         # default-deny gate + PUBLIC_PATHS allowlist
public/               # resume.pdf, fonts/, Crane.svg
```
