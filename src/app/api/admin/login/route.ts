import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const PASSWORD = (process.env.ADMIN_PASSWORD ?? "admin123").trim();

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: NextRequest) {
  let password = "";

  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const body = (await req.json()) as { password?: string };
    password = body.password ?? "";
  } else {
    const form = await req.formData();
    password = (form.get("password") as string) ?? "";
  }

  const origin = req.nextUrl.origin;

  if (!password || password !== PASSWORD) {
    return NextResponse.redirect(new URL("/admin/login?error=1", origin), { status: 303 });
  }

  const res = NextResponse.redirect(new URL("/admin", origin), { status: 303 });
  res.cookies.set(SESSION_COOKIE, hash(PASSWORD), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
