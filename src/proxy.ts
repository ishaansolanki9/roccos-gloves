import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "rocco_admin_session";

type SessionPayload = {
  adminUserId: string;
  expiresAt: number;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie || !(await isValidSessionToken(sessionCookie))) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

async function isValidSessionToken(token: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = await signPayload(encodedPayload, secret);

  if (!timingSafeEqual(signature, expectedSignature)) {
    return false;
  }

  const payload = decodePayload(encodedPayload);

  if (!payload) {
    return false;
  }

  return Date.now() <= payload.expiresAt;
}

function decodePayload(encodedPayload: string): SessionPayload | null {
  try {
    const normalized = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(`${normalized}${padding}`);
    const payload = JSON.parse(json) as SessionPayload;

    if (!payload.adminUserId || typeof payload.expiresAt !== "number") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

async function signPayload(encodedPayload: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(encodedPayload));
  return base64UrlEncode(new Uint8Array(signatureBuffer));
}

function base64UrlEncode(buffer: Uint8Array) {
  let binary = "";

  for (const byte of buffer) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
