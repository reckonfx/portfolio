import { readData } from "@/lib/cms";
import { CertificationsEditor } from "@/components/admin/CertificationsEditor";

export default function CertificationsPage() {
  const data = readData();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Certifications</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your professional certifications.</p>
      </div>
      <CertificationsEditor initialData={data.certifications} />
    </div>
  );
}
