import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { name, email, subject, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0d0e10;color:#e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#6366f1,#7c3aed);padding:24px 32px;">
          <h2 style="margin:0;color:#fff;font-size:20px;">New Contact Form Message</h2>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#94a3b8;width:80px;">From</td><td style="padding:8px 0;color:#f1f5f9;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#818cf8;">${email}</a></td></tr>
            ${subject ? `<tr><td style="padding:8px 0;color:#94a3b8;">Subject</td><td style="padding:8px 0;color:#f1f5f9;">${subject}</td></tr>` : ""}
          </table>
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">Message</p>
          <p style="color:#f1f5f9;line-height:1.7;white-space:pre-wrap;margin:0;">${message}</p>
        </div>
        <div style="padding:16px 32px;background:#0a0b0e;text-align:center;">
          <p style="color:#475569;font-size:12px;margin:0;">Sent from your portfolio contact form · Reply directly to respond to ${name}</p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
