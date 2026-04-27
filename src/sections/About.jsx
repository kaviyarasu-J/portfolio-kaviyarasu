import { Cpu, ShieldCheck, Sparkles } from 'lucide-react';
import { profile } from '../data/portfolio';

const highlights = [
  { icon: Cpu, label: 'Angular + Python', text: 'Full-stack product development with practical backend depth.' },
  { icon: Sparkles, label: 'AI Integration', text: 'Model responses transformed into meaningful user experiences.' },
  { icon: ShieldCheck, label: 'Security Mindset', text: 'API security, web security basics, and production support awareness.' },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.82fr_1fr] md:px-8">
        <div className="reveal">
          <p className="eyebrow">About</p>
          <h2 className="section-title">Engineering practical products with cinematic polish.</h2>
        </div>
        <div className="reveal space-y-6">
          <p className="text-balance text-xl leading-9 text-white/72">{profile.about}</p>
          <p className="text-lg leading-8 text-white/58">
            Interested in AI and data-driven solutions, with hands-on experience handling model responses and turning them into clear,
            interactive interfaces.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, label, text }) => (
              <article key={label} className="tilt-card rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                <Icon className="mb-5 text-cyan" size={24} />
                <h3 className="font-display text-lg font-semibold text-white">{label}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
