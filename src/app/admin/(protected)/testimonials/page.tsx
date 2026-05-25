import { readData } from "@/lib/cms";
import { TestimonialsEditor } from "@/components/admin/TestimonialsEditor";

export default function TestimonialsPage() {
  const data = readData();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Testimonials</h1>
        <p className="text-slate-400 text-sm mt-1">Manage client reviews and ratings.</p>
      </div>
      <TestimonialsEditor initialData={data.testimonials} />
    </div>
  );
}
