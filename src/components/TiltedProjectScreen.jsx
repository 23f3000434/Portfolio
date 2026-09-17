import React, { useRef, useState } from 'react';

export default function TiltedProjectScreen({
  imageSrc,
  alt = 'Project Screen Preview',
  url = '',
  title = '',
  badge = '',
  initialTilt = { x: 7, y: -10 },
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState(initialTilt);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate interactive tilt angles
    const rotateY = ((x - centerX) / centerX) * 14; // max 14deg
    const rotateX = -((y - centerY) / centerY) * 10; // max 10deg

    setTilt({ x: rotateX, y: rotateY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt(initialTilt);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
        width: '100%',
        margin: '1rem 0 0.5rem 0',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: '#090a0f',
          overflow: 'hidden',
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.08)'
            : '0 12px 28px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(${-tilt.y * 0.15}deg) translateY(-4px) scale(1.025)`
            : `rotateX(${initialTilt.x}deg) rotateY(${initialTilt.y}deg) scale(0.99)`,
          transformOrigin: 'center center',
          transition: isHovered ? 'transform 100ms ease-out, box-shadow 250ms ease' : 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 350ms ease',
          willChange: 'transform',
        }}
      >
        {/* Window Chrome / Titlebar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'rgba(24, 24, 27, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#a1a1aa',
          }}
        >
          {/* Traffic light window controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
          </div>

          {/* URL bar indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '2px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '10.5px',
              letterSpacing: '-0.01em',
              color: '#d4d4d8',
              maxWidth: '65%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ opacity: 0.5 }}>https://</span>
            <span>{url || title.toLowerCase().replace(/[^a-z0-9]/g, '') + '.internal'}</span>
          </div>

          {/* Badge or status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {badge && (
              <span
                style={{
                  fontSize: '9.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Screenshot Viewport */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', backgroundColor: '#090a0f' }}>
          <img
            src={imageSrc}
            alt={alt}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              transition: 'transform 300ms ease',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              display: 'block',
            }}
          />

          {/* Specular glare shine overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 65%)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 200ms ease',
            }}
          />

          {/* Subtle bottom vignette */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '35%',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.35) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
