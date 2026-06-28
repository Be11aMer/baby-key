import { memo } from 'react';
import type { RippleData } from '../../types';
import styles from './Ripple.module.css';

interface RippleProps extends RippleData {}

export const Ripple = memo(function Ripple({ x, y, color }: RippleProps) {
  return (
    <div className={styles.container} style={{ left: x, top: y }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={styles.ring}
          style={{
            borderColor: color,
            animationDelay: `${i * 0.13}s`,
          }}
        />
      ))}
    </div>
  );
});
