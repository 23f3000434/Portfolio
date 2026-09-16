import React, { useEffect, useRef } from 'react';

const BUTTERFLIES = [
  {
    id: 'yellow',
    src: '/images/butterflies/yellow-flap.png',
    turnSrc: '/images/butterflies/yellow-turn.png',
    width: 42,
    height: 42,
    landingAnchor: 31,
    flapDuration: 620,
    startDelay: 350,
    speed: 0.055,
  },
  {
    id: 'blue',
    src: '/images/butterflies/blue-flap.png',
    turnSrc: '/images/butterflies/blue-turn.png',
    width: 40,
    height: 40,
    landingAnchor: 28,
    flapDuration: 680,
    startDelay: 1250,
    speed: 0.052,
  },
  {
    id: 'coral',
    src: '/images/butterflies/coral-flap.png',
    turnSrc: '/images/butterflies/coral-turn.png',
    width: 42,
    height: 42,
    landingAnchor: 32,
    flapDuration: 650,
    startDelay: 2150,
    speed: 0.054,
  },
];

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const randomRange = (min, max) => min + Math.random() * (max - min);
const distance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

function sleep(ms, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve(false);
    const timer = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve(true);
    }, ms);
    const onAbort = () => {
      window.clearTimeout(timer);
      resolve(false);
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function getSafeWanderTarget(butterfly) {
  const padX = Math.min(48, 0.08 * window.innerWidth);
  const padY = Math.min(100, 0.14 * window.innerHeight);
  return {
    x: randomRange(padX - butterfly.width / 2, Math.max(padX, window.innerWidth - padX)),
    y: randomRange(padY - butterfly.height / 2, Math.max(padY, window.innerHeight - padY - butterfly.height / 2)),
  };
}

function getUnitDirection(from, to) {
  const d = Math.max(distance(from, to), 1);
  return { x: (to.x - from.x) / d, y: (to.y - from.y) / d };
}

function getPerchAnchor(element, butterfly) {
  const rect = element.getBoundingClientRect();
  return {
    x: clamp(rect.left + rect.width * randomRange(0.2, 0.8) - butterfly.width / 2, 8, window.innerWidth - butterfly.width - 8),
    y: clamp(rect.top - butterfly.landingAnchor + 6, 4, window.innerHeight - butterfly.height - 4),
  };
}

async function turnButterfly(el, pos, currentFacing, targetFacing, signal) {
  if (currentFacing === targetFacing) return true;
  el.dataset.state = 'turning';
  el.style.opacity = '1';
  el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(0deg) scaleX(${currentFacing})`;

  const done = await sleep(220, signal);
  if (!done) return false;

  el.dataset.facing = String(targetFacing);
  el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(0deg) scaleX(${targetFacing})`;
  return true;
}

function generateBezierPath(start, end, isLanding, isEntering, facing, direction) {
  const d = Math.max(distance(start, end), 1);
  const unit = getUnitDirection(start, end);
  const curveDist = clamp(0.32 * d, 40, 140);

  const cp1 = { x: start.x + direction.x * curveDist, y: start.y + direction.y * curveDist };
  const cp2 = { x: end.x - unit.x * curveDist, y: end.y - unit.y * curveDist };

  const STEPS = 48;
  const points = Array.from({ length: STEPS + 1 }, (_, idx) => {
    const t = idx / STEPS;
    const inv = 1 - t;
    const bx = inv * inv * inv * start.x + 3 * inv * inv * t * cp1.x + 3 * inv * t * t * cp2.x + t * t * t * end.x;
    const by = inv * inv * inv * start.y + 3 * inv * inv * t * cp1.y + 3 * inv * t * t * cp2.y + t * t * t * end.y;
    // Organic sinusoidal flutter bob that softens into zero on text landing
    const flutterWave = Math.sin(t * Math.PI * 8) * (isLanding ? 2.5 * (1 - t) : 4.0);
    return {
      x: bx,
      y: by + flutterWave,
    };
  });

  const stepDistances = points.map((p, idx) => (idx === 0 ? 0 : distance(points[idx - 1], p)));
  for (let i = 1; i < stepDistances.length; i++) stepDistances[i] += stepDistances[i - 1];
  const totalPath = stepDistances[stepDistances.length - 1];

  const keyframes = points.map((p, idx) => {
    const t = idx / STEPS;
    const next = points[Math.min(idx + 1, points.length - 1)];
    const prev = points[Math.max(idx - 1, 0)];
    const delta = idx === points.length - 1 ? { x: p.x - prev.x, y: p.y - prev.y } : { x: next.x - p.x, y: next.y - p.y };
    const angle = Math.atan2(delta.y, Math.abs(delta.x) || 0.001);
    const tilt = isLanding && t > 0.84 ? 0 : clamp((180 * angle) / Math.PI * 0.45 * facing, -16, 16);

    return {
      offset: totalPath > 0 ? stepDistances[idx] / totalPath : idx / STEPS,
      opacity: isEntering && idx === 0 ? 0 : 1,
      transform: `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) rotate(${tilt.toFixed(1)}deg) scaleX(${facing})`,
    };
  });

  return { keyframes, totalPath };
}

async function flyButterfly(el, butterfly, start, end, signal, options = {}) {
  if (signal.aborted) return false;

  const targetFacing = end.x >= start.x ? 1 : -1;
  const currentFacing = Number(el.dataset.facing || targetFacing);

  if (options.entering) {
    el.dataset.facing = String(targetFacing);
  } else {
    const turned = await turnButterfly(el, start, currentFacing, targetFacing, signal);
    if (!turned) return false;
  }

  el.dataset.state = options.takingOff ? 'taking-off' : 'flying';
  const initialDir = options.direction || getUnitDirection(start, end);

  const { keyframes, totalPath } = generateBezierPath(start, end, options.landing, options.entering, targetFacing, initialDir);
  const speedVariation = randomRange(0.92, 1.08);
  const duration = totalPath / (butterfly.speed * speedVariation);

  const easing = options.landing
    ? 'cubic-bezier(0.25, 1, 0.35, 1)'
    : options.takingOff
    ? 'cubic-bezier(0.32, 0, 0.67, 0)'
    : 'cubic-bezier(0.42, 0, 0.58, 1)';

  const animation = el.animate(keyframes, {
    duration,
    easing,
    fill: 'forwards',
  });

  const animPromise = new Promise((resolve) => {
    const abortHandler = () => {
      animation.cancel();
      resolve(false);
    };
    signal.addEventListener('abort', abortHandler, { once: true });
    animation.finished
      .then(() => resolve(true))
      .catch(() => resolve(false))
      .finally(() => signal.removeEventListener('abort', abortHandler));
  });

  const success = await animPromise;
  if (!success || signal.aborted) return false;

  const finalFrame = keyframes[keyframes.length - 1];
  el.style.opacity = '1';
  el.style.transform = finalFrame.transform;
  el.dataset.facing = String(targetFacing);
  animation.cancel();
  return true;
}

async function restButterfly(el, perchTarget, butterfly, signal) {
  el.dataset.state = 'resting';

  const updatePos = () => {
    if (!perchTarget.isConnected) return;
    const anchor = getPerchAnchor(perchTarget, butterfly);
    const facing = Number(el.dataset.facing || 1);
    el.style.transform = `translate3d(${anchor.x}px, ${anchor.y}px, 0) rotate(0deg) scaleX(${facing})`;
  };

  updatePos();
  window.addEventListener('scroll', updatePos, { passive: true });
  window.addEventListener('resize', updatePos, { passive: true });

  // Flap wings comfortably while sitting on text for 3.5 to 6.5 seconds
  const restDuration = randomRange(3500, 6500);
  const rested = await sleep(restDuration, signal);

  window.removeEventListener('scroll', updatePos);
  window.removeEventListener('resize', updatePos);
  return rested;
}

export default function ButterflyGarden() {
  const elementsRef = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const controller = new AbortController();
    const { signal } = controller;
    const activePerches = new Set();

    const startGarden = () => {
      BUTTERFLIES.forEach((butterfly, idx) => {
        const el = elementsRef.current[idx];
        if (!el) return;

        (async () => {
          const delay = butterfly.startDelay + randomRange(0, 1800);
          if (!(await sleep(delay, signal))) return;

          // Spawn from screen edges
          const edge = Math.floor(3 * Math.random());
          let currentPos =
            edge === 0
              ? { x: -butterfly.width - 12, y: randomRange(40, Math.max(80, 0.72 * window.innerHeight)) }
              : edge === 1
              ? { x: window.innerWidth + 12, y: randomRange(40, Math.max(80, 0.72 * window.innerHeight)) }
              : { x: randomRange(24, Math.max(48, window.innerWidth - 24)), y: -butterfly.height - 12 };

          el.style.transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, 0)`;
          let target = getSafeWanderTarget(butterfly);
          let dir = getUnitDirection(currentPos, target);

          if (!(await flyButterfly(el, butterfly, currentPos, target, signal, { entering: true, direction: dir }))) {
            return;
          }
          currentPos = target;

          // Infinite life loop
          while (!signal.aborted) {
            // Find text elements on page to perch on
            const perches = Array.from(document.querySelectorAll('.project-hover-target, [data-butterfly-perch], h1, h2, a.shimmer-text')).filter((elem) => {
              if (activePerches.has(elem)) return false;
              const r = elem.getBoundingClientRect();
              return r.width > 12 && r.height > 8 && r.bottom > 20 && r.top < window.innerHeight - 20 && r.right > 12 && r.left < window.innerWidth - 12;
            });

            // Wander at most 1 short leg before looking for a perch
            const wanderSteps = perches.length > 0 ? (Math.random() < 0.4 ? 1 : 0) : 1;
            for (let s = 0; s < wanderSteps; s++) {
              const nextPos = getSafeWanderTarget(butterfly);
              const nextDir = getUnitDirection(currentPos, nextPos);
              if (!(await flyButterfly(el, butterfly, currentPos, nextPos, signal, { direction: dir }))) {
                return;
              }
              dir = nextDir;
              currentPos = nextPos;
            }

            if (perches.length === 0) {
              if (!(await sleep(randomRange(400, 1000), signal))) return;
              continue;
            }

            const chosenPerch = perches[Math.floor(Math.random() * perches.length)];
            activePerches.add(chosenPerch);
            const anchorPos = getPerchAnchor(chosenPerch, butterfly);

            if (await flyButterfly(el, butterfly, currentPos, anchorPos, signal, { landing: true, direction: dir })) {
              currentPos = anchorPos;
              await restButterfly(el, chosenPerch, butterfly, signal);
            }

            activePerches.delete(chosenPerch);

            // Take off again
            const safeWander = getSafeWanderTarget(butterfly);
            const takeoffDir = getUnitDirection(currentPos, safeWander);
            if (!(await flyButterfly(el, butterfly, currentPos, safeWander, signal, { takingOff: true, direction: takeoffDir }))) {
              return;
            }
            dir = takeoffDir;
            currentPos = safeWander;
          }
        })();
      });
    };

    if (document.documentElement.dataset.siteReady === 'true') {
      startGarden();
    } else {
      window.addEventListener('site-ready', startGarden, { once: true });
    }

    return () => {
      controller.abort();
      window.removeEventListener('site-ready', startGarden);
    };
  }, []);

  return (
    <div className="butterfly-garden" aria-hidden="true">
      {BUTTERFLIES.map((b, idx) => (
        <div
          key={b.id}
          ref={(el) => (elementsRef.current[idx] = el)}
          className="butterfly"
          data-butterfly={b.id}
          data-state="flying"
          data-facing="1"
          style={{
            '--butterfly-sheet': `url(${b.src})`,
            '--butterfly-turn-sheet': `url(${b.turnSrc})`,
            '--butterfly-width': `${b.width}px`,
            '--butterfly-height': `${b.height}px`,
            '--butterfly-flap-duration': `${b.flapDuration}ms`,
          }}
        >
          <span className="butterfly__sprite" />
        </div>
      ))}
    </div>
  );
}
