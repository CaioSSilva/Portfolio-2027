import gsap from 'gsap';

export interface PathPoint {
  x: number;
  y: number;
  tx: number;
  ty: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface PhysicsTable {
  totalLength: number;
  totalTime: number;
  exitSpeed: number;
  sampleAtTime: (tNorm: number) => number;
  pointAtArcLength: (s: number) => Point2D;
}

export interface Parabola {
  vx: number;
  vyLaunch: number;
  vyLand: number;
  gJump: number;
  duration: number;
}

export interface BallLoopHandle {
  timeline: gsap.core.Timeline;
  destroy: () => void;
}
