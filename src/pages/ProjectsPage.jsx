import React from 'react';
import TopographyCanvas from '../components/TopographyCanvas';
import { siteData } from '../data/siteData';

export default function ProjectsPage({ onNavigate }) {
  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'done':
        return 'badge-done';
      case 'acquihired':
        return 'badge-acquihired';
      case 'discontinued':
        return 'badge-discontinued';
      case 'under construction':
        return 'badge-under-construction';
      default:
        return '';
    }
  };

  return (
    <main style={{ maxWidth: '44rem', marginTop: '1rem', position: 'relative', zIndex: 10 }}>
      {/* Background Topography Lines */}
      <TopographyCanvas />

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
      <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '2rem' }}>
        a collection of things i've built.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
          gap: '1rem',
        }}
      >
        {siteData.projects.map((proj) => (
          <article
            key={proj.slug}
            data-butterfly-perch={`project-${proj.slug}`}
            onClick={() => onNavigate(`/projects/${proj.slug}`)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '110px',
              padding: '0.875rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e4e4e7',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(4px)',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#a1a1aa';
              e.currentTarget.style.backgroundColor = 'rgba(250, 250, 250, 0.95)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e4e4e7';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 500, color: '#09090b' }}>
                {proj.title}
              </h2>
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5, flex: 1 }}>
              {proj.summary}
            </p>

            {proj.badge && (
              <div style={{ marginTop: '0.75rem' }}>
                <span className={`badge ${getBadgeClass(proj.badge)}`}>
                  {proj.badge}
                </span>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
