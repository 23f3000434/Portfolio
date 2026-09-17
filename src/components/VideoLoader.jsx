import React, { useState, useEffect, useRef } from 'react';

export default function VideoLoader({ onComplete }) {
  const videoRef = useRef(null);
  const alreadyWatched = typeof window !== 'undefined' && (
    sessionStorage.getItem('site-intro-watched') === 'true' ||
    window.location.search.includes('no-intro')
  );
  const [phase, setPhase] = useState(alreadyWatched ? 'hidden' : 'playing'); // 'playing' | 'flashing' | 'splitting' | 'hidden'
  const [lineActive, setLineActive] = useState(false);
  const triggeredRef = useRef(alreadyWatched);

  useEffect(() => {
    if (alreadyWatched) {
      document.documentElement.dataset.shellReady = 'true';
      document.documentElement.dataset.siteReady = 'true';
      window.dispatchEvent(new CustomEvent('site-shell-ready'));
      window.dispatchEvent(new CustomEvent('site-ready'));
      if (onComplete) onComplete();
      return;
    }

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      const applyPlaybackRate = () => {
        try {
          video.playbackRate = 2.0;
        } catch (_) {}
      };

      video.addEventListener('loadedmetadata', applyPlaybackRate);
      video.addEventListener('canplay', applyPlaybackRate);
      applyPlaybackRate();

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay was prevented by browser", err);
          // If Safari blocks autoplay completely, don't leave the user stuck on black screen
          setTimeout(() => {
            triggerReveal();
          }, 1200);
        });
      }
    }

    // Safari / slow network safety guard: video is 11s at 2x (~5.5s).
    // If it stalls or hangs for any reason, auto-transition gracefully.
    const safetyTimer = setTimeout(() => {
      triggerReveal();
    }, 6500);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        triggerReveal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const triggerReveal = () => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    try {
      sessionStorage.setItem('site-intro-watched', 'true');
    } catch (_) {}

    setLineActive(true);
    setPhase('flashing');

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

    if (video.currentTime >= 10.2 && !lineActive) {
      setLineActive(true);
    }

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
        cursor: 'pointer',
      }}
      onClick={triggerReveal}
    >
      <div className="loader-video-wrap">
        <video
          ref={videoRef}
          src="/videos/ascii-magic-2.mp4"
          muted
          playsInline
          webkit-playsinline="true"
          autoPlay
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onError={() => {
            console.warn("Video failed to decode or load; revealing site");
            triggerReveal();
          }}
          className="loader-video"
        />
      </div>

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

      <div className={`loader-white-flash ${phase === 'flashing' || phase === 'splitting' ? 'active' : ''}`} />

      <span
        className="loader-center-line"
        aria-hidden="true"
        style={{
          opacity: phase !== 'splitting' && lineActive ? 0.85 : 0,
          transform: `translateX(-50%) scaleY(${lineActive ? 1 : 0})`,
        }}
      />

      <button
        type="button"
        onClick={triggerReveal}
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 30,
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.75rem',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
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
