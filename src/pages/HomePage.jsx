import React from 'react';
import { ProjectHoverTarget, ProjectHoverStory } from '../components/ProjectHoverStory';
import HoverRoles from '../components/HoverRoles';
import PhotoGrid from '../components/PhotoGrid';
import AsciiPortrait from '../components/AsciiPortrait';
import { siteData } from '../data/siteData';

export default function HomePage({ onNavigate }) {
  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      {/* Corner ASCII art portrait */}
      <AsciiPortrait />

      <main style={{ maxWidth: '32rem', marginTop: '1rem', position: 'relative', zIndex: 10 }}>
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

        {/* Experience & Work timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: '#52525b', marginBottom: '1.75rem' }}>
          <div>
            currently building{' '}
            <ProjectHoverTarget
              project="safewaves"
              data-butterfly-perch="safewaves"
              className="shimmer-text"
              style={{ color: '#059669', fontWeight: 500 }}
              onClick={() => onNavigate('/projects/safewaves')}
            >
              <span style={{ marginRight: '2px' }}>🛡️</span> SafeWaves
            </ProjectHoverTarget>
            <span style={{ color: '#71717a' }}> — multi-threat cyber defense platform</span>
          </div>

          <div>
            built{' '}
            <ProjectHoverTarget
              project="codebattle"
              data-butterfly-perch="codebattle"
              className="shimmer-text"
              style={{ color: '#2563eb', fontWeight: 500 }}
              onClick={() => onNavigate('/projects/codebattle')}
            >
              <span style={{ marginRight: '4px' }}>⚔️</span>CodeBattle
            </ProjectHoverTarget>
            <span style={{ color: '#71717a' }}> — real-time competitive coding arena</span>
          </div>

          <div>
            national finalist (top 20 / 40,000){' '}
            <ProjectHoverTarget
              project="voxguard"
              data-butterfly-perch="voxguard"
              className="shimmer-text"
              style={{ color: '#ea580c', fontWeight: 500 }}
              onClick={() => onNavigate('/projects/voxguard')}
            >
              <span style={{ marginRight: '4px' }}>🎙️</span>VoxGuard
            </ProjectHoverTarget>
            <span style={{ color: '#71717a' }}> @ HCL GUVI AI Impact Buildathon (voice deepfake detection)</span>
          </div>

          <div>
            freelance full-stack engineer{' '}
            <ProjectHoverTarget
              project="freelance"
              data-butterfly-perch="freelance"
              className="shimmer-text"
              style={{ color: '#18181b', fontWeight: 500 }}
              onClick={() => onNavigate('/projects/realtime-engine')}
            >
              <span style={{ marginRight: '4px' }}>⚡</span>3 client deployments
            </ProjectHoverTarget>
            <span style={{ color: '#71717a' }}> with React, FastAPI, Node.js & Docker</span>
          </div>

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
            <span style={{ color: '#71717a' }}> ('23 — '27) · deep learning & algorithms</span>
          </div>

          <div>
            i love building & exploring:{' '}
            <ProjectHoverTarget
              project="safewaves"
              data-butterfly-perch="safewaves-link"
              className="shimmer-text"
              style={{ color: '#18181b' }}
              onClick={() => onNavigate('/projects/safewaves')}
            >
              safewaves
            </ProjectHoverTarget>
            {', '}
            <ProjectHoverTarget
              project="codebattle"
              data-butterfly-perch="codebattle-link"
              className="shimmer-text"
              style={{ color: '#18181b' }}
              onClick={() => onNavigate('/projects/codebattle')}
            >
              codebattle
            </ProjectHoverTarget>
            {', '}
            <ProjectHoverTarget
              project="voxguard"
              data-butterfly-perch="voxguard-link"
              className="shimmer-text"
              style={{ color: '#18181b' }}
              onClick={() => onNavigate('/projects/voxguard')}
            >
              voxguard
            </ProjectHoverTarget>
          </div>
        </div>

        {/* Dynamic Project Story / Bio transition box */}
        <ProjectHoverStory />

        {/* 3-Photo cycling carousel */}
        <PhotoGrid />

        {/* P.S. line */}
        <p style={{ fontSize: '0.75rem', color: '#71717a', paddingLeft: '1rem', marginTop: '1rem', marginBottom: '2rem' }}>
          {siteData.author.ps}
        </p>

        {/* Footer Social Links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', fontSize: '0.875rem' }}>
          <a
            href="https://github.com/23f3000434"
            target="_blank"
            rel="noopener noreferrer"
            data-butterfly-perch="github"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#71717a', transition: 'color 200ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            <span style={{ display: 'flex', width: '16px', height: '16px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#52525b', color: '#fff' }}>
              <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
                <path d="M216,104v8a56.06,56.06,0,0,1-48.44,55.47A39.8,39.8,0,0,1,176,192v40a8,8,0,0,1-8,8H104a8,8,0,0,1-8-8V216H72a40,40,0,0,1-40-40A24,24,0,0,0,8,152a8,8,0,0,1,0-16,40,40,0,0,1,40,40,24,24,0,0,0,24,24H96v-8a39.8,39.8,0,0,1,8.44-24.53A56.06,56.06,0,0,1,56,112v-8a58.14,58.14,0,0,1,7.69-28.32A59.78,59.78,0,0,1,69.07,28,8,8,0,0,1,76,24a59.75,59.75,0,0,1,48,24h24a59.75,59.75,0,0,1,48-24,8,8,0,0,1,6.93,4,59.74,59.74,0,0,1,5.37,47.68A58,58,0,0,1,216,104Z" />
              </svg>
            </span>
            <span>github</span>
          </a>

          <a
            href="https://linkedin.com/in/ashitoshjagtap"
            target="_blank"
            rel="noopener noreferrer"
            data-butterfly-perch="linkedin"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#71717a', transition: 'color 200ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
              <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM96,176a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0ZM88,96a12,12,0,1,1,12-12A12,12,0,0,1,88,96Zm96,80a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140Z" />
            </svg>
            <span>linkedin</span>
          </a>

          <a
            href="mailto:ashitoshjprogram@gmail.com"
            data-butterfly-perch="email"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#71717a', transition: 'color 200ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#09090b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
              <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
            </svg>
            <span>email</span>
          </a>

          <a
            href="https://safewaves.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            data-butterfly-perch="safewaves-app"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', transition: 'color 200ms', fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#047857')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#059669')}
          >
            <span>safewaves ↗</span>
          </a>
        </div>
      </main>
    </div>
  );
}
