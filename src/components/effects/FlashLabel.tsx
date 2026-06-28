import { memo } from 'react';
import type { ThemeMode } from '../../types';
import styles from './FlashLabel.module.css';

interface FlashLabelProps {
  label: string | null;
  theme: ThemeMode;
}

export const FlashLabel = memo(function FlashLabel({ label, theme }: FlashLabelProps) {
  if (!label) return null;

  return (
    <div className={`${styles.label} ${styles[theme]}`} key={label + Date.now()}>
      {label}
    </div>
  );
});
