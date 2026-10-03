import gsap from 'gsap';
import {
  BallLoopHandle,
  Parabola,
  PathPoint,
  PhysicsTable,
  Point2D,
} from '../../interfaces/ball-loop';

const BALL_LOOP_CONFIG = {
  svgDesignWidth: 1200,
  svgDesignHeight: 500,
  targetPxRadius: 11,
  strokeHalfWidth: 1.75,
  gPhysics: 650,
  vInitial: 120,
  gExit: 400,
  enterStartX: -50,
  enterYLift: 20,
  enterArcAmplitude: -15,
  enterDuration: 0.35,
};

const BALL_LOOP_MOBILE_CONFIG = {
  svgDesignWidth: 400,
  svgDesignHeight: 700,
  targetPxRadius: 11,
  strokeHalfWidth: 1.75,
  gPhysics: 750,
  vInitial: 140,
  gExit: 600,
  exitTargetX: 460,
  enterDuration: 0.55,
  enterArcHeight: 45,
};

function bisect(array: number[], target: number): number {
  let low = 0;
  let high = array.length - 1;
  while (low < high - 1) {
    const mid = (low + high) >> 1;
    if (array[mid] <= target) low = mid;
    else high = mid;
  }
  return low;
}

function computePhysicsTable(
  path: SVGPathElement,
  v0: number,
  g: number,
  steps = 300,
): PhysicsTable {
  const totalLength = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 0;
  const startPt =
    typeof path.getPointAtLength === 'function' ? path.getPointAtLength(0) : { x: 0, y: 0 };

  const samples: { s: number; h: number; pt: Point2D }[] = [];
  for (let i = 0; i <= steps; i++) {
    const s = totalLength ? (i / steps) * totalLength : 0;
    const rawPt =
      typeof path.getPointAtLength === 'function' ? path.getPointAtLength(s) : { x: 0, y: 0 };
    const pt = { x: rawPt.x, y: rawPt.y };
    samples.push({ s, h: -(pt.y - startPt.y), pt });
  }

  const times: number[] = [0];
  const speeds: number[] = [];
  for (let i = 0; i < steps; i++) {
    const ds = samples[i + 1].s - samples[i].s;
    const avgH = (samples[i].h + samples[i + 1].h) / 2;
    const speed = Math.sqrt(Math.max(10, v0 * v0 - 2 * g * avgH));
    speeds.push(speed);
    times.push(times[times.length - 1] + ds / speed);
  }

  const totalTime = times[times.length - 1];
  const exitSpeed = speeds[speeds.length - 1];
  const arcLengths = samples.map((s) => s.s);

  function sampleAtTime(tNorm: number): number {
    const targetT = tNorm * totalTime;
    const low = bisect(times, targetT);
    const high = low + 1;
    const t0 = times[low];
    const t1 = times[high];
    const ratio = t1 === t0 ? 0 : (targetT - t0) / (t1 - t0);
    return samples[low].s + ratio * (samples[high].s - samples[low].s);
  }

  function pointAtArcLength(s: number): Point2D {
    const low = bisect(arcLengths, s);
    const high = Math.min(low + 1, samples.length - 1);
    const s0 = samples[low].s;
    const s1 = samples[high].s;
    const ratio = s1 === s0 ? 0 : (s - s0) / (s1 - s0);
    const p0 = samples[low].pt;
    const p1 = samples[high].pt;
    return {
      x: p0.x + ratio * (p1.x - p0.x),
      y: p0.y + ratio * (p1.y - p0.y),
    };
  }

  return { totalLength, totalTime, exitSpeed, sampleAtTime, pointAtArcLength };
}

function getNormalOffset(
  table: PhysicsTable,
  s: number,
  scaleX: number,
  scaleY: number,
  pixelOffset: number,
): PathPoint {
  const delta = table.totalLength / 300;
  const pPrev = table.pointAtArcLength(Math.max(0, s - delta));
  const pNext = table.pointAtArcLength(Math.min(table.totalLength, s + delta));
  const pCurrent = table.pointAtArcLength(s);

  const screenDx = (pNext.x - pPrev.x) * scaleX;
  const screenDy = (pNext.y - pPrev.y) * scaleY;
  const screenLength = Math.hypot(screenDx, screenDy) || 1;

  const svgOffsetX = ((screenDy / screenLength) * pixelOffset) / scaleX;
  const svgOffsetY = ((-screenDx / screenLength) * pixelOffset) / scaleY;

  const rawLen = Math.hypot(pNext.x - pPrev.x, pNext.y - pPrev.y) || 1;

  return {
    x: pCurrent.x + svgOffsetX,
    y: pCurrent.y + svgOffsetY,
    tx: (pNext.x - pPrev.x) / rawLen,
    ty: (pNext.y - pPrev.y) / rawLen,
  };
}

function solveParabola(
  launch: PathPoint,
  land: { x: number; y: number },
  vLaunch: number,
): Parabola {
  const vx = vLaunch * launch.tx;
  const vyLaunch = vLaunch * launch.ty;
  const duration = (land.x - launch.x) / vx;
  const gJump = (2 * (land.y - launch.y - vyLaunch * duration)) / (duration * duration);
  const vyLand = vyLaunch + gJump * duration;
  return { vx, vyLaunch, vyLand, gJump, duration };
}

function parabolicY(launchY: number, vy0: number, g: number, t: number): number {
  return launchY + vy0 * t + 0.5 * g * t * t;
}

function ballLoopMobile(
  ball: SVGEllipseElement,
  pathLeft: SVGPathElement,
  pathRight: SVGPathElement,
): BallLoopHandle {
  const {
    svgDesignWidth,
    svgDesignHeight,
    targetPxRadius,
    strokeHalfWidth,
    gPhysics,
    vInitial,
    gExit,
    exitTargetX,
    enterDuration,
    enterArcHeight,
  } = BALL_LOOP_MOBILE_CONFIG;

  const pixelOffset = targetPxRadius + strokeHalfWidth;
  const svg = ball?.ownerSVGElement;

  let scaleX = 1;
  let scaleY = 1;

  function updateScale(): void {
    const w = svg?.clientWidth || svgDesignWidth;
    const h = svg?.clientHeight || svgDesignHeight;
    scaleX = w / svgDesignWidth || 1;
    scaleY = h / svgDesignHeight || 1;
    ball.setAttribute('rx', `${targetPxRadius / scaleX}`);
    ball.setAttribute('ry', `${targetPxRadius / scaleY}`);
  }

  updateScale();

  let rafId = 0;
  let resizeObserver: ResizeObserver | undefined;
  if (typeof ResizeObserver !== 'undefined' && svg) {
    resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => updateScale());
    });
    resizeObserver.observe(svg);
  }

  function setBallPos(x: number, y: number): void {
    ball.setAttribute('cx', `${x}`);
    ball.setAttribute('cy', `${y}`);
  }

  function positionBallOnPath(physics: PhysicsTable, tNorm: number): void {
    const { x, y } = getNormalOffset(
      physics,
      physics.sampleAtTime(tNorm),
      scaleX,
      scaleY,
      pixelOffset,
    );
    setBallPos(x, y);
  }

  const physicsLeft = computePhysicsTable(pathLeft, vInitial, gPhysics);
  const pLaunch1 = getNormalOffset(
    physicsLeft,
    physicsLeft.totalLength,
    scaleX,
    scaleY,
    pixelOffset,
  );
  const pStartLeft = getNormalOffset(physicsLeft, 0, scaleX, scaleY, pixelOffset);

  const exit1Vx = physicsLeft.exitSpeed * pLaunch1.tx;
  const exit1Vy = physicsLeft.exitSpeed * pLaunch1.ty;
  const exit1Duration = Math.max(0.2, (exitTargetX - pLaunch1.x) / exit1Vx);

  const physicsRightSeed = computePhysicsTable(pathRight, 0, gPhysics);
  const pRightStart = getNormalOffset(physicsRightSeed, 0, scaleX, scaleY, pixelOffset);

  // Compute speed arriving at pathRight carrying forward acceleration and momentum
  const vEntryRight = Math.hypot(exit1Vx, exit1Vy + gExit * exit1Duration);
  const physicsRight = computePhysicsTable(pathRight, Math.max(vInitial, vEntryRight * 0.7), gPhysics);
  const pLaunch2 = getNormalOffset(
    physicsRight,
    physicsRight.totalLength,
    scaleX,
    scaleY,
    pixelOffset,
  );

  // Natural exit jump from the bottom track: uses real trajectory and momentum
  const exit2Vx = physicsRight.exitSpeed * pLaunch2.tx;
  const exit2Vy = physicsRight.exitSpeed * pLaunch2.ty;
  const exit2Duration = Math.max(0.3, (exitTargetX - pLaunch2.x) / Math.max(exit2Vx, 100));

  const pRightLand = getNormalOffset(
    physicsRight,
    physicsRight.sampleAtTime(0),
    scaleX,
    scaleY,
    pixelOffset,
  );
  const pLeftLand = getNormalOffset(
    physicsLeft,
    physicsLeft.sampleAtTime(0),
    scaleX,
    scaleY,
    pixelOffset,
  );

  function makeEnterJump(
    landX: number,
    landY: number,
    dur: number,
  ): { startX: number; startY: number; vx: number; vy0: number } {
    const startX = -50;
    const vx = (landX - startX) / dur;
    const startY = landY - enterArcHeight;
    const vy0 = (landY - startY - 0.5 * gExit * dur * dur) / dur;
    return { startX, startY, vx, vy0 };
  }

  const jump1 = makeEnterJump(pRightLand.x, pRightLand.y, enterDuration);
  const jump2 = makeEnterJump(pLeftLand.x, pLeftLand.y, enterDuration);

  const pLeft = { v: 0 };
  const pExit1 = { v: 0 };
  const pEnter1 = { v: 0 };
  const pRight = { v: 0 };
  const pExit2 = { v: 0 };
  const pEnter2 = { v: 0 };

  const timeline = gsap
    .timeline({ repeat: -1 })
    .to(pLeft, {
      v: 1,
      duration: physicsLeft.totalTime,
      ease: 'none',
      onUpdate: () => positionBallOnPath(physicsLeft, pLeft.v),
    })
    .to(pExit1, {
      v: 1,
      duration: exit1Duration,
      ease: 'none',
      onUpdate: () => {
        const t = pExit1.v * exit1Duration;
        setBallPos(pLaunch1.x + exit1Vx * t, parabolicY(pLaunch1.y, exit1Vy, gExit, t));
      },
    })
    .to(pEnter1, {
      v: 1,
      duration: enterDuration,
      ease: 'none',
      onUpdate: () => {
        const t = pEnter1.v * enterDuration;
        setBallPos(jump1.startX + jump1.vx * t, parabolicY(jump1.startY, jump1.vy0, gExit, t));
      },
    })
    .to(pRight, {
      v: 1,
      duration: physicsRight.totalTime,
      ease: 'none',
      onUpdate: () => positionBallOnPath(physicsRight, pRight.v),
    })
    .to(pExit2, {
      v: 1,
      duration: exit2Duration,
      ease: 'none',
      onUpdate: () => {
        const t = pExit2.v * exit2Duration;
        setBallPos(pLaunch2.x + exit2Vx * t, parabolicY(pLaunch2.y, exit2Vy, gExit, t));
      },
    })
    .to(pEnter2, {
      v: 1,
      duration: enterDuration,
      ease: 'none',
      onUpdate: () => {
        const t = pEnter2.v * enterDuration;
        setBallPos(jump2.startX + jump2.vx * t, parabolicY(jump2.startY, jump2.vy0, gExit, t));
      },
    })
    .set([pLeft, pExit1, pEnter1, pRight, pExit2, pEnter2], { v: 0 });

  return {
    timeline,
    destroy: () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      timeline.kill();
    },
  };
}

export function ballLoop(
  ball: SVGEllipseElement,
  pathLeft: SVGPathElement,
  pathRight: SVGPathElement,
  mobile = false,
): BallLoopHandle {
  if (mobile) {
    return ballLoopMobile(ball, pathLeft, pathRight);
  }

  const {
    svgDesignWidth,
    svgDesignHeight,
    targetPxRadius,
    strokeHalfWidth,
    gPhysics,
    vInitial,
    gExit,
    enterStartX,
    enterYLift,
    enterArcAmplitude,
    enterDuration,
  } = BALL_LOOP_CONFIG;

  const pixelOffset = targetPxRadius + strokeHalfWidth;
  const svg = ball?.ownerSVGElement;

  let scaleX = 1;
  let scaleY = 1;

  function updateScale(): void {
    const w = svg?.clientWidth || svgDesignWidth;
    const h = svg?.clientHeight || svgDesignHeight;
    scaleX = w / svgDesignWidth || 1;
    scaleY = h / svgDesignHeight || 1;
    ball.setAttribute('rx', `${targetPxRadius / scaleX}`);
    ball.setAttribute('ry', `${targetPxRadius / scaleY}`);
  }

  updateScale();

  let rafId = 0;
  let resizeObserver: ResizeObserver | undefined;
  if (typeof ResizeObserver !== 'undefined' && svg) {
    resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => updateScale());
    });
    resizeObserver.observe(svg);
  }

  function setBallPos(x: number, y: number): void {
    ball.setAttribute('cx', `${x}`);
    ball.setAttribute('cy', `${y}`);
  }

  function positionBallOnPath(physics: PhysicsTable, tNorm: number): void {
    const { x, y } = getNormalOffset(
      physics,
      physics.sampleAtTime(tNorm),
      scaleX,
      scaleY,
      pixelOffset,
    );
    setBallPos(x, y);
  }

  const physicsLeft = computePhysicsTable(pathLeft, vInitial, gPhysics);

  const pLaunch1 = getNormalOffset(
    physicsLeft,
    physicsLeft.totalLength,
    scaleX,
    scaleY,
    pixelOffset,
  );

  const physicsRightSeed = computePhysicsTable(pathRight, 0, gPhysics);
  const pLand1 = getNormalOffset(physicsRightSeed, 0, scaleX, scaleY, pixelOffset);

  const jump1 = solveParabola(pLaunch1, pLand1, physicsLeft.exitSpeed);

  const physicsRight = computePhysicsTable(pathRight, Math.hypot(jump1.vx, jump1.vyLand), gPhysics);

  const pLaunch2 = getNormalOffset(
    physicsRight,
    physicsRight.totalLength,
    scaleX,
    scaleY,
    pixelOffset,
  );
  const pStartLeft = getNormalOffset(physicsLeft, 0, scaleX, scaleY, pixelOffset);

  const exitVx = physicsRight.exitSpeed * pLaunch2.tx;
  const exitVyLaunch = physicsRight.exitSpeed * pLaunch2.ty;
  const exitDuration = Math.max(0.2, (1240 - pLaunch2.x) / exitVx);

  const pLeft = { v: 0 };
  const pJump1 = { v: 0 };
  const pRight = { v: 0 };
  const pExit = { v: 0 };
  const pEnter = { v: 0 };

  const timeline = gsap
    .timeline({ repeat: -1 })
    .to(pLeft, {
      v: 1,
      duration: physicsLeft.totalTime,
      ease: 'none',
      onUpdate: () => positionBallOnPath(physicsLeft, pLeft.v),
    })
    .to(pJump1, {
      v: 1,
      duration: jump1.duration,
      ease: 'none',
      onUpdate: () => {
        const t = pJump1.v * jump1.duration;
        setBallPos(
          pLaunch1.x + jump1.vx * t,
          parabolicY(pLaunch1.y, jump1.vyLaunch, jump1.gJump, t),
        );
      },
    })
    .to(pRight, {
      v: 1,
      duration: physicsRight.totalTime,
      ease: 'none',
      onUpdate: () => positionBallOnPath(physicsRight, pRight.v),
    })
    .to(pExit, {
      v: 1,
      duration: exitDuration,
      ease: 'none',
      onUpdate: () => {
        const t = pExit.v * exitDuration;
        setBallPos(pLaunch2.x + exitVx * t, parabolicY(pLaunch2.y, exitVyLaunch, gExit, t));
      },
    })
    .to(pEnter, {
      v: 1,
      duration: enterDuration,
      ease: 'power1.out',
      onUpdate: () => {
        const t = pEnter.v;
        const startY = pStartLeft.y - enterYLift;
        setBallPos(
          enterStartX + (pStartLeft.x - enterStartX) * t,
          startY + (pStartLeft.y - startY) * t + Math.sin(t * Math.PI) * enterArcAmplitude,
        );
      },
    })
    .set([pLeft, pJump1, pRight, pExit, pEnter], { v: 0 });

  return {
    timeline,
    destroy: () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      timeline.kill();
    },
  };
}
