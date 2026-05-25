import { readData } from "@/lib/cms";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TechStack } from "@/components/sections/TechStack";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CommandPalette } from "@/components/CommandPalette";

export const dynamic = "force-dynamic";

export default function Home() {
  const data = readData();

  return (
    <>
      <LoadingScreen />
      <Navbar name={data.personalInfo.name} resume={data.personalInfo.resume} />
      <main>
        <Hero data={data.personalInfo} />
        <About data={{ personalInfo: data.personalInfo, experiences: data.experiences, certifications: data.certifications }} />
        <TechStack data={data.techStack} />
        <Projects data={data.projects} />
        <Services data={data.services} />
        <Testimonials data={data.testimonials} />
        <Contact data={data.personalInfo} />
      </main>
      <Footer name={data.personalInfo.name} social={data.personalInfo.social} email={data.personalInfo.email} location={data.personalInfo.location} />
      <CommandPalette email={data.personalInfo.email} resume={data.personalInfo.resume} github={data.personalInfo.social.github} />
    </>
  );
}
