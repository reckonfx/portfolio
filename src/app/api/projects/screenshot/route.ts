import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url, projectId } = await request.json() as { url?: string; projectId?: string | number };

  if (!url || !projectId) {
    return NextResponse.json({ error: "url and projectId are required" }, { status: 400 });
  }

  // Validate URL
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "URL must be http or https" }, { status: 400 });
  }

  // thum.io expects the target URL appended directly (not percent-encoded)
  const thumbUrl = `https://image.thum.io/get/width/1200/crop/630/${url}`;

  let imageBuffer: Buffer;
  try {
    const res = await fetch(thumbUrl, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`thum.io responded ${res.status}`);
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) throw new Error("Response is not an image");
    imageBuffer = Buffer.from(await res.arrayBuffer());
  } catch (err) {
    return NextResponse.json({ error: `Screenshot failed: ${(err as Error).message}` }, { status: 502 });
  }

  const safeId = String(projectId).replace(/[^a-z0-9_-]/gi, "_");
  const filename = `${safeId}-screenshot-${Date.now()}.jpg`;
  const uploadDir = path.join(process.cwd(), "public", "projects");

  try {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), imageBuffer);
    return NextResponse.json({ path: `/projects/${filename}` });
  } catch {
    // Vercel read-only filesystem — return the thum.io URL directly
    return NextResponse.json({ path: thumbUrl });
  }
}
