import React, { useState, useEffect, useRef } from 'react';

export default function VideoLoader({ onComplete }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('playing'); // 'playing' | 'flashing' | 'splitting' | 'hidden'
  const [lineActive, setLineActive] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Play at 2x speed as instructed by user
    video.playbackRate = 2.0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay was prevented, waiting for interaction", err);
      });
    }

  }, []);

  const triggerReveal = () => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    // Ensure line is active for split
    setLineActive(true);

    // Trigger white flash
    setPhase('flashing');

    // Slight delay to synchronize with the flash before splitting
    setTimeout(() => {
      setPhase('splitting');
      document.documentElement.dataset.shellReady = 'true';
      window.dispatchEvent(new CustomEvent('site-shell-ready'));

      setTimeout(() => {
        setPhase('hidden');
        document.documentElement.dataset.siteReady = 'true';
        window.dispatchEvent(new CustomEvent('site-ready'));
        if (onComplete) onComplete();
      }, 780);
    }, 120);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || triggeredRef.current) return;

    // Split line appears right before the climactic flash rather than prematurely
    if (video.currentTime >= 10.2 && !lineActive) {
      setLineActive(true);
    }

    // ascii-magic-2.mp4 turns white at exactly 10.58s - 10.65s!
    if (video.currentTime >= 10.58) {
      triggerReveal();
    }
  };

  const handleVideoEnded = () => {
    if (!triggeredRef.current) {
      triggerReveal();
    }
  };

  if (phase === 'hidden') return null;

  return (
    <div
      id="site-loader"
      role="status"
      aria-label="Loading portfolio"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Video layer playing at 2x */}
      <div className="loader-video-wrap">
        <video
          ref={videoRef}
          src="/videos/ascii-magic-2.mp4"
          muted
          playsInline
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className="loader-video"
        />
      </div>

      {/* Split curtain panels for smooth door opening */}
      <div
        className={`loader-half loader-half-left ${phase === 'splitting' ? 'splitting' : ''}`}
        style={{
          opacity: phase === 'flashing' || phase === 'splitting' ? 0.96 : 0,
          background: '#09090b',
          transition: 'transform 780ms cubic-bezier(0.76, 0, 0.24, 1), opacity 200ms ease'
        }}
      />
      <div
        className={`loader-half loader-half-right ${phase === 'splitting' ? 'splitting' : ''}`}
        style={{
          opacity: phase === 'flashing' || phase === 'splitting' ? 0.96 : 0,
          background: '#09090b',
          transition: 'transform 780ms cubic-bezier(0.76, 0, 0.24, 1), opacity 200ms ease'
        }}
      />

      {/* White flash glow burst */}
      <div className={`loader-white-flash ${phase === 'flashing' || phase === 'splitting' ? 'active' : ''}`} />

      {/* Minimalist central split line */}
      <span
        className="loader-center-line"
        aria-hidden="true"
        style={{
          opacity: phase !== 'splitting' && lineActive ? 0.85 : 0,
          transform: `translateX(-50%) scaleY(${lineActive ? 1 : 0})`,
        }}
      />

      {/* Skip button for accessibility */}
      <button
        type="button"
        onClick={triggerReveal}
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 30,
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.75rem',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          padding: '4px 10px',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)'
        }}
      >
        skip [esc]
      </button>
    </div>
  );
}
