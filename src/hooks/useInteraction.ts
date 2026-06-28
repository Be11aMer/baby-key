import { useState, useCallback, useEffect, useRef } from 'react';
import type { ParticleData, RippleData, ThemeMode } from '../types';
import { ANIMATIONS } from '../data/animations';
import {
  COLORS_DARK,
  COLORS_LIGHT,
  MAX_PARTICLES,
  MAX_RIPPLES,
  PARTICLE_LIFETIME_MS,
  RIPPLE_LIFETIME_MS,
} from '../data/constants';
import { useAudio } from './useAudio';

export function useInteraction(theme: ThemeMode) {
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [ripples, setRipples] = useState<RippleData[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [flashLabel, setFlashLabel] = useState<string | null>(null);
  const [pressCount, setPressCount] = useState(0);
  const [counterKey, setCounterKey] = useState(0);

  const { playNote, playChord, playArpeggio } = useAudio();
  const pressCountRef = useRef(0);
  const idRef = useRef(0);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const colors = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

  const spawn = useCallback(
    (x: number, y: number, count: number) => {
      const newParticles = Array.from({ length: count }, () => {
        const animation = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 100;
        return {
          id: ++idRef.current,
          x,
          y,
          animation,
          dx: Math.cos(angle) * dist * 2.5,
          dy: Math.sin(angle) * dist * 2.5 - 100,
        };
      });

      const color = colors[Math.floor(Math.random() * colors.length)];
      const rippleId = ++idRef.current;

      setParticles((prev) => [...prev.slice(-MAX_PARTICLES), ...newParticles]);
      setRipples((prev) => [...prev.slice(-MAX_RIPPLES), { id: rippleId, x, y, color }]);

      setTimeout(
        () => setRipples((prev) => prev.filter((r) => r.id !== rippleId)),
        RIPPLE_LIFETIME_MS,
      );
    },
    [colors],
  );

  const triggerInteraction = useCallback(
    (keyStr: string | null, x: number, y: number, isSpecial: boolean) => {
      if (isSpecial) {
        playChord();
      } else {
        playNote();
      }

      if (keyStr) {
        setLastKey(keyStr);
        setFlashLabel(keyStr);
        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        flashTimerRef.current = setTimeout(() => setFlashLabel(null), 700);
      }

      pressCountRef.current += 1;
      if (pressCountRef.current % 10 === 0) {
        playArpeggio();
      }

      setPressCount((c) => c + 1);
      setCounterKey((k) => k + 1);
      spawn(x, y, isSpecial ? 12 : 3 + Math.floor(Math.random() * 3));
    },
    [playNote, playChord, playArpeggio, spawn],
  );

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;

      const label =
        e.key === ' '
          ? 'SPACE'
          : e.key.length === 1
            ? e.key.toUpperCase()
            : e.key.replace(/^(Arrow|Key|Digit)/, '');

      const margin = Math.min(80, window.innerWidth * 0.1);
      const x = margin + Math.random() * (window.innerWidth - margin * 2);
      const y = margin + Math.random() * (window.innerHeight - margin * 2);
      triggerInteraction(label, x, y, e.key === 'Enter' || e.key === ' ');
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      Array.from(e.changedTouches).forEach((t) => {
        triggerInteraction(null, t.clientX, t.clientY, false);
      });
    };

    const preventGesture = (e: TouchEvent) => e.preventDefault();

    window.addEventListener('keydown', handleKey, { passive: false });
    window.addEventListener('touchstart', handleTouch, { passive: false });
    window.addEventListener('touchmove', preventGesture, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', preventGesture);
    };
  }, [triggerInteraction]);

  return {
    particles,
    ripples,
    lastKey,
    flashLabel,
    pressCount,
    counterKey,
    removeParticle,
  };
}

export { PARTICLE_LIFETIME_MS };
