import { memo } from 'react';
import type { ThemeMode } from '../../types';
import styles from './CenterHint.module.css';

interface CenterHintProps {
  visible: boolean;
  theme: ThemeMode;
}

export const CenterHint = memo(function CenterHint({ visible, theme }: CenterHintProps) {
  if (!visible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.icon}>⌨️</div>
      <div className={`${styles.text} ${styles[theme]}`}>Smash the keys!</div>
      <div className={`${styles.subtext} ${styles[theme]}`}>👆 or touch the screen!</div>
    </div>
  );
});
