import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

const GITHUB_OWNER = "reckonfx";
const GITHUB_REPO  = "portfolio";

async function saveToGitHub(filename: string, buffer: Buffer): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");

  const filePath = `public/projects/${filename}`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Check if file already exists (need SHA to update)
  let sha: string | undefined;
  const getRes = await fetch(apiUrl, { headers });
  if (getRes.ok) {
    const getJson = await getRes.json() as { sha?: string };
    sha = getJson.sha;
  }

  const body: Record<string, string> = {
    message: "chore: add project screenshot [admin]",
    content: buffer.toString("base64"),
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const err = await putRes.json() as { message?: string };
    throw new Error(err.message ?? `GitHub PUT ${putRes.status}`);
  }

  return `/projects/${filename}`;
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url, projectId } = await request.json() as { url?: string; projectId?: string | number };

  if (!url || !projectId) {
    return NextResponse.json({ error: "url and projectId are required" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "URL must be http or https" }, { status: 400 });
  }

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

  // Try local save first (works in dev), fall back to GitHub (for Vercel)
  try {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), imageBuffer);
    return NextResponse.json({ path: `/projects/${filename}` });
  } catch {
    try {
      const githubPath = await saveToGitHub(filename, imageBuffer);
      return NextResponse.json({ path: githubPath });
    } catch (err) {
      return NextResponse.json({ error: `Failed to save screenshot: ${(err as Error).message}` }, { status: 500 });
    }
  }
}
