import { readData } from "@/lib/cms";
import { PersonalInfoForm } from "@/components/admin/PersonalInfoForm";

export default function PersonalPage() {
  const data = readData();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Personal Info</h1>
        <p className="text-slate-400 text-sm mt-1">Edit your name, bio, contact details, and social links.</p>
      </div>
      <PersonalInfoForm initialData={data.personalInfo} />
    </div>
  );
}
