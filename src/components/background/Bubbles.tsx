import { memo, useRef } from 'react';
import type { BubbleData } from '../../types';
import { BUBBLE_COUNT } from '../../data/constants';
import styles from './Bubbles.module.css';

interface BubblesProps {
  visible: boolean;
}

export const Bubbles = memo(function Bubbles({ visible }: BubblesProps) {
  const bubbles = useRef<BubbleData[]>(
    Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 50 + 15,
      duration: Math.random() * 9 + 7,
      delay: Math.random() * 6,
      hue: Math.floor(Math.random() * 360),
    })),
  );

  if (!visible) return null;

  return (
    <div className={styles.container}>
      {bubbles.current.map((b) => (
        <div
          key={b.id}
          className={styles.bubble}
          style={{
            left: `${b.x}%`,
            width: b.size,
            height: b.size,
            background: `hsla(${b.hue}, 80%, 75%, 0.3)`,
            borderColor: `hsla(${b.hue}, 80%, 85%, 0.45)`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
});
