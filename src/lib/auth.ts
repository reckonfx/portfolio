import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function login(password: string): Promise<boolean> {
  if (password !== PASSWORD) return false;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, hash(PASSWORD), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return true;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token === hash(PASSWORD);
}
