import React, { createContext, useContext, useState, useRef } from 'react';
import { siteData } from '../data/siteData';

const HoverContext = createContext(null);

export function ProjectHoverProvider({ children }) {
  const [activeProject, setActiveProject] = useState(null);
  const timeoutRef = useRef(null);

  const activate = (key) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveProject(key);
  };

  const deactivate = (key) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveProject((current) => (current === key ? null : current));
    }, 50);
  };

  return (
    <HoverContext.Provider value={{ activeProject, activate, deactivate }}>
      {children}
    </HoverContext.Provider>
  );
}

export function useProjectHover() {
  const ctx = useContext(HoverContext);
  if (!ctx) throw new Error('useProjectHover must be used within ProjectHoverProvider');
  return ctx;
}

export function ProjectHoverTarget({ project, children, className = '', as = 'span', ...props }) {
  const { activate, deactivate } = useProjectHover();
  const Component = as;

  return (
    <Component
      className={`project-hover-target ${className}`}
      onMouseEnter={() => activate(project)}
      onMouseLeave={() => deactivate(project)}
      onFocus={() => activate(project)}
      onBlur={() => deactivate(project)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function ProjectHoverStory() {
  const { activeProject } = useProjectHover();
  const story = activeProject ? siteData.hoverStories[activeProject] : null;

  return (
    <div id="project-story" className="project-story">
      <div className="project-story-content" style={{ minHeight: '8rem' }}>
        {story ? (
          <div
            key={activeProject}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              animation: 'flow-token-in 250ms ease-out both',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, color: '#18181b', fontSize: '0.875rem' }}>
                {story.title}
              </span>
              <span style={{ color: '#71717a', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                ({story.duration})
              </span>
            </div>
            {story.paragraphs.map((para, idx) => (
              <p key={idx} style={{ color: '#52525b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {para}
              </p>
            ))}
          </div>
        ) : (
          <div
            key="default-bio"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
              animation: 'flow-token-in 250ms ease-out both',
            }}
          >
            <p style={{ color: '#52525b', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {siteData.author.bio}
            </p>
            <p style={{ color: '#52525b', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {siteData.author.aside}
            </p>
            <p style={{ color: '#52525b', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {siteData.author.activity}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
