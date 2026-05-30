"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import { Mail, ArrowDown, MapPin, Circle, Briefcase } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";
import { ResumeModal } from "@/components/ResumeModal";
import type { PersonalInfo } from "@/lib/types";

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; hue: number;
    }> = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.5 ? 245 : 270,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export function Hero({ data }: { data: PersonalInfo }) {
  const socialLinks = [
    { icon: GithubIcon, href: data.social.github, label: "GitHub" },
    { icon: LinkedinIcon, href: data.social.linkedin, label: "LinkedIn" },
    { icon: TwitterIcon, href: data.social.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${data.email}`, label: "Email" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0e10]/60 to-[#0d0e10]" />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] bg-indigo-600/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute inset-0">
        <Particles />
      </div>

      {/* Main hero content */}
      <div className="relative z-10 w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 pt-28 pb-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-20">

        {/* ── Left: Text ── */}
        <div className="flex-1 text-center lg:text-left min-w-0">

          {/* Availability pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide"
          >
            <Circle className="w-2 h-2 fill-emerald-400 animate-pulse" />
            {data.availability}
          </motion.div>

          {/* Name headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none mb-2">
              {data.name.split(" ")[0]}
            </h1>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6 gradient-text">
              {data.name.split(" ").slice(1).join(" ")}
            </h1>
          </motion.div>

          {/* Typing specialization */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-8 mb-5"
          >
            <TypeAnimation
              sequence={data.taglines.flatMap((t) => [t, 2200])}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-base sm:text-lg text-indigo-400 font-medium"
            />
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1.5 text-slate-500 text-sm mb-8 justify-center lg:justify-start"
          >
            <MapPin className="w-3.5 h-3.5" />
            {data.location}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-10"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Briefcase className="w-4 h-4" />
              Start a Project
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200"
            >
              View My Work
            </a>
            <ResumeModal />
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex items-center gap-2.5 justify-center lg:justify-start"
          >
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-xl bg-white/4 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Photo ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex-shrink-0"
        >
          {/* Wide ambient glow behind photo */}
          <div className="absolute -inset-16 bg-gradient-to-br from-indigo-600/20 via-violet-600/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute -inset-8 bg-gradient-to-tr from-violet-500/15 to-indigo-500/20 rounded-full blur-2xl" />

          {/* Outer pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.14, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-5 rounded-full border border-indigo-500/40"
          />

          {/* Inner pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.65, 0.05, 0.65] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -inset-2 rounded-full border border-violet-400/35"
          />

          {/* Gradient border */}
          <div className="relative p-[3px] rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 shadow-[0_0_55px_rgba(99,102,241,0.4)]">
            <div className="w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden bg-gradient-to-br from-indigo-900 to-violet-900 relative">
              <Image
                src={data.avatar}
                alt={data.name}
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Floating stat badge — top right */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-4 sm:-right-8 glass-strong rounded-2xl px-3.5 py-2.5 shadow-xl z-10 border border-white/8"
          >
            <div className="text-[10px] text-slate-400 mb-0.5">{data.stats[3]?.label ?? "GitHub Stars"}</div>
            <div className="text-lg font-bold text-white leading-none">{data.stats[3]?.value}{data.stats[3]?.suffix} ⭐</div>
          </motion.div>

          {/* Floating stat badge — bottom left */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -bottom-2 -left-4 sm:-left-8 glass-strong rounded-2xl px-3.5 py-2.5 shadow-xl z-10 border border-white/8"
          >
            <div className="text-[10px] text-slate-400 mb-0.5">{data.stats[1]?.label ?? "Projects"}</div>
            <div className="text-lg font-bold text-white leading-none">{data.stats[1]?.value}{data.stats[1]?.suffix} 🚀</div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.85 }}
        className="relative z-10 w-full max-w-3xl xl:max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 mb-10"
      >
        <div className="relative rounded-2xl overflow-hidden border border-white/6">
          <div className="absolute inset-0 bg-white/[0.025] backdrop-blur-sm" />
          <div className="relative flex divide-x divide-white/6">
            {data.stats.map((stat, i) => (
              <div key={i} className="flex-1 py-5 px-4 text-center group">
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 group-hover:scale-105 transition-transform duration-200">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-slate-500 text-[11px] sm:text-xs tracking-wide leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="relative z-10 flex flex-col items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors pb-6"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.a>
    </section>
  );
}
