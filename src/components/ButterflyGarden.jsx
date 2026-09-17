import React, { useEffect, useRef } from 'react';

const BUTTERFLIES_CONFIG = [
  {
    id: 'yellow',
    src: '/images/butterflies/yellow-flap.png',
    turnSrc: '/images/butterflies/yellow-turn.png',
    width: 42,
    height: 42,
    landingAnchor: 32,
    flapDuration: 520,
    speed: 130, // px per second
    turnSpeed: 3.2,
    color: '#eab308',
  },
  {
    id: 'blue',
    src: '/images/butterflies/blue-flap.png',
    turnSrc: '/images/butterflies/blue-turn.png',
    width: 40,
    height: 40,
    landingAnchor: 30,
    flapDuration: 560,
    speed: 120,
    turnSpeed: 3.0,
    color: '#3b82f6',
  },
  {
    id: 'coral',
    src: '/images/butterflies/coral-flap.png',
    turnSrc: '/images/butterflies/coral-turn.png',
    width: 42,
    height: 42,
    landingAnchor: 32,
    flapDuration: 540,
    speed: 125,
    turnSpeed: 3.1,
    color: '#f97316',
  },
];

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const randomRange = (min, max) => min + Math.random() * (max - min);

function getPerchPosition(element, butterfly) {
  const rect = element.getBoundingClientRect();
  return {
    x: clamp(rect.left + rect.width * 0.5 - butterfly.width * 0.5, 12, window.innerWidth - butterfly.width - 12),
    y: clamp(rect.top - butterfly.landingAnchor + 6, 8, window.innerHeight - butterfly.height - 8),
  };
}

export default function ButterflyGarden() {
  const elementsRef = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animFrameId;
    let lastTime = performance.now();
    const activePerches = new Set();

    // Initialize autonomous state for each butterfly
    const states = BUTTERFLIES_CONFIG.map((b, idx) => {
      // Spawn from offscreen edge
      const side = idx % 3;
      const startX = side === 0 ? -b.width - 20 : side === 1 ? window.innerWidth + 20 : randomRange(100, window.innerWidth - 100);
      const startY = side === 2 ? -b.height - 20 : randomRange(80, window.innerHeight * 0.6);

      return {
        id: b.id,
        config: b,
        x: startX,
        y: startY,
        vx: side === 0 ? 100 : side === 1 ? -100 : 0,
        vy: side === 2 ? 80 : 30,
        facing: side === 1 ? -1 : 1,
        angle: 0,
        mode: 'wandering', // 'wandering' | 'approaching' | 'resting' | 'takeoff'
        target: { x: randomRange(100, window.innerWidth - 100), y: randomRange(80, window.innerHeight * 0.6) },
        perchElement: null,
        restTimer: 0,
        wanderTimer: randomRange(1.5, 3.5),
        wavePhase: Math.random() * Math.PI * 2,
        swoopProgress: 0,
        el: null,
      };
    });

    const findAvailablePerch = () => {
      const perches = Array.from(document.querySelectorAll(
        '.project-hover-target, [data-butterfly-perch], h1, h2, a.shimmer-text, nav a, .badge'
      )).filter((elem) => {
        if (activePerches.has(elem)) return false;
        const r = elem.getBoundingClientRect();
        return (
          r.width > 16 &&
          r.height > 10 &&
          r.bottom > 40 &&
          r.top < window.innerHeight - 40 &&
          r.right > 20 &&
          r.left < window.innerWidth - 20
        );
      });

      if (perches.length === 0) return null;
      return perches[Math.floor(Math.random() * perches.length)];
    };

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.06); // clamped to avoid delta jumps
      lastTime = now;

      states.forEach((bState, idx) => {
        const el = elementsRef.current[idx];
        if (!el) return;
        bState.el = el;
        const b = bState.config;

        bState.wavePhase += dt * 4.2;

        if (bState.mode === 'resting') {
          // If perch element was removed or scrolled out of view, take off
          if (!bState.perchElement || !bState.perchElement.isConnected) {
            bState.mode = 'takeoff';
            bState.swoopProgress = 0;
            return;
          }

          // Follow the perched element dynamically as user scrolls
          const perchPos = getPerchPosition(bState.perchElement, b);
          bState.x = perchPos.x;
          // Gentle breathing hover while perched
          bState.y = perchPos.y + Math.sin(bState.wavePhase * 0.8) * 1.2;

          bState.restTimer -= dt;
          if (bState.restTimer <= 0) {
            // Finished resting, initiate graceful takeoff
            activePerches.delete(bState.perchElement);
            bState.perchElement = null;
            bState.mode = 'takeoff';
            bState.swoopProgress = 0;
            bState.vy = -randomRange(80, 140);
            bState.vx = (Math.random() > 0.5 ? 1 : -1) * randomRange(70, 120);
            el.dataset.state = 'taking-off';
          }
        } else if (bState.mode === 'takeoff') {
          // Accelerate upwards in an elegant arc
          bState.swoopProgress += dt * 1.8;
          bState.x += bState.vx * dt;
          bState.y += bState.vy * dt;
          bState.vy += dt * 50; // gentle gravity leveling

          if (bState.swoopProgress >= 1.0) {
            bState.mode = 'wandering';
            bState.wanderTimer = randomRange(3.0, 6.0);
            bState.target = {
              x: randomRange(60, window.innerWidth - 60),
              y: randomRange(60, window.innerHeight * 0.75),
            };
            el.dataset.state = 'flying';
          }
        } else if (bState.mode === 'approaching') {
          // Flying toward a perch
          if (!bState.perchElement || !bState.perchElement.isConnected) {
            bState.mode = 'wandering';
            bState.wanderTimer = randomRange(2.0, 4.0);
            return;
          }

          const targetPos = getPerchPosition(bState.perchElement, b);
          const dx = targetPos.x - bState.x;
          const dy = targetPos.y - bState.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 14) {
            // Landed smoothly on text!
            bState.mode = 'resting';
            bState.x = targetPos.x;
            bState.y = targetPos.y;
            bState.vx = 0;
            bState.vy = 0;
            bState.angle = 0;
            bState.restTimer = randomRange(4.0, 7.5);
            el.dataset.state = 'resting';
          } else {
            // Smooth swooping curve towards the target
            const speed = b.speed * clamp(dist / 80, 0.45, 1.15);
            const desiredVx = (dx / dist) * speed;
            const desiredVy = (dy / dist) * speed;

            // Organic steering
            bState.vx += (desiredVx - bState.vx) * dt * b.turnSpeed;
            bState.vy += (desiredVy - bState.vy) * dt * b.turnSpeed;

            // Subtle flutter wave perpendicular to travel
            const flutter = Math.sin(bState.wavePhase) * 1.5 * (dist > 50 ? 1 : dist / 50);

            bState.x += bState.vx * dt;
            bState.y += bState.vy * dt + flutter * dt * 20;
          }
        } else {
          // Mode === 'wandering': Graceful cruising across the screen
          bState.wanderTimer -= dt;

          const dx = bState.target.x - bState.x;
          const dy = bState.target.y - bState.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 50 || bState.wanderTimer <= 0) {
            // Pick next destination: 65% chance to land on a cool text perch, 35% chance to cruise
            if (Math.random() < 0.65) {
              const perch = findAvailablePerch();
              if (perch) {
                bState.perchElement = perch;
                activePerches.add(perch);
                bState.mode = 'approaching';
              } else {
                bState.target = {
                  x: randomRange(60, window.innerWidth - 60),
                  y: randomRange(60, window.innerHeight * 0.8),
                };
                bState.wanderTimer = randomRange(3.0, 5.5);
              }
            } else {
              bState.target = {
                x: randomRange(60, window.innerWidth - 60),
                y: randomRange(60, window.innerHeight * 0.8),
              };
              bState.wanderTimer = randomRange(3.0, 5.5);
            }
          }

          // Steer towards target smoothly
          const desiredVx = (dx / Math.max(dist, 1)) * b.speed;
          const desiredVy = (dy / Math.max(dist, 1)) * b.speed;

          bState.vx += (desiredVx - bState.vx) * dt * b.turnSpeed;
          bState.vy += (desiredVy - bState.vy) * dt * b.turnSpeed;

          // Natural undulating flutter flight
          const wave = Math.sin(bState.wavePhase) * 2.2;
          bState.x += bState.vx * dt;
          bState.y += bState.vy * dt + wave;
        }

        // Screen boundary soft bounce
        const margin = 20;
        if (bState.x < margin) bState.vx += dt * 150;
        if (bState.x > window.innerWidth - b.width - margin) bState.vx -= dt * 150;
        if (bState.y < margin) bState.vy += dt * 150;
        if (bState.y > window.innerHeight - b.height - margin) bState.vy -= dt * 150;

        // Smooth facing & bank angle
        if (Math.abs(bState.vx) > 8) {
          bState.facing = bState.vx > 0 ? 1 : -1;
        }

        if (bState.mode === 'resting') {
          bState.angle = 0;
        } else {
          // Bank angle based on vertical climb/dive
          const targetAngle = clamp((bState.vy / (Math.abs(bState.vx) + 20)) * 24 * bState.facing, -18, 18);
          bState.angle += (targetAngle - bState.angle) * dt * 5.0;
        }

        // Apply silky smooth transforms
        el.style.opacity = '1';
        el.style.transform = `translate3d(${bState.x.toFixed(1)}px, ${bState.y.toFixed(1)}px, 0) rotate(${bState.angle.toFixed(1)}deg) scaleX(${bState.facing})`;
      });

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    // Interactive startle: if user moves cursor near perched butterfly, it flutters away
    const handleMouseMove = (e) => {
      states.forEach((bState) => {
        if (bState.mode === 'resting' && bState.perchElement) {
          const d = Math.hypot(e.clientX - (bState.x + 20), e.clientY - (bState.y + 20));
          if (d < 45) {
            activePerches.delete(bState.perchElement);
            bState.perchElement = null;
            bState.mode = 'takeoff';
            bState.swoopProgress = 0;
            bState.vx = (e.clientX < bState.x ? 1 : -1) * randomRange(120, 180);
            bState.vy = -randomRange(100, 160);
            if (bState.el) bState.el.dataset.state = 'taking-off';
          }
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="butterfly-garden" aria-hidden="true">
      {BUTTERFLIES_CONFIG.map((b, idx) => (
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
            opacity: 1,
          }}
        >
          <span className="butterfly__sprite" />
        </div>
      ))}
    </div>
  );
}
