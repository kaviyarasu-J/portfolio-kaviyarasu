import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.25,
    smoothWheel: true,
    wheelMultiplier: 0.86,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function splitText(element) {
  if (!element) return [];
  const words = element.textContent.trim().split(' ');
  element.textContent = '';

  return words.map((word) => {
    const span = document.createElement('span');
    span.className = 'split-word';
    span.textContent = word;
    element.appendChild(span);
    element.appendChild(document.createTextNode(' '));
    return span;
  });
}
