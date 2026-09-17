import React, { useEffect, useState, useRef } from 'react';
import { CURSOR_OPTIONS } from './CustomCursor';

export default function Navbar({ currentPath, onNavigate, soundEnabled, setSoundEnabled }) {
  const [cursorType, setCursorType] = useState('pikachu');
  const [showCursorMenu, setShowCursorMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleSound = () => {
    const audio = document.getElementById('bg-lofi-audio');
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.35;
      audio.play()
        .then(() => {
          setSoundEnabled(true);
        })
        .catch((err) => {
          console.warn('Audio play error:', err);
        });
    } else {
      audio.pause();
      setSoundEnabled(false);
    }
  };

  useEffect(() => {
    const audio = document.getElementById('bg-lofi-audio');
    if (!audio) return;

    const onPlay = () => setSoundEnabled(true);
    const onPause = () => setSoundEnabled(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [setSoundEnabled]);

  useEffect(() => {
    const saved = localStorage.getItem('cursor-type');
    setCursorType(saved || 'pikachu');

    const handleCursorChange = () => {
      setCursorType(localStorage.getItem('cursor-type') || 'pikachu');
    };

    window.addEventListener('cursor-change', handleCursorChange);
    return () => window.removeEventListener('cursor-change', handleCursorChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowCursorMenu(false);
      }
    };

    if (showCursorMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCursorMenu]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        onNavigate('/');
      } else if (e.key === 'b' || e.key === 'B') {
        onNavigate('/blog');
      } else if (e.key === 'p' || e.key === 'P') {
        onNavigate('/projects');
      } else if (e.key === 'k' || e.key === 'K') {
        onNavigate('/hobbies');
      } else if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      } else if (e.key === 'r' || e.key === 'R') {
        window.open('/AshitoshJagtapResume.pdf', '_blank');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  const isHome = currentPath === '/';
  const isBlog = currentPath.startsWith('/blog') || currentPath.startsWith('/blogs');
  const isProjects = currentPath.startsWith('/projects');
  const isHobbies = currentPath.startsWith('/hobbies');

  return (
    <nav className="site-nav">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className={`nav-link ${isHome ? 'active' : ''}`}
        title="Shortcut: [h]"
      >
        <span style={{ color: '#a1a1aa', marginRight: '0.25rem' }}>[h]</span>
        home
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/projects')}
        className={`nav-link ${isProjects ? 'active' : ''}`}
        title="Shortcut: [p]"
      >
        <span style={{ color: '#a1a1aa', marginRight: '0.25rem' }}>[p]</span>
        projects
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/blog')}
        className={`nav-link ${isBlog ? 'active' : ''}`}
        title="Shortcut: [b]"
      >
        <span style={{ color: '#a1a1aa', marginRight: '0.25rem' }}>[b]</span>
        blog & memes
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/hobbies')}
        className={`nav-link ${isHobbies ? 'active' : ''}`}
        title="Shortcut: [k]"
      >
        <span style={{ color: '#a1a1aa', marginRight: '0.25rem' }}>[k]</span>
        hobbies
      </button>

      <button
        type="button"
        onClick={() => window.open('/AshitoshJagtapResume.pdf', '_blank')}
        className="nav-link"
        title="Shortcut: [r]"
        style={{ color: '#ea580c' }}
      >
        <span style={{ color: '#fb923c', marginRight: '0.25rem' }}>[r]</span>
        resume
      </button>

      {/* Right-aligned utility controls */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Pikachu & Interactive Cursor Switcher */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowCursorMenu(!showCursorMenu)}
            className={`sound-toggle-btn ${cursorType !== 'none' ? 'sound-on' : ''}`}
            title="Interactive Character Cursor"
            aria-label="Interactive Character Cursor"
            style={{ margin: 0 }}
          >
            <span style={{ fontSize: '11px' }}>⚡</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              {cursorType === 'none' ? 'pika off' : cursorType}
            </span>
          </button>

          {showCursorMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(12px)',
                borderRadius: '8px',
                border: '1px solid #e4e4e7',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 200,
                minWidth: '130px',
              }}
            >
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#a1a1aa', padding: '4px 8px', borderBottom: '1px solid #f4f4f5', marginBottom: '2px' }}>
                SELECT CURSOR
              </div>
              {CURSOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    localStorage.setItem('cursor-type', c.id);
                    setCursorType(c.id);
                    window.dispatchEvent(new Event('cursor-change'));
                    setShowCursorMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: cursorType === c.id ? '#09090b' : '#71717a',
                    backgroundColor: cursorType === c.id ? '#f4f4f5' : 'transparent',
                    fontWeight: cursorType === c.id ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background-color 150ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f4f4f5')}
                  onMouseLeave={(e) => {
                    if (cursorType !== c.id) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {c.moveSrc ? (
                    <img src={c.moveSrc} alt="" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ width: '18px', textAlign: 'center', color: '#a1a1aa', fontSize: '11px' }}>✕</span>
                  )}
                  <span>{c.name}</span>
                  {cursorType === c.id && (
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#059669' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rock-Solid Lofi Audio Toggle: Ninja Hattori Melody */}
        <button
          type="button"
          onClick={toggleSound}
          className={`sound-toggle-btn ${soundEnabled ? 'sound-on' : ''}`}
          title={soundEnabled ? "Mute lofi music [m]" : "Play lofi music [m]"}
          aria-label={soundEnabled ? "Mute lofi music" : "Play lofi music"}
          style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          {soundEnabled ? (
            <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '1.5px', height: '12px' }}>
              <span className="visualizer-bar" style={{ width: '2px', height: '10px', backgroundColor: '#059669', borderRadius: '1px' }} />
              <span className="visualizer-bar" style={{ width: '2px', height: '6px', backgroundColor: '#059669', borderRadius: '1px', animationDelay: '0.2s' }} />
              <span className="visualizer-bar" style={{ width: '2px', height: '12px', backgroundColor: '#059669', borderRadius: '1px', animationDelay: '0.4s' }} />
            </span>
          ) : (
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a1a1aa' }} />
          )}
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            {soundEnabled ? 'lofi on' : 'lofi off'}
          </span>
        </button>
      </div>
    </nav>
  );
}
