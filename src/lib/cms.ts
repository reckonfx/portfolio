import "server-only";
import fs from "fs";
import path from "path";
import type { PortfolioData } from "./types";

const DATA_FILE = path.join(process.cwd(), "src/data/portfolio.json");
const GITHUB_OWNER = "reckonfx";
const GITHUB_REPO  = "portfolio";
const GITHUB_PATH  = "src/data/portfolio.json";

export function readData(): PortfolioData {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw) as PortfolioData;

  const projectsStat = data.personalInfo.stats.find(
    (s) => s.label === "Projects Delivered"
  );
  if (projectsStat) {
    projectsStat.value = data.projects.length;
  }

  return data;
}

export function writeData(data: PortfolioData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Vercel filesystem is read-only at runtime; GitHub sync handles persistence
  }
}

// Pushes portfolio.json to GitHub after every admin save.
// On Vercel: uses GITHUB_TOKEN + GitHub API (filesystem is ephemeral).
// In local dev: falls back to git CLI.
export async function syncToGitHub(data: PortfolioData): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const json  = JSON.stringify(data, null, 2);

  if (token) {
    try {
      const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      };

      // Fetch current SHA (required by GitHub API to update a file)
      const getRes  = await fetch(apiBase, { headers });
      const getJson = await getRes.json() as { sha?: string; message?: string };
      if (!getJson.sha) throw new Error(`GitHub GET failed: ${getJson.message}`);

      const putRes = await fetch(apiBase, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: "chore: update portfolio data [admin]",
          content: Buffer.from(json).toString("base64"),
          sha: getJson.sha,
        }),
      });

      if (!putRes.ok) {
        const err = await putRes.json() as { message?: string };
        throw new Error(err.message ?? `GitHub PUT ${putRes.status}`);
      }
    } catch (err) {
      console.error("[syncToGitHub] GitHub API error:", err);
    }
  } else {
    // Local dev — commit + push via git CLI
    try {
      const { execSync } = await import("child_process");
      execSync(
        'git add src/data/portfolio.json && git diff --cached --quiet || git commit -m "chore: update portfolio data [admin]" && git push origin master',
        { cwd: process.cwd(), stdio: "ignore" }
      );
    } catch (err) {
      console.error("[syncToGitHub] git CLI error:", err);
    }
  }
}
