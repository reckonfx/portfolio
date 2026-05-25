import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  // Accept YYYY-MM or YYYY-MM-DD; normalise to a full date string
  const normalised = dateString.length === 7 ? dateString + "-01" : dateString;
  const date = new Date(normalised);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}
