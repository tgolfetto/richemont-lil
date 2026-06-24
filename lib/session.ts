import type { SessionUser } from "@/lib/types";
import { cookies } from "next/headers";

export const sessionCookieName = "rlr_session";

function encodeSession(user: SessionUser) {
  return encodeURIComponent(JSON.stringify(user));
}

function decodeSession(value: string | undefined) {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as SessionUser;
  } catch {
    return null;
  }
}

export function createSessionValue(user: SessionUser) {
  return encodeSession(user);
}

export function parseSessionValue(value: string | undefined) {
  return decodeSession(value);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(sessionCookieName)?.value);
}
