import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition, type CSSProperties, type ReactNode } from "react";
import { EclipseScene } from "@/components/home/Stages";
import Architecture from "@/components/study/Architecture";
import Reveals from "@/components/study/Reveals";
import Magnetic from "@/components/ui/Magnetic";
import { Line } from "@/components/ui/Text";
import { BackLink, ProjectLink } from "@/components/ui/TransitionLink";
import { bySlug, demoFor, nextProject, projects, type Project } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) return {};
  return { title: project.name, description: project.summary };
}

function Chapter({ id, n, label, children, wide }: { id: string; n: string; label: string; children: ReactNode; wide?: boolean }) {
  return (
    <section className={`chapter${wide ? " chapter--wide" : ""}`} aria-labelledby={`c-${id}-${n}`}>
      <h2 className="chapter__label mono" id={`c-${id}-${n}`} data-reveal>
        <span>{n}</span>
        <span>{label}</span>
      </h2>
      <div className="chapter__body">{children}</div>
    </section>
  );
}

function Cover({ project, priority }: { project: Project; priority?: boolean }) {
  if (project.stage === "eclipse") return <EclipseScene />;
  const { cover } = project;
  return (
    <Image
      src={cover.src}
      alt={cover.alt}
      sizes="(max-width: 860px) 100vw, 88vw"
      quality={88}
      placeholder="blur"
      priority={priority}
      style={{ objectPosition: cover.focus ?? "50% 50%" }}
    />
  );
}

/**
 * The slug is URL data, so it is read inside a Suspense boundary. Every case
 * study is prerendered and its links prefetch the whole page, so in practice
 * the boundary never shows: the content arrives with the navigation.
 */
export default function Page({ params }: PageProps<"/work/[slug]">) {
  return <Suspense fallback={null}>{params.then(({ slug }) => <Study slug={slug} />)}</Suspense>;
}

function Study({ slug }: { slug: string }) {
  const project = bySlug(slug);
  if (!project) notFound();

  const { study, cover } = project;
  const demo = demoFor(slug);
  const next = nextProject(slug);
  const chars = Math.max(...project.title.map((l) => l.length));
  const total = String(projects.length).padStart(2, "0");

  return (
    <ViewTransition enter={{ "to-project": "page-in", default: "none" }} exit={{ "to-home": "page-out", "to-project": "page-out", default: "none" }} default="none">
      <main className="study" style={{ "--chars": chars } as CSSProperties}>
        <Reveals />

        <header className="study__hero" data-world={`${project.world}:top`} data-section={`${project.num} — ${project.name}`}>
          <p className="study__crumbs mono">
            <Magnetic>
              <BackLink href={`/#p-${slug}`} data-cursor="open">
                <span aria-hidden="true">←</span> Index
              </BackLink>
            </Magnetic>
            <span>
              {project.num} / {total}
            </span>
            <span>{project.category}</span>
          </p>

          <h1 className="study__title display" aria-label={project.name}>
            {project.title.map((line) => (
              <Line key={line}>
                <span aria-hidden="true">{line}</span>
              </Line>
            ))}
          </h1>
          {project.subtitle && <p className="study__subtitle">{project.subtitle}</p>}

          <figure className="study__cover">
            <ViewTransition name={`media-${slug}`} share="morph" default="none">
              <div className="study__frame">
                <Cover project={project} priority />
              </div>
            </ViewTransition>
            <figcaption className="mono">
              <i data-kind={cover.kind} aria-hidden="true" />
              {cover.caption}
            </figcaption>
          </figure>

          <div className="study__intro">
            <p className="study__summary">{project.summary}</p>
            <dl className="study__facts mono">
              <div>
                <dt>Role</dt>
                <dd>{study.role}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>{study.context}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{project.tech.join(" · ")}</dd>
              </div>
            </dl>
          </div>

          <ul className="study__links mono" aria-label="Project links">
            {demo && (
              <li>
                <Magnetic>
                  <a className="button button--solid" href={demo.href} target="_blank" rel="noopener noreferrer" data-cursor="ext">
                    Live demo <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Magnetic>
              </li>
            )}
            {project.links
              .filter((link) => link.href !== demo?.href)
              .map((link) => (
                <li key={link.href}>
                  <Magnetic>
                    <a className="button" href={link.href} target="_blank" rel="noopener noreferrer" data-cursor="ext">
                      {link.label} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </Magnetic>
                </li>
              ))}
          </ul>
        </header>

        <div className="study__body" data-world={`${project.world}:calm`}>
          <Chapter id={slug} n="01" label="The problem">
            <p className="chapter__statement" data-reveal>
              {study.problem}
            </p>
          </Chapter>

          <Chapter id={slug} n="02" label="The idea">
            <p className="chapter__lede" data-reveal>
              {study.idea}
            </p>
            <p className="chapter__flow display" data-reveal aria-label={project.flow.join(", then ")}>
              {project.flow.map((step, i) => (
                <span key={step} aria-hidden="true">
                  {i > 0 && <i>→</i>}
                  {step}
                </span>
              ))}
            </p>
          </Chapter>

          <Chapter id={slug} n="03" label="How it works">
            <ol className="steps">
              {study.how.map((step, i) => (
                <li key={i} data-reveal>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter id={slug} n="04" label="Technical architecture" wide>
            <Architecture nodes={study.architecture} />
          </Chapter>

          <Chapter id={slug} n="05" label="Build process">
            <ul className="process">
              {study.process.map((step, i) => (
                <li key={i} data-reveal>
                  {step}
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter id={slug} n="06" label="Result">
            <p className="chapter__statement" data-reveal>
              {study.result}
            </p>
            <p className="chapter__caveat" data-reveal>
              <span className="mono">Limits, stated plainly</span>
              {study.caveat}
            </p>
          </Chapter>

          {study.gallery.length > 0 && (
            <Chapter id={slug} n="07" label="Gallery" wide>
              <div className="gallery">
                {study.gallery.map((shot) => (
                  <figure
                    key={shot.caption}
                    className={shot.src.height > shot.src.width * 1.2 ? "gallery__item is-tall" : "gallery__item"}
                    data-reveal
                  >
                    <Image src={shot.src} alt={shot.alt} sizes="(max-width: 860px) 100vw, 60vw" placeholder="blur" />
                    <figcaption className="mono">
                      <i data-kind={shot.kind} aria-hidden="true" />
                      {shot.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Chapter>
          )}
        </div>

        <nav className="next" data-world={next.world} data-world-lead="1" aria-label="Next project">
          <p className="mono">
            Next project — {next.num} / {total}
          </p>
          <ProjectLink className="next__link" href={`/work/${next.slug}`} data-cursor="view">
            <span className="next__title display">{next.name}</span>
            <span className="next__go mono">
              {next.category} <span aria-hidden="true">↗</span>
            </span>
          </ProjectLink>
          <p className="next__home mono">
            <Magnetic>
              <BackLink href="/#index">All projects</BackLink>
            </Magnetic>
          </p>
        </nav>
      </main>
    </ViewTransition>
  );
}
