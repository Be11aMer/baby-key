import { memo } from 'react';
import type { ThemeMode } from '../../types';
import { IconButton } from './IconButton';
import styles from './TopBar.module.css';

interface TopBarProps {
  pressCount: number;
  counterKey: number;
  theme: ThemeMode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onToggleTheme: () => void;
}

export const TopBar = memo(function TopBar({
  pressCount,
  counterKey,
  theme,
  isFullscreen,
  onToggleFullscreen,
  onToggleTheme,
}: TopBarProps) {
  return (
    <div className={styles.bar}>
      <div className={`${styles.title} ${styles[theme]}`}>🎹 Baby Keys</div>

      {pressCount > 0 && (
        <div key={counterKey} className={`${styles.counter} ${styles[`counter-${theme}`]}`}>
          ✨ {pressCount}
        </div>
      )}

      <div className={styles.actions}>
        <IconButton
          icon={isFullscreen ? '🗗' : '🖵'}
          label={isFullscreen ? 'Exit' : 'Lock Screen'}
          onClick={onToggleFullscreen}
          theme={theme}
          title="Lock Fullscreen"
        />
        <IconButton
          icon={theme === 'dark' ? '☀️' : '🌙'}
          onClick={onToggleTheme}
          theme={theme}
        />
      </div>
    </div>
  );
});
