import { memo } from 'react';
import type { ThemeMode } from '../../types';
import styles from './BottomInfo.module.css';

interface BottomInfoProps {
  lastKey: string | null;
  theme: ThemeMode;
}

export const BottomInfo = memo(function BottomInfo({ lastKey, theme }: BottomInfoProps) {
  return (
    <div className={styles.container}>
      {lastKey && (
        <div className={`${styles.lastKey} ${styles[`lastKey-${theme}`]}`}>
          Last key: <span className={`${styles.badge} ${styles[`badge-${theme}`]}`}>{lastKey}</span>
        </div>
      )}
      <div className={`${styles.tip} ${styles[`tip-${theme}`]}`}>
        Tip: Use &quot;Lock Screen&quot; to keep babies in the app
      </div>
    </div>
  );
});
