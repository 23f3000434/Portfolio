import React from 'react';
import { siteData } from '../data/siteData';

export default function BlogPage({ onNavigate }) {
  return (
    <main style={{ maxWidth: '36rem', marginTop: '1rem', position: 'relative', zIndex: 10 }}>
      <h1
        data-butterfly-perch="blog-title"
        style={{
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#09090b',
          letterSpacing: '-0.02em',
          marginBottom: '2rem',
        }}
      >
        blog
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {siteData.blogs.map((post) => (
          <article
            key={post.slug}
            data-butterfly-perch={`blog-${post.slug}`}
            onClick={() => onNavigate(`/blog/${post.slug}`)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '0.75rem',
              margin: '-0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid transparent',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.025)';
              e.currentTarget.style.borderColor = '#e4e4e7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <time
              dateTime={post.dateIso}
              style={{ fontSize: '0.75rem', color: '#71717a' }}
            >
              {post.date}
            </time>
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: '#18181b',
                transition: 'color 200ms',
              }}
            >
              {post.title}
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#52525b',
                lineHeight: 1.5,
              }}
            >
              {post.summary}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
