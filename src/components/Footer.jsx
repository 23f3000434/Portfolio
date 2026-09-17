import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ marginTop: '3.5rem', position: 'relative', zIndex: 10 }}>
      {/* Centered Anime Duel GIF - clearly visible and placed cleanly above the footer border */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          userSelect: 'none',
          marginBottom: '1.5rem',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            maxHeight: '170px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/images/footer-duel.gif"
            alt="Anime duel animation"
            aria-hidden="true"
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '170px',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              filter: 'contrast(1.05) brightness(0.97)',
            }}
          />
        </div>
      </div>

      {/* Footer Navigation & Social Links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderTop: '1px solid #e4e4e7',
          paddingTop: '1.25rem',
          fontSize: '0.8125rem',
          fontFamily: 'var(--font-mono, monospace)',
        }}
      >
        <nav style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '1.25rem' }}>
          <a
            href="https://github.com/23f3000434"
            target="_blank"
            rel="noopener noreferrer"
            data-butterfly-perch="footer-github"
            style={{ color: '#71717a', transition: 'color 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            github
          </a>

          <a
            href="https://linkedin.com/in/ashitoshjagtap"
            target="_blank"
            rel="noopener noreferrer"
            data-butterfly-perch="footer-linkedin"
            style={{ color: '#71717a', transition: 'color 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            linkedin
          </a>

          <a
            href="mailto:ashitoshjprogram@gmail.com"
            data-butterfly-perch="footer-email"
            style={{ color: '#71717a', transition: 'color 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            email
          </a>

          <a
            href="https://safewaves.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            data-butterfly-perch="footer-safewaves"
            style={{ color: '#059669', fontWeight: 500, transition: 'color 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#047857')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#059669')}
          >
            safewaves ↗
          </a>
        </nav>

        <div style={{ color: '#a1a1aa', fontSize: '0.75rem' }}>
          ashitosh jagtap · iit madras '27
        </div>
      </div>
    </footer>
  );
}
