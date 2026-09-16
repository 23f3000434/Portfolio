import React, { useEffect } from 'react';

export default function Navbar({ currentPath, onNavigate, soundEnabled, setSoundEnabled }) {
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

      {/* Subtle Sound Toggle */}
      <button
        type="button"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`sound-toggle-btn ${soundEnabled ? 'sound-on' : ''}`}
        title={soundEnabled ? "Mute scroll sounds" : "Unmute scroll sounds"}
        aria-label={soundEnabled ? "Mute scroll sounds" : "Unmute scroll sounds"}
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
    </nav>
  );
}
