import React from 'react';
import { ProjectHoverTarget, ProjectHoverStory } from '../components/ProjectHoverStory';
import HoverRoles from '../components/HoverRoles';
import PhotoGrid from '../components/PhotoGrid';
import Footer from '../components/Footer';
import { siteData } from '../data/siteData';

export default function HomePage({ onNavigate }) {
  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <main style={{ maxWidth: '34rem', marginTop: '1rem', position: 'relative', zIndex: 10 }}>
        {/* Title and Age */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#09090b', letterSpacing: '-0.02em' }}>
            {siteData.author.name}
          </h1>
          <span style={{ fontSize: '0.875rem', color: '#71717a' }}>
            {siteData.author.age}
          </span>
        </div>

        {/* Roles line with interactive hover stream */}
        <div style={{ fontSize: '0.875rem', color: '#52525b', marginBottom: '1.5rem' }}>
          <span>i can be </span>
          <HoverRoles />
        </div>

        {/* Prominent Achievements Spotlight Grid */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#71717a', marginBottom: '0.625rem' }}>
            key milestones & national hackathons
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '0.625rem',
            }}
          >
            {/* 1. HackerHouse Goa Hackathon */}
            <div
              data-butterfly-perch="achievement-hhgoa"
              style={{
                padding: '0.75rem 0.875rem',
                borderRadius: '0.625rem',
                border: '1px solid #e4e4e7',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                transition: 'border-color 150ms ease, transform 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, fontFamily: 'monospace' }}>
                  RANK #11
                </span>
                <span style={{ fontSize: '13px' }}>🏆</span>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#09090b', lineHeight: 1.25 }}>
                HackerHouse Goa Hackathon
              </div>
              <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                top 11 out of 50,000+ national registrations
              </div>
            </div>

            {/* 2. AI Impact Summit Hackathon */}
            <div
              data-butterfly-perch="achievement-aiimpact"
              style={{
                padding: '0.75rem 0.875rem',
                borderRadius: '0.625rem',
                border: '1px solid #e4e4e7',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                transition: 'border-color 150ms ease, transform 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 600, fontFamily: 'monospace' }}>
                  NATIONAL TOP 20
                </span>
                <span style={{ fontSize: '13px' }}>⚡</span>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#09090b', lineHeight: 1.25 }}>
                AI Impact Summit
              </div>
              <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                national finalist (top 20 of 40,000+ builders)
              </div>
            </div>

            {/* 3. IndiaNext Hackathon */}
            <div
              data-butterfly-perch="achievement-indianext"
              onClick={() => onNavigate('/projects/safewaves')}
              style={{
                padding: '0.75rem 0.875rem',
                borderRadius: '0.625rem',
                border: '1px solid #e4e4e7',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                cursor: 'pointer',
                transition: 'border-color 150ms ease, transform 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#a7f3d0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600, fontFamily: 'monospace' }}>
                  TOP 30 FINALIST
                </span>
                <span style={{ fontSize: '13px' }}>🛡️</span>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#09090b', lineHeight: 1.25 }}>
                IndiaNext Hackathon
              </div>
              <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                top 30 of 300+ teams (SafeWaves)
              </div>
            </div>

            {/* 4. Freelance Tutor */}
            <div
              data-butterfly-perch="achievement-tutor"
              style={{
                padding: '0.75rem 0.875rem',
                borderRadius: '0.625rem',
                border: '1px solid #e4e4e7',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                transition: 'border-color 150ms ease, transform 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#c4b5fd';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600, fontFamily: 'monospace' }}>
                  AI STARTUP TUTOR
                </span>
                <span style={{ fontSize: '13px' }}>👨‍🏫</span>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#09090b', lineHeight: 1.25 }}>
                Product Engineering
              </div>
              <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                lectures & mentoring for Grade 11–12
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Lifestyle timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#52525b', marginBottom: '1.75rem' }}>
          <div>
            studying bs data science @{' '}
            <ProjectHoverTarget
              project="iitmadras"
              data-butterfly-perch="iitmadras"
              className="shimmer-text"
              style={{ color: '#991b1b', fontWeight: 500 }}
            >
              <span style={{ marginRight: '4px' }}>🎓</span>IIT Madras
            </ProjectHoverTarget>
            <span style={{ color: '#71717a' }}> ('23 — '27) · algorithms & modern systems</span>
          </div>

          <div>
            currently reading{' '}
            <ProjectHoverTarget
              project="reading"
              data-butterfly-perch="reading"
              className="shimmer-text"
              style={{ color: '#d97706', fontWeight: 500 }}
              onClick={() => onNavigate('/hobbies')}
            >
              <span style={{ marginRight: '4px' }}>📖</span>Dostoevsky, Marcus Aurelius & Sherlock Holmes
            </ProjectHoverTarget>
            <span style={{ color: '#71717a' }}> — Crime and Punishment, Meditations & The Courage to Be Disliked</span>
          </div>

          <div>
            offline pursuits:{' '}
            <ProjectHoverTarget
              project="flute"
              data-butterfly-perch="flute"
              className="shimmer-text"
              style={{ color: '#059669', fontWeight: 500 }}
              onClick={() => onNavigate('/hobbies')}
            >
              <span style={{ marginRight: '3px' }}>🪈</span>classical flute
            </ProjectHoverTarget>
            {', '}
            <ProjectHoverTarget
              project="sketching"
              data-butterfly-perch="sketching"
              className="shimmer-text"
              style={{ color: '#4b5563', fontWeight: 500 }}
              onClick={() => onNavigate('/hobbies')}
            >
              <span style={{ marginRight: '3px' }}>✏️</span>pencil sketching
            </ProjectHoverTarget>
            <span style={{ color: '#71717a' }}> & swimming laps to clear my head</span>
          </div>

          <div>
            i love building & exploring:{' '}
            <ProjectHoverTarget
              project="prism"
              data-butterfly-perch="prism-link"
              className="shimmer-text"
              style={{ color: '#18181b', fontWeight: 500 }}
              onClick={() => onNavigate('/projects/prism-playground')}
            >
              prism playground
            </ProjectHoverTarget>
            {', '}
            <ProjectHoverTarget
              project="cakeshop"
              data-butterfly-perch="cakeshop-link"
              className="shimmer-text"
              style={{ color: '#18181b', fontWeight: 500 }}
              onClick={() => onNavigate('/projects/butterlane')}
            >
              butterlane
            </ProjectHoverTarget>
            {', '}
            <ProjectHoverTarget
              project="safewaves"
              data-butterfly-perch="safewaves-link"
              className="shimmer-text"
              style={{ color: '#18181b', fontWeight: 500 }}
              onClick={() => onNavigate('/projects/safewaves')}
            >
              safewaves
            </ProjectHoverTarget>
            {', '}
            <ProjectHoverTarget
              project="interntrack"
              data-butterfly-perch="interntrack-link"
              className="shimmer-text"
              style={{ color: '#18181b', fontWeight: 500 }}
              onClick={() => onNavigate('/projects/interntrack')}
            >
              interntrack
            </ProjectHoverTarget>
          </div>
        </div>

        {/* Dynamic Project Story / Bio transition box */}
        <ProjectHoverStory />

        {/* 3-Photo cycling carousel with user aesthetic photos */}
        <PhotoGrid />

        {/* P.S. line */}
        <p style={{ fontSize: '0.75rem', color: '#71717a', paddingLeft: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
          {siteData.author.ps}
        </p>

        {/* Pawann.dev inspired Footer with user's animated GIF and navigation */}
        <Footer onNavigate={onNavigate} />
      </main>
    </div>
  );
}
