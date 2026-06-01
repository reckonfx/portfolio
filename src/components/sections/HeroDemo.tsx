"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Circle, Briefcase, Users, Clock, CheckCircle, Zap, TrendingUp } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";
import { Mail } from "lucide-react";
import type { PersonalInfo } from "@/lib/types";

// ── Particle canvas ───────────────────────────────────────────────────────────

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
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.1 + 0.3, o: Math.random() * 0.25 + 0.06,
      h: Math.random() > 0.5 ? 245 : 270,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h},65%,65%,${p.o})`; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,102,241,${0.05 * (1 - d / 100)})`; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Main component ────────────────────────────────────────────────────────────

export function HeroDemo({ data }: { data: PersonalInfo }) {
  // Split name: everything except last word is white, last word is gradient
  const nameParts = data.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName  = nameParts[nameParts.length - 1];

  const socialLinks = [
    { icon: GithubIcon,   href: data.social.github,    label: "GitHub" },
    { icon: LinkedinIcon, href: data.social.linkedin,   label: "LinkedIn" },
    { icon: TwitterIcon,  href: data.social.twitter,    label: "Twitter" },
    { icon: Mail,         href: `mailto:${data.email}`, label: "Email" },
  ];

  // Map stats → bottom bar with icons
  const bottomStats = [
    { icon: Briefcase,     stat: data.stats[1], fallback: { value: "20", suffix: "+", label: "Projects Completed" } },
    { icon: Users,         stat: data.stats[2], fallback: { value: "15", suffix: "+", label: "Happy Clients" } },
    { icon: Clock,         stat: data.stats[0], fallback: { value: "5",  suffix: "+", label: "Years Experience" } },
    { icon: CheckCircle,   stat: data.stats[3], fallback: { value: "100", suffix: "%", label: "Client Satisfaction" } },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#08090c]">

      {/* ── Backgrounds ── */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg,rgba(99,102,241,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#08090c]/40 to-[#08090c]" />

      {/* Violet glow — right half (behind photo) */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-violet-800/8 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[420px] h-[500px] bg-indigo-700/10 rounded-full blur-[110px] pointer-events-none" />
      {/* Subtle left glow */}
      <div className="absolute top-1/2 left-[10%] w-[350px] h-[350px] bg-indigo-600/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute inset-0"><Particles /></div>

      {/* ── Hero content ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-24 pb-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-6 xl:gap-0">

            {/* ══ LEFT: Text ══════════════════════════════════════════════════ */}
            <div className="flex-1 text-center lg:text-left min-w-0 lg:pr-8 xl:pr-16">

              {/* Availability pill */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide"
              >
                <Circle className="w-2 h-2 fill-emerald-400 animate-pulse" />
                {data.availability}
              </motion.div>

              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
                className="text-slate-400 text-lg sm:text-xl font-normal mb-1"
              >
                Hello, I&apos;m
              </motion.p>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-[3.8rem] xl:text-[4.4rem] font-extrabold text-white tracking-tight leading-[1.05]">
                  {firstName}
                </h1>
                <h1 className="text-5xl sm:text-6xl lg:text-[3.8rem] xl:text-[4.4rem] font-extrabold tracking-tight leading-[1.05] gradient-text mb-4">
                  {lastName}
                </h1>
              </motion.div>

              {/* Title */}
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.28 }}
                className="text-slate-300 text-base sm:text-lg font-medium mb-4"
              >
                {data.title}
              </motion.p>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
                className="text-slate-500 text-sm leading-relaxed mb-8 max-w-[480px] mx-auto lg:mx-0"
              >
                {data.bio}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.48 }}
                className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-8"
              >
                <a href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  Let&apos;s Discuss Your Project
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200">
                  View My Work
                </a>
              </motion.div>

              {/* Social icons */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex flex-col items-center lg:items-start gap-2"
              >
                <span className="text-slate-600 text-[11px] font-medium tracking-wider uppercase">Let&apos;s connect</span>
                <div className="flex items-center gap-2">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className="p-2.5 rounded-xl bg-white/4 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-200">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ══ RIGHT: Photo ═════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative flex-shrink-0 flex items-end justify-center"
            >
              {/* Wide glow halo behind photo */}
              <div className="absolute inset-0 -m-20 bg-violet-600/18 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute inset-0 -m-10 bg-indigo-600/12 rounded-full blur-[70px] pointer-events-none" />

              {/* Photo container */}
              <div className="relative" style={{ width: "340px", height: "460px" }}>

                {/* Photo image — no circle, no border */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Image
                    src={data.avatar}
                    alt={data.name}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  {/* Bottom fade → matches bg */}
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#08090c] via-[#08090c]/65 to-transparent" />
                  {/* Left edge fade */}
                  <div className="absolute top-0 left-0 bottom-0 w-10 bg-gradient-to-r from-[#08090c]/50 to-transparent" />
                  {/* Right edge subtle fade */}
                  <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-[#08090c]/30 to-transparent" />
                </div>

                {/* ── Experience badge — floats RIGHT of photo ── */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-20 top-[35%] z-20 rounded-2xl px-4 py-3.5 text-center border border-indigo-500/20 shadow-2xl shadow-indigo-900/40 min-w-[82px]"
                  style={{ background: "rgba(10,10,18,0.90)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold gradient-text leading-none">
                    {data.stats[0]?.value}{data.stats[0]?.suffix}
                  </div>
                  <div className="text-slate-400 text-[9px] mt-1 leading-tight">
                    {data.stats[0]?.label ?? "Years Experience"}
                  </div>
                </motion.div>

                {/* ── Performance card — floats TOP-RIGHT ── */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                  className="absolute -right-20 top-4 z-20 rounded-2xl px-3.5 py-3 border border-violet-500/15 shadow-2xl shadow-violet-900/30 min-w-[82px]"
                  style={{ background: "rgba(10,10,18,0.90)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3 h-3 text-violet-400" />
                    <span className="text-[8px] text-slate-500 leading-tight">System Performance</span>
                  </div>
                  <div className="text-xl font-bold text-white leading-none">
                    {data.stats[3]?.value}{data.stats[3]?.suffix}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">
                    {data.stats[3]?.label ?? "Client Satisfaction"}
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Bottom stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
        className="relative z-10 w-full border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-white/6">
            {bottomStats.map(({ icon: Icon, stat, fallback }, i) => {
              const value  = stat?.value  ?? fallback.value;
              const suffix = stat?.suffix ?? fallback.suffix;
              const label  = stat?.label  ?? fallback.label;
              return (
                <div key={i} className="flex items-center gap-3 lg:px-8 first:lg:pl-0 last:lg:pr-0">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-white leading-none">
                      {value}{suffix}
                    </div>
                    <div className="text-slate-500 text-[10px] sm:text-[11px] mt-0.5 leading-tight">{label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

    </section>
  );
}
