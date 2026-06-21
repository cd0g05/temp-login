import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { timingSafeEqual } from "node:crypto";
import { sessionOptions, type SessionData } from "@/lib/session";

export const runtime = "nodejs";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** Constant-time string compare that doesn't early-return on length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) {
    // Keep timing roughly constant, then fail.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

export async function POST(req: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) {
    return NextResponse.json(
      { error: "Server not configured." },
      { status: 500 },
    );
  }

  let password = "";
  let remember = false;
  let from = "/preview";

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    password = String(body.password ?? "");
    remember = Boolean(body.remember);
    if (body.from) from = String(body.from);
  } else {
    const form = await req.formData();
    password = String(form.get("password") ?? "");
    remember = form.get("remember") != null;
    if (form.get("from")) from = String(form.get("from"));
  }

  // Only allow same-site relative redirect targets.
  if (!from.startsWith("/") || from.startsWith("//")) from = "/preview";

  if (!safeEqual(password, sitePassword)) {
    return NextResponse.json(
      { error: "That password didn't work. Try again." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true, redirect: from });
  const session = await getIronSession<SessionData>(req, res, {
    ...sessionOptions,
    ttl: remember ? THIRTY_DAYS : 0,
    cookieOptions: {
      ...sessionOptions.cookieOptions,
      // remember -> persistent ~30d cookie; otherwise a session cookie.
      maxAge: remember ? THIRTY_DAYS : undefined,
    },
  });
  session.authed = true;
  session.at = Date.now();
  await session.save();

  return res;
}
