// App.jsx — Root component + router
// React Router v6: <Routes> matches the URL path and renders the right page.
// All context providers wrap the router so every page can access them.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HealthPage from './pages/HealthPage';

export default function App() {
  return (
    // ThemeProvider must wrap everything so any component can call useTheme()
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Phase 1: only the health check page exists */}
          <Route path="/" element={<Navigate to="/health" replace />} />
          <Route path="/health" element={<HealthPage />} />

          {/* Future routes (phases 2-9) will be added here */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
