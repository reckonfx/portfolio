"use client";

import { motion } from "framer-motion";
import { Terminal, Heart, Mail, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";
import type { SocialLinks } from "@/lib/types";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

interface FooterProps {
  name: string;
  social: SocialLinks;
  email: string;
  location: string;
}

export function Footer({ name, social, email, location }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-[#0a0b0e]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">{name.split(" ")[0]}<span className="text-indigo-400">.</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              IT Professional & Full Stack Developer. Building scalable digital experiences.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-slate-500 hover:text-white text-sm transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Connect</h4>
            <div className="flex gap-2 mb-4">
              {[
                { icon: GithubIcon, href: social.github },
                { icon: LinkedinIcon, href: social.linkedin },
                { icon: TwitterIcon, href: social.twitter },
                { icon: Mail, href: `mailto:${email}` },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-slate-600 text-xs">{email}</p>
            <p className="text-slate-600 text-xs">{location}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-slate-600 text-xs flex items-center gap-1">
            © {year} {name}. Built with <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> using Next.js & Tailwind CSS
          </p>
          <motion.a href="#" whileHover={{ y: -2 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-white/8 transition-all text-xs">
            <ArrowUp className="w-3 h-3" />Back to top
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
