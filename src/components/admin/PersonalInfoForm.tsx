"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { savePersonalInfo } from "@/lib/actions";
import type { PersonalInfo } from "@/lib/types";
import { AdminFormWrapper, Field, Input, Textarea, SaveButton } from "./AdminUI";
import { toast } from "sonner";
import { Upload, User, Loader2, X } from "lucide-react";

function AvatarUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onChange(json.path);
      toast.success("Photo uploaded!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex items-start gap-6">
      {/* Preview */}
      <div className="relative flex-shrink-0">
        <div className="p-[2px] rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-900 to-violet-900">
            {value ? (
              <Image src={value} alt="Avatar" fill className="object-cover object-top" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-slate-600" />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              </div>
            )}
          </div>
        </div>
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute top-0 right-0 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Drop zone */}
      <div
        className="flex-1 border-2 border-dashed border-white/10 rounded-xl p-5 text-center hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Upload className="w-5 h-5 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-400 text-sm font-medium">
          {uploading ? "Uploading..." : "Click or drag photo here"}
        </p>
        <p className="text-slate-600 text-xs mt-1">JPG, PNG, WebP — max 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>
    </div>
  );
}

export function PersonalInfoForm({ initialData }: { initialData: PersonalInfo }) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const set = (key: keyof PersonalInfo, value: unknown) =>
    setData((d) => ({ ...d, [key]: value }));
  const setSocial = (key: keyof PersonalInfo["social"], value: string) =>
    setData((d) => ({ ...d, social: { ...d.social, [key]: value } }));

  function handleSave() {
    startTransition(async () => {
      await savePersonalInfo(data);
      toast.success("Personal info saved!");
    });
  }

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <AdminFormWrapper title="Profile Photo">
        <AvatarUploader value={data.avatar} onChange={(path) => set("avatar", path)} />
        <p className="text-slate-600 text-xs mt-3">
          Current path: <code className="text-slate-400">{data.avatar || "none"}</code>
        </p>
      </AdminFormWrapper>

      {/* Basic Info */}
      <AdminFormWrapper title="Basic Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name"><Input value={data.name} onChange={(v) => set("name", v)} placeholder="Your Name" /></Field>
          <Field label="Title"><Input value={data.title} onChange={(v) => set("title", v)} placeholder="IT Professional & Developer" /></Field>
          <Field label="Location"><Input value={data.location} onChange={(v) => set("location", v)} placeholder="City, Country" /></Field>
          <Field label="Email"><Input value={data.email} onChange={(v) => set("email", v)} placeholder="you@example.com" /></Field>
          <Field label="Phone"><Input value={data.phone} onChange={(v) => set("phone", v)} placeholder="+1 (555) 000-0000" /></Field>
          <Field label="Website"><Input value={data.website} onChange={(v) => set("website", v)} placeholder="https://yoursite.com" /></Field>
          <Field label="Resume Path"><Input value={data.resume} onChange={(v) => set("resume", v)} placeholder="/resume.pdf" /></Field>
          <Field label="Availability"><Input value={data.availability} onChange={(v) => set("availability", v)} placeholder="Open to opportunities" /></Field>
        </div>
        <Field label="Bio" className="mt-4">
          <Textarea value={data.bio} onChange={(v) => set("bio", v)} rows={4} placeholder="Your professional bio..." />
        </Field>
      </AdminFormWrapper>

      {/* Taglines */}
      <AdminFormWrapper title="Typing Taglines">
        <p className="text-slate-500 text-xs mb-3">One per line — these cycle in the hero typing animation.</p>
        <Textarea
          value={data.taglines.join("\n")}
          onChange={(v) => set("taglines", v.split("\n").filter(Boolean))}
          rows={5}
          placeholder={"Full Stack Developer\nCloud Architect\nAI Integration Specialist"}
        />
      </AdminFormWrapper>

      {/* Stats */}
      <AdminFormWrapper title="Stats">
        <div className="space-y-3">
          {data.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-center">
              <Field label="Label">
                <Input value={stat.label} onChange={(v) => {
                  const updated = [...data.stats]; updated[i] = { ...stat, label: v };
                  set("stats", updated);
                }} />
              </Field>
              <Field label="Value">
                <Input value={String(stat.value)} onChange={(v) => {
                  const updated = [...data.stats]; updated[i] = { ...stat, value: Number(v) || 0 };
                  set("stats", updated);
                }} type="number" />
              </Field>
              <Field label="Suffix">
                <Input value={stat.suffix} onChange={(v) => {
                  const updated = [...data.stats]; updated[i] = { ...stat, suffix: v };
                  set("stats", updated);
                }} placeholder="+" />
              </Field>
            </div>
          ))}
        </div>
      </AdminFormWrapper>

      {/* Social Links */}
      <AdminFormWrapper title="Social Links">
        <div className="grid sm:grid-cols-2 gap-4">
          {(Object.keys(data.social) as Array<keyof PersonalInfo["social"]>).map((key) => (
            <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
              <Input value={data.social[key]} onChange={(v) => setSocial(key, v)} placeholder="https://..." />
            </Field>
          ))}
        </div>
      </AdminFormWrapper>

      <SaveButton onClick={handleSave} isPending={isPending} />
    </div>
  );
}
