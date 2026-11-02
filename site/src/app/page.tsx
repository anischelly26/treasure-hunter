import { ViewTransition } from "react";
import Contact from "@/components/home/Contact";
import Demos from "@/components/home/Demos";
import Experiments from "@/components/home/Experiments";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import ProjectIndex from "@/components/home/ProjectIndex";
import ProjectScene from "@/components/home/ProjectScene";
import Stack from "@/components/home/Stack";
import TypeFilter from "@/components/home/TypeFilter";
import WorkIntro from "@/components/home/WorkIntro";
import { projects } from "@/content/projects";

export default function Home() {
  return (
    <ViewTransition enter={{ "to-home": "page-in", default: "none" }} exit={{ "to-project": "page-out", default: "none" }} default="none">
      <main className="home">
        <Hero />
        <Manifesto />
        <TypeFilter />
        <WorkIntro />
        <div className="projects">
          {projects.map((project) => (
            <ProjectScene key={project.slug} project={project} />
          ))}
        </div>
        <ProjectIndex />
        <Demos />
        <Experiments />
        <Stack />
        <Contact />
      </main>
    </ViewTransition>
  );
}
