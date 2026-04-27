import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CursorGlow() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const move = (event) => {
      gsap.to(cursor, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return <div ref={cursorRef} className="cursor-glow" aria-hidden="true" />;
}
