// ─────────────────────────────────────────────────────────────────────────────
// RESUME DOWNLOAD API ROUTE
// Place at: src/app/api/resume/route.ts  in your new Next.js project
//
// ADAPT: In the portfolio, readData() reads from a local JSON file.
//        In your CV builder, the user data comes from a POST request body.
//        Change GET to POST and read req.json() instead of readData().
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import {
  generateGulfCV,
  generateSaudiCV,
  generateEmiratiCV,
  generateEuropassCV,
  generateUSACV,
  generateCanadaCV,
} from "@/lib/cv-generators";
import type { CVData } from "@/lib/types";

export const dynamic = "force-dynamic";

const generators: Record<string, (data: CVData) => Promise<Buffer>> = {
  gulf: generateGulfCV,
  saudi: generateSaudiCV,
  emirati: generateEmiratiCV,
  europass: generateEuropassCV,
  usa: generateUSACV,
  canada: generateCanadaCV,
};

// ADAPTED VERSION: Accepts user data as POST body + format query param
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") ?? "usa";
    const generate = generators[format] ?? generateUSACV;

    // In the CV builder, user submits their data as JSON:
    const data = await req.json() as CVData;

    const buffer = await generate(data);
    const name = data.personalInfo.name.replace(/\s+/g, "_");
    const filename = `${name}_${format.toUpperCase()}_CV.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/resume] PDF generation failed:", err);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}

// ─── ORIGINAL PORTFOLIO VERSION (for reference) ───────────────────────────────
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const format = searchParams.get("format") ?? "usa";
//   const generate = generators[format] ?? generateUSACV;
//   const data = readData();                   // reads from portfolio.json
//   const buffer = await generate(data);
//   ...
// }
