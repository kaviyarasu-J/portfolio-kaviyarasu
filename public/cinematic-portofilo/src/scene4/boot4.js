// Scene four's lifecycle: rebuild the reference as living layers, then run
// the assembly. The environment is canvas (gallery.js); the twelve project
// cards are DOM buttons wearing sprites cut from the reference itself; the
// figure is the reference's own pixels, matted. Everything is placed through
// one fitCover() mapping, so the layers agree to the pixel.
//
// Interaction model:
//   pointer  -> a damped -1..1 pair; the deck yaws a couple of degrees, each
//               card drifts by its depth (near flanks move most, the far row
//               least), the figure counters gently, the plate slides opposite
//   hover    -> the card lifts toward the camera; its siblings ease back
//   scroll   -> past the intro, the whole universe dollies subtly toward you

import { createGL } from '../gl/renderer.js';
import { Gallery } from './gallery.js';
import { CARDS, PERSON, PORTRAIT, fitCover } from './layout4.js';
import { sample4, cardIn, popEase, T4 } from './timeline4.js';

const damp = (v, to, k, dt) => v + (to - v) * (1 - Math.exp(-k * dt));

export async function initGallery() {
  const section = document.getElementById('gallery');
  const canvas = document.getElementById('galleryStage');
  const deck = document.getElementById('galleryDeck');
  const person = document.getElementById('galleryPerson');
  const portal = document.getElementById('galleryPortal');
  const vignette = document.getElementById('portalVignette');
  const portalHud = document.getElementById('portalHud');
  // Scene 5 Glossy Holographic HUD panels
  const pLeft  = document.getElementById('panelLeft');
  const pRight = document.getElementById('panelRight');
  const pDock  = document.getElementById('panelDock');
  if (!section || !canvas || !deck || !person) return null;

  const gl = createGL(canvas);
  if (!gl) {
    section.classList.add('is-fallback', 'is-set');
    return null;
  }
  const gallery = new Gallery(canvas, gl);
  await gallery.load();

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const labels = [...section.querySelectorAll('.g-label')];
  const num = document.getElementById('galleryNum');

  // ---- cards ---------------------------------------------------------------
  // far row surfaces first: entrance order is depth-sorted, back to front
  const order = CARDS.map((c, i) => i)
    .sort((a, b) => CARDS[b].depth - CARDS[a].depth);
  const rank = [];
  order.forEach((ci, k) => { rank[ci] = k; });

  const cards = CARDS.map((c, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'g-card';
    el.dataset.i = String(i);
    el.setAttribute('aria-label', `Project — ${c.title}`);
    el.style.setProperty('--tint',
      `rgba(${c.tint.map((v, k) => k < 3 ? Math.round(v * 255) : v)}, 0.5)`);
    el.style.zIndex = String(10 + Math.round((1 - c.depth) * 20));
    el.style.setProperty('--i', String(i));   // float dephasing
    el.innerHTML = `<span class="g-card__in">`
      + `<img src="public/projects/${c.id}.png" alt="" `
      + `draggable="false" loading="eager" decoding="async"></span>`;
    deck.appendChild(el);
    return el;
  });
  person.style.zIndex = '34';

  // ---- placement -----------------------------------------------------------
  let portrait = false;
  function place() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const f = gallery.resize(w, h, dpr);
    portrait = w / h < 0.75;
    section.classList.toggle('is-portrait', portrait);

    for (let i = 0; i < cards.length; i++) {
      const c = CARDS[i];
      const el = cards[i];
      if (portrait) {
        const p = PORTRAIT.get(i);
        if (!p) { el.style.display = 'none'; continue; }
        el.style.display = '';
        const cw = p.w * w;
        el.style.width = `${cw}px`;
        el.style.left = `${p.cx * w - cw / 2}px`;
        el.style.top = `${p.cy * h - (cw * c.box[3] / c.box[2]) / 2}px`;
      } else {
        el.style.display = '';
        el.style.width = `${c.box[2] * f.s}px`;
        el.style.left = `${c.box[0] * f.s + f.ox}px`;
        el.style.top = `${c.box[1] * f.s + f.oy}px`;
      }
    }

    // the red 01 belongs to the composition, not the viewport corners: it
    // rides just over the hero screen's top-left, where the reference puts it
    if (num && !portrait) {
      num.style.left = `${588 * f.s + f.ox}px`;
      num.style.top = `${46 * f.s + f.oy}px`;
      num.style.fontSize = `${Math.max(10, 15 * f.s)}px`;
    }

    // The figure keeps the plate's own cover mapping in EVERY orientation:
    // he must sit exactly over the hole the extractor filled behind him, or
    // the fill's soft edge reads as a box around his silhouette.
    person.style.width = `${PERSON.w * f.s}px`;
    person.style.left = `${PERSON.x * f.s + f.ox}px`;
    person.style.top = `${PERSON.y * f.s + f.oy}px`;
  }
  place();
  let resizeId;
  window.addEventListener('resize', () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(place, 140);
  });

  // ---- pointer -------------------------------------------------------------
  const ptr = { tx: 0, ty: 0, x: 0, y: 0, inside: false };
  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    ptr.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    ptr.inside = true;
  }, { passive: true });
  section.addEventListener('pointerleave', () => { ptr.inside = false; });

  // hover: the deck learns something is hot so siblings can ease back
  deck.addEventListener('pointerover', (e) => {
    if (e.target.closest('.g-card')) deck.classList.add('is-hot');
  });
  deck.addEventListener('pointerout', (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest('.g-card')) {
      deck.classList.remove('is-hot');
    }
  });

  // ---- the clock -----------------------------------------------------------
  const state = { started: 0, running: false, visible: false, raf: 0, last: 0, set: false };

  const frame = (now) => {
    if (!state.running) return;
    const dt = Math.min(0.05, (now - state.last) / 1000 || 0.016);
    state.last = now;
    const t = reduced ? T4.live + 2 : (now - state.started) / 1000;
    const s = sample4(t);

    // scroll dolly: progress of the pin through its extra scroll room
    const r = section.getBoundingClientRect();
    const room = section.offsetHeight - window.innerHeight;
    const sp = room > 4 ? Math.min(1, Math.max(0, -r.top / room)) : 0;

    // Cinematic 3D camera fly-through:
    // As the visitor scrolls into the floating designs, the camera pushes deep forward
    // into the 3D room, causing cards to disperse outward and dissolving smoothly into
    // the Kaviyarasu image (Footer image.png).
    const camProgress = Math.min(1, Math.max(0, (sp - 0.10) / 0.90));
    const camWarp = Math.pow(camProgress, 1.85);

    ptr.x = damp(ptr.x, ptr.inside ? ptr.tx : 0, 2.8, dt);
    ptr.y = damp(ptr.y, ptr.inside ? ptr.ty : 0, 2.8, dt);
    gallery.par.x = ptr.x;
    gallery.par.y = ptr.y;
    gallery.dolly = sp * 2.5;
    gallery.render(t, s);

    // Deck camera motion: pitch/yaw with pointer + big cinematic zoom push-in
    const live = s.live ? 1 : 0;
    const deckScale = 1 + camWarp * 3.4;
    const deckTranslateZ = camWarp * 550;
    deck.style.transform =
      `rotateY(${(ptr.x * 2.1 * live).toFixed(3)}deg) `
      + `rotateX(${(-ptr.y * 1.4 * live).toFixed(3)}deg) `
      + `translateZ(${deckTranslateZ.toFixed(2)}px) `
      + `scale(${deckScale.toFixed(4)})`;

    for (let i = 0; i < cards.length; i++) {
      if (portrait && !PORTRAIT.get(i)) continue;
      const el = cards[i];
      const d = CARDS[i].depth;
      const e = popEase(cardIn(s.deck, rank[i], cards.length));
      const rise = (1 - e) * (0.42 * window.innerHeight);
      const str = (6 + (1 - d) * 26) * live;
      let tx = ptr.x * str;
      let ty = ptr.y * str * 0.55;

      // 3D Camera fly-through dispersion:
      // Cards fly outward from the central vanishing point past the camera lens
      const cx = CARDS[i].box[0] + CARDS[i].box[2] * 0.5;
      const cy = CARDS[i].box[1] + CARDS[i].box[3] * 0.5;
      const dirX = (cx - 800) / 380;
      const dirY = (cy - 450) / 240;
      const flyDist = camWarp * (580 * (1.3 - d * 0.45));
      tx += dirX * flyDist;
      ty += dirY * flyDist;

      const cardScale = 0.84 + e * 0.16 + camWarp * (1.15 - d * 0.4);
      el.style.transform =
        `translate3d(${tx.toFixed(2)}px, ${(ty + rise).toFixed(2)}px, ${(camWarp * 220).toFixed(2)}px) `
        + `rotateX(${((1 - e) * -24).toFixed(2)}deg) `
        + `rotateZ(${((1 - e) * (i % 2 ? 3.5 : -3.5)).toFixed(2)}deg) `
        + `scale(${cardScale.toFixed(4)})`;

      // Base opacity with smooth pass-by camera fade
      const baseOp = Math.min(1, Math.max(0, e * 2.4));
      const cardFadeThreshold = 0.20 + d * 0.42;
      const cardFade = Math.max(0, 1 - Math.max(0, (camProgress - cardFadeThreshold) / 0.32));
      el.style.opacity = (baseOp * cardFade).toFixed(3);

      // HD clarity: clear any blur once live or settled
      if (s.live || e >= 0.98) {
        el.style.filter = '';
      } else if (e < 0.98) {
        el.style.filter = `blur(${((1 - Math.min(1, e)) * 5).toFixed(2)}px)`;
      }
    }

    // the figure: rises into light, camera zooms in towards him, then dissolves as the fifth page enters
    const pe = s.person;
    const personFade = Math.max(0, 1 - Math.max(0, (camProgress - 0.40) / 0.30));
    const personScale = 0.985 + pe * 0.015 + camWarp * 3.4;
    person.style.transform =
      `translate3d(${(ptr.x * -9 * live).toFixed(2)}px, `
      + `${(ptr.y * -5 * live + (1 - pe) * 34).toFixed(2)}px, 0) `
      + `scale(${personScale.toFixed(4)})`;
    person.style.opacity = (pe * personFade).toFixed(3);

    // Labels fade out as soon as fly-through begins
    if (labels.length) {
      const labelFade = Math.max(0, 1 - camProgress * 2.8);
      labels.forEach((l) => { l.style.opacity = labelFade.toFixed(3); });
    }

    // Reveal fifth image (Kaviyarasu image) and orchestrate Iron Man suit assembly
    if (portal) {
      if (camProgress >= 0.35) {
        portal.style.visibility = 'visible';
        // Fast, smooth portal fade-in: completes by camProgress = 0.44
        const pP = Math.min(1, Math.max(0, (camProgress - 0.35) / 0.10));
        const pEase = pP * pP * (3 - 2 * pP);
        portal.style.opacity = pEase.toFixed(3);
        const pScale = (0.94 + pEase * 0.06).toFixed(4);
        portal.style.transform = `scale(${pScale})`;

        // Suit pieces fly in rapidly between 0.40 and 0.52, then are 100% completely visible:
        const assembleProgress = Math.min(1, Math.max(0, (camProgress - 0.40) / 0.12));

        if (vignette) {
          vignette.style.opacity = (assembleProgress * 0.82).toFixed(3);
        }

        if (portalHud) {
          portalHud.classList.toggle('is-interactive', assembleProgress >= 0.85);
        }

        // Sub-piece eases with mechanical snap
        const easePiece = (t, start, end) => {
          const p = Math.min(1, Math.max(0, (t - start) / (end - start)));
          return p * p * (3 - 2 * p);
        };

        // --- Holographic Iron Man Suit Assembly ---
        const leftP = easePiece(assembleProgress, 0.00, 0.70);
        const rightP = easePiece(assembleProgress, 0.08, 0.80);
        const dockP = easePiece(assembleProgress, 0.18, 0.90);

        // Left Panel (Identity & Journey): 100% visible once assembled
        if (pLeft) {
          if (leftP >= 0.99) {
            pLeft.style.transform = '';
            pLeft.style.opacity = '1';
            pLeft.style.filter = '';
          } else {
            const tx = (1 - leftP) * -240;
            const ty = (1 - leftP) * 30;
            const tz = (1 - leftP) * 160;
            const rot = (1 - leftP) * -8;
            pLeft.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateY(${(-rot).toFixed(1)}deg) rotateZ(${rot.toFixed(1)}deg)`;
            pLeft.style.opacity = leftP.toFixed(3);
            pLeft.style.filter = `blur(${((1 - leftP) * 10).toFixed(1)}px)`;
          }
        }

        // Right Panel (Core Stack & Architecture): 100% visible once assembled
        if (pRight) {
          if (rightP >= 0.99) {
            pRight.style.transform = '';
            pRight.style.opacity = '1';
            pRight.style.filter = '';
          } else {
            const tx = (1 - rightP) * 240;
            const ty = (1 - rightP) * -30;
            const tz = (1 - rightP) * 160;
            const rot = (1 - rightP) * 8;
            pRight.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateY(${(-rot).toFixed(1)}deg) rotateZ(${rot.toFixed(1)}deg)`;
            pRight.style.opacity = rightP.toFixed(3);
            pRight.style.filter = `blur(${((1 - rightP) * 10).toFixed(1)}px)`;
          }
        }

        // Center-Bottom Credentials Dock: 100% visible once assembled
        if (pDock) {
          if (dockP >= 0.99) {
            pDock.style.transform = '';
            pDock.style.opacity = '1';
            pDock.style.filter = '';
          } else {
            const ty = (1 - dockP) * 70;
            const tz = (1 - dockP) * 80;
            pDock.style.transform = `translate3d(0, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px)`;
            pDock.style.opacity = dockP.toFixed(3);
            pDock.style.filter = `blur(${((1 - dockP) * 8).toFixed(1)}px)`;
          }
        }
      } else {
        portal.style.opacity = '0';
        portal.style.visibility = 'hidden';
        if (vignette) vignette.style.opacity = '0';
      }
    }

    if (s.labels > 0 && !state.set) {
      state.set = true;
      section.classList.add('is-labels');
    }
    if (s.live) section.classList.add('is-live');

    state.raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (state.running) return;
    state.running = true;
    state.last = performance.now();
    if (!state.started) state.started = performance.now();
    state.raf = requestAnimationFrame(frame);
  };
  const stop = () => { state.running = false; cancelAnimationFrame(state.raf); };

  new IntersectionObserver((entries) => {
    for (const e of entries) {
      state.visible = e.isIntersecting;
      if (e.isIntersecting) start(); else stop();
    }
  }, { threshold: 0.22 }).observe(section);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stop();
    else if (state.visible) start();
  });

  labels.forEach((el, i) => el.style.setProperty('--li', String(i)));

  // review hook: canvas only (the cards are DOM; screenshot the pane for those)
  window.__shot4 = async (name = 'gallery', at = null) => {
    const t = at !== null ? at : (performance.now() - state.started) / 1000;
    gallery.render(t, sample4(t));
    const url = canvas.toDataURL('image/png');
    await fetch(`/__shot?name=${encodeURIComponent(name)}`, { method: 'POST', body: url });
    return `${canvas.width}x${canvas.height} @ t=${t.toFixed(2)}`;
  };
  window.__gallery = { gallery, state, section };

  return { gallery, section };
}
