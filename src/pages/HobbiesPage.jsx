import React, { useRef, useState } from 'react';
import TopographyCanvas from '../components/TopographyCanvas';
import Footer from '../components/Footer';
import { siteData } from '../data/siteData';

export default function HobbiesPage({ onNavigate }) {
  const { books, sketches } = siteData.hobbies;
  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const startPlay = (unmute = false) => {
    const video = videoRef.current;
    if (!video) return;

    if (unmute) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }

    const promise = video.play();
    playPromiseRef.current = promise;
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          playPromiseRef.current = null;
        })
        .catch(() => {
          // If unmuted playback was blocked by Safari, fallback to muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            const retry = videoRef.current.play();
            playPromiseRef.current = retry;
            if (retry !== undefined) {
              retry
                .then(() => {
                  setIsPlaying(true);
                  playPromiseRef.current = null;
                })
                .catch(() => {
                  playPromiseRef.current = null;
                });
            }
          }
        });
    }
  };

  const stopPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          video.pause();
          setIsPlaying(false);
        })
        .catch(() => {
          video.pause();
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayClick = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      startPlay(true); // User click gesture: allow unmuted sound
    } else {
      stopPlay();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <main style={{ maxWidth: '42rem', marginTop: '1rem', position: 'relative', zIndex: 10 }}>
      <TopographyCanvas />

      <header style={{ marginBottom: '2.5rem' }}>
        <h1
          data-butterfly-perch="hobbies-title"
          style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#09090b',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}
        >
          hobbies & reading
        </h1>
        <p style={{ color: '#71717a', fontSize: '0.875rem', lineHeight: 1.5 }}>
          when i'm not shipping code or swimming laps, i play the bansuri (flute), sketch portraits, and read books that challenge mental models.
        </p>
      </header>

      {/* Flute Performance Section (Compact & Hover-to-play, no text underneath) */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#09090b', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🪈</span>
            <span>Bansuri Flute Recital</span>
          </h2>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717a' }}>
            hover to play
          </span>
        </div>

        {/* Smaller, compact video container - clean with no text underneath */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            data-butterfly-perch="flute-video-card"
            onMouseEnter={() => startPlay(false)}
            onMouseLeave={stopPlay}
            onClick={togglePlayClick}
            style={{
              width: '100%',
              maxWidth: '360px',
              borderRadius: '0.875rem',
              overflow: 'hidden',
              border: '1px solid #e4e4e7',
              backgroundColor: '#09090b',
              boxShadow: isPlaying ? '0 14px 30px -4px rgba(0, 0, 0, 0.16)' : '0 4px 18px -2px rgba(0, 0, 0, 0.05)',
              transition: 'box-shadow 300ms ease, border-color 300ms ease',
              cursor: 'pointer',
            }}
          >
            {/* Video element - optimized for Safari with faststart, poster, and inline play */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <video
                ref={videoRef}
                src="/media/flute-performance.mp4"
                poster="/media/flute-poster.jpg"
                playsInline
                webkit-playsinline="true"
                muted
                loop
                preload="auto"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Hover / tap overlay hint */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 300ms ease, opacity 300ms ease',
                  pointerEvents: 'none',
                  opacity: isPlaying ? 0 : 1,
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    color: '#09090b',
                    fontSize: '0.95rem',
                  }}
                >
                  ▶
                </div>
                <span
                  style={{
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  hover / click to play
                </span>
              </div>

              {/* Live Playing Indicator */}
              {isPlaying && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(5, 150, 105, 0.9)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    pointerEvents: 'none',
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#a7f3d0' }} />
                  <span>playing</span>
                </div>
              )}

              {/* In-player sound toggle */}
              {isPlaying && (
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute flute sound" : "Mute flute sound"}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.72)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)',
                    zIndex: 10,
                  }}
                >
                  <span>{isMuted ? '🔇 sound off (tap for sound)' : '🔊 sound on'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pencil Sketching & Visual Art Section */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#09090b', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✏️</span>
            <span>Pencil Sketching & Studies</span>
          </h2>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717a' }}>
            graphite & paper
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          {sketches.map((sketch) => (
            <div
              key={sketch.id}
              data-butterfly-perch={`sketch-${sketch.id}`}
              style={{
                borderRadius: '0.75rem',
                border: '1px solid #e4e4e7',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 6px 18px -2px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.03)';
              }}
            >
              <div style={{ width: '100%', aspectRatio: '4/5', backgroundColor: '#f4f4f5', overflow: 'hidden' }}>
                <img
                  src={sketch.src}
                  alt={sketch.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 300ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.025)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
              <div style={{ padding: '0.625rem 0.75rem' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#09090b', margin: 0 }}>
                  {sketch.title}
                </h4>
                <p style={{ fontSize: '0.72rem', color: '#71717a', margin: '2px 0 0 0' }}>
                  {sketch.medium}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Books Shelf Section - Real book photos with human perspective */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#09090b', letterSpacing: '-0.01em' }}>
            books & literary perspectives
          </h2>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717a' }}>
            honest thoughts
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {books.map((book) => (
            <article
              key={book.id}
              data-butterfly-perch={`book-${book.id}`}
              style={{
                display: 'flex',
                gap: '1.25rem',
                padding: '1.1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                borderRadius: '0.75rem',
                border: '1px solid #e4e4e7',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 6px 18px -2px rgba(0, 0, 0, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.03)';
              }}
            >
              {/* Real Book Cover Photo */}
              <div
                style={{
                  width: '82px',
                  minWidth: '82px',
                  height: '122px',
                  borderRadius: '0.375rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  backgroundColor: '#f4f4f5',
                  flexShrink: 0,
                }}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Book Details & Human Perspective */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#09090b', margin: 0 }}>
                      {book.title}
                    </h3>
                    {book.status && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono, monospace)',
                          color: book.status.includes('still') ? '#c2410c' : '#71717a',
                          backgroundColor: book.status.includes('still') ? '#fff7ed' : '#f4f4f5',
                          border: book.status.includes('still') ? '1px solid #fed7aa' : '1px solid #e4e4e7',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {book.status}
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#71717a' }}>
                    {book.author} · {book.year}
                  </span>
                </div>

                {book.id === 'crime-and-punishment' && (
                  <div style={{ fontSize: '0.75rem', color: '#c2410c', fontFamily: 'var(--font-mono, monospace)', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>📖</span>
                    <span>i am still reading this...</span>
                  </div>
                )}

                <p style={{ fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.6, margin: 0 }}>
                  {book.thought}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </main>
  );
}
