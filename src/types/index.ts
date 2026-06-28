export interface AnimationConfig {
  emoji: string;
  size: number;
  spin: boolean;
  bounce: boolean;
}

export interface ParticleData {
  id: number;
  x: number;
  y: number;
  animation: AnimationConfig;
  dx: number;
  dy: number;
}

export interface RippleData {
  id: number;
  x: number;
  y: number;
  color: string;
}

export interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export interface BubbleData {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  hue: number;
}

export type ThemeMode = 'dark' | 'light';
