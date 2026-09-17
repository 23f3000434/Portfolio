import React from 'react';
import TopographyCanvas from '../components/TopographyCanvas';
import TiltedProjectScreen from '../components/TiltedProjectScreen';
import Footer from '../components/Footer';
import { siteData } from '../data/siteData';

export default function ProjectsPage({ onNavigate }) {
  const getBadgeClass = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'live in prod':
        return 'badge-done';
      case 'award winner':
        return 'badge-done';
      case 'client prod':
        return 'badge-done';
      case 'done':
        return 'badge-done';
      default:
        return 'badge-done';
    }
  };

  return (
    <main
      style={{
        width: '100%',
        maxWidth: '64rem',
        marginTop: '1rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Background Topography Lines */}
      <TopographyCanvas />

      <header style={{ marginBottom: '2.5rem', maxWidth: '44rem' }}>
        <h1
          data-butterfly-perch="projects-title"
          style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#09090b',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}
        >
          projects
        </h1>
        <p style={{ color: '#71717a', fontSize: '0.875rem' }}>
          frontend sandboxes, operational platforms & real-time systems architectures. hover over any screen to interact with the 3D perspective.
        </p>
      </header>

      {/* 2 Projects side-by-side on desktop */}
      <div
        className="projects-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          alignItems: 'stretch',
        }}
      >
        {siteData.projects.map((proj, idx) => (
          <article
            key={proj.slug}
            data-butterfly-perch={`project-${proj.slug}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.35rem',
              borderRadius: '1rem',
              border: '1px solid #e4e4e7',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
              transition: 'border-color 250ms ease, box-shadow 250ms ease, transform 250ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e4e4e7';
              e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(0, 0, 0, 0.04)';
            }}
          >
            {/* Header: Title, Date, Badge */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2
                  onClick={() => onNavigate(`/projects/${proj.slug}`)}
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#09090b',
                    letterSpacing: '-0.02em',
                    cursor: 'pointer',
                  }}
                >
                  {proj.title}
                </h2>
                {proj.badge && (
                  <span className={`badge ${getBadgeClass(proj.badge)}`}>
                    {proj.badge}
                  </span>
                )}
              </div>

              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717a' }}>
                {proj.date}
              </span>
            </div>

            {/* Subtitle / Award Banner */}
            {proj.award ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#ea580c',
                  backgroundColor: 'rgba(234, 88, 12, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  width: 'fit-content',
                  marginBottom: '0.5rem',
                }}
              >
                <span>🏆</span>
                <span>{proj.award}</span>
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#71717a', marginBottom: '0.5rem' }}>
                {proj.subtitle}
              </div>
            )}

            <p style={{ fontSize: '0.84rem', color: '#52525b', lineHeight: 1.55, marginBottom: '0.75rem', flexGrow: 0 }}>
              {proj.summary}
            </p>

            {/* Interactive 3D Tilted Screen Preview on Hover */}
            {proj.previewImage && (
              <div
                onClick={() => {
                  if (proj.links?.[0]?.url) {
                    window.open(proj.links[0].url, '_blank', 'noopener,noreferrer');
                  } else {
                    onNavigate(`/projects/${proj.slug}`);
                  }
                }}
                style={{ marginBottom: '0.5rem' }}
              >
                <TiltedProjectScreen
                  imageSrc={proj.previewImage}
                  alt={`${proj.title} screen interface preview`}
                  title={proj.title}
                  url={
                    proj.slug === 'prism-playground'
                      ? 'prism-playground-alpha.vercel.app'
                      : proj.slug === 'butterlane'
                      ? 'cake-shop-management-five.vercel.app'
                      : proj.slug === 'safewaves'
                      ? 'safewaves.vercel.app'
                      : 'internship-placement-portal-steel.vercel.app'
                  }
                  badge={proj.badge}
                  initialTilt={{ x: 5, y: idx % 2 === 0 ? -7 : 7 }}
                />
              </div>
            )}

            {/* Feature Highlights */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 1rem 0', display: 'flex', flexDirection: 'column', gap: '0.35rem', flexGrow: 1 }}>
              {proj.features?.slice(0, 3).map((feat, fIdx) => (
                <li
                  key={fIdx}
                  style={{
                    fontSize: '0.78rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    lineHeight: 1.45,
                  }}
                >
                  <span style={{ color: '#059669', fontSize: '0.75rem', marginTop: '1px' }}>▹</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {/* Links & Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.875rem', marginTop: 'auto' }}>
              {proj.links?.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: lIdx === 0 ? '#059669' : '#71717a',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = lIdx === 0 ? '#059669' : '#71717a')}
                >
                  {link.label} {link.label.includes('visit') ? '↗' : '→'}
                </a>
              ))}

              <button
                onClick={() => onNavigate(`/projects/${proj.slug}`)}
                style={{
                  marginLeft: 'auto',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                details →
              </button>
            </div>
          </article>
        ))}
      </div>

      <Footer onNavigate={onNavigate} />
    </main>
  );
}
