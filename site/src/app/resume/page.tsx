import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/study/PrintButton";
import Magnetic from "@/components/ui/Magnetic";
import { resume, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${site.name} — software engineering, AI and data experience. Printable résumé.`,
};

export default function Resume() {
  return (
    <main className="resume" data-world="resume" data-section="Résumé">
      <p className="resume__crumbs mono">
        <Magnetic>
          <Link href="/" data-cursor="open">
            <span aria-hidden="true">←</span> Portfolio
          </Link>
        </Magnetic>
        <PrintButton />
      </p>

      <header className="resume__head">
        <h1 className="display">{site.name}</h1>
        <p className="resume__role">Software Engineering · Artificial Intelligence · Data</p>
        <p className="mono">
          {site.location} · <a href={`mailto:${site.email}`}>{site.email}</a> ·{" "}
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            github.com/anischelly26
          </a>
        </p>
      </header>

      <section className="resume__section" aria-labelledby="r-profile">
        <h2 className="mono" id="r-profile">
          Profile
        </h2>
        <p className="resume__lede">{resume.profile}</p>
      </section>

      <section className="resume__section" aria-labelledby="r-experience">
        <h2 className="mono" id="r-experience">
          Experience
        </h2>
        <div>
          {resume.experience.map((job) => (
            <article className="resume__item" key={job.org}>
              <h3>
                {job.role} — {job.org}
              </h3>
              <p className="mono">{job.period}</p>
              <ul>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="resume__section" aria-labelledby="r-team">
        <h2 className="mono" id="r-team">
          Selected team project
        </h2>
        <article className="resume__item">
          <h3>
            {resume.teamProject.title} — {resume.teamProject.org}
          </h3>
          <p className="mono">{resume.teamProject.period}</p>
          <p>{resume.teamProject.text}</p>
        </article>
      </section>

      <section className="resume__section" aria-labelledby="r-education">
        <h2 className="mono" id="r-education">
          Education
        </h2>
        <article className="resume__item">
          <h3>{resume.education.title}</h3>
          <p className="mono">{resume.education.period}</p>
          <p>{resume.education.text}</p>
        </article>
      </section>

      <section className="resume__section" aria-labelledby="r-skills">
        <h2 className="mono" id="r-skills">
          Technical skills
        </h2>
        <div>
          {resume.skills.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section className="resume__section" aria-labelledby="r-languages">
        <h2 className="mono" id="r-languages">
          Languages
        </h2>
        <p>{resume.languages}</p>
      </section>
    </main>
  );
}
