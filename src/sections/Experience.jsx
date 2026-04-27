import { Award, BriefcaseBusiness, GraduationCap } from 'lucide-react';
import { certifications, education, experience } from '../data/portfolio';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[0.78fr_1fr] md:px-8">
        <div className="reveal">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">Building, shipping, and supporting live systems.</h2>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article key={item.company} className="timeline-item reveal">
              <span className="timeline-dot">
                <BriefcaseBusiness size={18} />
              </span>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan/80">{item.duration}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">{item.role}</h3>
              <p className="mt-1 text-white/55">{item.company}</p>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-white/62">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}

          <article className="timeline-item reveal">
            <span className="timeline-dot">
              <GraduationCap size={18} />
            </span>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan/80">{education.year}</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-white">{education.degree}</h3>
            <p className="mt-1 text-white/55">{education.college}</p>
            <p className="mt-4 text-sm text-white/62">CGPA: {education.cgpa}</p>
          </article>

          {certifications.map((cert) => (
            <article key={cert.title} className="timeline-item reveal">
              <span className="timeline-dot">
                <Award size={18} />
              </span>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan/80">Certification</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">{cert.title}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {cert.items.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/64">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
