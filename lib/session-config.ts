import type { SessionOptions } from "iron-session";

/**
 * Edge-safe session config. This module MUST NOT import `next/headers` (or any
 * other Node-only API), because it is imported by `middleware.ts`, which runs in
 * the Edge runtime. Keep `cookies()`-based helpers in `lib/session.ts`.
 */

export interface SessionData {
  authed?: boolean;
  at?: number;
}

export const THIRTY_DAYS = 60 * 60 * 24 * 30;

export const sessionOptions: SessionOptions = {
  // iron-session requires a secret of at least 32 characters.
  password: process.env.SESSION_SECRET as string,
  cookieName: "cc_site",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};
