import React from 'react';
import TiltedProjectScreen from '../components/TiltedProjectScreen';
import { siteData } from '../data/siteData';

export default function ProjectDetailPage({ slug, onNavigate }) {
  const project = siteData.projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main style={{ maxWidth: '38rem', marginTop: '2rem' }}>
        <p style={{ color: '#71717a' }}>Project not found.</p>
        <button
          type="button"
          onClick={() => onNavigate('/projects')}
          style={{ marginTop: '1rem', color: '#18181b', textDecoration: 'underline' }}
        >
          ← Back to projects
        </button>
      </main>
    );
  }

  const currentIndex = siteData.projects.findIndex((p) => p.slug === slug);
  const prevProj = currentIndex > 0 ? siteData.projects[currentIndex - 1] : null;
  const nextProj = currentIndex < siteData.projects.length - 1 ? siteData.projects[currentIndex + 1] : null;

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
    <main style={{ maxWidth: '40rem', marginTop: '1rem', position: 'relative', zIndex: 10 }}>
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate('/projects')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: '#71717a',
          marginBottom: '1.5rem',
          transition: 'color 200ms',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
      >
        <span>←</span>
        <span>Back to projects</span>
      </button>

      {/* Header & Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <h1
          data-butterfly-perch="project-title"
          style={{
            fontSize: '2rem',
            fontWeight: 600,
            color: '#09090b',
            letterSpacing: '-0.02em',
          }}
        >
          {project.title}
        </h1>
        {project.badge && (
          <span className={`badge ${getBadgeClass(project.badge)}`}>
            {project.badge}
          </span>
        )}
      </div>

      {project.date && (
        <time style={{ display: 'block', fontSize: '0.8125rem', color: '#71717a', marginBottom: '1.25rem' }}>
          {project.date}
        </time>
      )}

      <p style={{ fontSize: '1rem', color: '#3f3f46', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        {project.description}
      </p>

      {/* Interactive 3D Tilted Screen Preview */}
      {project.previewImage && (
        <div style={{ marginBottom: '2rem' }}>
          <TiltedProjectScreen
            imageSrc={project.previewImage}
            alt={`${project.title} live interface preview`}
            title={project.title}
            url={project.slug === 'safewaves' ? 'safewaves.vercel.app' : `${project.slug}.ashitosh.dev`}
            badge={project.badge}
            initialTilt={{ x: 5, y: -7 }}
          />
        </div>
      )}

      {/* Meta DL */}
      {project.meta && project.meta.length > 0 && (
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
            gap: '0.75rem 1.5rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            borderTop: '1px solid #e4e4e7',
            borderBottom: '1px solid #e4e4e7',
            fontSize: '0.875rem',
            marginBottom: '2rem',
          }}
        >
          {project.meta.map((m, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
              <dt style={{ width: '4.5rem', flexShrink: 0, color: '#71717a' }}>{m.term}</dt>
              <dd style={{ color: '#27272a' }}>{m.desc}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* What it does */}
      {project.features && project.features.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#09090b', marginBottom: '0.75rem' }}>
            what it does
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {project.features.map((feat, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#52525b' }}>
                <span style={{ color: '#a1a1aa' }}>—</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* External Links */}
      {project.links && project.links.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          {project.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#18181b',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              <span>{link.label || 'visit project'}</span>
              <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
                <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
              </svg>
            </a>
          ))}
        </div>
      )}

      {/* Pagination navigation */}
      <nav
        aria-label="More projects"
        style={{
          marginTop: '3rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #e4e4e7',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
        }}
      >
        {prevProj ? (
          <button
            type="button"
            onClick={() => onNavigate(`/projects/${prevProj.slug}`)}
            style={{ color: '#71717a' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            ← {prevProj.title}
          </button>
        ) : (
          <span />
        )}

        {nextProj && (
          <button
            type="button"
            onClick={() => onNavigate(`/projects/${nextProj.slug}`)}
            style={{ color: '#71717a' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            {nextProj.title} →
          </button>
        )}
      </nav>
    </main>
  );
}
