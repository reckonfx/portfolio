"use client";

import { useState, useTransition, useRef } from "react";
import { saveProjects } from "@/lib/actions";
import type { Project } from "@/lib/types";
import { AdminFormWrapper, Field, Input, Textarea, Select, Toggle, SaveButton, DeleteButton, AddButton } from "./AdminUI";
import { ChevronDown, ChevronUp, Camera, Upload, X, Loader2, Play } from "lucide-react";
import { toast } from "sonner";

const statusOptions = [
  { value: "Live", label: "Live" },
  { value: "In Development", label: "In Development" },
  { value: "Private", label: "Private" },
];

function emptyProject(id: number): Project {
  return {
    id, title: "", description: "", longDescription: "", tech: [], github: "", demo: "",
    vercel: "", image: "", video: "", featured: false, status: "Live", category: "SaaS",
    tags: [], date: new Date().toISOString().slice(0, 7), client: "", stars: 0, metrics: {},
  };
}

function MediaPreview({ image, video }: { image: string; video?: string }) {
  if (!image && !video) return null;
  return (
    <div className="relative rounded-lg overflow-hidden bg-black/30 border border-white/10" style={{ aspectRatio: "16/9" }}>
      {video ? (
        <video src={video} className="w-full h-full object-cover" controls muted loop playsInline />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="preview" className="w-full h-full object-cover" />
      )}
    </div>
  );
}

function ProjectMediaField({
  project, onUpdate,
}: {
  project: Project;
  onUpdate: (p: Project) => void;
}) {
  const [capturing, setCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Prefer public demo over vercel preview (vercel previews are behind login)
  const defaultUrl = project.demo || project.vercel;
  const screenshotUrl = customUrl.trim() || defaultUrl;

  async function handleScreenshot() {
    if (!screenshotUrl) return toast.error("Enter a Demo or Vercel URL first");
    setCapturing(true);
    try {
      const res = await fetch("/api/projects/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: screenshotUrl, projectId: project.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Screenshot failed");
      onUpdate({ ...project, image: data.path, video: "" });
      toast.success("Screenshot captured!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setCapturing(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("projectId", String(project.id));
      const res = await fetch("/api/projects/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      if (data.type === "video") {
        onUpdate({ ...project, video: data.path });
      } else {
        onUpdate({ ...project, image: data.path, video: "" });
      }
      toast.success("Media uploaded!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function clearMedia() {
    onUpdate({ ...project, image: "", video: "" });
  }

  const hasMedia = !!(project.image || project.video);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Project Preview</span>
        {hasMedia && (
          <button onClick={clearMedia} className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {hasMedia && <MediaPreview image={project.image} video={project.video} />}

      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder={defaultUrl || "https://your-public-site.com"}
            className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs placeholder:text-slate-600 outline-none focus:border-indigo-500/40 transition-colors"
          />
          <button
            onClick={handleScreenshot}
            disabled={capturing || !screenshotUrl}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-medium hover:bg-indigo-500/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {capturing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            {capturing ? "Capturing…" : "Screenshot"}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        <p className="text-xs text-slate-600">
          {defaultUrl
            ? <>Will screenshot <span className="text-slate-500">{customUrl.trim() || defaultUrl}</span>. If you get a login screen, paste the public URL above.</>
            : "Enter a Demo or Vercel URL above, or paste any public URL here to screenshot."}
        </p>
      </div>
    </div>
  );
}

function ProjectRow({
  project, index, onUpdate, onDelete,
}: {
  project: Project; index: number;
  onUpdate: (p: Project) => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const set = (key: keyof Project, value: unknown) => onUpdate({ ...project, [key]: value });

  return (
    <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/3 transition-colors"
        onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium truncate">{project.title || `Project ${index + 1}`}</div>
          <div className="text-slate-500 text-xs flex items-center gap-2">
            {project.category} · {project.status}
            {(project.image || project.video) && (
              <span className="flex items-center gap-0.5 text-emerald-500">
                {project.video ? <Play className="w-2.5 h-2.5" /> : <Camera className="w-2.5 h-2.5" />}
                {project.video ? "video" : "image"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {project.featured && <span className="px-1.5 py-0.5 rounded text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20">Featured</span>}
          <DeleteButton onClick={onDelete} />
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-white/5 space-y-4 pt-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Title"><Input value={project.title} onChange={(v) => set("title", v)} placeholder="Project Name" /></Field>
            <Field label="Category"><Input value={project.category} onChange={(v) => set("category", v)} placeholder="SaaS, Web3, AI Tool..." /></Field>
            <Field label="Status">
              <Select value={project.status} onChange={(v) => set("status", v as Project["status"])} options={statusOptions} />
            </Field>
            <Field label="Client / Company"><Input value={project.client} onChange={(v) => set("client", v)} /></Field>
            <Field label="Date (YYYY-MM)"><Input value={project.date} onChange={(v) => set("date", v)} placeholder="2024-01" /></Field>
            <Field label="GitHub Stars"><Input value={String(project.stars)} onChange={(v) => set("stars", Number(v) || 0)} type="number" /></Field>
          </div>

          <Field label="Short Description">
            <Textarea value={project.description} onChange={(v) => set("description", v)} rows={2} />
          </Field>
          <Field label="Long Description (modal)">
            <Textarea value={project.longDescription ?? ""} onChange={(v) => set("longDescription", v)} rows={3} />
          </Field>

          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="GitHub URL"><Input value={project.github} onChange={(v) => set("github", v)} placeholder="https://github.com/..." /></Field>
            <Field label="Demo URL"><Input value={project.demo} onChange={(v) => set("demo", v)} placeholder="https://..." /></Field>
            <Field label="Vercel URL"><Input value={project.vercel} onChange={(v) => set("vercel", v)} /></Field>
          </div>

          <ProjectMediaField project={project} onUpdate={onUpdate} />

          <Field label="Tech Stack (comma-separated)">
            <Input value={project.tech.join(", ")} onChange={(v) => set("tech", v.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="React, Node.js, PostgreSQL" />
          </Field>

          <Field label="Tags (comma-separated)">
            <Input value={project.tags.join(", ")} onChange={(v) => set("tags", v.split(",").map((s) => s.trim()).filter(Boolean))} />
          </Field>

          <div className="flex items-center gap-6">
            <Toggle checked={project.featured} onChange={(v) => set("featured", v)} label="Featured project" />
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectsEditor({ initialData }: { initialData: Project[] }) {
  const [projects, setProjects] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const update = (i: number, p: Project) => setProjects((prev) => { const n = [...prev]; n[i] = p; return n; });
  const remove = (i: number) => setProjects((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setProjects((prev) => [...prev, emptyProject(Date.now())]);

  function handleSave() {
    startTransition(async () => {
      await saveProjects(projects);
      toast.success("Projects saved!");
    });
  }

  return (
    <div className="space-y-4">
      <AdminFormWrapper title={`Projects (${projects.length})`}>
        <div className="space-y-3">
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} onUpdate={(updated) => update(i, updated)} onDelete={() => remove(i)} />
          ))}
        </div>
        <div className="mt-4">
          <AddButton onClick={add} label="Add Project" />
        </div>
      </AdminFormWrapper>
      <SaveButton onClick={handleSave} isPending={isPending} />
    </div>
  );
}
