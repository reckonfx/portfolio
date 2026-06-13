"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Calendar, CheckCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { PersonalInfo } from "@/lib/types";
import { toast } from "sonner";

export function Contact({ data }: { data: PersonalInfo }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const contactInfo = [
    { icon: Mail, label: "Email", value: data.email, href: `mailto:${data.email}` },
    { icon: Phone, label: "Phone", value: data.phone, href: `tel:${data.phone}` },
    { icon: MapPin, label: "Location", value: data.location, href: "#" },
  ];

  const socialLinks = [
    { icon: GithubIcon, label: "GitHub", href: data.social.github },
    { icon: LinkedinIcon, label: "LinkedIn", href: data.social.linkedin },
    { icon: TwitterIcon, label: "Twitter", href: data.social.twitter },
    { icon: Mail, label: "Email", href: `mailto:${data.email}` },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill in all required fields."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      setSent(true);
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0" style={{ background: "var(--theme-bg)" }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="Contact" title="Let's Work " highlight="Together"
          description="Have a project in mind? I'd love to hear about it. Let's build something great." />

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5 }} className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">{label}</div>
                      <div className="text-slate-200 text-sm group-hover:text-white transition-colors">{value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }} className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {data.social.whatsapp && (
                  <a href={`https://wa.me/${data.social.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">WhatsApp me</span>
                  </a>
                )}
                {data.social.calendly && (
                  <a href={data.social.calendly} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Book a call</span>
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }} className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="flex-1 flex items-center justify-center p-3 rounded-xl glass text-slate-400 hover:text-white hover:border-white/15 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-400 text-xs mb-1.5">Name <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" required />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1.5">Subject</label>
                <input type="text" placeholder="Project idea, collaboration..." value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1.5">Message <span className="text-red-400">*</span></label>
                <textarea rows={5} placeholder="Tell me about your project..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none" required />
              </div>
              <motion.button type="submit" disabled={loading || sent} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {sent ? <><CheckCircle className="w-4 h-4" /> Message Sent!</> :
                 loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> :
                 <><Send className="w-4 h-4" /> Send Message</>}
              </motion.button>
              <p className="text-center text-slate-600 text-xs">I typically respond within 24 hours.</p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
