import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'classic-light' | 'midnight-dark' | 'navy-slate';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('hmt_theme') as AppTheme;
    if (saved && (saved === 'classic-light' || saved === 'midnight-dark' || saved === 'navy-slate')) {
      return saved;
    }
    return 'midnight-dark'; // default theme: Midnight Dark
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('hmt_theme', newTheme);
  };

  useEffect(() => {
    // Apply theme class to html / body element
    const root = document.documentElement;
    root.classList.remove('theme-classic-light', 'theme-midnight-dark', 'theme-navy-slate');
    root.classList.add(`theme-${theme}`);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
