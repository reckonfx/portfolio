"use client";

import { type ReactNode } from "react";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminFormWrapper({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-xl p-5">
      <h2 className="text-white font-semibold text-sm mb-4 pb-3 border-b border-white/8">{title}</h2>
      {children}
    </div>
  );
}

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-slate-400 text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}

export function Input({
  value, onChange, placeholder, type = "text", className,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn("w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 transition-colors", className)}
    />
  );
}

export function Textarea({
  value, onChange, rows = 3, placeholder, className,
}: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={cn("w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 transition-colors resize-none", className)}
    />
  );
}

export function Select({
  value, onChange, options, className,
}: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("w-full px-3 py-2 rounded-lg bg-[#1a1b1e] border border-white/8 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/40 transition-colors", className)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={cn("w-9 h-5 rounded-full transition-colors relative flex-shrink-0",
          checked ? "bg-indigo-500" : "bg-white/10")}
      >
        <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5")} />
      </div>
      {label && <span className="text-slate-300 text-sm">{label}</span>}
    </label>
  );
}

export function SaveButton({ onClick, isPending }: { onClick: () => void; isPending: boolean }) {
  return (
    <div className="flex justify-end pt-2">
      <button onClick={onClick} disabled={isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-60">
        {isPending ? (
          <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
        ) : (
          <><Save className="w-3.5 h-3.5" /> Save Changes</>
        )}
      </button>
    </div>
  );
}

export function DeleteButton({ onClick, label = "Delete" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs transition-colors">
      {label}
    </button>
  );
}

export function AddButton({ onClick, label = "Add" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 text-xs transition-colors">
      + {label}
    </button>
  );
}
