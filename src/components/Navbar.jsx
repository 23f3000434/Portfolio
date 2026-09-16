import React, { useEffect, useState, useRef } from 'react';
import { CURSOR_OPTIONS } from './CustomCursor';

export default function Navbar({ currentPath, onNavigate, soundEnabled, setSoundEnabled }) {
  const [cursorType, setCursorType] = useState('pikachu');
  const [showCursorMenu, setShowCursorMenu] = useState(false);
  const menuRef = useRef(null);

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

      if (e.key === 'h') {
        onNavigate('/');
      } else if (e.key === 'b') {
        onNavigate('/blog');
      } else if (e.key === 'p') {
        onNavigate('/projects');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  const isHome = currentPath === '/';
  const isBlog = currentPath.startsWith('/blog') || currentPath.startsWith('/blogs');
  const isProjects = currentPath.startsWith('/projects');

  return (
    <nav className="site-nav">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className={`nav-link ${isHome ? 'active' : ''}`}
      >
        <span style={{ color: '#a1a1aa', marginRight: '0.25rem' }}>[h]</span>
        home
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/blog')}
        className={`nav-link ${isBlog ? 'active' : ''}`}
      >
        <span style={{ color: '#a1a1aa', marginRight: '0.25rem' }}>[b]</span>
        blog
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/projects')}
        className={`nav-link ${isProjects ? 'active' : ''}`}
      >
        <span style={{ color: '#a1a1aa', marginRight: '0.25rem' }}>[p]</span>
        projects
      </button>

      {/* Right-aligned utility controls */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Pikachu & Interactive Cursor Switcher */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowCursorMenu(!showCursorMenu)}
            className={`sound-toggle-btn ${cursorType !== 'none' ? 'sound-on' : ''}`}
            title="Interactive Pikachu Cursor"
            aria-label="Interactive Pikachu Cursor"
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
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                width: '9.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                padding: '0.35rem',
                zIndex: 150,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.15rem',
              }}
            >
              <div style={{ fontSize: '10px', color: '#a1a1aa', padding: '0.25rem 0.5rem', fontFamily: 'var(--font-mono)' }}>
                cursor follower
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
                    gap: '0.5rem',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    color: cursorType === c.id ? '#09090b' : '#52525b',
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

        {/* Subtle Sound Toggle */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`sound-toggle-btn ${soundEnabled ? 'sound-on' : ''}`}
          title={soundEnabled ? "Mute scroll sounds" : "Unmute scroll sounds"}
          aria-label={soundEnabled ? "Mute scroll sounds" : "Unmute scroll sounds"}
          style={{ margin: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {soundEnabled ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </>
            )}
          </svg>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            {soundEnabled ? 'snd on' : 'snd off'}
          </span>
        </button>
      </div>
    </nav>
  );
}
