import { useState, useMemo } from 'react';
import type { ThemeMode } from '../types';
import { useInteraction } from '../hooks/useInteraction';
import { useFullscreen } from '../hooks/useFullscreen';
import { Stars } from './background/Stars';
import { Bubbles } from './background/Bubbles';
import { Particle } from './effects/Particle';
import { Ripple } from './effects/Ripple';
import { FlashLabel } from './effects/FlashLabel';
import { TopBar } from './ui/TopBar';
import { CenterHint } from './ui/CenterHint';
import { BottomInfo } from './ui/BottomInfo';
import styles from './BabyKeysApp.module.css';

export default function BabyKeysApp() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const isDark = theme === 'dark';

  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { particles, ripples, lastKey, flashLabel, pressCount, counterKey, removeParticle } =
    useInteraction(theme);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const background = useMemo(
    () =>
      isDark
        ? 'radial-gradient(ellipse at 25% 20%, #1e0545 0%, #0b0622 45%, #000914 100%)'
        : 'radial-gradient(ellipse at 75% 25%, #ffe4f5 0%, #e4eeff 40%, #edfff4 100%)',
    [isDark],
  );

  return (
    <div className={styles.root} style={{ background }}>
      <Stars visible={isDark} />
      <Bubbles visible={!isDark} />

      {ripples.map((r) => (
        <Ripple key={r.id} {...r} />
      ))}
      {particles.map((p) => (
        <Particle key={p.id} {...p} onDone={removeParticle} />
      ))}

      <FlashLabel label={flashLabel} theme={theme} />

      <div className={styles.overlay}>
        <TopBar
          pressCount={pressCount}
          counterKey={counterKey}
          theme={theme}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onToggleTheme={toggleTheme}
        />

        <CenterHint visible={pressCount === 0} theme={theme} />

        <BottomInfo lastKey={lastKey} theme={theme} />
      </div>
    </div>
  );
}
