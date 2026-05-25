import "server-only";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import type { PortfolioData } from "./types";

// ── constants ─────────────────────────────────────────────────────────────────
const A4_W = 595.28;
const A4_H = 841.89;

// ── helpers ───────────────────────────────────────────────────────────────────

function clean(str: string): string {
  return str
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[☀-⟿]/gu, "")
    .replace(/️/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cut(str: string, max: number): string {
  const s = clean(str);
  return s.length > max ? s.slice(0, max) + "..." : s;
}

function avatarPath(url: string): string | null {
  if (!url) return null;
  const p = path.join(process.cwd(), "public", url);
  return fs.existsSync(p) ? p : null;
}

function buildPDF(
  opts: PDFKit.PDFDocumentOptions,
  draw: (doc: PDFKit.PDFDocument) => void
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument(opts);
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    draw(doc);
    doc.end();
  });
}

// Tags drawn inline; returns new x after drawing
function inlineTag(
  doc: PDFKit.PDFDocument,
  label: string,
  x: number,
  y: number,
  bg: string,
  fg: string
): number {
  const pad = 5;
  doc.fontSize(7.5);
  const w = doc.widthOfString(label) + pad * 2;
  doc.roundedRect(x, y, w, 13, 2).fill(bg);
  doc.fillColor(fg).text(label, x + pad, y + 3, { lineBreak: false });
  doc.fillColor("#111827").fontSize(10);
  return w + 4;
}

function tagRow(
  doc: PDFKit.PDFDocument,
  items: string[],
  startX: number,
  maxW: number,
  bg: string,
  fg: string
) {
  let x = startX;
  let y = doc.y;
  for (const item of items) {
    doc.fontSize(7.5);
    const w = doc.widthOfString(item) + 14;
    if (x + w > startX + maxW) { x = startX; y += 17; }
    inlineTag(doc, item, x, y, bg, fg);
    x += w;
  }
  doc.fontSize(10).fillColor("#111827");
  doc.y = y + 19;
}

function checkPage(doc: PDFKit.PDFDocument, needed = 80, margin = 44) {
  if (doc.y + needed > A4_H - margin) doc.addPage();
}

// ─────────────────────────────────────────────────────────────────────────────
// GULF CV  (navy, photo top-right, personal details)
// ─────────────────────────────────────────────────────────────────────────────
export function generateGulfCV(data: PortfolioData): Promise<Buffer> {
  const M = 48;
  const CW = A4_W - M * 2;
  const ACCENT = "#0a3d6b";
  const LIGHT = "#e8f0f7";

  return buildPDF(
    { size: "A4", margins: { top: M, bottom: M, left: M, right: M }, info: { Title: `${data.personalInfo.name} — CV` } },
    (doc) => {
      const p = data.personalInfo;
      const photo = avatarPath(p.avatar);
      const photoW = 90, photoH = 110;

      // Header background stripe
      doc.rect(0, 0, A4_W, 155).fill(ACCENT);

      // Photo
      if (photo) {
        try { doc.image(photo, A4_W - M - photoW, 22, { width: photoW, height: photoH }); } catch {}
      }

      // Name + title
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(22)
        .text(clean(p.name), M, 30, { width: CW - (photo ? photoW + 14 : 0) });
      doc.font("Helvetica").fontSize(11).fillColor("#c8d8e8")
        .text(clean(p.title), M, doc.y + 2, { width: CW - (photo ? photoW + 14 : 0) });

      // Contact row
      const contacts = [p.email, p.phone, p.location].filter(Boolean);
      doc.fontSize(8.5).fillColor("#a0b8cc")
        .text(contacts.join("   |   "), M, doc.y + 6, { width: CW });

      doc.y = 165;

      // Section helper
      const section = (title: string) => {
        checkPage(doc, 70, M);
        doc.rect(M, doc.y, CW, 1).fill(ACCENT);
        doc.y += 3;
        doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(9.5)
          .text(title.toUpperCase(), M, doc.y, { characterSpacing: 1 });
        doc.y += 8;
        doc.fillColor("#111827").font("Helvetica").fontSize(10);
      };

      // Summary
      section("Professional Summary");
      doc.text(clean(p.bio), M, doc.y, { width: CW, lineGap: 2 }); doc.y += 12;

      // Experience
      const work = data.experiences.filter(e => e.type === "work" || e.type === "entrepreneurship");
      if (work.length) {
        section("Work Experience");
        for (const e of work) {
          checkPage(doc, 65, M);
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(e.title), M, doc.y, { width: CW - 90, continued: false });
          const ty = doc.y;
          doc.fontSize(9).fillColor("#6b7280")
            .text(e.period, M + CW - 88, ty - 13, { lineBreak: false });
          doc.fillColor(ACCENT).font("Helvetica").fontSize(9.5)
            .text(clean(e.company), M, doc.y);
          doc.y += 2;
          doc.fillColor("#111827").fontSize(9.5)
            .text(clean(e.description), M, doc.y, { width: CW, lineGap: 1.5 });
          if (e.tech.length) { doc.y += 4; tagRow(doc, e.tech.slice(0, 8), M, CW, LIGHT, ACCENT); }
          else doc.y += 10;
        }
      }

      // Projects
      const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
      if (proj.length) {
        section("Key Projects");
        for (const pr of proj) {
          checkPage(doc, 65, M);
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(pr.title), M, doc.y, { width: CW });
          doc.y += 2;
          doc.font("Helvetica").fontSize(9.5)
            .text(cut(pr.description, 230), M, doc.y, { width: CW, lineGap: 1.5 });
          if (pr.tech.length) { doc.y += 4; tagRow(doc, pr.tech.slice(0, 9), M, CW, LIGHT, ACCENT); }
          else doc.y += 10;
        }
      }

      // Skills
      const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))].slice(0, 28);
      section("Technical Skills");
      tagRow(doc, skills, M, CW, LIGHT, ACCENT);
      doc.y += 4;

      // Education
      const edu = data.experiences.filter(e => e.type === "education");
      if (edu.length) {
        section("Education");
        for (const e of edu) {
          checkPage(doc, 45, M);
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(e.title), M, doc.y, { width: CW - 90 });
          doc.fontSize(9).fillColor("#6b7280")
            .text(e.period, M + CW - 88, doc.y - 13, { lineBreak: false });
          doc.fillColor(ACCENT).font("Helvetica").fontSize(9.5)
            .text(clean(e.company), M, doc.y);
          doc.y += 2;
          doc.fillColor("#111827").fontSize(9.5)
            .text(clean(e.description), M, doc.y, { width: CW, lineGap: 1.5 });
          doc.y += 10;
        }
      }

      // Certifications
      if (data.certifications.length) {
        section("Certifications");
        for (const c of data.certifications) {
          checkPage(doc, 28, M);
          doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827")
            .text(clean(c.name), M, doc.y, { width: CW - 50 });
          doc.fontSize(9).fillColor("#6b7280")
            .text(String(c.year), M + CW - 48, doc.y - 12, { lineBreak: false });
          doc.font("Helvetica").fontSize(9).fillColor("#6b7280")
            .text(c.issuer, M, doc.y);
          doc.y += 8;
        }
      }
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SAUDI CV  (green, photo top-right, religion field)
// ─────────────────────────────────────────────────────────────────────────────
export function generateSaudiCV(data: PortfolioData): Promise<Buffer> {
  const M = 48;
  const CW = A4_W - M * 2;
  const ACCENT = "#006c35";
  const LIGHT = "#e6f4ee";

  return buildPDF(
    { size: "A4", margins: { top: M, bottom: M, left: M, right: M }, info: { Title: `${data.personalInfo.name} — CV` } },
    (doc) => {
      const p = data.personalInfo;
      const photo = avatarPath(p.avatar);
      const photoW = 90, photoH = 110;

      doc.rect(0, 0, A4_W, 165).fill(ACCENT);

      if (photo) {
        try { doc.image(photo, A4_W - M - photoW, 22, { width: photoW, height: photoH }); } catch {}
      }

      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(22)
        .text(clean(p.name), M, 30, { width: CW - (photo ? photoW + 14 : 0) });
      doc.font("Helvetica").fontSize(11).fillColor("#a8d5b8")
        .text(clean(p.title), M, doc.y + 2, { width: CW - (photo ? photoW + 14 : 0) });

      // Personal details grid
      const details = [
        `Email: ${p.email}`,
        `Phone: ${p.phone}`,
        `Location: ${p.location}`,
        "Nationality: [Add]",
        "Marital Status: [Add]",
        "Religion: Islam",
      ];
      doc.fontSize(8.5).fillColor("#a8d5b8");
      let dx = M, dy = doc.y + 6;
      for (let i = 0; i < details.length; i++) {
        if (i === 3) { dx = M; dy += 14; }
        doc.text(details[i], dx, dy, { lineBreak: false });
        dx += 160;
      }
      doc.y = dy + 20;

      const section = (title: string) => {
        checkPage(doc, 70, M);
        doc.moveTo(M, doc.y).lineTo(M + CW, doc.y).strokeColor(ACCENT).lineWidth(1).stroke();
        doc.y += 4;
        doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(9.5)
          .text(title.toUpperCase(), M, doc.y, { characterSpacing: 1 });
        doc.y += 8;
        doc.fillColor("#111827").font("Helvetica").fontSize(10);
      };

      section("Professional Summary");
      doc.text(clean(p.bio), M, doc.y, { width: CW, lineGap: 2 }); doc.y += 12;

      const work = data.experiences.filter(e => e.type === "work" || e.type === "entrepreneurship");
      if (work.length) {
        section("Work Experience");
        for (const e of work) {
          checkPage(doc, 65, M);
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(e.title), M, doc.y, { width: CW - 90 });
          doc.fontSize(9).fillColor("#6b7280")
            .text(e.period, M + CW - 88, doc.y - 13, { lineBreak: false });
          doc.fillColor(ACCENT).font("Helvetica").fontSize(9.5)
            .text(clean(e.company), M, doc.y); doc.y += 2;
          doc.fillColor("#111827").fontSize(9.5)
            .text(clean(e.description), M, doc.y, { width: CW, lineGap: 1.5 });
          if (e.tech.length) { doc.y += 4; tagRow(doc, e.tech.slice(0, 8), M, CW, LIGHT, ACCENT); }
          else doc.y += 10;
        }
      }

      const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
      if (proj.length) {
        section("Key Projects");
        for (const pr of proj) {
          checkPage(doc, 65, M);
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(pr.title), M, doc.y, { width: CW }); doc.y += 2;
          doc.font("Helvetica").fontSize(9.5)
            .text(cut(pr.description, 230), M, doc.y, { width: CW, lineGap: 1.5 });
          if (pr.tech.length) { doc.y += 4; tagRow(doc, pr.tech.slice(0, 9), M, CW, LIGHT, ACCENT); }
          else doc.y += 10;
        }
      }

      const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))].slice(0, 28);
      section("Technical Skills");
      tagRow(doc, skills, M, CW, LIGHT, ACCENT);
      doc.y += 4;

      const edu = data.experiences.filter(e => e.type === "education");
      if (edu.length) {
        section("Education");
        for (const e of edu) {
          checkPage(doc, 45, M);
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(e.title), M, doc.y, { width: CW - 90 });
          doc.fontSize(9).fillColor("#6b7280")
            .text(e.period, M + CW - 88, doc.y - 13, { lineBreak: false });
          doc.fillColor(ACCENT).font("Helvetica").fontSize(9.5)
            .text(clean(e.company), M, doc.y); doc.y += 2;
          doc.fillColor("#111827").fontSize(9.5)
            .text(clean(e.description), M, doc.y, { width: CW, lineGap: 1.5 });
          doc.y += 10;
        }
      }

      if (data.certifications.length) {
        section("Certifications");
        for (const c of data.certifications) {
          checkPage(doc, 28, M);
          doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827")
            .text(clean(c.name), M, doc.y, { width: CW - 50 });
          doc.fontSize(9).fillColor("#6b7280")
            .text(String(c.year), M + CW - 48, doc.y - 12, { lineBreak: false });
          doc.font("Helvetica").fontSize(9).fillColor("#6b7280")
            .text(c.issuer, M, doc.y); doc.y += 8;
        }
      }
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMIRATI CV  (dark sidebar + gold accents + UAE palette)
// ─────────────────────────────────────────────────────────────────────────────
export function generateEmiratiCV(data: PortfolioData): Promise<Buffer> {
  const SIDE_W = 170;
  const SIDE_PAD = 16;
  const MAIN_X = SIDE_W + 24;
  const MAIN_W = A4_W - MAIN_X - 36;
  const DARK = "#0d1117";
  const GOLD = "#c8a951";
  const RED = "#cf2028";

  return buildPDF(
    { size: "A4", margins: { top: 0, bottom: 0, left: 0, right: 0 }, info: { Title: `${data.personalInfo.name} — CV` } },
    (doc) => {
      const p = data.personalInfo;
      const photo = avatarPath(p.avatar);

      // Sidebar background
      doc.rect(0, 0, SIDE_W, A4_H).fill(DARK);

      // UAE flag strip at top of sidebar
      const flagH = 6;
      const flagW = SIDE_W / 3;
      doc.rect(0, 0, flagW, flagH).fill(RED);
      doc.rect(flagW, 0, flagW, flagH).fill("#ffffff");
      doc.rect(flagW * 2, 0, flagW, flagH).fill("#009736");
      doc.rect(0, 0, 6, 40).fill(RED);

      // Photo in sidebar
      let sideY = 50;
      if (photo) {
        try {
          doc.roundedRect(SIDE_PAD, sideY, SIDE_W - SIDE_PAD * 2, 100, 4).clip();
          doc.image(photo, SIDE_PAD, sideY, { width: SIDE_W - SIDE_PAD * 2, height: 100 });
          doc.restore();
          sideY += 108;
        } catch { sideY += 10; }
      }

      // Name & title in sidebar
      doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(13)
        .text(clean(p.name), SIDE_PAD + 6, sideY, { width: SIDE_W - SIDE_PAD * 2 - 6 });
      sideY = doc.y + 4;
      doc.fillColor("#a0a8b0").font("Helvetica").fontSize(8.5)
        .text(clean(p.title), SIDE_PAD + 6, sideY, { width: SIDE_W - SIDE_PAD * 2 - 6 });
      sideY = doc.y + 14;

      // Gold divider
      doc.moveTo(SIDE_PAD, sideY).lineTo(SIDE_W - SIDE_PAD, sideY).strokeColor(GOLD).lineWidth(0.5).stroke();
      sideY += 10;

      // Contact info
      const sideSection = (label: string) => {
        doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(7.5)
          .text(label.toUpperCase(), SIDE_PAD + 6, sideY, { characterSpacing: 0.8 });
        sideY = doc.y + 4;
      };
      const sideText = (txt: string) => {
        doc.fillColor("#c8d0d8").font("Helvetica").fontSize(8)
          .text(clean(txt), SIDE_PAD + 6, sideY, { width: SIDE_W - SIDE_PAD * 2 - 6 });
        sideY = doc.y + 6;
      };

      sideSection("Contact");
      sideText(p.email);
      sideText(p.phone);
      sideText(p.location);
      if (p.website) sideText(p.website.replace(/^https?:\/\//, ""));
      sideY += 4;

      if (p.social.linkedin) { sideSection("LinkedIn"); sideText(p.social.linkedin.replace("https://www.", "").replace("https://", "")); sideY += 4; }
      if (p.social.github) { sideSection("GitHub"); sideText(p.social.github.replace("https://", "")); sideY += 4; }

      // Skills in sidebar
      doc.moveTo(SIDE_PAD, sideY).lineTo(SIDE_W - SIDE_PAD, sideY).strokeColor(GOLD).lineWidth(0.5).stroke();
      sideY += 10;
      sideSection("Key Skills");
      const topSkills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))].slice(0, 14);
      for (const sk of topSkills) {
        sideText(sk);
      }

      // ── Main content ─────────────────────────────────────────────
      const mainSection = (title: string, y: number): number => {
        if (y + 70 > A4_H - 40) { doc.addPage(); y = 40; }
        doc.moveTo(MAIN_X, y).lineTo(MAIN_X + MAIN_W, y).strokeColor(RED).lineWidth(1).stroke();
        y += 4;
        doc.fillColor(DARK).font("Helvetica-Bold").fontSize(9.5)
          .text(title.toUpperCase(), MAIN_X, y, { characterSpacing: 1 });
        y += 14;
        doc.fillColor("#111827").font("Helvetica").fontSize(10);
        return y;
      };

      let y = 44;

      // Summary
      doc.fillColor(DARK).font("Helvetica-Bold").fontSize(10).text("PROFESSIONAL SUMMARY", MAIN_X, y, { characterSpacing: 0.8 });
      y = doc.y + 4;
      doc.font("Helvetica").fontSize(9.5).fillColor("#374151")
        .text(clean(p.bio), MAIN_X, y, { width: MAIN_W, lineGap: 2 });
      y = doc.y + 14;

      // Experience
      const work = data.experiences.filter(e => e.type === "work" || e.type === "entrepreneurship");
      if (work.length) {
        y = mainSection("Work Experience", y);
        for (const e of work) {
          if (y + 65 > A4_H - 40) { doc.addPage(); y = 40; }
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827").text(clean(e.title), MAIN_X, y, { width: MAIN_W - 90 });
          doc.fontSize(9).fillColor("#6b7280").text(e.period, MAIN_X + MAIN_W - 88, y, { lineBreak: false });
          y = doc.y;
          doc.fillColor(RED).font("Helvetica").fontSize(9.5).text(clean(e.company), MAIN_X, y);
          y = doc.y + 2;
          doc.fillColor("#374151").fontSize(9.5).text(clean(e.description), MAIN_X, y, { width: MAIN_W, lineGap: 1.5 });
          y = doc.y + 10;
        }
      }

      // Projects
      const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
      if (proj.length) {
        y = mainSection("Key Projects", y);
        for (const pr of proj) {
          if (y + 65 > A4_H - 40) { doc.addPage(); y = 40; }
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827").text(clean(pr.title), MAIN_X, y, { width: MAIN_W });
          y = doc.y + 2;
          doc.font("Helvetica").fontSize(9.5).fillColor("#374151").text(cut(pr.description, 220), MAIN_X, y, { width: MAIN_W, lineGap: 1.5 });
          y = doc.y + 10;
        }
      }

      // Education
      const edu = data.experiences.filter(e => e.type === "education");
      if (edu.length) {
        y = mainSection("Education", y);
        for (const e of edu) {
          if (y + 45 > A4_H - 40) { doc.addPage(); y = 40; }
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827").text(clean(e.title), MAIN_X, y, { width: MAIN_W - 90 });
          doc.fontSize(9).fillColor("#6b7280").text(e.period, MAIN_X + MAIN_W - 88, y, { lineBreak: false });
          y = doc.y;
          doc.fillColor(RED).font("Helvetica").fontSize(9.5).text(clean(e.company), MAIN_X, y);
          y = doc.y + 2;
          doc.fillColor("#374151").fontSize(9.5).text(clean(e.description), MAIN_X, y, { width: MAIN_W, lineGap: 1.5 });
          y = doc.y + 10;
        }
      }

      // Certifications
      if (data.certifications.length) {
        y = mainSection("Certifications", y);
        for (const c of data.certifications) {
          if (y + 28 > A4_H - 40) { doc.addPage(); y = 40; }
          doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text(clean(c.name), MAIN_X, y, { width: MAIN_W - 50 });
          doc.fontSize(9).fillColor("#6b7280").text(String(c.year), MAIN_X + MAIN_W - 48, y, { lineBreak: false });
          y = doc.y;
          doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(c.issuer, MAIN_X, y);
          y = doc.y + 8;
        }
      }
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EUROPASS CV  (EU standard: blue header, date | content layout)
// ─────────────────────────────────────────────────────────────────────────────
export function generateEuropassCV(data: PortfolioData): Promise<Buffer> {
  const M = 40;
  const EU_BLUE = "#003399";
  const EU_LIGHT = "#e8edf8";
  const DATE_W = 100;
  const MAIN_X = M + DATE_W + 12;
  const MAIN_W = A4_W - MAIN_X - M;

  return buildPDF(
    { size: "A4", margins: { top: 0, bottom: M, left: 0, right: M }, info: { Title: `${data.personalInfo.name} — Europass CV` } },
    (doc) => {
      const p = data.personalInfo;
      const photo = avatarPath(p.avatar);

      // EU blue header banner
      doc.rect(0, 0, A4_W, 36).fill(EU_BLUE);
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(13)
        .text("Curriculum vitae", 14, 10);
      doc.font("Helvetica").fontSize(8).fillColor("#aabcdd")
        .text("Europass", 14, 24, { lineBreak: false });

      // EU stars decoration (simplified)
      doc.fontSize(9).fillColor("#ffcc00").text("★★★★★★★★★★★★", A4_W - 120, 13, { lineBreak: false });

      // Photo + personal info header
      const headerY = 48;
      const photoW = 82, photoH = 100;
      let nameX = M;

      if (photo) {
        try {
          doc.image(photo, M, headerY, { width: photoW, height: photoH });
          nameX = M + photoW + 14;
        } catch {}
      }

      const nameW = A4_W - nameX - M;
      doc.fillColor("#1a1a1a").font("Helvetica-Bold").fontSize(20)
        .text(clean(p.name), nameX, headerY, { width: nameW });
      doc.font("Helvetica").fontSize(10.5).fillColor("#555")
        .text(clean(p.title), nameX, doc.y + 2, { width: nameW });
      doc.y += 6;

      // Contact details as table
      const row = (label: string, val: string) => {
        doc.fillColor(EU_BLUE).font("Helvetica-Bold").fontSize(8.5)
          .text(label, nameX, doc.y, { width: 70, lineBreak: false });
        doc.fillColor("#333").font("Helvetica").fontSize(8.5)
          .text(clean(val), nameX + 72, doc.y - 0, { width: nameW - 72 });
        doc.y += 1;
      };
      row("Email", p.email);
      row("Phone", p.phone);
      row("Address", p.location);
      if (p.social.linkedin) row("LinkedIn", p.social.linkedin);
      if (p.social.github) row("GitHub", p.social.github);
      if (p.website) row("Website", p.website);

      doc.y = Math.max(doc.y, headerY + photoH) + 16;

      // Section helper (date | content two-column)
      const section = (title: string) => {
        checkPage(doc, 70, M);
        // Blue section header bar
        doc.rect(M - 4, doc.y, A4_W - M * 2 + 8, 18).fill(EU_BLUE);
        doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9.5)
          .text(title.toUpperCase(), M, doc.y + 4, { characterSpacing: 0.8 });
        doc.y += 22;
        doc.fillColor("#111827").font("Helvetica").fontSize(10);
      };

      const entry = (
        dateStr: string,
        titleStr: string,
        sub: string,
        desc: string,
        tags?: string[]
      ) => {
        checkPage(doc, 60, M);
        const startY = doc.y;
        // Date column
        doc.fillColor("#555").font("Helvetica").fontSize(9)
          .text(dateStr, M, startY, { width: DATE_W });
        // Blue left border for content
        doc.moveTo(MAIN_X - 6, startY).lineTo(MAIN_X - 6, startY + 6).strokeColor(EU_BLUE).lineWidth(1.5).stroke();
        // Content
        doc.fillColor("#1a1a1a").font("Helvetica-Bold").fontSize(10.5)
          .text(clean(titleStr), MAIN_X, startY, { width: MAIN_W });
        doc.fillColor(EU_BLUE).font("Helvetica").fontSize(9.5)
          .text(clean(sub), MAIN_X, doc.y + 1, { width: MAIN_W });
        doc.y += 2;
        doc.fillColor("#444").fontSize(9.5)
          .text(clean(desc), MAIN_X, doc.y, { width: MAIN_W, lineGap: 1.5 });
        if (tags && tags.length) {
          doc.y += 4;
          tagRow(doc, tags.slice(0, 8), MAIN_X, MAIN_W, EU_LIGHT, EU_BLUE);
        } else doc.y += 10;
      };

      // Summary
      section("Personal Statement");
      checkPage(doc, 40, M);
      doc.fillColor("#444").font("Helvetica").fontSize(9.5)
        .text(clean(p.bio), MAIN_X, doc.y, { width: MAIN_W, lineGap: 2 });
      doc.y += 12;

      // Experience
      const work = data.experiences.filter(e => e.type === "work" || e.type === "entrepreneurship");
      if (work.length) {
        section("Work Experience");
        for (const e of work) entry(e.period, e.title, e.company, e.description, e.tech);
      }

      // Education
      const edu = data.experiences.filter(e => e.type === "education");
      if (edu.length) {
        section("Education and Training");
        for (const e of edu) entry(e.period, e.title, e.company, e.description);
      }

      // Skills
      const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))].slice(0, 28);
      section("Digital Competence");
      checkPage(doc, 40, M);
      tagRow(doc, skills, MAIN_X, MAIN_W, EU_LIGHT, EU_BLUE);
      doc.y += 4;

      // Projects
      const proj = data.projects.filter(pr => pr.featured).slice(0, 2);
      if (proj.length) {
        section("Projects");
        for (const pr of proj) entry(pr.date, pr.title, pr.client, cut(pr.description, 220), pr.tech.slice(0, 8));
      }

      // Certifications
      if (data.certifications.length) {
        section("Certifications");
        for (const c of data.certifications)
          entry(String(c.year), clean(c.name), c.issuer, "");
      }
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USA STYLE CV  (no photo, centered header, bullet points)
// ─────────────────────────────────────────────────────────────────────────────
export function generateUSACV(data: PortfolioData): Promise<Buffer> {
  const M = 52;
  const CW = A4_W - M * 2;

  return buildPDF(
    { size: "A4", margins: { top: M, bottom: M, left: M, right: M }, info: { Title: `${data.personalInfo.name} — Resume` } },
    (doc) => {
      const p = data.personalInfo;

      // Name — centered, large
      doc.fillColor("#111827").font("Helvetica-Bold").fontSize(24)
        .text(clean(p.name), M, M, { width: CW, align: "center" });
      doc.y += 2;

      // Contact line — centered
      const contacts: string[] = [p.email, p.phone];
      if (p.location) contacts.push(p.location);
      if (p.social.linkedin) contacts.push(p.social.linkedin.replace("https://www.", "").replace("https://", ""));
      if (p.social.github) contacts.push(p.social.github.replace("https://", ""));
      doc.fillColor("#374151").font("Helvetica").fontSize(9)
        .text(contacts.join("  •  "), M, doc.y, { width: CW, align: "center" });
      doc.y += 6;

      // Full-width rule
      doc.moveTo(M, doc.y).lineTo(M + CW, doc.y).strokeColor("#111827").lineWidth(1).stroke();
      doc.y += 10;

      const section = (title: string) => {
        checkPage(doc, 70, M);
        doc.fillColor("#111827").font("Helvetica-Bold").fontSize(10.5)
          .text(title.toUpperCase(), M, doc.y, { characterSpacing: 1 });
        doc.moveTo(M, doc.y).lineTo(M + CW, doc.y).strokeColor("#d1d5db").lineWidth(0.5).stroke();
        doc.y += 8;
        doc.fillColor("#111827").font("Helvetica").fontSize(10);
      };

      // Summary
      section("Professional Summary");
      doc.font("Helvetica").fontSize(9.5).fillColor("#374151")
        .text(clean(p.bio), M, doc.y, { width: CW, lineGap: 2 });
      doc.y += 12;

      // Experience
      const work = data.experiences.filter(e => e.type === "work" || e.type === "entrepreneurship");
      if (work.length) {
        section("Professional Experience");
        for (const e of work) {
          checkPage(doc, 65, M);
          // Title | Company | Period on one line
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(e.title), M, doc.y, { width: CW - 90, continued: false });
          doc.fillColor("#6b7280").fontSize(9)
            .text(e.period, M + CW - 88, doc.y - 13, { lineBreak: false });
          doc.fillColor("#374151").font("Helvetica-Bold").fontSize(9.5)
            .text(clean(e.company), M, doc.y);
          doc.y += 3;
          // Description as bullet
          doc.font("Helvetica").fontSize(9.5).fillColor("#374151")
            .text(`• ${clean(e.description)}`, M + 10, doc.y, { width: CW - 10, lineGap: 1.5 });
          doc.y += 10;
        }
      }

      // Education
      const edu = data.experiences.filter(e => e.type === "education");
      if (edu.length) {
        section("Education");
        for (const e of edu) {
          checkPage(doc, 40, M);
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(e.title), M, doc.y, { width: CW - 90 });
          doc.fontSize(9).fillColor("#6b7280")
            .text(e.period, M + CW - 88, doc.y - 13, { lineBreak: false });
          doc.fillColor("#374151").font("Helvetica").fontSize(9.5)
            .text(clean(e.company), M, doc.y);
          doc.y += 2;
          doc.text(clean(e.description), M, doc.y, { width: CW, lineGap: 1.5 });
          doc.y += 10;
        }
      }

      // Skills — grouped by category
      section("Technical Skills");
      for (const cat of data.techStack) {
        checkPage(doc, 20, M);
        doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#111827")
          .text(cat.category + ": ", M, doc.y, { continued: true });
        doc.font("Helvetica").fillColor("#374151")
          .text(cat.items.map(i => i.name).join(", "), { width: CW });
        doc.y += 4;
      }
      doc.y += 4;

      // Projects
      const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
      if (proj.length) {
        section("Selected Projects");
        for (const pr of proj) {
          checkPage(doc, 55, M);
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(pr.title), M, doc.y, { width: CW });
          doc.y += 2;
          doc.font("Helvetica").fontSize(9.5).fillColor("#374151")
            .text(`• ${cut(pr.description, 230)}`, M + 10, doc.y, { width: CW - 10, lineGap: 1.5 });
          if (pr.tech.length) {
            doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#6b7280")
              .text("Tech: ", M + 10, doc.y + 3, { continued: true });
            doc.font("Helvetica").fillColor("#6b7280")
              .text(pr.tech.slice(0, 8).join(", "));
          }
          doc.y += 8;
        }
      }

      // Certifications
      if (data.certifications.length) {
        section("Certifications");
        for (const c of data.certifications) {
          checkPage(doc, 20, M);
          doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827")
            .text(clean(c.name), M, doc.y, { width: CW - 50 });
          doc.fontSize(9).fillColor("#6b7280")
            .text(String(c.year), M + CW - 48, doc.y - 12, { lineBreak: false });
          doc.font("Helvetica").fontSize(9).fillColor("#6b7280")
            .text(c.issuer, M, doc.y);
          doc.y += 8;
        }
      }
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CANADA STYLE CV  (red accent, core competencies grid, volunteer-friendly)
// ─────────────────────────────────────────────────────────────────────────────
export function generateCanadaCV(data: PortfolioData): Promise<Buffer> {
  const M = 48;
  const CW = A4_W - M * 2;
  const RED = "#cc0000";
  const LIGHT_RED = "#fff0f0";

  return buildPDF(
    { size: "A4", margins: { top: M, bottom: M, left: M, right: M }, info: { Title: `${data.personalInfo.name} — Resume` } },
    (doc) => {
      const p = data.personalInfo;

      // Name block
      doc.fillColor(RED).font("Helvetica-Bold").fontSize(22)
        .text(clean(p.name), M, M);
      doc.fillColor("#374151").font("Helvetica").fontSize(10.5)
        .text(clean(p.title), M, doc.y + 2);
      doc.y += 6;

      // Contact row
      const contacts = [p.email, p.phone, p.location].filter(Boolean);
      if (p.social.linkedin) contacts.push(p.social.linkedin.replace("https://www.", "").replace("https://", ""));
      doc.fillColor("#555").fontSize(8.5)
        .text(contacts.join("  |  "), M, doc.y, { width: CW });
      doc.y += 4;

      // Red rule
      doc.rect(M, doc.y, CW, 2).fill(RED);
      doc.y += 12;

      const section = (title: string) => {
        checkPage(doc, 70, M);
        doc.fillColor(RED).font("Helvetica-Bold").fontSize(10)
          .text(title.toUpperCase(), M, doc.y, { characterSpacing: 1.2 });
        doc.moveTo(M, doc.y).lineTo(M + CW, doc.y).strokeColor("#e5c0c0").lineWidth(0.5).stroke();
        doc.y += 8;
        doc.fillColor("#111827").font("Helvetica").fontSize(10);
      };

      // Profile
      section("Professional Profile");
      doc.font("Helvetica").fontSize(9.5).fillColor("#374151")
        .text(clean(p.bio), M, doc.y, { width: CW, lineGap: 2 });
      doc.y += 12;

      // Core Competencies — 3-column grid
      section("Core Competencies");
      const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))].slice(0, 18);
      const colW = CW / 3;
      let gx = M, gy = doc.y;
      for (let i = 0; i < skills.length; i++) {
        if (i % 3 === 0 && i !== 0) { gy += 16; gx = M; }
        doc.roundedRect(gx + 2, gy, colW - 6, 13, 2).fill(LIGHT_RED);
        doc.fillColor(RED).font("Helvetica").fontSize(8.5)
          .text(skills[i], gx + 7, gy + 3, { width: colW - 14, lineBreak: false });
        gx += colW;
      }
      doc.y = gy + 22;

      // Professional Experience
      const work = data.experiences.filter(e => e.type === "work" || e.type === "entrepreneurship");
      if (work.length) {
        section("Professional Experience");
        for (const e of work) {
          checkPage(doc, 65, M);
          // Period on left, title on right
          doc.fillColor(RED).font("Helvetica-Bold").fontSize(9)
            .text(e.period, M, doc.y, { width: 100, lineBreak: false });
          doc.fillColor("#111827").font("Helvetica-Bold").fontSize(10.5)
            .text(clean(e.title), M + 108, doc.y - 0, { width: CW - 108 });
          doc.fillColor("#555").font("Helvetica").fontSize(9.5)
            .text(clean(e.company), M + 108, doc.y);
          doc.y += 3;
          doc.fillColor("#374151").fontSize(9.5)
            .text(clean(e.description), M + 108, doc.y, { width: CW - 108, lineGap: 1.5 });
          if (e.tech.length) {
            doc.y += 4;
            tagRow(doc, e.tech.slice(0, 8), M + 108, CW - 108, LIGHT_RED, RED);
          } else doc.y += 10;
        }
      }

      // Education
      const edu = data.experiences.filter(e => e.type === "education");
      if (edu.length) {
        section("Education");
        for (const e of edu) {
          checkPage(doc, 40, M);
          doc.fillColor(RED).font("Helvetica-Bold").fontSize(9)
            .text(e.period, M, doc.y, { width: 100, lineBreak: false });
          doc.fillColor("#111827").font("Helvetica-Bold").fontSize(10.5)
            .text(clean(e.title), M + 108, doc.y - 0, { width: CW - 108 });
          doc.fillColor("#555").font("Helvetica").fontSize(9.5)
            .text(clean(e.company), M + 108, doc.y);
          doc.y += 2;
          doc.fillColor("#374151").fontSize(9.5)
            .text(clean(e.description), M + 108, doc.y, { width: CW - 108, lineGap: 1.5 });
          doc.y += 10;
        }
      }

      // Key Projects
      const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
      if (proj.length) {
        section("Key Projects");
        for (const pr of proj) {
          checkPage(doc, 55, M);
          doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827")
            .text(clean(pr.title), M, doc.y, { width: CW });
          doc.y += 2;
          doc.font("Helvetica").fontSize(9.5).fillColor("#374151")
            .text(cut(pr.description, 230), M, doc.y, { width: CW, lineGap: 1.5 });
          if (pr.tech.length) { doc.y += 4; tagRow(doc, pr.tech.slice(0, 9), M, CW, LIGHT_RED, RED); }
          else doc.y += 8;
        }
      }

      // Certifications
      if (data.certifications.length) {
        section("Certifications & Credentials");
        for (const c of data.certifications) {
          checkPage(doc, 24, M);
          doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827")
            .text(clean(c.name), M, doc.y, { width: CW - 50 });
          doc.fontSize(9).fillColor("#6b7280")
            .text(String(c.year), M + CW - 48, doc.y - 12, { lineBreak: false });
          doc.font("Helvetica").fontSize(9).fillColor("#6b7280")
            .text(c.issuer, M, doc.y);
          doc.y += 8;
        }
      }
    }
  );
}
