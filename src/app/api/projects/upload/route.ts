import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

const GITHUB_OWNER = "reckonfx";
const GITHUB_REPO  = "portfolio";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

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

  let sha: string | undefined;
  const getRes = await fetch(apiUrl, { headers });
  if (getRes.ok) {
    const getJson = await getRes.json() as { sha?: string };
    sha = getJson.sha;
  }

  const body: Record<string, string> = {
    message: "chore: add project media [admin]",
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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!projectId) return NextResponse.json({ error: "No projectId provided" }, { status: 400 });

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Only images (JPG, PNG, WebP, GIF) or videos (MP4, WebM, OGG, MOV) allowed" }, { status: 400 });
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json({ error: `File too large (max ${isVideo ? "100MB" : "10MB"})` }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? (isVideo ? "mp4" : "jpg");
  const safeId = String(projectId).replace(/[^a-z0-9_-]/gi, "_");
  const filename = `${safeId}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "projects");
  const buffer = Buffer.from(await file.arrayBuffer());

  // Try local save first (works in dev), fall back to GitHub (for Vercel)
  try {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ path: `/projects/${filename}`, type: isVideo ? "video" : "image" });
  } catch {
    try {
      const githubPath = await saveToGitHub(filename, buffer);
      return NextResponse.json({ path: githubPath, type: isVideo ? "video" : "image" });
    } catch (err) {
      return NextResponse.json({ error: `Failed to save file: ${(err as Error).message}` }, { status: 500 });
    }
  }
}
