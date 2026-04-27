import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/portfolio';

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="reveal max-w-3xl">
          <p className="eyebrow">Projects</p>
          <h2 className="section-title">Selected work concepts ready for real case studies.</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {projects.map((project, index) => (
            <article key={project.title} className="project-card reveal" style={{ '--delay': `${index * 0.08}s` }}>
              <div className="project-visual">
                <span />
                <span />
                <span />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan/80">{project.type}</p>
                <h3 className="mt-5 font-display text-2xl font-semibold text-white">{project.title}</h3>
                <p className="mt-4 min-h-24 text-sm leading-7 text-white/60">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/64">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowUpRight className="absolute right-5 top-5 text-white/55 transition group-hover:text-white" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
