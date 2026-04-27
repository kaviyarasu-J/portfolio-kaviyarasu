import { skills } from '../data/portfolio';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Skills</p>
            <h2 className="section-title max-w-3xl">A stack shaped around product delivery.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/58">
            Frontend, backend, cloud, APIs, security, and AI response handling in one practical engineering loop.
          </p>
        </div>
        <div className="orbit-grid mt-12">
          {skills.map((skill, index) => (
            <article key={skill.group} className="skill-cluster reveal" style={{ '--delay': `${index * 0.045}s` }}>
              <h3>{skill.group}</h3>
              <div>
                {skill.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
