import { ArrowDown, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { profile } from '../data/portfolio';
import { splitText } from '../utils/animation';

export default function Hero() {
  const titleRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = splitText(titleRef.current);
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero-kicker', { opacity: 0, y: 22, duration: 0.7 })
        .from(words, { opacity: 0, yPercent: 115, rotateX: -75, stagger: 0.055, duration: 1.1 }, '-=0.25')
        .from('.hero-copy, .hero-actions, .hero-meta', { opacity: 0, y: 24, stagger: 0.12, duration: 0.8 }, '-=0.45');
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={rootRef} className="section hero-section min-h-screen items-center pt-32">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 md:grid-cols-[1fr_0.7fr] md:px-8">
        <div className="relative z-10 max-w-4xl">
          <p className="hero-kicker eyebrow">Product Engineer / Full Stack Developer</p>
          <h1 ref={titleRef} className="hero-title mt-5 font-display text-5xl font-semibold leading-none text-white sm:text-7xl lg:text-8xl">
            Kaviyarasu J builds scalable web applications with AI depth.
          </h1>
          <p className="hero-copy mt-7 max-w-2xl text-lg leading-8 text-white/68">{profile.tagline}</p>
          <div className="hero-actions mt-9 flex flex-wrap gap-4">
            <a className="primary-button" href="#projects">
              View Work
              <ArrowDown size={18} />
            </a>
            <a className="ghost-button" href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={18} />
              LinkedIn
            </a>
          </div>
        </div>

        <aside className="hero-meta z-10 self-end rounded-[2rem] border border-white/10 bg-panel p-5 text-sm text-white/70 shadow-violet backdrop-blur-2xl">
          <div className="grid gap-4">
            <span className="flex items-center gap-3">
              <MapPin size={17} className="text-cyan" />
              {profile.location}
            </span>
            <a className="flex items-center gap-3 hover:text-white" href={`mailto:${profile.email}`}>
              <Mail size={17} className="text-cyan" />
              {profile.email}
            </a>
            <a className="flex items-center gap-3 hover:text-white" href={`tel:${profile.phone}`}>
              <Phone size={17} className="text-cyan" />
              {profile.phone}
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
