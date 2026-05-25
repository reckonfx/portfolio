import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { to, senderName, format, pdfBase64, filename } = await request.json() as {
    to?: string; senderName?: string; format?: string;
    pdfBase64?: string; filename?: string;
  };

  if (!to || !pdfBase64) {
    return NextResponse.json({ error: "Recipient email and PDF are required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return NextResponse.json({ error: "Invalid recipient email address" }, { status: 400 });
  }

  // jsPDF output("datauristring") returns "data:application/pdf;filename=...;base64,<data>"
  const base64Data = pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64;
  const pdfBuffer = Buffer.from(base64Data, "base64");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const name = senderName ?? "Someone";
  const formatLabel = format ?? "CV";
  const attachmentName = filename ?? `${name.replace(/\s+/g, "-")}-CV.pdf`;

  await transporter.sendMail({
    from: `"${name}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${name} shared their ${formatLabel} with you`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg,#6366f1,#7c3aed);padding:28px 32px;">
          <h2 style="margin:0;color:#fff;font-size:22px;">${name}'s ${formatLabel}</h2>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">has been shared with you</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#334155;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Hi,<br/><br/>
            <strong>${name}</strong> has shared their professional CV with you.
            The CV is attached to this email as a PDF — you can open and save it directly.
          </p>
          <p style="color:#94a3b8;font-size:13px;margin:0;">📎 Attachment: <strong>${attachmentName}</strong></p>
        </div>
        <div style="padding:16px 32px;background:#f8fafc;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">Sent via ${name}'s portfolio</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: attachmentName,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  return NextResponse.json({ ok: true });
}
