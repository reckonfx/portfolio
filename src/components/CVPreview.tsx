"use client";

import { useEffect, useState, useRef, CSSProperties, ReactNode } from "react";
import { Loader2, Mail, X, Send } from "lucide-react";
import type { PortfolioData, Experience, Project } from "@/lib/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  return s.length > max ? s.slice(0, max) + "…" : s;
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function Tags({ items, bg, color }: { items: string[]; bg: string; color: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>
      {items.map((t, i) => (
        <span key={i} style={{ background: bg, color, borderRadius: "3px", padding: "2px 7px", fontSize: "7.5pt" }}>
          {t}
        </span>
      ))}
    </div>
  );
}

function SectionHeader({ title, color, border = true }: { title: string; color: string; border?: boolean }) {
  return (
    <div style={{ borderBottom: border ? `2px solid ${color}` : "none", paddingBottom: "3px", marginBottom: "8px" }}>
      <span style={{ fontSize: "9pt", fontWeight: "bold", color, textTransform: "uppercase", letterSpacing: "1.2px" }}>
        {title}
      </span>
    </div>
  );
}

function ExpBlock({
  title, company, period, desc, tech = [], accent, tagBg,
}: {
  title: string; company: string; period: string; desc: string;
  tech?: string[]; accent: string; tagBg: string;
}) {
  return (
    <div data-cv-section="true" style={{ marginBottom: "11px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <strong style={{ fontSize: "10.5pt" }}>{clean(title)}</strong>
        <span style={{ fontSize: "8.5pt", color: "#777" }}>{period}</span>
      </div>
      <div style={{ color: accent, fontSize: "9.5pt", marginBottom: "2px" }}>{clean(company)}</div>
      <div style={{ fontSize: "9.5pt", lineHeight: 1.55, color: "#222" }}>{clean(desc)}</div>
      {tech.length > 0 && <Tags items={tech.slice(0, 8)} bg={tagBg} color={accent} />}
    </div>
  );
}

// ── Gulf CV ───────────────────────────────────────────────────────────────────

function GulfCV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const A = "#0a3d6b";
  const BG = "#e8f0f7";
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
  const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#111", background: "#fff" }}>
      {/* Header */}
      <div style={{ background: A, color: "#fff", padding: "22px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "22pt", fontWeight: "bold", marginBottom: "3px" }}>{p.name}</div>
          <div style={{ fontSize: "11pt", opacity: 0.75, marginBottom: "10px" }}>{clean(p.title)}</div>
          <div style={{ fontSize: "8.5pt", opacity: 0.65, lineHeight: 1.8 }}>
            <span>{p.email}</span><span style={{ margin: "0 8px" }}>|</span>
            <span>{p.phone}</span><span style={{ margin: "0 8px" }}>|</span>
            <span>{p.location}</span>
          </div>
          {(p.social.linkedin || p.social.github) && (
            <div style={{ fontSize: "8.5pt", opacity: 0.65, marginTop: "3px" }}>
              {p.social.linkedin && <span>{p.social.linkedin.replace("https://www.", "").replace("https://", "")}</span>}
              {p.social.linkedin && p.social.github && <span style={{ margin: "0 8px" }}>|</span>}
              {p.social.github && <span>{p.social.github.replace("https://", "")}</span>}
            </div>
          )}
        </div>
        {p.avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatar} alt="Profile" style={{ width: "88px", height: "108px", objectFit: "cover", borderRadius: "4px", border: "3px solid rgba(255,255,255,0.3)" }} />
        )}
      </div>

      <div style={{ padding: "18px 32px" }}>
        <Sec title="Professional Summary" color={A}>
          <p style={{ margin: 0, lineHeight: 1.6, fontSize: "9.5pt" }}>{clean(p.bio)}</p>
        </Sec>
        {work.length > 0 && (
          <Sec title="Work Experience" color={A}>
            {work.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={e.tech} accent={A} tagBg={BG} />)}
          </Sec>
        )}
        {proj.length > 0 && (
          <Sec title="Key Projects" color={A}>
            {proj.map((pr, i) => (
              <div key={i} style={{ marginBottom: "11px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(pr.title)}</strong>
                <div style={{ fontSize: "9.5pt", lineHeight: 1.55, marginTop: "2px" }}>{cut(pr.description, 230)}</div>
                {pr.tech.length > 0 && <Tags items={pr.tech.slice(0, 10)} bg={BG} color={A} />}
              </div>
            ))}
          </Sec>
        )}
        <Sec title="Technical Skills" color={A}>
          <Tags items={skills.slice(0, 28)} bg={BG} color={A} />
        </Sec>
        {edu.length > 0 && (
          <Sec title="Education" color={A}>
            {edu.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={e.tech} accent={A} tagBg={BG} />)}
          </Sec>
        )}
        {data.certifications.length > 0 && (
          <Sec title="Certifications" color={A}>
            {data.certifications.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "10pt" }}>{clean(c.name)}</div>
                  <div style={{ fontSize: "8.5pt", color: "#777" }}>{c.issuer}</div>
                </div>
                <div style={{ fontSize: "9pt", color: "#777" }}>{c.year}</div>
              </div>
            ))}
          </Sec>
        )}
      </div>
    </div>
  );
}

// ── Saudi CV ──────────────────────────────────────────────────────────────────

function SaudiCV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const A = "#006c35";
  const BG = "#e6f4ee";
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
  const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#111", background: "#fff" }}>
      <div style={{ background: A, color: "#fff", padding: "22px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "22pt", fontWeight: "bold", marginBottom: "3px" }}>{p.name}</div>
          <div style={{ fontSize: "11pt", opacity: 0.75, marginBottom: "10px" }}>{clean(p.title)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 20px", fontSize: "8.5pt", opacity: 0.75 }}>
            <span>Email: {p.email}</span>
            <span>Phone: {p.phone}</span>
            <span>Location: {p.location}</span>
            <span>Nationality: {p.nationality || "[Add]"}</span>
            <span>Marital Status: {p.maritalStatus || "[Add]"}</span>
            <span>Religion: {p.religion || "Islam"}</span>
          </div>
        </div>
        {p.avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatar} alt="Profile" style={{ width: "88px", height: "108px", objectFit: "cover", borderRadius: "4px", border: "3px solid rgba(255,255,255,0.3)" }} />
        )}
      </div>

      <div style={{ padding: "18px 32px" }}>
        <Sec title="Professional Summary" color={A}>
          <p style={{ margin: 0, lineHeight: 1.6, fontSize: "9.5pt" }}>{clean(p.bio)}</p>
        </Sec>
        {work.length > 0 && (
          <Sec title="Work Experience" color={A}>
            {work.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={e.tech} accent={A} tagBg={BG} />)}
          </Sec>
        )}
        {proj.length > 0 && (
          <Sec title="Key Projects" color={A}>
            {proj.map((pr, i) => (
              <div key={i} style={{ marginBottom: "11px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(pr.title)}</strong>
                <div style={{ fontSize: "9.5pt", lineHeight: 1.55, marginTop: "2px" }}>{cut(pr.description, 230)}</div>
                {pr.tech.length > 0 && <Tags items={pr.tech.slice(0, 10)} bg={BG} color={A} />}
              </div>
            ))}
          </Sec>
        )}
        <Sec title="Technical Skills" color={A}>
          <Tags items={skills.slice(0, 28)} bg={BG} color={A} />
        </Sec>
        {edu.length > 0 && (
          <Sec title="Education" color={A}>
            {edu.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={e.tech} accent={A} tagBg={BG} />)}
          </Sec>
        )}
        {data.certifications.length > 0 && (
          <Sec title="Certifications" color={A}>
            {data.certifications.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{clean(c.name)}</div>
                  <div style={{ fontSize: "8.5pt", color: "#777" }}>{c.issuer}</div>
                </div>
                <div style={{ fontSize: "9pt", color: "#777" }}>{c.year}</div>
              </div>
            ))}
          </Sec>
        )}
      </div>
    </div>
  );
}

// ── Emirati CV (dark sidebar) ─────────────────────────────────────────────────

function EmiratiCV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const DARK = "#0d1117";
  const GOLD = "#c8a951";
  const RED = "#cf2028";
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
  const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))].slice(0, 16);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#111", display: "flex", minHeight: "297mm", background: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: "170px", flexShrink: 0, background: DARK, color: "#fff", padding: "0 0 24px" }}>
        {/* UAE flag strip */}
        <div style={{ display: "flex", height: "7px" }}>
          <div style={{ flex: 1, background: RED }} />
          <div style={{ flex: 1, background: "#fff" }} />
          <div style={{ flex: 1, background: "#009736" }} />
        </div>
        <div style={{ height: "20px", background: RED }} />

        {p.avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatar} alt="Profile" style={{ width: "150px", height: "145px", objectFit: "cover", objectPosition: "top center", display: "block", margin: "0 auto 14px", borderRadius: "4px" }} />
        )}

        <div style={{ padding: "0 14px" }}>
          <div style={{ color: GOLD, fontWeight: "bold", fontSize: "13pt", lineHeight: 1.3, marginBottom: "4px" }}>{p.name}</div>
          <div style={{ color: "#9ba3ae", fontSize: "8.5pt", marginBottom: "14px" }}>{clean(p.title)}</div>

          <div style={{ borderTop: `0.5px solid ${GOLD}`, paddingTop: "10px", marginBottom: "10px" }}>
            <SideLabel label="Contact" color={GOLD} />
            <SideText text={p.email} />
            <SideText text={p.phone} />
            <SideText text={p.location} />
            {p.website && <SideText text={p.website.replace(/^https?:\/\//, "")} />}
          </div>

          {p.social.linkedin && (
            <div style={{ marginBottom: "10px" }}>
              <SideLabel label="LinkedIn" color={GOLD} />
              <SideText text={p.social.linkedin.replace("https://www.", "").replace("https://", "")} />
            </div>
          )}

          <div style={{ borderTop: `0.5px solid ${GOLD}`, paddingTop: "10px" }}>
            <SideLabel label="Key Skills" color={GOLD} />
            {skills.map((s, i) => <SideText key={i} text={s} />)}
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "24px 28px" }}>
        <div style={{ borderBottom: `2px solid ${RED}`, paddingBottom: "3px", marginBottom: "16px" }}>
          <span style={{ fontSize: "9pt", fontWeight: "bold", color: DARK, textTransform: "uppercase", letterSpacing: "1.2px" }}>Professional Summary</span>
        </div>
        <p style={{ margin: "0 0 18px", lineHeight: 1.6, fontSize: "9.5pt", color: "#333" }}>{clean(p.bio)}</p>

        {work.length > 0 && (
          <>
            <MainSec title="Work Experience" accent={RED}>
              {work.map((e, i) => (
                <div key={i} style={{ marginBottom: "11px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "10.5pt" }}>{clean(e.title)}</strong>
                    <span style={{ fontSize: "8.5pt", color: "#777" }}>{e.period}</span>
                  </div>
                  <div style={{ color: RED, fontSize: "9.5pt", marginBottom: "2px" }}>{clean(e.company)}</div>
                  <div style={{ fontSize: "9.5pt", lineHeight: 1.55, color: "#333" }}>{clean(e.description)}</div>
                </div>
              ))}
            </MainSec>
          </>
        )}

        {proj.length > 0 && (
          <MainSec title="Key Projects" accent={RED}>
            {proj.map((pr, i) => (
              <div key={i} style={{ marginBottom: "11px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(pr.title)}</strong>
                <div style={{ fontSize: "9.5pt", lineHeight: 1.55, marginTop: "2px", color: "#333" }}>{cut(pr.description, 220)}</div>
              </div>
            ))}
          </MainSec>
        )}

        {edu.length > 0 && (
          <MainSec title="Education" accent={RED}>
            {edu.map((e, i) => (
              <div key={i} style={{ marginBottom: "11px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "10.5pt" }}>{clean(e.title)}</strong>
                  <span style={{ fontSize: "8.5pt", color: "#777" }}>{e.period}</span>
                </div>
                <div style={{ color: RED, fontSize: "9.5pt" }}>{clean(e.company)}</div>
                <div style={{ fontSize: "9.5pt", lineHeight: 1.55, color: "#333" }}>{clean(e.description)}</div>
              </div>
            ))}
          </MainSec>
        )}

        {data.certifications.length > 0 && (
          <MainSec title="Certifications" accent={RED}>
            {data.certifications.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{clean(c.name)}</div>
                  <div style={{ fontSize: "8.5pt", color: "#777" }}>{c.issuer}</div>
                </div>
                <div style={{ fontSize: "9pt", color: "#777" }}>{c.year}</div>
              </div>
            ))}
          </MainSec>
        )}
      </div>
    </div>
  );
}

function SideLabel({ label, color }: { label: string; color: string }) {
  return <div style={{ color, fontSize: "7.5pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{label}</div>;
}
function SideText({ text }: { text: string }) {
  return <div style={{ color: "#b0b8c4", fontSize: "8pt", marginBottom: "3px", wordBreak: "break-all" }}>{text}</div>;
}
function MainSec({ title, accent, children }: { title: string; accent: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ borderBottom: `1.5px solid ${accent}`, paddingBottom: "3px", marginBottom: "8px" }}>
        <span style={{ fontSize: "9pt", fontWeight: "bold", color: "#111", textTransform: "uppercase", letterSpacing: "1px" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── Europass CV ───────────────────────────────────────────────────────────────

function EuropassCV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const A = "#003399";
  const BG = "#e8edf8";
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 2);
  const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#111", background: "#fff" }}>
      {/* Blue header banner */}
      <div style={{ background: A, color: "#fff", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "14pt", fontWeight: "bold" }}>Curriculum vitae</div>
          <div style={{ fontSize: "8pt", opacity: 0.6 }}>Europass</div>
        </div>
        <div style={{ color: "#ffcc00", fontSize: "10pt", letterSpacing: "3px" }}>★★★★★★★★★★★★</div>
      </div>

      {/* Personal info + photo */}
      <div style={{ display: "flex", gap: "20px", padding: "18px 24px", borderBottom: `1px solid #ddd` }}>
        {p.avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatar} alt="Profile" style={{ width: "82px", height: "100px", objectFit: "cover", flexShrink: 0, border: "1px solid #ccc" }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "20pt", fontWeight: "bold", color: "#111", marginBottom: "2px" }}>{p.name}</div>
          <div style={{ fontSize: "11pt", color: "#555", marginBottom: "10px" }}>{clean(p.title)}</div>
          <table style={{ fontSize: "8.5pt", borderCollapse: "collapse" }}>
            <tbody>
              {([
                ["Email", p.email], ["Phone", p.phone], ["Location", p.location],
                ...(p.social.linkedin ? [["LinkedIn", p.social.linkedin]] : []),
                ...(p.social.github ? [["GitHub", p.social.github]] : []),
                ...(p.website ? [["Website", p.website]] : []),
              ] as [string, string][]).map(([label, val], i) => (
                <tr key={i}>
                  <td style={{ color: A, fontWeight: "bold", paddingRight: "10px", paddingBottom: "2px", whiteSpace: "nowrap" }}>{label}</td>
                  <td style={{ color: "#333", paddingBottom: "2px" }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ padding: "16px 24px" }}>
        {/* Personal statement */}
        <EuroSec title="Personal Statement" color={A}>
          <p style={{ margin: 0, fontSize: "9.5pt", lineHeight: 1.6, color: "#333" }}>{clean(p.bio)}</p>
        </EuroSec>

        {/* Experience */}
        {work.length > 0 && (
          <EuroSec title="Work Experience" color={A}>
            {work.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "12px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ width: "100px", flexShrink: 0, fontSize: "8.5pt", color: "#666", paddingTop: "2px" }}>{e.period}</div>
                <div style={{ flex: 1, borderLeft: `2px solid ${A}`, paddingLeft: "12px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "10.5pt", color: "#111" }}>{clean(e.title)}</div>
                  <div style={{ color: A, fontSize: "9.5pt", marginBottom: "2px" }}>{clean(e.company)}</div>
                  <div style={{ fontSize: "9.5pt", lineHeight: 1.55, color: "#333" }}>{clean(e.description)}</div>
                  {e.tech.length > 0 && <Tags items={e.tech.slice(0, 8)} bg={BG} color={A} />}
                </div>
              </div>
            ))}
          </EuroSec>
        )}

        {edu.length > 0 && (
          <EuroSec title="Education and Training" color={A}>
            {edu.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "12px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ width: "100px", flexShrink: 0, fontSize: "8.5pt", color: "#555", paddingTop: "2px" }}>{e.period}</div>
                <div style={{ flex: 1, borderLeft: `2px solid ${A}`, paddingLeft: "12px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "10.5pt", color: "#111" }}>{clean(e.title)}</div>
                  <div style={{ color: A, fontSize: "9.5pt", marginBottom: "2px" }}>{clean(e.company)}</div>
                  <div style={{ fontSize: "9.5pt", lineHeight: 1.55, color: "#333" }}>{clean(e.description)}</div>
                  {e.tech.length > 0 && <Tags items={e.tech.slice(0, 8)} bg={BG} color={A} />}
                </div>
              </div>
            ))}
          </EuroSec>
        )}

        {/* Digital Skills */}
        <EuroSec title="Digital Competence" color={A}>
          <Tags items={skills.slice(0, 28)} bg={BG} color={A} />
        </EuroSec>

        {/* Projects */}
        {proj.length > 0 && (
          <EuroSec title="Projects" color={A}>
            {proj.map((pr, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "12px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ width: "100px", flexShrink: 0, fontSize: "8.5pt", color: "#666", paddingTop: "2px" }}>{pr.date}</div>
                <div style={{ flex: 1, borderLeft: `2px solid ${A}`, paddingLeft: "12px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "10.5pt", color: "#111" }}>{clean(pr.title)}</div>
                  <div style={{ color: A, fontSize: "9.5pt", marginBottom: "2px" }}>{pr.client}</div>
                  <div style={{ fontSize: "9.5pt", lineHeight: 1.55, color: "#333" }}>{cut(pr.description, 220)}</div>
                  {pr.tech.length > 0 && <Tags items={pr.tech.slice(0, 8)} bg={BG} color={A} />}
                </div>
              </div>
            ))}
          </EuroSec>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <EuroSec title="Certifications" color={A}>
            {data.certifications.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
                <div style={{ width: "100px", flexShrink: 0, fontSize: "8.5pt", color: "#666" }}>{c.year}</div>
                <div style={{ flex: 1, borderLeft: `2px solid ${A}`, paddingLeft: "12px" }}>
                  <div style={{ fontWeight: "bold" }}>{clean(c.name)}</div>
                  <div style={{ fontSize: "8.5pt", color: "#777" }}>{c.issuer}</div>
                </div>
              </div>
            ))}
          </EuroSec>
        )}
      </div>
    </div>
  );
}

function EuroSec({ title, color, children }: { title: string; color: string; children: ReactNode }) {
  return (
    <div data-cv-section="true" style={{ marginBottom: "16px" }}>
      <div style={{ background: color, color: "#fff", padding: "5px 10px", marginBottom: "10px", fontSize: "9.5pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.8px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ── USA Resume ────────────────────────────────────────────────────────────────

function USACV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 3);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#111", background: "#fff", padding: "28px 40px" }}>
      {/* Centered name block */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ fontSize: "24pt", fontWeight: "bold", letterSpacing: "-0.5px" }}>{p.name}</div>
        <div style={{ fontSize: "10.5pt", color: "#555", marginTop: "3px" }}>{clean(p.title)}</div>
        <div style={{ fontSize: "8.5pt", color: "#666", marginTop: "6px" }}>
          {[p.email, p.phone, p.location,
            p.social.linkedin && p.social.linkedin.replace("https://www.", "").replace("https://", ""),
            p.social.github && p.social.github.replace("https://", ""),
          ].filter(Boolean).join("  •  ")}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1.5px solid #111", margin: "0 0 14px" }} />

      <USASec title="Professional Summary">
        <p style={{ margin: 0, lineHeight: 1.6, fontSize: "9.5pt" }}>{clean(p.bio)}</p>
      </USASec>

      {work.length > 0 && (
        <USASec title="Professional Experience">
          {work.map((e, i) => (
            <div key={i} style={{ marginBottom: "12px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(e.title)}</strong>
                <span style={{ fontSize: "8.5pt", color: "#666" }}>{e.period}</span>
              </div>
              <div style={{ fontWeight: "bold", fontSize: "9.5pt", color: "#444", marginBottom: "3px" }}>{clean(e.company)}</div>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.55 }}>• {clean(e.description)}</div>
            </div>
          ))}
        </USASec>
      )}

      <USASec title="Technical Skills">
        {data.techStack.map((cat, i) => (
          <div key={i} style={{ marginBottom: "4px", fontSize: "9.5pt" }}>
            <strong>{cat.category}:</strong> {cat.items.map(item => item.name).join(", ")}
          </div>
        ))}
      </USASec>

      {proj.length > 0 && (
        <USASec title="Selected Projects">
          {proj.map((pr, i) => (
            <div key={i} style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <strong style={{ fontSize: "10.5pt" }}>{clean(pr.title)}</strong>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.55, marginTop: "2px" }}>• {cut(pr.description, 230)}</div>
              {pr.tech.length > 0 && (
                <div style={{ fontSize: "8.5pt", color: "#666", marginTop: "2px" }}>
                  <strong>Tech:</strong> {pr.tech.slice(0, 8).join(", ")}
                </div>
              )}
            </div>
          ))}
        </USASec>
      )}

      {edu.length > 0 && (
        <USASec title="Education">
          {edu.map((e, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(e.title)}</strong>
                <span style={{ fontSize: "8.5pt", color: "#666" }}>{e.period}</span>
              </div>
              <div style={{ fontSize: "9.5pt", color: "#444" }}>{clean(e.company)}</div>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.55 }}>{clean(e.description)}</div>
            </div>
          ))}
        </USASec>
      )}

      {data.certifications.length > 0 && (
        <USASec title="Certifications">
          {data.certifications.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <div>
                <strong style={{ fontSize: "10pt" }}>{clean(c.name)}</strong>
                <div style={{ fontSize: "8.5pt", color: "#666" }}>{c.issuer}</div>
              </div>
              <div style={{ fontSize: "9pt", color: "#666" }}>{c.year}</div>
            </div>
          ))}
        </USASec>
      )}
    </div>
  );
}

function USASec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div data-cv-section="true" style={{ marginBottom: "14px" }}>
      <div style={{ fontSize: "9.5pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #bbb", paddingBottom: "2px", marginBottom: "8px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ── Canada CV ─────────────────────────────────────────────────────────────────

function CanadaCV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const A = "#cc0000";
  const BG = "#fff0f0";
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
  const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))].slice(0, 18);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#111", background: "#fff", padding: "26px 36px" }}>
      {/* Name block */}
      <div style={{ marginBottom: "8px" }}>
        <div style={{ fontSize: "22pt", fontWeight: "bold", color: A }}>{p.name}</div>
        <div style={{ fontSize: "11pt", color: "#555", marginBottom: "5px" }}>{clean(p.title)}</div>
        <div style={{ fontSize: "8.5pt", color: "#666" }}>
          {[p.email, p.phone, p.location,
            p.social.linkedin && p.social.linkedin.replace("https://www.", "").replace("https://", ""),
          ].filter(Boolean).join("  |  ")}
        </div>
      </div>
      <div style={{ height: "3px", background: A, marginBottom: "14px" }} />

      <CanSec title="Professional Profile" color={A}>
        <p style={{ margin: 0, lineHeight: 1.6, fontSize: "9.5pt" }}>{clean(p.bio)}</p>
      </CanSec>

      <CanSec title="Core Competencies" color={A}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
          {skills.map((s, i) => (
            <div key={i} style={{ background: BG, color: A, borderRadius: "3px", padding: "3px 8px", fontSize: "8.5pt", textAlign: "center" }}>
              {s}
            </div>
          ))}
        </div>
      </CanSec>

      {work.length > 0 && (
        <CanSec title="Professional Experience" color={A}>
          {work.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "12px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ width: "90px", flexShrink: 0, fontSize: "8.5pt", color: A, fontWeight: "bold", paddingTop: "2px" }}>{e.period}</div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(e.title)}</strong>
                <div style={{ color: "#555", fontSize: "9.5pt", marginBottom: "2px" }}>{clean(e.company)}</div>
                <div style={{ fontSize: "9.5pt", lineHeight: 1.55 }}>{clean(e.description)}</div>
                {e.tech.length > 0 && <Tags items={e.tech.slice(0, 8)} bg={BG} color={A} />}
              </div>
            </div>
          ))}
        </CanSec>
      )}

      {proj.length > 0 && (
        <CanSec title="Key Projects" color={A}>
          {proj.map((pr, i) => (
            <div key={i} style={{ marginBottom: "11px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <strong style={{ fontSize: "10.5pt" }}>{clean(pr.title)}</strong>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.55, marginTop: "2px" }}>{cut(pr.description, 230)}</div>
              {pr.tech.length > 0 && <Tags items={pr.tech.slice(0, 9)} bg={BG} color={A} />}
            </div>
          ))}
        </CanSec>
      )}

      {edu.length > 0 && (
        <CanSec title="Education" color={A}>
          {edu.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "8px" }}>
              <div style={{ width: "90px", flexShrink: 0, fontSize: "8.5pt", color: A, fontWeight: "bold" }}>{e.period}</div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(e.title)}</strong>
                <div style={{ fontSize: "9.5pt", color: "#555" }}>{clean(e.company)}</div>
                <div style={{ fontSize: "9.5pt", lineHeight: 1.55 }}>{clean(e.description)}</div>
              </div>
            </div>
          ))}
        </CanSec>
      )}

      {data.certifications.length > 0 && (
        <CanSec title="Certifications & Credentials" color={A}>
          {data.certifications.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div>
                <strong style={{ fontSize: "10pt" }}>{clean(c.name)}</strong>
                <div style={{ fontSize: "8.5pt", color: "#777" }}>{c.issuer}</div>
              </div>
              <div style={{ fontSize: "9pt", color: "#777" }}>{c.year}</div>
            </div>
          ))}
        </CanSec>
      )}
    </div>
  );
}

function CanSec({ title, color, children }: { title: string; color: string; children: ReactNode }) {
  return (
    <div data-cv-section="true" style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "9.5pt", fontWeight: "bold", color, textTransform: "uppercase", letterSpacing: "1px", borderBottom: `1px solid #e8b0b0`, paddingBottom: "2px", marginBottom: "8px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ── UK CV ─────────────────────────────────────────────────────────────────────

function UKSec({ title, accent, children }: { title: string; accent: string; children: ReactNode }) {
  return (
    <div data-cv-section="true" style={{ marginBottom: "14px" }}>
      <div style={{ color: accent, fontWeight: "bold", fontSize: "9pt", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>{title}</div>
      <div style={{ borderBottom: `1px solid ${accent}`, marginBottom: "7px" }} />
      {children}
    </div>
  );
}

function UKCV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const A = "#1a4f7a";
  const BG = "#e8f0f7";
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
  const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#1a1a1a", background: "#fff", padding: "32px 36px" }}>
      <div style={{ borderBottom: `2.5px solid ${A}`, paddingBottom: "12px", marginBottom: "14px" }}>
        <div style={{ fontSize: "24pt", fontWeight: "bold", color: "#1a1a1a", marginBottom: "2px" }}>{p.name}</div>
        <div style={{ fontSize: "11.5pt", color: A, marginBottom: "8px" }}>{clean(p.title)}</div>
        <div style={{ fontSize: "8.5pt", color: "#555" }}>
          {[p.email, p.phone, p.location, p.social.linkedin?.replace("https://www.", "").replace("https://", ""), p.website?.replace(/^https?:\/\//, "")].filter(Boolean).join("   ·   ")}
        </div>
      </div>

      <UKSec title="Personal Statement" accent={A}>
        <p style={{ margin: 0, lineHeight: 1.6, fontSize: "9.5pt" }}>{clean(p.bio)}</p>
      </UKSec>

      <UKSec title="Core Skills" accent={A}>
        <Tags items={skills.slice(0, 22)} bg={BG} color={A} />
      </UKSec>

      {work.length > 0 && (
        <UKSec title="Work Experience" accent={A}>
          {work.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={e.tech} accent={A} tagBg={BG} />)}
        </UKSec>
      )}

      {proj.length > 0 && (
        <UKSec title="Key Projects" accent={A}>
          {proj.map((pr, i) => (
            <div key={i} style={{ marginBottom: "11px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <strong style={{ fontSize: "10.5pt" }}>{clean(pr.title)}</strong>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.55, marginTop: "2px" }}>{cut(pr.description, 230)}</div>
              {pr.tech.length > 0 && <Tags items={pr.tech.slice(0, 10)} bg={BG} color={A} />}
            </div>
          ))}
        </UKSec>
      )}

      {edu.length > 0 && (
        <UKSec title="Education & Qualifications" accent={A}>
          {edu.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={[]} accent={A} tagBg={BG} />)}
        </UKSec>
      )}

      {data.certifications.length > 0 && (
        <UKSec title="Professional Development" accent={A}>
          {data.certifications.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "10pt" }}>{clean(c.name)}</div>
                <div style={{ fontSize: "8.5pt", color: "#777" }}>{c.issuer}</div>
              </div>
              <div style={{ fontSize: "9pt", color: "#777" }}>{c.year}</div>
            </div>
          ))}
        </UKSec>
      )}
    </div>
  );
}

// ── Australia / NZ CV ─────────────────────────────────────────────────────────

function ANZSec({ title, accent, children }: { title: string; accent: string; children: ReactNode }) {
  return (
    <div data-cv-section="true" style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
        <div style={{ width: "3px", height: "14px", background: accent, flexShrink: 0 }} />
        <div style={{ color: "#1a1a1a", fontWeight: "bold", fontSize: "9.5pt", textTransform: "uppercase", letterSpacing: "0.8px" }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function ANZCV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const A = "#1b6b72";
  const BG = "#e0f4f5";
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
  const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#1a1a1a", background: "#fff" }}>
      <div style={{ height: "5px", background: A }} />
      <div style={{ padding: "24px 32px" }}>
        <div style={{ marginBottom: "16px", paddingBottom: "10px", borderBottom: `1px solid ${A}` }}>
          <div style={{ fontSize: "23pt", fontWeight: "bold", color: "#1a1a1a", marginBottom: "2px" }}>{p.name}</div>
          <div style={{ fontSize: "11pt", color: A, marginBottom: "8px" }}>{clean(p.title)}</div>
          <div style={{ fontSize: "8.5pt", color: "#555" }}>
            {[p.email, p.phone, p.location, p.social.linkedin?.replace("https://www.", "").replace("https://", "")].filter(Boolean).join("   |   ")}
          </div>
        </div>

        <ANZSec title="Professional Profile" accent={A}>
          <p style={{ margin: 0, lineHeight: 1.6, fontSize: "9.5pt" }}>{clean(p.bio)}</p>
        </ANZSec>

        {work.length > 0 && (
          <ANZSec title="Work Experience" accent={A}>
            {work.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={e.tech} accent={A} tagBg={BG} />)}
          </ANZSec>
        )}

        {proj.length > 0 && (
          <ANZSec title="Key Projects" accent={A}>
            {proj.map((pr, i) => (
              <div key={i} style={{ marginBottom: "11px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(pr.title)}</strong>
                <div style={{ fontSize: "9.5pt", lineHeight: 1.55, marginTop: "2px" }}>{cut(pr.description, 230)}</div>
                {pr.tech.length > 0 && <Tags items={pr.tech.slice(0, 10)} bg={BG} color={A} />}
              </div>
            ))}
          </ANZSec>
        )}

        <ANZSec title="Key Skills" accent={A}>
          <Tags items={skills.slice(0, 24)} bg={BG} color={A} />
        </ANZSec>

        {edu.length > 0 && (
          <ANZSec title="Education" accent={A}>
            {edu.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={[]} accent={A} tagBg={BG} />)}
          </ANZSec>
        )}

        {data.certifications.length > 0 && (
          <ANZSec title="Certifications & Credentials" accent={A}>
            {data.certifications.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "10pt" }}>{clean(c.name)}</div>
                  <div style={{ fontSize: "8.5pt", color: "#777" }}>{c.issuer}</div>
                </div>
                <div style={{ fontSize: "9pt", color: "#777" }}>{c.year}</div>
              </div>
            ))}
          </ANZSec>
        )}

        <div style={{ marginTop: "16px", paddingTop: "8px", borderTop: "1px solid #d1d5db" }}>
          <div style={{ fontSize: "9pt", color: "#777", fontStyle: "italic" }}>References available upon request</div>
        </div>
      </div>
    </div>
  );
}

// ── Germany — Lebenslauf ──────────────────────────────────────────────────────

const LEBENSLAUF_HTML_LABELS = {
  en: {
    title: "Curriculum Vitae", personal: "Personal Information",
    fields: { email: "Email", phone: "Phone", address: "Address", nationality: "Nationality", dob: "Date of Birth", pob: "Place of Birth", marital: "Marital Status" },
    add: "[Add]", dobPlaceholder: "[DD.MM.YYYY]", cityPlaceholder: "[City]",
    work: "Work Experience", edu: "Education", skills: "Technical Skills",
    lang: "Languages", langLine: "English (Fluent) | [Add your languages]",
    projects: "Key Projects", certs: "Certifications",
    sign: "Signature",
  },
  de: {
    title: "Lebenslauf", personal: "Persönliche Angaben",
    fields: { email: "E-Mail", phone: "Telefon", address: "Anschrift", nationality: "Nationalität", dob: "Geburtsdatum", pob: "Geburtsort", marital: "Familienstand" },
    add: "[Hinzufügen]", dobPlaceholder: "[TT.MM.JJJJ]", cityPlaceholder: "[Ort]",
    work: "Berufserfahrung", edu: "Ausbildung", skills: "Technische Kenntnisse",
    lang: "Sprachkenntnisse", langLine: "Englisch (Fließend) | [Sprachen hinzufügen]",
    projects: "Schlüsselprojekte", certs: "Zertifizierungen",
    sign: "Unterschrift",
  },
};

function LebSec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div data-cv-section="true" style={{ marginBottom: "14px" }}>
      <div style={{ fontWeight: "bold", fontSize: "8.5pt", color: "#2c2c2c", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "0.5px solid #aaa", paddingBottom: "3px", marginBottom: "8px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function LebEntry({ period, title, org, desc, tech, accent, mid, bg }: {
  period: string; title: string; org: string; desc: string;
  tech: string[]; accent: string; mid: string; bg: string;
}) {
  return (
    <div data-cv-section="true" style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
      <div style={{ width: "82px", flexShrink: 0, fontSize: "8.5pt", color: mid, paddingTop: "1px" }}>{period}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "bold", fontSize: "10.5pt", color: accent }}>{clean(title)}</div>
        {org && <div style={{ fontSize: "9.5pt", color: mid, marginBottom: "2px" }}>{clean(org)}</div>}
        {desc && <div style={{ fontSize: "9.5pt", lineHeight: 1.55, color: "#333" }}>{clean(desc)}</div>}
        {tech.length > 0 && <Tags items={tech} bg={bg} color={accent} />}
      </div>
    </div>
  );
}

function LebenslaufCV({ data, lang = "en" }: { data: PortfolioData; lang?: "en" | "de" }) {
  const p = data.personalInfo;
  const A = "#2c2c2c";
  const MID = "#555";
  const BG = "#f2f2f2";
  const L = LEBENSLAUF_HTML_LABELS[lang];
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 2);
  const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))];

  // System date formatted for the locale
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const todayStr = `${dd}.${mm}.${yyyy}`;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#1a1a1a", background: "#fff" }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #2c2c2c", padding: "22px 32px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "11pt", letterSpacing: "3px", color: A, marginBottom: "12px", textTransform: "uppercase" }}>
            {L.title}
          </div>
          <div style={{ fontSize: "20pt", fontWeight: "bold", color: A, marginBottom: "2px" }}>{p.name}</div>
          <div style={{ fontSize: "10pt", color: MID, marginBottom: "10px" }}>{clean(p.title)}</div>
          <div style={{ fontSize: "8pt", fontWeight: "bold", color: MID, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{L.personal}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 20px", fontSize: "8pt" }}>
            <span><span style={{ color: MID }}>{L.fields.email}: </span>{p.email}</span>
            <span><span style={{ color: MID }}>{L.fields.nationality}: </span>{p.nationality || L.add}</span>
            <span><span style={{ color: MID }}>{L.fields.phone}: </span>{p.phone}</span>
            <span><span style={{ color: MID }}>{L.fields.dob}: </span>{p.dateOfBirth || L.dobPlaceholder}</span>
            <span><span style={{ color: MID }}>{L.fields.address}: </span>{p.location}</span>
            <span><span style={{ color: MID }}>{L.fields.pob}: </span>{p.placeOfBirth || L.add}</span>
          </div>
        </div>
        {p.avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatar} alt="Profile" style={{ width: "78px", height: "100px", objectFit: "cover", border: "1px solid #ccc", marginLeft: "20px", flexShrink: 0 }} />
        )}
      </div>

      <div style={{ padding: "14px 32px" }}>
        {work.length > 0 && (
          <LebSec title={L.work}>
            {work.map((e, i) => <LebEntry key={i} period={e.period} title={e.title} org={e.company} desc={e.description} tech={e.tech} accent={A} mid={MID} bg={BG} />)}
          </LebSec>
        )}
        {edu.length > 0 && (
          <LebSec title={L.edu}>
            {edu.map((e, i) => <LebEntry key={i} period={e.period} title={e.title} org={e.company} desc={e.description} tech={[]} accent={A} mid={MID} bg={BG} />)}
          </LebSec>
        )}
        <LebSec title={L.skills}>
          <Tags items={skills.slice(0, 28)} bg={BG} color={A} />
        </LebSec>
        <LebSec title={L.lang}>
          <div style={{ fontSize: "9.5pt" }}>{L.langLine}</div>
        </LebSec>
        {proj.length > 0 && (
          <LebSec title={L.projects}>
            {proj.map((pr, i) => <LebEntry key={i} period={pr.date || "—"} title={pr.title} org="" desc={cut(pr.description, 200)} tech={pr.tech.slice(0, 8)} accent={A} mid={MID} bg={BG} />)}
          </LebSec>
        )}
        {data.certifications.length > 0 && (
          <LebSec title={L.certs}>
            {data.certifications.map((c, i) => <LebEntry key={i} period={String(c.year)} title={c.name} org={c.issuer} desc="" tech={[]} accent={A} mid={MID} bg={BG} />)}
          </LebSec>
        )}
        {/* Signature */}
        <div data-cv-section="true" style={{ marginTop: "20px", paddingTop: "10px", borderTop: "0.5px solid #aaa" }}>
          <div style={{ fontSize: "9pt", color: MID, marginBottom: "20px" }}>{L.cityPlaceholder}, {todayStr}</div>
          <div style={{ fontSize: "9pt", fontWeight: "bold", color: A, marginBottom: "4px" }}>{L.sign}:</div>
          <div style={{ borderBottom: "0.5px solid #aaa", width: "160px", marginBottom: "4px" }} />
          <div style={{ fontSize: "9pt", color: A }}>{p.name}</div>
        </div>
      </div>
    </div>
  );
}

// ── Academic / Research CV ────────────────────────────────────────────────────

function AcadSec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div data-cv-section="true" style={{ marginBottom: "16px" }}>
      <div style={{ fontWeight: "bold", fontSize: "9.5pt", textTransform: "uppercase", letterSpacing: "1.5px", borderBottom: "1px solid #1a1a1a", paddingBottom: "2px", marginBottom: "8px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function AcademicCV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const MID = "#555";
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured);

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "10pt", color: "#1a1a1a", background: "#fff", padding: "36px 42px" }}>
      <div style={{ textAlign: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: "22pt", fontWeight: "bold", marginBottom: "4px" }}>{p.name}</div>
        <div style={{ fontSize: "10pt", color: MID, marginBottom: "8px" }}>{clean(p.title)}</div>
        <div style={{ fontSize: "8.5pt", color: MID }}>
          {[p.email, p.phone, p.location, p.social.linkedin?.replace("https://www.", "").replace("https://", ""), p.website?.replace(/^https?:\/\//, "")].filter(Boolean).join("   |   ")}
        </div>
      </div>

      <AcadSec title="Research Interests">
        <p style={{ margin: 0, lineHeight: 1.7, fontSize: "9.5pt" }}>{clean(p.bio)}</p>
      </AcadSec>

      {edu.length > 0 && (
        <AcadSec title="Education">
          {edu.map((e, i) => (
            <div key={i} style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(e.title)}</strong>
                <span style={{ fontSize: "8.5pt", color: MID }}>{e.period}</span>
              </div>
              <div style={{ color: MID, fontSize: "9.5pt", fontStyle: "italic" }}>{clean(e.company)}</div>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.6, marginTop: "2px" }}>{clean(e.description)}</div>
            </div>
          ))}
        </AcadSec>
      )}

      {work.length > 0 && (
        <AcadSec title="Academic & Professional Appointments">
          {work.map((e, i) => (
            <div key={i} style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(e.title)}</strong>
                <span style={{ fontSize: "8.5pt", color: MID }}>{e.period}</span>
              </div>
              <div style={{ color: MID, fontSize: "9.5pt", fontStyle: "italic" }}>{clean(e.company)}</div>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.6, marginTop: "2px" }}>{clean(e.description)}</div>
            </div>
          ))}
        </AcadSec>
      )}

      {proj.length > 0 && (
        <AcadSec title="Publications & Research Projects">
          {proj.map((pr, i) => (
            <div key={i} style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid", fontSize: "9.5pt", lineHeight: 1.6 }}>
              <strong>{i + 1}.</strong>&nbsp;
              <strong>{clean(pr.title)}</strong>.&nbsp;
              {cut(pr.description, 240)}
              {pr.tech.length > 0 && <span style={{ color: MID, fontStyle: "italic" }}>&nbsp;[{pr.tech.join(", ")}]</span>}
            </div>
          ))}
        </AcadSec>
      )}

      <AcadSec title="Technical Skills & Tools">
        {data.techStack.slice(0, 6).map((cat, i) => (
          <div key={i} style={{ fontSize: "9.5pt", marginBottom: "4px" }}>
            <strong>{clean(cat.category)}:</strong>&nbsp;
            <span style={{ color: MID }}>{cat.items.map(item => item.name).slice(0, 10).join(", ")}</span>
          </div>
        ))}
      </AcadSec>

      {data.certifications.length > 0 && (
        <AcadSec title="Awards, Grants & Qualifications">
          {data.certifications.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div>
                <strong style={{ fontSize: "10pt" }}>{clean(c.name)}</strong>
                <div style={{ fontSize: "8.5pt", color: MID, fontStyle: "italic" }}>{c.issuer}</div>
              </div>
              <div style={{ fontSize: "9pt", color: MID }}>{c.year}</div>
            </div>
          ))}
        </AcadSec>
      )}
    </div>
  );
}

// ── Pakistan / India CV ───────────────────────────────────────────────────────

function PakIndiaCV({ data }: { data: PortfolioData }) {
  const p = data.personalInfo;
  const A = "#1e3a5f";
  const BG = "#eef2f8";
  const work = data.experiences.filter(e => e.type !== "education");
  const edu = data.experiences.filter(e => e.type === "education");
  const proj = data.projects.filter(pr => pr.featured).slice(0, 3);
  const skills = [...new Set(data.techStack.flatMap(c => c.items.map(i => i.name)))];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt", color: "#111", background: "#fff" }}>
      {/* Header */}
      <div style={{ background: A, color: "#fff", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "20pt", fontWeight: "bold", marginBottom: "2px" }}>{p.name}</div>
          <div style={{ fontSize: "10pt", opacity: 0.7, marginBottom: "9px" }}>{clean(p.title)}</div>
          {/* Personal details grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 20px", fontSize: "8pt", color: "#8faec8" }}>
            <span>Email: {p.email}</span>
            <span>Phone: {p.phone}</span>
            <span>Location: {p.location}</span>
            <span>Nationality: {p.nationality || "[Add]"}</span>
            <span>CNIC / ID No: {p.cnic || "[Add]"}</span>
            <span>Date of Birth: {p.dateOfBirth || "[Add]"}</span>
            <span>Religion: {p.religion || "[Add]"}</span>
            <span>Marital Status: {p.maritalStatus || "[Add]"}</span>
          </div>
          {(p.social.linkedin || p.social.github) && (
            <div style={{ fontSize: "7.5pt", color: "#6f90aa", marginTop: "5px" }}>
              {p.social.linkedin && <span>{p.social.linkedin.replace("https://www.", "").replace("https://", "")}</span>}
              {p.social.linkedin && p.social.github && <span style={{ margin: "0 8px" }}>|</span>}
              {p.social.github && <span>{p.social.github.replace("https://", "")}</span>}
            </div>
          )}
        </div>
        {p.avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatar} alt="Profile" style={{ width: "82px", height: "102px", objectFit: "cover", border: "3px solid #2a4f7a", marginLeft: "16px", flexShrink: 0 }} />
        )}
      </div>

      <div style={{ padding: "16px 28px" }}>
        {/* Career Objective */}
        <Sec title="Career Objective" color={A}>
          <p style={{ margin: 0, lineHeight: 1.6, fontSize: "9.5pt" }}>{cut(p.bio, 350)}</p>
        </Sec>

        {/* Work Experience */}
        {work.length > 0 && (
          <Sec title="Work Experience" color={A}>
            {work.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={e.tech} accent={A} tagBg={BG} />)}
          </Sec>
        )}

        {/* Key Projects */}
        {proj.length > 0 && (
          <Sec title="Key Projects" color={A}>
            {proj.map((pr, i) => (
              <div key={i} style={{ marginBottom: "11px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <strong style={{ fontSize: "10.5pt" }}>{clean(pr.title)}</strong>
                <div style={{ fontSize: "9.5pt", lineHeight: 1.55, marginTop: "2px" }}>{cut(pr.description, 230)}</div>
                {pr.tech.length > 0 && <Tags items={pr.tech.slice(0, 10)} bg={BG} color={A} />}
              </div>
            ))}
          </Sec>
        )}

        {/* Technical Skills */}
        <Sec title="Technical Skills" color={A}>
          <Tags items={skills.slice(0, 28)} bg={BG} color={A} />
        </Sec>

        {/* Education */}
        {edu.length > 0 && (
          <Sec title="Education" color={A}>
            {edu.map((e, i) => <ExpBlock key={i} title={e.title} company={e.company} period={e.period} desc={e.description} tech={e.tech} accent={A} tagBg={BG} />)}
          </Sec>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <Sec title="Certifications" color={A}>
            {data.certifications.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "10pt" }}>{clean(c.name)}</div>
                  <div style={{ fontSize: "8.5pt", color: "#777" }}>{c.issuer}</div>
                </div>
                <div style={{ fontSize: "9pt", color: "#777" }}>{c.year}</div>
              </div>
            ))}
          </Sec>
        )}

        {/* Languages */}
        <Sec title="Languages Known" color={A}>
          <div style={{ fontSize: "9.5pt", color: "#374151" }}>
            English (Fluent)&nbsp;&nbsp;|&nbsp;&nbsp;Urdu (Native)&nbsp;&nbsp;|&nbsp;&nbsp;Arabic (Basic)
          </div>
        </Sec>

        {/* Declaration */}
        <div data-cv-section="true" style={{ marginBottom: "12px", borderTop: "1px solid #d1d5db", paddingTop: "10px" }}>
          <div style={{ fontSize: "9pt", fontWeight: "bold", color: "#374151", marginBottom: "5px", letterSpacing: "0.5px" }}>DECLARATION</div>
          <div style={{ fontSize: "8.5pt", color: "#6b7280", lineHeight: 1.5 }}>
            I hereby declare that all the information mentioned above is true to the best of my knowledge and belief.
            I shall be held responsible for any false information provided herein.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", fontSize: "9pt", color: "#374151" }}>
            <span>Date: ________________</span>
            <span>Signature: ________________</span>
          </div>
          <div style={{ marginTop: "4px", fontSize: "8.5pt", color: "#374151" }}>Place: ________________</div>
        </div>

        {/* References */}
        <div style={{ fontSize: "9pt", color: "#6b7280", fontStyle: "italic" }}>
          References: Available upon request
        </div>
      </div>
    </div>
  );
}

// ── Shared Section helper ─────────────────────────────────────────────────────

function Sec({ title, color, children }: { title: string; color: string; children: ReactNode }) {
  return (
    <div data-cv-section="true" style={{ marginBottom: "16px" }}>
      <SectionHeader title={title} color={color} />
      {children}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

const FORMAT_NAMES: Record<string, string> = {
  gulf: "Gulf CV",
  saudi: "Saudi CV",
  emirati: "Emirati CV",
  europass: "Europass CV",
  usa: "USA Resume",
  canada: "Canadian CV",
  pakIndia: "Pakistan / India CV",
  uk: "UK CV",
  anz: "Australia / NZ CV",
  lebenslauf: "Lebenslauf (EN)",
  "lebenslauf-de": "Lebenslauf (DE)",
  academic: "Academic CV",
};

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EmailShareDialog({
  open, onClose, senderName, format, generatePDF,
}: {
  open: boolean; onClose: () => void;
  senderName: string; format: string;
  generatePDF: () => Promise<string>; // returns base64 PDF
}) {
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "generating" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setTo(""); setStatus("idle"); setError(""); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [open]);

  if (!open) return null;

  async function handleSend() {
    if (!to.trim()) return;
    setError("");
    try {
      setStatus("generating");
      const pdfBase64 = await generatePDF();

      setStatus("sending");
      const filename = `${senderName.replace(/\s+/g, "-")}-${format}.pdf`;
      const res = await fetch("/api/share-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.trim(), senderName, format, pdfBase64, filename }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      setStatus("done");
      setTimeout(onClose, 2500);
    } catch (e) {
      setError((e as Error).message);
      setStatus("idle");
    }
  }

  const isBusy = status === "generating" || status === "sending";
  const statusLabel = status === "generating" ? "Generating PDF…" : status === "sending" ? "Sending…" : "Send as PDF";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: "14px", padding: "28px",
        width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
        }}><X size={18} /></button>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>Share CV via Email</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Enter the recipient&apos;s email address</p>
        </div>

        {status === "done" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>✅</div>
            <p style={{ margin: 0, color: "#16a34a", fontWeight: 600 }}>CV sent as PDF attachment!</p>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="recipient@example.com"
              disabled={isBusy}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: "8px",
                border: "1.5px solid #e2e8f0", fontSize: "14px", color: "#0f172a",
                outline: "none", boxSizing: "border-box", marginBottom: "8px",
                opacity: isBusy ? 0.6 : 1,
              }}
            />
            {error && <p style={{ margin: "0 0 8px", color: "#ef4444", fontSize: "13px" }}>{error}</p>}
            <button
              onClick={handleSend}
              disabled={isBusy || !to.trim()}
              style={{
                width: "100%", padding: "11px", borderRadius: "8px",
                background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                color: "#fff", border: "none", fontWeight: 600, fontSize: "14px",
                cursor: isBusy || !to.trim() ? "not-allowed" : "pointer",
                opacity: isBusy || !to.trim() ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {isBusy ? <><Loader2 size={15} className="animate-spin" /> {statusLabel}</> : <><Send size={15} /> Send as PDF</>}
            </button>
            <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
              The CV will be generated and attached as a PDF
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function CVPreview({ data, format }: { data: PortfolioData; format: string }) {
  const [generating, setGenerating] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  // Auto-download on page open (bypasses print dialog so colors are preserved)
  useEffect(() => {
    const t = setTimeout(() => handleDownload(), 1200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Returns the PDF as a base64 data-URI string (used by both download and email)
  async function buildPDF(): Promise<string> {
    const [{ toJpeg }, { jsPDF }] = await Promise.all([
      import("html-to-image"),
      import("jspdf"),
    ]);

    const el = document.getElementById("cv-content");
    if (!el) throw new Error("CV element not found");

    const prevWidth     = el.style.width;
    const prevMaxWidth  = el.style.maxWidth;
    const prevMarginTop = el.style.marginTop;
    el.style.width     = "794px";
    el.style.maxWidth  = "794px";
    el.style.marginTop = "0";

    const overrideStyle = document.createElement("style");
    overrideStyle.id = "hti-color-scheme-override";
    overrideStyle.textContent =
      "html,body,*,*::before,*::after{color-scheme:light!important;}";
    document.head.appendChild(overrideStyle);

    await new Promise<void>((res) =>
      requestAnimationFrame(() => requestAnimationFrame(() => res()))
    );

    const A4_H  = 794 * 297 / 210;
    const BOT   = 12  * 794 / 210;
    const TOP   = 14  * 794 / 210;
    const PAGE1 = A4_H - BOT;
    const PAGEN = A4_H - BOT - TOP;

    const sections = Array.from(el.querySelectorAll<HTMLElement>("[data-cv-section]"));
    const savedPaddings: Array<{ node: HTMLElement; prev: string }> = [];

    for (const sec of sections) {
      savedPaddings.push({ node: sec, prev: sec.style.paddingTop });
      const elRect  = el.getBoundingClientRect();
      const secRect = sec.getBoundingClientRect();
      const topInEl = secRect.top - elRect.top;
      let consumed = 0; let pageNum = 0;
      while (consumed + (pageNum === 0 ? PAGE1 : PAGEN) < topInEl) {
        consumed += pageNum === 0 ? PAGE1 : PAGEN; pageNum++;
      }
      const pageH = pageNum === 0 ? PAGE1 : PAGEN;
      const posInPage = topInEl - consumed;
      const secHeight = secRect.height;
      const wouldOverflow = posInPage + secHeight > pageH;
      // Push to next page if: starts in last 8% of page, OR content overflows
      // (and the section fits on a fresh page — avoids infinite loop on giant sections)
      if ((posInPage > pageH * 0.92 || (wouldOverflow && secHeight <= PAGEN)) && posInPage > 30) {
        sec.style.paddingTop = `${Math.ceil(pageH - posInPage)}px`;
        await new Promise<void>((res) =>
          requestAnimationFrame(() => requestAnimationFrame(() => res()))
        );
      }
    }

    const imgData = await toJpeg(el, {
      quality: 0.97, backgroundColor: "#ffffff", pixelRatio: 2, skipFonts: false,
    });

    el.style.width     = prevWidth;
    el.style.maxWidth  = prevMaxWidth;
    el.style.marginTop = prevMarginTop;
    document.head.removeChild(overrideStyle);
    for (const { node, prev } of savedPaddings) node.style.paddingTop = prev;

    const pdf   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const img   = new Image();
    await new Promise<void>((res) => { img.onload = () => res(); img.src = imgData; });
    const imgH = (img.height * pageW) / img.width;

    const TOP_MARGIN = 14; const BOTTOM_MARGIN = 12;
    let imgY = 0; let pageNum = 0;

    while (imgY < imgH) {
      if (pageNum > 0) {
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, TOP_MARGIN - imgY, pageW, imgH);
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageW, TOP_MARGIN, "F");
        pdf.rect(0, pageH - BOTTOM_MARGIN, pageW, BOTTOM_MARGIN, "F");
        imgY += pageH - TOP_MARGIN - BOTTOM_MARGIN;
      } else {
        pdf.addImage(imgData, "JPEG", 0, 0, pageW, imgH);
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, pageH - BOTTOM_MARGIN, pageW, BOTTOM_MARGIN, "F");
        imgY += pageH - BOTTOM_MARGIN;
      }
      pageNum++;
    }

    // Return as base64 string (strip the data-URI prefix for nodemailer)
    return pdf.output("datauristring");
  }

  async function handleDownload() {
    if (generating) return;
    setGenerating(true);
    try {
      const dataUri = await buildPDF();
      const link = document.createElement("a");
      link.href = dataUri;
      link.download = `cv-${data.personalInfo.name.replace(/\s+/g, "-")}-${format}.pdf`;
      link.click();
    } finally {
      setGenerating(false);
    }
  }

  async function shareViaWhatsApp() {
    if (generating) return;
    setGenerating(true);
    try {
      const pdfDataUri = await buildPDF();
      const base64 = pdfDataUri.split(",")[1];
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      const name = clean(data.personalInfo.name).replace(/\s+/g, "_") || "CV";
      const filename = `${name}_CV.pdf`;
      const file = new File([blob], filename, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: filename, files: [file] });
      } else {
        // Fallback for desktop: just download the PDF
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") console.error("Share failed:", err);
    } finally {
      setGenerating(false);
    }
  }

  function shareViaEmail() {
    setEmailDialogOpen(true);
  }

  function renderCV() {
    switch (format) {
      case "gulf":          return <GulfCV data={data} />;
      case "saudi":         return <SaudiCV data={data} />;
      case "emirati":       return <EmiratiCV data={data} />;
      case "europass":      return <EuropassCV data={data} />;
      case "canada":        return <CanadaCV data={data} />;
      case "pakIndia":      return <PakIndiaCV data={data} />;
      case "uk":            return <UKCV data={data} />;
      case "anz":           return <ANZCV data={data} />;
      case "lebenslauf":    return <LebenslaufCV data={data} lang="en" />;
      case "lebenslauf-de": return <LebenslaufCV data={data} lang="de" />;
      case "academic":      return <AcademicCV data={data} />;
      default:              return <USACV data={data} />;
    }
  }

  return (
    <>
      {/* Instruction bar — hidden when printing */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 text-sm"
        style={{ background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-indigo-400">{FORMAT_NAMES[format] ?? "CV"} Preview</span>
          <span className="text-slate-400 text-xs hidden md:block">
            Click <strong>⬇ Download PDF</strong> for a full-color PDF · or use <strong>Print</strong> with Background graphics enabled
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={shareViaWhatsApp}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-medium disabled:opacity-60"
            style={{ background: "#25d366" }}
            title="Share PDF via WhatsApp"
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">Share PDF</span>
          </button>
          <button
            onClick={shareViaEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-medium"
            style={{ background: "#4f46e5" }}
            title="Share via Email"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Email</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={generating}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-sm font-medium disabled:opacity-60"
            style={{ background: "#6366f1" }}
          >
            {generating
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
              : "⬇ Download PDF"
            }
          </button>
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ background: "#374151", color: "#9ca3af" }}
            title="Open browser print dialog (enable Background graphics for colors)"
          >
            Print
          </button>
          <button
            onClick={() => window.close()}
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ background: "#1f2937", color: "#6b7280" }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* CV content — id required for html2canvas capture */}
      <div id="cv-content" className="print:mt-0 bg-white" style={{ marginTop: "52px" }}>
        {renderCV()}
      </div>

      <EmailShareDialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        senderName={data.personalInfo.name}
        format={FORMAT_NAMES[format] ?? "CV"}
        generatePDF={buildPDF}
      />
    </>
  );
}
