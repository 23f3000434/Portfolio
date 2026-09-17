import React from 'react';
import Footer from '../components/Footer';
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
        blog & writings
      </h1>

      {/* Blog Posts List */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <time
                dateTime={post.dateIso}
                style={{ fontSize: '0.75rem', color: '#71717a' }}
              >
                {post.date}
              </time>
              {post.category && (
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    color: post.category.includes('mental') ? '#7c3aed' : post.category.includes('craft') ? '#d97706' : '#059669',
                    backgroundColor: post.category.includes('mental') ? 'rgba(124, 58, 237, 0.08)' : post.category.includes('craft') ? 'rgba(217, 119, 6, 0.08)' : 'rgba(5, 150, 105, 0.08)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {post.category}
                </span>
              )}
            </div>

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

      {/* Memes Section under Blog */}
      <section style={{ marginTop: '3.5rem', paddingTop: '1.75rem', borderTop: '1px solid #e4e4e7' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#09090b', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🐸</span>
            <span>memes & terminal humor</span>
          </h2>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717a' }}>
            unfiltered dev life
          </span>
        </div>

        {/* Small compact grid displaying memes completely */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {siteData.memes?.map((meme) => (
            <div
              key={meme.id}
              data-butterfly-perch={`meme-${meme.id}`}
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #e4e4e7',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                transition: 'border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  backgroundColor: '#f8fafc',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={meme.src}
                  alt={meme.title}
                  loading="lazy"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </main>
  );
}
