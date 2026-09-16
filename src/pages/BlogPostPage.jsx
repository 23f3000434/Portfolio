import React from 'react';
import { siteData } from '../data/siteData';

export default function BlogPostPage({ slug, onNavigate }) {
  const post = siteData.blogs.find((b) => b.slug === slug);

  if (!post) {
    return (
      <main style={{ maxWidth: '36rem', marginTop: '2rem' }}>
        <p style={{ color: '#71717a' }}>Post not found.</p>
        <button
          type="button"
          onClick={() => onNavigate('/blog')}
          style={{ marginTop: '1rem', color: '#18181b', textDecoration: 'underline' }}
        >
          ← Back to blog
        </button>
      </main>
    );
  }

  const currentIndex = siteData.blogs.findIndex((b) => b.slug === slug);
  const prevPost = currentIndex > 0 ? siteData.blogs[currentIndex - 1] : null;
  const nextPost = currentIndex < siteData.blogs.length - 1 ? siteData.blogs[currentIndex + 1] : null;

  return (
    <main style={{ maxWidth: '38rem', marginTop: '1rem', position: 'relative', zIndex: 10 }}>
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate('/blog')}
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
        <span>Back to blog</span>
      </button>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <time
          dateTime={post.dateIso}
          style={{ display: 'block', fontSize: '0.75rem', color: '#71717a', marginBottom: '0.5rem' }}
        >
          {post.date}
        </time>
        <h1
          data-butterfly-perch="post-title"
          style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#09090b',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h1>
      </div>

      {/* Article Content */}
      <div
        className="blog-prose"
        onClick={(e) => {
          const anchor = e.target.closest('a');
          if (anchor && anchor.getAttribute('href')?.startsWith('/')) {
            e.preventDefault();
            onNavigate(anchor.getAttribute('href'));
          }
        }}
        style={{
          color: '#3f3f46',
          fontSize: '0.9375rem',
          lineHeight: 1.7,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* Post Navigation */}
      <nav
        aria-label="Blog post navigation"
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e4e4e7',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
        }}
      >
        {prevPost ? (
          <button
            type="button"
            onClick={() => onNavigate(`/blog/${prevPost.slug}`)}
            style={{ color: '#71717a', textAlign: 'left' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            ← {prevPost.title}
          </button>
        ) : (
          <span />
        )}

        {nextPost && (
          <button
            type="button"
            onClick={() => onNavigate(`/blog/${nextPost.slug}`)}
            style={{ color: '#71717a', textAlign: 'right' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            {nextPost.title} →
          </button>
        )}
      </nav>
    </main>
  );
}
