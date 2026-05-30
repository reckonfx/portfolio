"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, MapPin, Circle, Briefcase, ChevronRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";
import { Mail } from "lucide-react";
import type { PersonalInfo } from "@/lib/types";

// ── Subtle particle canvas ────────────────────────────────────────────────────

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.4, o: Math.random() * 0.35 + 0.08,
      h: Math.random() > 0.5 ? 245 : 270,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h},70%,65%,${p.o})`; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - d / 110)})`; ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Highlight specific words in bio text ──────────────────────────────────────

function HighlightedHeadline({ text }: { text: string }) {
  // Words/phrases to highlight in gradient — customise to match your content
  const highlights = ["logistics", "business", "web applications", "powerful", "SaaS", "systems", "solutions"];
  let remaining = text;
  const parts: { str: string; highlight: boolean }[] = [];

  while (remaining.length > 0) {
    let matched = false;
    for (const word of highlights) {
      const idx = remaining.toLowerCase().indexOf(word.toLowerCase());
      if (idx === 0) {
        parts.push({ str: remaining.slice(0, word.length), highlight: true });
        remaining = remaining.slice(word.length);
        matched = true;
        break;
      } else if (idx > 0) {
        parts.push({ str: remaining.slice(0, idx), highlight: false });
        parts.push({ str: remaining.slice(idx, idx + word.length), highlight: true });
        remaining = remaining.slice(idx + word.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      parts.push({ str: remaining, highlight: false });
      remaining = "";
    }
  }

  return (
    <>
      {parts.map((p, i) =>
        p.highlight
          ? <span key={i} className="gradient-text">{p.str}</span>
          : <span key={i}>{p.str}</span>
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function HeroDemo({ data }: { data: PersonalInfo }) {
  const socialLinks = [
    { icon: GithubIcon,   href: data.social.github,   label: "GitHub" },
    { icon: LinkedinIcon, href: data.social.linkedin,  label: "LinkedIn" },
    { icon: TwitterIcon,  href: data.social.twitter,   label: "Twitter" },
    { icon: Mail,         href: `mailto:${data.email}`, label: "Email" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#08090c]">

      {/* ── Background layers ── */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#08090c]/50 to-[#08090c]" />

      {/* Ambient glow — left centre */}
      <div className="absolute top-1/3 left-1/4 w-[550px] h-[550px] bg-indigo-600/7 rounded-full blur-[130px] pointer-events-none" />
      {/* Ambient glow — right (behind photo) */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[600px] bg-violet-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-indigo-500/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none"><Particles /></div>

      {/* ── Main grid ── */}
      <div className="relative z-10 w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 pt-28 pb-16
                      flex flex-col lg:flex-row items-center gap-10 lg:gap-12 xl:gap-16">

        {/* ══ LEFT: Text ══════════════════════════════════════════════════════ */}
        <div className="flex-1 text-center lg:text-left min-w-0">

          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide"
          >
            <Circle className="w-2 h-2 fill-emerald-400 animate-pulse" />
            {data.availability}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] font-bold tracking-tight leading-[1.1] text-white mb-6"
          >
            <HighlightedHeadline text={data.bio} />
          </motion.h1>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="flex items-center gap-1.5 text-slate-500 text-sm mb-8 justify-center lg:justify-start"
          >
            <MapPin className="w-3.5 h-3.5" />
            {data.location}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-12"
          >
            <a href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              <Briefcase className="w-4 h-4" />
              Start a Project
            </a>
            <a href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200">
              View My Work
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>

          {/* Stats — inline with dividers */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center divide-x divide-white/10 justify-center lg:justify-start"
          >
            {data.stats.slice(0, 3).map((stat, i) => (
              <div key={i} className={`text-center lg:text-left ${i === 0 ? "pr-6" : "px-6"}`}>
                <div className="text-2xl sm:text-3xl font-bold gradient-text leading-none">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-slate-500 text-[11px] mt-1 leading-tight">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
            className="flex items-center gap-2.5 justify-center lg:justify-start mt-8"
          >
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="p-2.5 rounded-xl bg-white/4 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ══ RIGHT: Developer photo ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex-shrink-0 flex items-center justify-center"
        >
          {/* Wide violet glow behind the entire photo area */}
          <div className="absolute inset-0 -m-16 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 -m-8 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Photo container — rectangular, no circle */}
          <div className="relative"
            style={{ width: "300px", height: "420px" }}
          >
            {/* ── Photo image ── */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src={data.avatar}
                alt={data.name}
                fill
                className="object-cover object-top"
                priority
              />
              {/* Fade bottom into background */}
              <div className="absolute bottom-0 left-0 right-0 h-36
                bg-gradient-to-t from-[#08090c] via-[#08090c]/70 to-transparent" />
              {/* Fade left edge */}
              <div className="absolute top-0 left-0 bottom-0 w-12
                bg-gradient-to-r from-[#08090c]/60 to-transparent" />
              {/* Fade right edge */}
              <div className="absolute top-0 right-0 bottom-0 w-12
                bg-gradient-to-l from-[#08090c]/60 to-transparent" />
            </div>

            {/* ── Name + Designation card — top of photo ── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute top-4 left-4 right-4 z-20"
            >
              <div className="rounded-xl px-3.5 py-2.5 border border-white/12"
                style={{ background: "rgba(8,9,12,0.72)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
                <div className="text-white font-bold text-sm leading-snug">{data.name}</div>
                <div className="text-indigo-400 text-[11px] font-medium mt-0.5 leading-tight">{data.title}</div>
              </div>
            </motion.div>

            {/* ── Experience badge — floats on RIGHT side ── */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 top-[38%] z-20 rounded-2xl px-3.5 py-3 text-center border border-indigo-500/25 shadow-2xl shadow-indigo-900/40"
              style={{ background: "rgba(10,11,16,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            >
              <div className="text-xl font-bold gradient-text leading-none">
                {data.stats[0]?.value}{data.stats[0]?.suffix}
              </div>
              <div className="text-slate-400 text-[9px] mt-1 leading-tight max-w-[52px]">
                {data.stats[0]?.label}
              </div>
            </motion.div>

            {/* ── Projects badge — floats on LEFT side ── */}
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute -left-12 top-[55%] z-20 rounded-2xl px-3.5 py-3 text-center border border-violet-500/20 shadow-2xl shadow-violet-900/30"
              style={{ background: "rgba(10,11,16,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            >
              <div className="text-xl font-bold gradient-text leading-none">
                {data.stats[1]?.value}{data.stats[1]?.suffix}
              </div>
              <div className="text-slate-400 text-[9px] mt-1 leading-tight max-w-[52px]">
                {data.stats[1]?.label}
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="relative z-10 flex flex-col items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors pb-8"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.a>
    </section>
  );
}
