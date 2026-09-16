import React, { useEffect, useRef, useState } from 'react';

export const CURSOR_OPTIONS = [
  { id: 'pikachu', name: 'Pikachu', moveSrc: '/cursors-move/pikachu.gif', stopSrc: '/cursors-stop/pikachu-stop.gif' },
  { id: 'mario', name: 'Mario', moveSrc: '/cursors-move/mario.gif', stopSrc: '/cursors-stop/mario-stop.gif' },
  { id: 'luffy', name: 'Luffy', moveSrc: '/cursors-move/luffy.gif', stopSrc: '/cursors-stop/luffy-stop.gif' },
  { id: 'sonic', name: 'Sonic', moveSrc: '/cursors-move/sonic.gif', stopSrc: '/cursors-stop/sonic-stop.gif' },
  { id: 'amongus', name: 'Among Us', moveSrc: '/cursors-move/amongus.gif', stopSrc: '/cursors-stop/amongus-stop.gif' },
  { id: 'none', name: 'None', moveSrc: null, stopSrc: null },
];

export default function CustomCursor() {
  const containerRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const currentAngle = useRef(0);
  const [angle, setAngle] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState('pikachu');

  // Load cursor type from localStorage, defaulting to 'pikachu'
  useEffect(() => {
    const saved = localStorage.getItem('cursor-type');
    setCursorType(saved || 'pikachu');

    const handleCursorChange = () => {
      const updated = localStorage.getItem('cursor-type');
      setCursorType(updated || 'pikachu');
    };

    window.addEventListener('cursor-change', handleCursorChange);
    return () => window.removeEventListener('cursor-change', handleCursorChange);
  }, []);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let hasMoved = false;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        followerPos.current.x = e.clientX;
        followerPos.current.y = e.clientY;
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animFrame;
    const update = () => {
      const dx = mousePos.current.x - followerPos.current.x;
      const dy = mousePos.current.y - followerPos.current.y;

      // Spring follow speed (0.14 matches the original site)
      followerPos.current.x += 0.14 * dx;
      followerPos.current.y += 0.14 * dy;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0)`;
      }

      const dist = Math.hypot(dx, dy);

      if (dist > 0.5) {
        setIsMoving(true);

        if (Math.abs(dx) > 0.5) {
          setIsFlipped(dx < 0);
        }

        const deg = (180 / Math.PI) * Math.atan2(dy, dx);
        let targetAngle = deg;
        if (dx < 0) {
          targetAngle = -deg;
        }

        if (targetAngle > 45) targetAngle = 45;
        if (targetAngle < -45) targetAngle = -45;

        currentAngle.current += (targetAngle - currentAngle.current) * 0.2;
        setAngle(currentAngle.current);
      } else {
        setIsMoving(false);
      }

      animFrame = requestAnimationFrame(update);
    };

    animFrame = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animFrame);
    };
  }, [isVisible]);

  if (!cursorType || cursorType === 'none') {
    return null;
  }

  const selectedCursor = CURSOR_OPTIONS.find((c) => c.id === cursorType) || CURSOR_OPTIONS[0];
  const activeSrc = isMoving ? selectedCursor.moveSrc : selectedCursor.stopSrc;

  if (!activeSrc) return null;

  return (
    <div
      ref={containerRef}
      className="custom-cursor-follower"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        width: '38px',
        height: '38px',
        marginLeft: '-19px',
        marginTop: '-19px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 200ms ease',
        willChange: 'transform',
      }}
    >
      <img
        src={activeSrc}
        alt="cursor"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: `rotate(${angle.toFixed(1)}deg) ${isFlipped ? 'scaleX(-1)' : ''}`,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12))',
          display: 'block',
        }}
      />
    </div>
  );
}
