import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";

/**
 * Default-deny gate. Every route is private unless it is on PUBLIC_PATHS or is a
 * public static asset. Enforced server-side at the edge, so a non-allowlisted
 * route is unreachable without a valid session — even via curl with no JS.
 *
 * To make a page public, add its path here. Forgetting = safe (stays private).
 */
const PUBLIC_PATHS = new Set<string>([
  "/", // landing + login
  "/api/login",
  "/api/logout",
  "/resume.pdf",
]);

function isPublicAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/fonts/") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname === "/robots.txt" ||
    /\.(?:png|jpe?g|gif|svg|ico|webp|woff2?|ttf|pdf|txt)$/i.test(pathname)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname) || isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (session.authed) return res;
  } catch {
    // Fail closed: any session/crypto error is treated as unauthenticated.
  }

  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next's internal static/image assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
