import { useRef, useCallback } from 'react';
import { NOTE_FREQS, WAVEFORM_PAIRS } from '../data/constants';

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as never)['webkitAudioContext'])();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }, []);

  const playNote = useCallback(() => {
    try {
      const ctx = getCtx();
      const freq = NOTE_FREQS[Math.floor(Math.random() * NOTE_FREQS.length)];
      const now = ctx.currentTime;
      const pair = WAVEFORM_PAIRS[Math.floor(Math.random() * WAVEFORM_PAIRS.length)];
      const detune = 1.005 + Math.random() * 0.015;
      const attack = 0.01 + Math.random() * 0.03;
      const duration = 0.6 + Math.random() * 0.4;
      const volume = 0.1 + Math.random() * 0.08;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = pair[0];
      osc2.type = pair[1];
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * detune, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio may fail on some devices — non-critical
    }
  }, [getCtx]);

  const playChord = useCallback(() => {
    try {
      const ctx = getCtx();
      const rootIdx = Math.floor(Math.random() * (NOTE_FREQS.length - 4));
      const root = NOTE_FREQS[rootIdx];
      const fifth = root * 1.5;
      const octave = root * 2;
      const now = ctx.currentTime;

      [root, fifth, octave].forEach((freq, i) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 1.008, now);

        const vol = 0.12 - i * 0.02;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(now + 1.0);
        osc2.stop(now + 1.0);
      });
    } catch {
      // non-critical
    }
  }, [getCtx]);

  const playArpeggio = useCallback(() => {
    try {
      const ctx = getCtx();
      const startIdx = Math.floor(Math.random() * (NOTE_FREQS.length - 3));
      const notes = [NOTE_FREQS[startIdx], NOTE_FREQS[startIdx + 1], NOTE_FREQS[startIdx + 2]];
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const offset = i * 0.08;

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now + offset);
        osc2.frequency.setValueAtTime(freq * 1.01, now + offset);

        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(0.13, now + offset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + offset);
        osc2.start(now + offset);
        osc1.stop(now + offset + 0.5);
        osc2.stop(now + offset + 0.5);
      });
    } catch {
      // non-critical
    }
  }, [getCtx]);

  return { playNote, playChord, playArpeggio };
}
