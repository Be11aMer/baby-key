import { memo } from 'react';
import type { ThemeMode } from '../../types';
import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: string;
  label?: string;
  onClick: () => void;
  theme: ThemeMode;
  title?: string;
}

export const IconButton = memo(function IconButton({
  icon,
  label,
  onClick,
  theme,
  title,
}: IconButtonProps) {
  return (
    <button className={`${styles.button} ${styles[theme]}`} onClick={onClick} title={title}>
      <span className={styles.icon}>{icon}</span>
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
});
