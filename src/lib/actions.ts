"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readData, writeData, syncToGitHub } from "./cms";
import { login, logout } from "./auth";
import type { PersonalInfo, Project, TechCategory, Service, Testimonial, Experience, Certification } from "./types";

export async function actionLogin(formData: FormData) {
  const password = formData.get("password") as string;
  const ok = await login(password);
  if (!ok) return { error: "Invalid password" };
  redirect("/admin");
}

export async function actionLogout() {
  await logout();
  redirect("/admin/login");
}

export async function savePersonalInfo(info: PersonalInfo) {
  const data = readData();
  data.personalInfo = info;
  writeData(data);
  revalidatePath("/");
  syncToGitHub(data).catch(console.error);
}

export async function saveProjects(projects: Project[]) {
  const data = readData();
  data.projects = projects;
  writeData(data);
  revalidatePath("/");
  syncToGitHub(data).catch(console.error);
}

export async function saveTechStack(stack: TechCategory[]) {
  const data = readData();
  data.techStack = stack;
  writeData(data);
  revalidatePath("/");
  syncToGitHub(data).catch(console.error);
}

export async function saveServices(services: Service[]) {
  const data = readData();
  data.services = services;
  writeData(data);
  revalidatePath("/");
  syncToGitHub(data).catch(console.error);
}

export async function saveTestimonials(testimonials: Testimonial[]) {
  const data = readData();
  data.testimonials = testimonials;
  writeData(data);
  revalidatePath("/");
  syncToGitHub(data).catch(console.error);
}

export async function saveExperiences(experiences: Experience[]) {
  const data = readData();
  data.experiences = experiences;
  writeData(data);
  revalidatePath("/");
  syncToGitHub(data).catch(console.error);
}

export async function saveCertifications(certifications: Certification[]) {
  const data = readData();
  data.certifications = certifications;
  writeData(data);
  revalidatePath("/");
  syncToGitHub(data).catch(console.error);
}
