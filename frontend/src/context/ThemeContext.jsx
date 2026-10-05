// context/ThemeContext.jsx — Light / Dark mode toggle
// We store the theme in localStorage (key: rcp_theme_v2) so it persists.
// The 'dark' class on <html> is what Tailwind's dark: variants check.
// index.html contains a blocking inline script that applies the class before
// first paint to eliminate any flash of wrong theme.

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Wipe any legacy keys from old builds (OS-detection era)
    try { localStorage.removeItem('rcp_theme'); } catch (e) {}
    try { localStorage.removeItem('rcp_theme_mode'); } catch (e) {}

    // Read the v2 key — only set by explicit user toggle
    const saved = localStorage.getItem('rcp_theme_v2');
    // Default is ALWAYS 'light' unless user explicitly chose dark
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Persist the explicit user choice
    localStorage.setItem('rcp_theme_v2', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — components call useTheme() instead of useContext(ThemeContext)
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
