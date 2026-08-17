import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';

// Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { HyipsPage } from './pages/HyipsPage.tsx';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage.tsx';
import { NewProjectsPage } from './pages/NewProjectsPage.tsx';
import { EventsPage } from './pages/EventsPage.tsx';
import { MonitorsPage } from './pages/MonitorsPage.tsx';
import { WatchlistPage } from './pages/WatchlistPage.tsx';
import { ComparePage } from './pages/ComparePage.tsx';
import { StatisticsPage } from './pages/StatisticsPage.tsx';
import { ReviewsPage } from './pages/ReviewsPage.tsx';
import { AdvertisePage, AddProjectPage } from './pages/AdvertisePage.tsx';
import { AboutPage, ContactPage, DisclaimerPage } from './pages/AboutPage.tsx';
import { LoginPage, RegisterPage, ProfilePage } from './pages/LoginPage.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { GoofyBackgroundEffects } from './components/common/GoofyBackgroundEffects.tsx';
import { GoofyFloatingMascot } from './components/common/GoofyFloatingMascot.tsx';

function MainApp() {
  const { theme } = useTheme();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderRoute = () => {
    const [pathOnly] = currentPath.split('?');

    if (pathOnly === '/' || pathOnly === '') {
      return <LandingPage navigate={navigate} />;
    }
    if (pathOnly === '/directory' || pathOnly === '/all') {
      return <HomePage navigate={navigate} />;
    }
    if (pathOnly === '/hyips') {
      return <HyipsPage navigate={navigate} />;
    }
    if (pathOnly.startsWith('/hyips/')) {
      const slug = pathOnly.replace('/hyips/', '');
      return <ProjectDetailsPage slug={slug} navigate={navigate} />;
    }
    if (pathOnly.startsWith('/project/')) {
      const slug = pathOnly.replace('/project/', '');
      return <ProjectDetailsPage slug={slug} navigate={navigate} />;
    }
    if (pathOnly === '/new-projects') {
      return <NewProjectsPage navigate={navigate} />;
    }
    if (pathOnly === '/paying') {
      return <HyipsPage navigate={navigate} initialStatus="PAYING" />;
    }
    if (pathOnly === '/problems') {
      return <HyipsPage navigate={navigate} initialStatus="PROBLEM" />;
    }
    if (pathOnly === '/compare') {
      return <ComparePage navigate={navigate} />;
    }
    if (pathOnly === '/statistics') {
      return <StatisticsPage navigate={navigate} />;
    }
    if (pathOnly === '/monitors') {
      return <MonitorsPage navigate={navigate} />;
    }
    if (pathOnly === '/events') {
      return <EventsPage navigate={navigate} />;
    }
    if (pathOnly === '/reviews') {
      return <ReviewsPage navigate={navigate} />;
    }
    if (pathOnly === '/watchlist') {
      return <WatchlistPage navigate={navigate} />;
    }
    if (pathOnly === '/advertise') {
      return <AdvertisePage navigate={navigate} />;
    }
    if (pathOnly === '/add-project') {
      return <AddProjectPage navigate={navigate} />;
    }
    if (pathOnly === '/about') {
      return <AboutPage navigate={navigate} />;
    }
    if (pathOnly === '/contact') {
      return <ContactPage navigate={navigate} />;
    }
    if (pathOnly === '/disclaimer') {
      return <DisclaimerPage navigate={navigate} />;
    }
    if (pathOnly === '/login') {
      return <LoginPage navigate={navigate} />;
    }
    if (pathOnly === '/register') {
      return <RegisterPage navigate={navigate} />;
    }
    if (pathOnly === '/profile') {
      return <ProfilePage navigate={navigate} />;
    }
    if (pathOnly === '/admin') {
      return <AdminDashboard navigate={navigate} />;
    }

    // Default fallback
    return <HomePage navigate={navigate} />;
  };

  const getThemeWrapperClass = () => {
    if (theme === 'midnight-dark') {
      return 'bg-[#090d16] text-slate-100';
    }
    if (theme === 'navy-slate') {
      return 'bg-[#0f172a] text-slate-100';
    }
    // Classic Light (Master theme matching screenshot)
    return 'bg-[#ebedf0] text-[#1e293b]';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 relative ${getThemeWrapperClass()}`}>
      <GoofyBackgroundEffects />
      <Header currentPath={currentPath} navigate={navigate} />
      <main className="flex-1 pb-12 relative z-10">{renderRoute()}</main>
      <Footer navigate={navigate} />
      <GoofyFloatingMascot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}
