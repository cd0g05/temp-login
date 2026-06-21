import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type SessionData } from "./session-config";

// Re-export the Edge-safe config for convenience (Node-runtime callers).
export { sessionOptions, THIRTY_DAYS, type SessionData } from "./session-config";

/**
 * Read the session in a Server Component / Route Handler (Node runtime) context.
 * Uses `next/headers`, so it is NOT importable from Edge middleware — middleware
 * imports `lib/session-config` instead.
 */
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
