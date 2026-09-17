import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VideoLoader from './components/VideoLoader';
import CustomCursor from './components/CustomCursor';
import ButterflyGarden from './components/ButterflyGarden';
import { ProjectHoverProvider } from './components/ProjectHoverStory';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import HobbiesPage from './pages/HobbiesPage';

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

  // Autoplay background lofi music by default
  useEffect(() => {
    const audio = document.getElementById('bg-lofi-audio');
    if (!audio) return;
    audio.volume = 0.35;

    const startAudio = () => {
      audio.play()
        .then(() => {
          setSoundEnabled(true);
        })
        .catch(() => {
          // If browser policy delays unprompted autoplay, start seamlessly on first user interaction
          const resumeOnGesture = () => {
            audio.play().then(() => setSoundEnabled(true)).catch(() => {});
            window.removeEventListener('click', resumeOnGesture);
            window.removeEventListener('keydown', resumeOnGesture);
            window.removeEventListener('touchstart', resumeOnGesture);
          };
          window.addEventListener('click', resumeOnGesture, { once: true });
          window.addEventListener('keydown', resumeOnGesture, { once: true });
          window.addEventListener('touchstart', resumeOnGesture, { once: true });
        });
    };

    startAudio();

    const handleSiteReady = () => {
      if (audio.paused) {
        startAudio();
      }
    };
    window.addEventListener('site-ready', handleSiteReady);
    return () => window.removeEventListener('site-ready', handleSiteReady);
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
    if (currentPath === '/hobbies' || currentPath === '/hobbies/') {
      return <HobbiesPage onNavigate={navigate} />;
    }
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <ProjectHoverProvider>
      {/* 2x Video Intro Opening Screen */}
      <VideoLoader />

      {/* Pikachu / Interactive Character Follower Cursor */}
      <CustomCursor />

      {/* Autonomous Butterfly Garden with Smooth Travelling Animation */}
      <ButterflyGarden />

      {/* Persistent Background Lofi Audio Player (Ninja Hattori Soothing Melody) */}
      <audio
        id="bg-lofi-audio"
        src="/audio/ninja-hattori-lofi.mp3"
        loop
        preload="auto"
      />

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
