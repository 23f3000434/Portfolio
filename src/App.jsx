import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VideoLoader from './components/VideoLoader';
import ButterflyGarden from './components/ButterflyGarden';
import SoundEngine from './components/SoundEngine';
import { ProjectHoverProvider } from './components/ProjectHoverStory';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }
    if (currentPath === '/blog' || currentPath === '/blog/' || currentPath === '/blogs' || currentPath === '/blogs/') {
      return <BlogPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/blog/') || currentPath.startsWith('/blogs/')) {
      const slug = currentPath.replace(/^\/(blog|blogs)\//, '').replace(/\/$/, '');
      return <BlogPostPage slug={slug} onNavigate={navigate} />;
    }
    if (currentPath === '/projects' || currentPath === '/projects/') {
      return <ProjectsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/projects/')) {
      const slug = currentPath.replace('/projects/', '').replace(/\/$/, '');
      return <ProjectDetailPage slug={slug} onNavigate={navigate} />;
    }
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <ProjectHoverProvider>
      {/* 2x Video Intro Opening Screen */}
      <VideoLoader />

      {/* Autonomous Butterfly Garden */}
      <ButterflyGarden />

      {/* Tactile scroll sound synthesis */}
      <SoundEngine enabled={soundEnabled} />

      {/* Main Page Layout */}
      <div className="site-canvas">
        <div className="main-content-column">
          <Navbar
            currentPath={currentPath}
            onNavigate={navigate}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
          {renderPage()}
        </div>
      </div>
    </ProjectHoverProvider>
  );
}
