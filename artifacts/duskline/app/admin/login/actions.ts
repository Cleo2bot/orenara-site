"use server";

import { cookies, headers } from "next/headers";
import { createHash } from "crypto";
import { redirect } from "next/navigation";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, { count: number; lockedUntil: number }>();

function getClientIp(): string {
  const h = headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

function sessionToken(): string {
  const pwd = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.SESSION_SECRET ?? "";
  return createHash("sha256").update(`${pwd}:${secret}`).digest("hex");
}

export type LoginState = {
  error: string | null;
  locked: boolean;
  remainingMs: number;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip = getClientIp();
  const now = Date.now();

  const record = attempts.get(ip);
  if (record && now < record.lockedUntil) {
    return { error: null, locked: true, remainingMs: record.lockedUntil - now };
  }

  const password = formData.get("password")?.toString() ?? "";
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return {
      error: "ADMIN_PASSWORD environment variable is not set.",
      locked: false,
      remainingMs: 0,
    };
  }

  if (password !== expected) {
    const prev = record && now >= record.lockedUntil ? null : record;
    const count = (prev?.count ?? 0) + 1;
    const lockedUntil = count >= MAX_ATTEMPTS ? now + RATE_LIMIT_WINDOW_MS : 0;
    attempts.set(ip, { count, lockedUntil });

    if (count >= MAX_ATTEMPTS) {
      return { error: null, locked: true, remainingMs: RATE_LIMIT_WINDOW_MS };
    }

    const remaining = MAX_ATTEMPTS - count;
    return {
      error: `Incorrect password. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      locked: false,
      remainingMs: 0,
    };
  }

  attempts.delete(ip);

  const cookieStore = cookies();
  cookieStore.set("orn_admin", sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete("orn_admin");
  redirect("/admin/login");
}
// env-check: redeploy trigger
