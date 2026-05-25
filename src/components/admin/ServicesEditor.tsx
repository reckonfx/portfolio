"use client";

import { useState, useTransition } from "react";
import { saveServices } from "@/lib/actions";
import type { Service } from "@/lib/types";
import { AdminFormWrapper, Field, Input, Textarea, SaveButton, DeleteButton, AddButton } from "./AdminUI";
import { toast } from "sonner";

function ServiceCard({ service, onUpdate, onDelete }: { service: Service; onUpdate: (s: Service) => void; onDelete: () => void }) {
  const set = (key: keyof Service, value: unknown) => onUpdate({ ...service, [key]: value });

  return (
    <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3">
      <div className="flex justify-end">
        <DeleteButton onClick={onDelete} />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Icon Key"><Input value={service.icon} onChange={(v) => set("icon", v)} placeholder="Code2" /></Field>
        <Field label="Color">
          <div className="flex items-center gap-2">
            <input type="color" value={service.color} onChange={(e) => set("color", e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
            <Input value={service.color} onChange={(v) => set("color", v)} />
          </div>
        </Field>
        <Field label="Price"><Input value={service.price} onChange={(v) => set("price", v)} placeholder="From $3,000" /></Field>
      </div>
      <Field label="Title"><Input value={service.title} onChange={(v) => set("title", v)} /></Field>
      <Field label="Description"><Textarea value={service.description} onChange={(v) => set("description", v)} rows={2} /></Field>
      <Field label="Features (one per line)">
        <Textarea value={service.features.join("\n")} onChange={(v) => set("features", v.split("\n").filter(Boolean))} rows={4} />
      </Field>
    </div>
  );
}

export function ServicesEditor({ initialData }: { initialData: Service[] }) {
  const [services, setServices] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const update = (i: number, s: Service) => setServices((prev) => { const n = [...prev]; n[i] = s; return n; });
  const remove = (i: number) => setServices((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setServices((prev) => [...prev, { icon: "Code2", title: "New Service", description: "", features: [], color: "#818cf8", price: "From $0" }]);

  function handleSave() {
    startTransition(async () => {
      await saveServices(services);
      toast.success("Services saved!");
    });
  }

  return (
    <div className="space-y-4">
      <AdminFormWrapper title={`Services (${services.length})`}>
        <div className="space-y-4">
          {services.map((s, i) => (
            <ServiceCard key={i} service={s} onUpdate={(updated) => update(i, updated)} onDelete={() => remove(i)} />
          ))}
        </div>
        <div className="mt-4"><AddButton onClick={add} label="Add Service" /></div>
      </AdminFormWrapper>
      <SaveButton onClick={handleSave} isPending={isPending} />
    </div>
  );
}
