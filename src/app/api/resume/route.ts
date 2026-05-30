import { NextResponse } from "next/server";
import { readData } from "@/lib/cms";
import {
  generateGulfCV,
  generateSaudiCV,
  generateEmiratiCV,
  generateEuropassCV,
  generateUSACV,
  generateCanadaCV,
  generatePakIndiaCV,
  generateUKCV,
  generateANZCV,
  generateLebenslaufCV,
  generateAcademicCV,
} from "@/lib/cv-generators";

export const dynamic = "force-dynamic";

type DataType = Awaited<ReturnType<typeof readData>>;

const generators: Record<string, (data: DataType) => Promise<Buffer>> = {
  gulf: generateGulfCV,
  saudi: generateSaudiCV,
  emirati: generateEmiratiCV,
  europass: generateEuropassCV,
  usa: generateUSACV,
  canada: generateCanadaCV,
  pakIndia: generatePakIndiaCV,
  uk: generateUKCV,
  anz: generateANZCV,
  lebenslauf: (data: DataType) => generateLebenslaufCV(data, "en"),
  "lebenslauf-de": (data: DataType) => generateLebenslaufCV(data, "de"),
  academic: generateAcademicCV,
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") ?? "usa";
    const generate = generators[format] ?? generateUSACV;

    const data = readData();
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
