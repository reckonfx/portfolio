"use client";

import { useState, useTransition, useRef } from "react";
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

  function compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 800;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        canvas.toBlob(
          (blob) => resolve(blob ? new File([blob], "avatar.jpg", { type: "image/jpeg" }) : file),
          "image/jpeg",
          0.82
        );
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", compressed);
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
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="Avatar" className="w-full h-full object-cover object-top" />
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

      {/* CV Personal Details */}
      <AdminFormWrapper title="CV Personal Details">
        <p className="text-slate-500 text-xs mb-4">These fields appear in regional CV formats (Gulf, Saudi, Pakistan/India, Lebenslauf). Leave blank to show a placeholder.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nationality"><Input value={data.nationality ?? ""} onChange={(v) => set("nationality", v)} placeholder="e.g. Pakistani" /></Field>
          <Field label="Date of Birth"><Input value={data.dateOfBirth ?? ""} onChange={(v) => set("dateOfBirth", v)} placeholder="e.g. 15 March 1985" /></Field>
          <Field label="Place of Birth"><Input value={data.placeOfBirth ?? ""} onChange={(v) => set("placeOfBirth", v)} placeholder="e.g. Karachi, Pakistan" /></Field>
          <Field label="Religion"><Input value={data.religion ?? ""} onChange={(v) => set("religion", v)} placeholder="e.g. Islam" /></Field>
          <Field label="Marital Status"><Input value={data.maritalStatus ?? ""} onChange={(v) => set("maritalStatus", v)} placeholder="e.g. Married" /></Field>
          <Field label="CNIC / National ID"><Input value={data.cnic ?? ""} onChange={(v) => set("cnic", v)} placeholder="e.g. 42101-1234567-8" /></Field>
        </div>
      </AdminFormWrapper>

      {/* Language Skills — Europass */}
      <AdminFormWrapper title="Language Skills (Europass)">
        <p className="text-slate-500 text-xs mb-4">Used in the Europass CV Languages section. CEFR levels: A1/A2 (Basic), B1/B2 (Independent), C1/C2 (Proficient).</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Field label="Mother Tongue">
            <Input value={data.motherTongue ?? ""} onChange={(v) => set("motherTongue", v)} placeholder="e.g. Urdu" />
          </Field>
          <Field label="Driving Licence">
            <Input value={data.drivingLicence ?? ""} onChange={(v) => set("drivingLicence", v)} placeholder="e.g. B" />
          </Field>
        </div>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Other Languages</div>
        <div className="space-y-2">
          {(data.languages ?? []).map((lang, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <Input value={lang.language} onChange={(v) => {
                const updated = [...(data.languages ?? [])]; updated[i] = { ...lang, language: v };
                set("languages", updated);
              }} placeholder="Language" />
              <Input value={lang.level} onChange={(v) => {
                const updated = [...(data.languages ?? [])]; updated[i] = { ...lang, level: v };
                set("languages", updated);
              }} placeholder="e.g. C1 — Advanced" />
              <button onClick={() => set("languages", (data.languages ?? []).filter((_, j) => j !== i))}
                className="text-slate-500 hover:text-red-400 text-xs px-2">✕</button>
            </div>
          ))}
          <button
            onClick={() => set("languages", [...(data.languages ?? []), { language: "", level: "" }])}
            className="text-indigo-400 hover:text-indigo-300 text-xs mt-1">+ Add language</button>
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
