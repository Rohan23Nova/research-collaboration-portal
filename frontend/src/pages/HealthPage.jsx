// pages/HealthPage.jsx — System health check page
// Calls GET /api/health and shows server + DB status with visual feedback.
// This is Phase 1's main deliverable — proves the full stack is connected.

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Server, Database, Clock } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

// ── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const ok = status === 'ok' || status === 'connected';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${ok
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
        }`}
    >
      {ok
        ? <CheckCircle size={12} />
        : <XCircle size={12} />
      }
      {ok ? (status === 'ok' ? 'Online' : 'Connected') : status}
    </span>
  );
}

// ── InfoRow ──────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-muted last:border-0">
      <div className="flex items-center gap-2 text-sm text-foreground-muted">
        <Icon size={15} />
        {label}
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function HealthPage() {
  const { theme, toggleTheme } = useTheme();

  // State: null = not fetched yet, object = response data, 'error' = network error
  const [health, setHealth]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  async function fetchHealth() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/health');
      setHealth(res.data);
      setLastFetched(new Date().toLocaleTimeString());
    } catch (err) {
      // The API may return a 503 with a body — use that if available.
      if (err.response?.data) {
        setHealth(err.response.data);
      } else {
        setError(err.message);
      }
      setLastFetched(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  }

  // Fetch on mount
  useEffect(() => {
    fetchHealth();
  }, []);

  const d = health?.data;

  return (
    <div className="min-h-screen bg-surface-muted bg-background flex flex-col">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-10 h-14 border-b border-border-muted
        bg-surface/80 bg-background/80 backdrop-blur-md
        flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary text-surface flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="font-semibold text-foreground text-sm">
            Research Collaboration Portal
          </span>
        </div>
        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-surface-muted dark:hover:bg-[#34302B]
            text-foreground-muted dark:text-[#B8B0A5] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">

          {/* Page title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              System Health
            </h1>
            <p className="text-sm text-foreground-muted mt-1">
              Verifies the API server and database connection
            </p>
          </div>

          {/* ── Status card ── */}
          <div className="bg-surface rounded-xl border border-border-muted
            border-border-muted shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="px-5 py-4 border-b border-border-muted
              flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Health Check
              </span>
              {!loading && lastFetched && (
                <span className="text-xs text-foreground-muted">
                  Last checked: {lastFetched}
                </span>
              )}
            </div>

            {/* Card body */}
            <div className="px-5 py-4">
              {/* Loading skeleton */}
              {loading && (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center py-3
                      border-b border-border-muted last:border-0">
                      <div className="h-4 bg-surface-muted rounded w-28" />
                      <div className="h-5 bg-surface-muted rounded w-20" />
                    </div>
                  ))}
                </div>
              )}

              {/* Network error (couldn't reach server at all) */}
              {!loading && error && (
                <div className="text-center py-6">
                  <XCircle size={40} className="mx-auto mb-3 text-red-500" />
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    Cannot reach server
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">{error}</p>
                  <p className="text-xs text-foreground-muted mt-1">
                    Is the backend running on port 5000?
                  </p>
                </div>
              )}

              {/* Health data */}
              {!loading && health && !error && (
                <div>
                  <InfoRow
                    icon={Server}
                    label="Server status"
                    value={<StatusBadge status={d?.server_status ?? 'unknown'} />}
                  />
                  <InfoRow
                    icon={Database}
                    label="Database"
                    value={<StatusBadge status={d?.db_status ?? 'unknown'} />}
                  />
                  <InfoRow
                    icon={Database}
                    label="DB name"
                    value={d?.db_name ?? '—'}
                  />
                  <InfoRow
                    icon={Server}
                    label="Environment"
                    value={
                      <span className="capitalize px-2 py-0.5 bg-primary-soft dark:bg-[#6E4634]/40
                        text-primary dark:text-[#D88959] rounded text-xs font-medium">
                        {d?.environment ?? '—'}
                      </span>
                    }
                  />
                  <InfoRow
                    icon={Clock}
                    label="Server time"
                    value={d?.timestamp ? new Date(d.timestamp).toLocaleString() : '—'}
                  />

                  {/* DB error message if disconnected */}
                  {d?.db_status === 'disconnected' && d?.error && (
                    <p className="mt-3 text-xs text-red-500 bg-red-50 dark:bg-red-900/20
                      rounded-lg px-3 py-2 font-mono">
                      {d.error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4
              bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed
              text-white text-sm font-medium rounded-lg
              transition-colors duration-150 shadow-sm"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Checking…' : 'Refresh'}
          </button>

          <p className="text-center text-xs text-foreground-muted">
            Phase 1 — Project Setup
          </p>
        </div>
      </main>
    </div>
  );
}
