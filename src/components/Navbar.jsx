import { Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { profile } from '../data/portfolio';

const links = ['about', 'projects', 'skills', 'experience', 'contact'];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const goTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-5 py-4 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-ink/55 px-4 py-3 text-sm text-white/75 shadow-glow backdrop-blur-xl">
        <button onClick={() => goTo('home')} className="font-display text-base font-semibold text-white">
          KJ<span className="text-cyan">.</span>
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <button key={link} onClick={() => goTo(link)} className="nav-link capitalize">
              {link}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/cinematic-portofilo/index.html"
            className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3.5 py-1.5 text-xs font-semibold text-red-200 transition-all hover:border-red-400 hover:bg-red-900/50 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            <span>🎬 Cinematic Mode</span>
          </a>

          <a href={`mailto:${profile.email}`} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-ink">
            <Mail size={16} />
            Contact
          </a>
        </div>

        <button className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-3 grid max-w-7xl gap-2 rounded-3xl border border-white/10 bg-ink/90 p-4 text-white/80 backdrop-blur-xl md:hidden">
          {links.map((link) => (
            <button key={link} onClick={() => goTo(link)} className="rounded-2xl px-3 py-3 text-left capitalize hover:bg-white/10">
              {link}
            </button>
          ))}
          <a
            href="/cinematic-portofilo/index.html"
            className="flex items-center gap-2 rounded-2xl bg-red-950/60 border border-red-500/40 px-3 py-3 text-left font-semibold text-red-200 hover:bg-red-900/70"
          >
            🎬 Switch to Cinematic Portfolio
          </a>
        </div>
      )}
    </header>
  );
}
