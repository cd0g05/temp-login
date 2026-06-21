import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  authed?: boolean;
  at?: number;
}

/**
 * Single source of truth for the sealed-cookie session.
 * Secrets come from env only and are never imported into client components.
 */
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

/** Read the session in a Server Component / Route Handler context. */
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
