import { Canvas, useFrame } from '@react-three/fiber';
import emailjs from '@emailjs/browser';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import profilePortrait from './assets/profile-portrait.png';
import techVisualSheet from './assets/tech-visual-sheet.png';
import manifestoImg1 from './assets/manifesto-1.png';
import manifestoImg2 from './assets/manifesto-2.png';
import manifestoImg3 from './assets/manifesto-3.png';
import manifestoImg4 from './assets/manifesto-4.png';
import { certifications, education, experience, profile, projects, skills } from './data/portfolio';

gsap.registerPlugin(ScrollTrigger);

const accent = '#e0ff00';

const manifesto = [
  ['01 / Frontend', 'Interactive', 'Interfaces', manifestoImg1],
  ['02 / Backend', 'Scalable', 'Workflows', manifestoImg2],
  ['03 / Cloud', 'Azure', 'Systems', manifestoImg3],
  ['04 / AI', 'Model', 'Experiences', manifestoImg4],
];

const differentiators = [
  {
    label: 'Modern Era',
    titleA: 'AI Model',
    titleB: 'Integration',
    desc: 'Handling model responses and transforming JSON outputs into structured, usable product experiences.',
  },
  {
    label: 'Product Flow',
    titleA: 'Angular',
    titleB: 'Dashboards',
    desc: 'Building dynamic dashboards, forms, and user workflows for real application environments.',
  },
  {
    label: 'Backend',
    titleA: 'Python',
    titleB: 'Services',
    desc: 'Developing Flask, FastAPI, Azure Functions, and API-driven systems for complex workflows.',
  },
  {
    label: 'Production',
    titleA: 'Live System',
    titleB: 'Support',
    desc: 'Owning critical issues, production support, API management, and reliability in live products.',
  },
];

const projectReel = [
  ...projects,
  {
    title: 'Azure Function Workflows',
    type: 'Serverless Backend',
    description: 'Function App services for production workflows, data processing, and API orchestration.',
    tags: ['Azure', 'Python', 'APIM'],
  },
  {
    title: 'Dynamic Content Renderer',
    type: 'AI + UI Rendering',
    description: 'JSON-based rendering patterns for structured AI output inside interactive web interfaces.',
    tags: ['JSON', 'AI', 'Angular'],
  },
];

const visualPositions = ['0% 0%', '50% 0%', '100% 0%', '0% 100%', '50% 100%', '100% 100%'];
const fallingTech = [
  { label: 'Angular', glyph: 'A', tone: 'angular' },
  { label: 'Python', glyph: 'Py', tone: 'python' },
  { label: 'FastAPI', glyph: 'F', tone: 'api' },
  { label: 'Azure', glyph: 'Az', tone: 'azure' },
  { label: 'AI', glyph: 'AI', tone: 'ai' },
  { label: 'MongoDB', glyph: 'DB', tone: 'db' },
  { label: 'APIM', glyph: '{}', tone: 'api' },
  { label: 'Git', glyph: 'Git', tone: 'git' },
  { label: 'Security', glyph: 'S', tone: 'security' },
  { label: 'Docker', glyph: 'Do', tone: 'azure' },
  { label: 'TypeScript', glyph: 'TS', tone: 'api' },
  { label: 'Stripe', glyph: '$', tone: 'security' },
  { label: 'DevOps', glyph: '∞', tone: 'azure' },
];

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.85 });
    const update = (time) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);
}

function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    let moveTimer = null;
    let currentLabel = '';

    const move = (event) => {
      gsap.to(ringRef.current, { x: event.clientX, y: event.clientY, duration: 0.9, ease: 'elastic.out(1, 0.65)' });
      gsap.set(dotRef.current, { x: event.clientX, y: event.clientY });

      if (currentLabel === 'Move mouse') {
        gsap.to(ringRef.current.querySelector('span'), { opacity: 0, duration: 0.15 });
        clearTimeout(moveTimer);
        moveTimer = setTimeout(() => {
          gsap.to(ringRef.current.querySelector('span'), { opacity: 1, duration: 0.2 });
        }, 300);
      }
    };

    const enter = (event) => {
      currentLabel = event.currentTarget.getAttribute('data-cursor');
      ringRef.current.querySelector('span').textContent = currentLabel || '';
      gsap.to(ringRef.current, { width: currentLabel ? 160 : 64, height: 42, borderRadius: 999, background: 'rgba(0,0,0,0.28)' });
      
      if (currentLabel === 'Move mouse') {
        gsap.to(ringRef.current.querySelector('span'), { opacity: 1, duration: 0.2 });
      } else {
        gsap.to(ringRef.current.querySelector('span'), { opacity: currentLabel ? 1 : 0, duration: 0.2 });
      }
    };

    const leave = () => {
      currentLabel = '';
      clearTimeout(moveTimer);
      gsap.to(ringRef.current, { width: 42, height: 42, background: 'transparent' });
      gsap.to(ringRef.current.querySelector('span'), { opacity: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', move);
    document.querySelectorAll('[data-cursor]').forEach((item) => {
      item.addEventListener('mouseenter', enter);
      item.addEventListener('mouseleave', leave);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      document.querySelectorAll('[data-cursor]').forEach((item) => {
        item.removeEventListener('mouseenter', enter);
        item.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring">
        <span />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}

function LoaderHero() {
  return (
    <section className="loader-stage">
      <div id="loading-bar" />
      <p className="desktop-note">Shift to desktop for best experience</p>
      <div className="top-mark">KJ</div>
      <HeroFrame />
    </section>
  );
}

function HeroFrame() {
  const portraitRef = useRef(null);

  useEffect(() => {
    const element = portraitRef.current;
    if (!element) return undefined;

    const move = (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty('--mx', x.toFixed(3));
      element.style.setProperty('--my', y.toFixed(3));
    };

    const leave = () => {
      element.style.setProperty('--mx', '0');
      element.style.setProperty('--my', '0');
    };

    element.addEventListener('mousemove', move);
    element.addEventListener('mouseleave', leave);

    return () => {
      element.removeEventListener('mousemove', move);
      element.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <section id="hero-wrapper" className="hero-wrapper">
      <div className="loading-word" aria-hidden="true">
        {'LOADING  PORTFOLIO'.split('').map((letter, index) => (
          <span key={`${letter}-${index}`} style={{ animationDelay: `${index * 20}ms` }}>
            {letter === ' ' ? '\u00a0' : letter}
          </span>
        ))}
      </div>

      <p className="hero-bg-word">Full Stack</p>

      <div className="hero-grid">
        <header className="hero-left">
          <button className="hero-logo" data-cursor="Logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            KJ
          </button>

          <div className="hero-status" data-cursor="Available">
            <p>Current Status</p>
            <div>
              <span className="ping-dot" />
              <strong>
                Available for
                <br />
                <em>Projects</em>
              </strong>
            </div>
          </div>

          <div className="hero-name" style={{ whiteSpace: 'nowrap' }}>
            <span className="hero-name-line" />
            <div>
              <p>Hi, my name is</p>
              <h1>
                <span>K</span>aviyarasu <span>J</span>
              </h1>
            </div>
          </div>
        </header>

        <div className="hero-portrait-wrap">
          <div ref={portraitRef} className="hero-portrait" data-cursor="Product Engineer">
            <img className="portrait-img portrait-main" src={profilePortrait} alt="Kaviyarasu J profile portrait" />
            <img className="portrait-img portrait-ghost portrait-red" src={profilePortrait} alt="" aria-hidden="true" />
            <img className="portrait-img portrait-ghost portrait-cyan" src={profilePortrait} alt="" aria-hidden="true" />
            <span className="portrait-scan" aria-hidden="true" />
            <span className="portrait-shine" aria-hidden="true" />

          </div>
        </div>

        <div className="hero-right">
          <div className="hero-title-stack">
            <div>
              <span>01</span>
              <h2>
                Full Stack
              </h2>
            </div>
            <div>
              <span>02</span>
              <h2>
                Develop<span>er</span>
              </h2>
            </div>
          </div>

          <a className="hero-cta" href={`mailto:${profile.email}`} data-cursor="Email me">
            <span>
              <small>Get In Touch</small>
              <strong>Let&apos;s talk</strong>
            </span>
            <i>
              <ArrowUpRight size={24} />
            </i>
          </a>
        </div>
      </div>

      <nav className="hero-socials" aria-label="Social links">
        <span />
        <a href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor="Open LinkedIn">
          LinkedIn
        </a>
        <a href={`mailto:${profile.email}`} data-cursor="Send mail">
          Email
        </a>
        <a href={`tel:${profile.phone}`} data-cursor="Call">
          Phone
        </a>
      </nav>

      <aside className="side-text">
        <span />
        <i />
        <p>Design - build - deploy</p>
      </aside>
    </section>
  );
}

function ParticleField({ active }) {
  const points = useRef(null);
  const activeRef = useRef(active);
  const count = 5200;

  const shapes = useMemo(() => {
    const sphere = [];
    const card = [];
    const wave = [];
    const diamond = [];

    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const polar = Math.acos(2 * Math.random() - 1);
      
      // 1. Double Sphere (Inner 70% radius, heavy density; Outer lower density)
      const isInner = i < count * 0.75; // 75% inner, 25% outer
      const baseRadius = isInner ? 2.0 : 2.85; // Inner ~70% of Outer
      const radius = baseRadius + (Math.random() - 0.5) * 0.3;
      sphere.push(radius * Math.sin(polar) * Math.cos(angle), radius * Math.sin(polar) * Math.sin(angle), radius * Math.cos(polar));

      // 2. Database Cylinder (Tech/Backend) instead of Card
      const dbAngle = Math.random() * Math.PI * 2;
      const isSurface = Math.random() > 0.4;
      const dbRadius = isSurface ? 2.2 + (Math.random() - 0.5) * 0.15 : Math.sqrt(Math.random()) * 2.2;
      const dbY = (Math.random() - 0.5) * 4.5;
      const dbRingY = [-1.5, 0, 1.5][Math.floor(Math.random() * 3)];
      const isRing = Math.random() > 0.85;
      const finalDbY = isRing ? dbRingY + (Math.random() - 0.5) * 0.1 : dbY;
      card.push(dbRadius * Math.cos(dbAngle), finalDbY, dbRadius * Math.sin(dbAngle));

      // 3. Wave (unchanged)
      const x = (i / count - 0.5) * 9;
      wave.push(x, Math.sin(x * 1.6) * 1.2, Math.cos(x * 1.6) * 1.2);

      // 4. Diamond (unchanged)
      const dx = 2 * Math.random() - 1;
      const dy = 2 * Math.random() - 1;
      const dz = 2 * Math.random() - 1;
      const scale = 3.4 / (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) + 0.01);
      diamond.push(dx * scale, dy * scale, dz * scale);
    }

    return [sphere, card, wave, diamond].map((shape) => new Float32Array(shape));
  }, []);

  const positions = useMemo(() => new Float32Array(shapes[0]), [shapes]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useFrame((state) => {
    const target = shapes[activeRef.current] || shapes[0];
    const attr = points.current.geometry.attributes.position;

    for (let i = 0; i < attr.array.length; i += 1) {
      attr.array[i] += (target[i] - attr.array[i]) * 0.035;
    }

    attr.needsUpdate = true;
    points.current.rotation.y += 0.002;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={accent} size={0.026} transparent opacity={0.82} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function ApartSection() {
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    const canvas = rootRef.current?.querySelector('.apart-canvas');
    const triggers = differentiators.map((_, index) =>
      ScrollTrigger.create({
        trigger: `.apart-panel-${index}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      }),
    );
    const pinTrigger = ScrollTrigger.create({
      trigger: '.apart-wrap',
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => canvas?.classList.add('is-fixed'),
      onEnterBack: () => {
        canvas?.classList.remove('is-bottom');
        canvas?.classList.add('is-fixed');
      },
      onLeave: () => {
        canvas?.classList.remove('is-fixed');
        canvas?.classList.add('is-bottom');
      },
      onLeaveBack: () => {
        canvas?.classList.remove('is-fixed', 'is-bottom');
      },
    });

    return () => {
      pinTrigger.kill();
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={rootRef} id="about" className="apart-section">
      <h2 className="section-heading">
        <span>What</span> Sets Me Apart
      </h2>
      <div className="apart-wrap">
        <div className="apart-canvas" data-cursor="Interactive">
          <Canvas camera={{ position: [0, 0, 9], fov: 42 }} dpr={[1, 1.6]}>
            <ambientLight intensity={0.8} />
            <ParticleField active={active} />
          </Canvas>
        </div>
        <div className="apart-copy">
          {differentiators.map((item, index) => (
            <article key={item.titleB} className={`apart-panel apart-panel-${index}`}>
              <p>{item.label}</p>
              <h3>{item.titleA}</h3>
              <h3>{item.titleB}</h3>
              <span>{item.desc}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RealitySection() {
  const icons = [
    'Angular', 'Python', 'FastAPI', 'Azure', 'AI Models', 'MongoDB', 'APIM', 'Git',
    'Postman', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Flask', 'SQL', 'Stripe',
    'PayPal', 'JSON', 'DevOps', 'Security', 'REST APIs', 'Node.js', 'React', 'Linux',
    'Webhooks', 'OAuth', 'JWT', 'Agile', 'Jira', 'CI/CD', 'Functions', 'App Services'
  ];

  return (
    <section id="skills" className="reality-section" data-cursor="Move mouse">
      <div className="reality-mask">
        <img src={techVisualSheet} alt="" />
        {icons.map((icon, index) => {
          const col = index % 8;
          const row = Math.floor(index / 8);
          const top = 10 + row * 22;
          const left = 3 + col * 12 + (row % 2 === 0 ? 0 : 6);
          return (
            <span key={icon} style={{ '--i': index, left: `${left}%`, top: `${top}%` }}>
              {icon}
            </span>
          );
        })}
      </div>
      <h2>
        <span>Bring</span> your logic into production
      </h2>
    </section>
  );
}

function WorkSection() {
  return (
    <section id="projects" className="work-section">
      <h2 className="section-heading">
        <span>The</span> Artworks
      </h2>
      <div className="work-scroller">
        {projectReel.map((project, index) => (
          <article key={project.title} className="work-card" data-cursor="View Project">
            <div className="work-top">
              <span>Project #{index + 1}</span>
              <a href="#contact">Contact</a>
            </div>
            <div className="work-preview">
              <img className="work-image" src={techVisualSheet} alt="" style={{ objectPosition: visualPositions[index % visualPositions.length] }} />
              <div className="preview-window">
                <i />
                <i />
                <i />
              </div>
              <strong>{String(index + 1).padStart(2, '0')}</strong>
            </div>
            <h3>
              <span>{project.title.split(' ')[0]}</span> {project.title.split(' ').slice(1).join(' ')}
            </h3>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section className="manifesto-section">
      <h2 className="section-heading">
        <span>The</span> Manifesto
      </h2>
      <div className="manifesto-slider">
        {manifesto.map(([number, lineA, lineB, imgPath], index) => (
          <article key={number} className="manifesto-slide" data-cursor="Scroll">
            <div className="manifesto-image" style={{ '--index': index }}>
              <img src={imgPath} alt={lineA} />
              <span>{lineA}</span>
            </div>
            <div className="manifesto-copy">
              <small>{number}</small>
              <h3>
                {lineA}
                <br />
                {lineB}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PremiumGlowCard({ children, className = "" }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--mouse-x", "-999px");
    cardRef.current.style.setProperty("--mouse-y", "-999px");
  };

  return (
    <div
      className={`premium-glow-card ${className}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="premium-card-glow" />
      <div className="premium-card-content">{children}</div>
    </div>
  );
}

function ProfileDetails() {
  const skillList = skills.flatMap((skill) => skill.items);
  const [status, setStatus] = useState('');
  const formRef = useRef(null);

  /*
  const sendEmail = async (event) => {
    event.preventDefault();
    const configured =
      import.meta.env.VITE_EMAILJS_SERVICE_ID && import.meta.env.VITE_EMAILJS_TEMPLATE_ID && import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!configured) {
      setStatus('EmailJS keys are not configured yet. Use .env.example to connect this form.');
      return;
    }

    try {
      setStatus('Sending...');
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      formRef.current.reset();
      setStatus('Message sent.');
    } catch {
      setStatus('Message failed. Please email directly.');
    }
  };
  */

  return (
    <section className="details-section">
      <div>
        <h2>
          Full-stack product engineer focused on <span>Angular, Python, Azure, and AI.</span>
        </h2>
        <p>{profile.about}</p>
        <div className="skill-marquee">
          {skillList.slice(0, 18).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
      <aside>
        <PremiumGlowCard className="experience-card">
          <h3>{experience[0].role}</h3>
          <p>{experience[0].company}</p>
          <small>{experience[0].duration}</small>
          <ul>
            {experience[0].details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </PremiumGlowCard>

        <PremiumGlowCard className="education-card">
          <strong>{education.degree}</strong>
          <span>{education.college}</span>
          <span>
            {education.year} / CGPA {education.cgpa}
          </span>
        </PremiumGlowCard>

        <div className="cert-grid">
          {certifications.map((cert) => (
            <PremiumGlowCard key={cert.title} className="cert-card">
              <strong>{cert.title}</strong>
              <span>{cert.items.join(' / ')}</span>
            </PremiumGlowCard>
          ))}
        </div>
      </aside>
      {/*
      <form ref={formRef} className="replica-form" onSubmit={sendEmail}>
        <input name="from_name" placeholder="Name" required />
        <input name="reply_to" type="email" placeholder="Email" required />
        <textarea name="message" placeholder="Message" rows="4" required />
        <button type="submit">Send Message</button>
        {status && <p>{status}</p>}
      </form>
      */}
    </section>
  );
}

function Footer() {
  return (
    <>
      <section className="footer-spacer">
        <span />
      </section>
      <footer id="contact" className="big-footer">
        <p>
          <i />
          Available for new projects
        </p>
        <a href={`mailto:${profile.email}`} data-cursor="Email">
          Let&apos;s
        </a>
        <a href={`tel:${profile.phone}`} data-cursor="Call">
          Talk
        </a>
        <div>
          <span>Kaviyarasu J (C) 2026</span>
          <nav>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor="Open LinkedIn">
              LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} data-cursor="Send mail">
              Email
            </a>
            <a href={`tel:${profile.phone}`} data-cursor="Call">
              Phone
            </a>
          </nav>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>^ Back to top</button>
      </footer>
    </>
  );
}

export default function App() {
  useLenis();

  useEffect(() => {
    const cleanupFns = [];
    const ctx = gsap.context(() => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline({ delay: 2.2, defaults: { ease: 'expo.inOut' } });
      gsap.set('.hero-bg-word, .hero-logo, .hero-status, .hero-name, .hero-title-stack > div, .hero-cta, .hero-socials, .side-text', {
        opacity: 0,
      });
      gsap.set('.hero-portrait', { opacity: 0, clipPath: 'inset(0% 50% 0% 50%)', scale: 1.18 });
      gsap.set('.hero-name-line', { scaleY: 0 });

      tl.to('#loading-bar', { width: '100%', duration: 0.65 })
        .to(['.loading-word span', '.top-mark', '.desktop-note'], { yPercent: -130, opacity: 0, stagger: 0.012, duration: 0.4, ease: 'power2.out' })
        .to('#hero-wrapper', {
          width: '100%',
          height: '100%',
          borderRadius: 0,
          duration: 0.45,
          onComplete: () => {
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflow = 'auto';
          },
        })
        .to('.hero-bg-word', { opacity: 0.1, x: -110, scale: 1, duration: 2.1 }, '-=0.2')
        .to('.hero-portrait', { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.6 }, '-=1.9')
        .to('.hero-name-line', { scaleY: 1, duration: 1.1 }, '-=1.15')
        .to('.hero-title-stack > div', { opacity: 1, x: 0, stagger: 0.13, duration: 1.2 }, '-=1')
        .to(['.hero-name', '.hero-logo', '.hero-status', '.hero-cta'], { opacity: 1, y: 0, stagger: 0.09, duration: 0.9 }, '-=0.8')
        .to(['.hero-socials', '.side-text'], { opacity: 1, duration: 0.8 }, '-=0.4');

      gsap.utils.toArray('.section-heading').forEach((heading) => {
        gsap.from(heading.children, {
          yPercent: 105,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: heading, start: 'top 78%' },
        });
      });

      gsap.from('.reality-section', {
        scale: 0.22,
        scrollTrigger: {
          trigger: '.reality-section',
          start: 'top 75%',
          end: 'top 35%',
          scrub: 1.5,
        },
      });

      const reality = document.querySelector('.reality-section');
      let canSpawn = true;
      const spawnTechChip = (event) => {
        if (!reality || window.innerWidth < 1030 || !canSpawn) return;
        canSpawn = false;
        const item = fallingTech[Math.floor(Math.random() * fallingTech.length)];
        const chip = document.createElement('span');
        const glyph = document.createElement('i');
        const label = document.createElement('b');
        chip.className = `tech-fall-chip tech-fall-${item.tone}`;
        glyph.textContent = item.glyph;
        label.textContent = item.label;
        chip.append(glyph, label);
        chip.style.left = `${event.clientX - 28}px`;
        chip.style.top = `${event.clientY - 24}px`;
        chip.style.setProperty('--twirl', `${Math.random() * 100 - 50}px`);
        chip.style.setProperty('--rot', `${Math.random() * 120 - 60}deg`);
        document.body.appendChild(chip);
        setTimeout(() => chip.remove(), 2800);
        setTimeout(() => {
          canSpawn = true;
        }, 110);
      };
      reality?.addEventListener('mousemove', spawnTechChip);
      cleanupFns.push(() => reality?.removeEventListener('mousemove', spawnTechChip));

      const media = gsap.matchMedia();
      media.add('(min-width: 1030px)', () => {
        /*
        const workDistance = () => document.querySelector('.work-scroller').scrollWidth - window.innerWidth + window.innerWidth * 0.2;
        gsap.to('.work-scroller', {
          x: () => -workDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work-section',
            start: 'top top',
            end: () => `+=${workDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        */

        const manifestoDistance = () => document.querySelector('.manifesto-slider').scrollWidth - window.innerWidth + window.innerWidth * 0.2;
        const manifestoTween = gsap.to('.manifesto-slider', {
          x: () => -manifestoDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.manifesto-section',
            start: 'top top',
            end: () => `+=${manifestoDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Add dynamic animation to each card as it enters during horizontal scroll
        gsap.utils.toArray('.manifesto-slide').forEach((slide) => {
          gsap.from(slide, {
            opacity: 0,
            y: 80,
            scale: 0.85,
            rotateZ: 6,
            duration: 1.2,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: slide,
              containerAnimation: manifestoTween,
              start: 'left 95%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      });

      gsap.from('.manifesto-image', {
        width: 0,
        stagger: 0.1,
        duration: 1.3,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.manifesto-section', start: 'top 45%' },
      });

      gsap.to('.footer-spacer span', {
        height: '100%',
        ease: 'none',
        scrollTrigger: { trigger: '.footer-spacer', start: 'top center', end: 'bottom center', scrub: 1.6 },
      });

      gsap.from('.big-footer > a', {
        yPercent: 110,
        skewY: 7,
        stagger: 0.1,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.big-footer', start: 'top 45%' },
      });
    });

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Cursor />
      <main className="replica-site">
        <LoaderHero />
        <ApartSection />
        <RealitySection />
        {/* <WorkSection /> */}
        <ManifestoSection />
        <ProfileDetails />
        <Footer />
      </main>
    </>
  );
}
