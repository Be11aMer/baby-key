import { memo, useEffect } from 'react';
import type { ParticleData } from '../../types';
import { PARTICLE_LIFETIME_MS } from '../../data/constants';
import styles from './Particle.module.css';

interface ParticleProps extends ParticleData {
  onDone: (id: number) => void;
}

export const Particle = memo(function Particle({ id, x, y, animation, dx, dy, onDone }: ParticleProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(id), PARTICLE_LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [id, onDone]);

  return (
    <div
      className={`${styles.particle}${animation.bounce ? ` ${styles.bouncy}` : ''}`}
      style={
        {
          left: x,
          top: y,
          fontSize: animation.size,
          '--dx': `${dx}px`,
          '--dy': `${dy}px`,
        } as React.CSSProperties
      }
      role="img"
      aria-hidden="true"
    >
      {animation.emoji}
    </div>
  );
});
