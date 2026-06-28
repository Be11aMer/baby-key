import { useRef, useCallback } from 'react';
import { NOTE_FREQS } from '../data/constants';

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playNote = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as never)['webkitAudioContext'])();
    }

    const ctx = ctxRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const freq = NOTE_FREQS[Math.floor(Math.random() * NOTE_FREQS.length)];
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.01, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } catch {
      // Audio may fail on some devices — non-critical
    }
  }, []);

  return { playNote };
}
