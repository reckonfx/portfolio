import { readData } from "@/lib/cms";
import { ServicesEditor } from "@/components/admin/ServicesEditor";

export default function ServicesPage() {
  const data = readData();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Services</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your service offerings and pricing.</p>
      </div>
      <ServicesEditor initialData={data.services} />
    </div>
  );
}
