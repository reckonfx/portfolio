"use client";

import { useState, useTransition } from "react";
import { saveCertifications } from "@/lib/actions";
import type { Certification } from "@/lib/types";
import { AdminFormWrapper, Field, Input, SaveButton, DeleteButton, AddButton } from "./AdminUI";
import { toast } from "sonner";

export function CertificationsEditor({ initialData }: { initialData: Certification[] }) {
  const [certs, setCerts] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const update = (i: number, c: Certification) => setCerts((prev) => { const n = [...prev]; n[i] = c; return n; });
  const remove = (i: number) => setCerts((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setCerts((prev) => [...prev, { name: "", issuer: "", year: new Date().getFullYear(), badge: "🏆" }]);

  function handleSave() {
    startTransition(async () => {
      await saveCertifications(certs);
      toast.success("Certifications saved!");
    });
  }

  return (
    <div className="space-y-4">
      <AdminFormWrapper title={`Certifications (${certs.length})`}>
        <div className="space-y-3">
          {certs.map((cert, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <Field label="Badge" className="col-span-1">
                <Input value={cert.badge} onChange={(v) => update(i, { ...cert, badge: v })} className="text-center" />
              </Field>
              <Field label="Certification Name" className="col-span-5">
                <Input value={cert.name} onChange={(v) => update(i, { ...cert, name: v })} />
              </Field>
              <Field label="Issuer" className="col-span-3">
                <Input value={cert.issuer} onChange={(v) => update(i, { ...cert, issuer: v })} />
              </Field>
              <Field label="Year" className="col-span-2">
                <Input value={String(cert.year)} onChange={(v) => update(i, { ...cert, year: Number(v) || 2024 })} type="number" />
              </Field>
              <div className="col-span-1 pb-0.5">
                <DeleteButton onClick={() => remove(i)} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4"><AddButton onClick={add} label="Add Certification" /></div>
      </AdminFormWrapper>
      <SaveButton onClick={handleSave} isPending={isPending} />
    </div>
  );
}
