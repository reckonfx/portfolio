import { readData } from "@/lib/cms";
import { CVPreview } from "@/components/CVPreview";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ format?: string }>;
}) {
  const { format = "usa" } = await searchParams;
  const data = readData();
  return <CVPreview data={data} format={format} />;
}
