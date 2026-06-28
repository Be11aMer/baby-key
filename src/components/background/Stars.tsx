import { memo, useRef } from 'react';
import type { StarData } from '../../types';
import { STAR_COUNT } from '../../data/constants';
import styles from './Stars.module.css';

const STAR_COLORS = ['#ffffff', '#ffe4a0', '#a0d4ff'];

interface StarsProps {
  visible: boolean;
}

export const Stars = memo(function Stars({ visible }: StarsProps) {
  const stars = useRef<StarData[]>(
    Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    })),
  );

  if (!visible) return null;

  return (
    <div className={styles.container}>
      {stars.current.map((s) => (
        <div
          key={s.id}
          className={styles.star}
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              '--star-color': s.color,
            } as React.CSSProperties
          }
        />
      ))}
      {[0, 1, 2].map((i) => (
        <div
          key={`shoot-${i}`}
          className={styles.shootingStar}
          style={{
            top: `${10 + i * 25}%`,
            left: `${15 + i * 30}%`,
            animationDelay: `${i * 4 + 2}s`,
            animationDuration: `${8 + i * 3}s`,
          }}
        />
      ))}
    </div>
  );
});
