import "server-only";
import fs from "fs";
import path from "path";
import type { PortfolioData } from "./types";

const DATA_FILE = path.join(process.cwd(), "src/data/portfolio.json");

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
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}
