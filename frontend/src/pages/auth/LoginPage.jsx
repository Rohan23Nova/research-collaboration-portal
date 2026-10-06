import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import archHarsh from '../../assets/architecture/pexels-harsh-kukadiya-244412142-37415415.jpg';
import patMandala1 from '../../assets/patterns/2746540.svg';
import patMandala2 from '../../assets/patterns/mandala-svgrepo-com.svg';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // Terracotta (#C96F3D) filter from pure black SVG vector
  const mandalaTerracotta = "brightness(0) saturate(100%) invert(51%) sepia(47%) saturate(1487%) hue-rotate(343deg) brightness(88%) contrast(87%)";

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden flex flex-col justify-between selection:bg-primary/20 selection:text-foreground">
      {/* ============================================================== */}
      {/* 1. BACKGROUND COMPOSITION (Unified Full-Viewport Flow)          */}
      {/* ============================================================== */}

      {/* Layer 1: Monochrome Hawa Mahal Architecture (Feathered seamlessly from right to left) */}
      <img 
        src={archHarsh} 
        alt="" 
        className="absolute top-0 right-0 w-[64vw] lg:w-[60vw] xl:w-[56vw] min-w-[560px] max-w-[1100px] h-full object-cover pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-[0.48] dark:opacity-[0.22] dark:brightness-[0.55] dark:contrast-[115%] select-none z-[1]"
        style={{ 
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.90) 22%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.22) 76%, rgba(0,0,0,0.04) 92%, rgba(0,0,0,0) 100%)', 
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.90) 22%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.22) 76%, rgba(0,0,0,0.04) 92%, rgba(0,0,0,0) 100%)', 
          filter: 'grayscale(100%) contrast(96%) brightness(98%)' 
        }}
        aria-hidden="true"
      />

      {/* Dark mode atmospheric tone wash */}
      <div className="absolute inset-0 bg-transparent dark:bg-black/30 pointer-events-none z-[1]" aria-hidden="true" />

      {/* Layer 2: Primary Terracotta Mandala (Top-Left corner quadrant entering viewport) */}
      <img 
        src={patMandala1} 
        alt="" 
        className="absolute -top-[180px] -left-[180px] sm:-top-[220px] sm:-left-[220px] lg:-top-[240px] lg:-left-[240px] w-[500px] h-[500px] lg:w-[580px] lg:h-[580px] max-w-none opacity-[0.34] dark:opacity-[0.18] pointer-events-none select-none z-[2]"
        style={{ filter: mandalaTerracotta }}
        aria-hidden="true"
      />

      {/* Layer 3: Subtle Secondary Mandala Fragment (Bottom-Right corner) */}
      <img 
        src={patMandala2} 
        alt="" 
        className="hidden sm:block absolute -bottom-[160px] -right-[160px] lg:-bottom-[200px] lg:-right-[200px] w-[380px] h-[380px] lg:w-[440px] lg:h-[440px] max-w-none opacity-[0.10] dark:opacity-[0.06] pointer-events-none select-none z-[2]"
        style={{ filter: mandalaTerracotta }}
        aria-hidden="true"
      />

      {/* ============================================================== */}
      {/* 2. TOP EDITORIAL BAR                                            */}
      {/* ============================================================== */}
      <header className="relative z-20 w-full px-6 sm:px-10 lg:px-16 pt-5 sm:pt-6 lg:pt-7 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Return to Research Collaboration Portal Home"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/15 group-hover:ring-primary/30 transition-all duration-200" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-foreground leading-none">
              Research Collaboration Portal
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-foreground-muted font-sans font-medium mt-1">
              Academic Exchange &amp; Discovery
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:inline-flex items-center text-xs font-semibold text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-surface/70 dark:hover:bg-[#292622]/70 border border-transparent hover:border-border-muted dark:hover:border-[#3D3934] transition-all duration-150"
          >
            ← Back to portal
          </Link>

          <button 
            type="button"
            onClick={toggleTheme} 
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2.5 rounded-xl text-foreground-muted dark:text-[#B8B0A5] bg-surface/85 dark:bg-[#292622]/85 hover:bg-surface dark:hover:bg-[#34302B] hover:text-foreground dark:hover:text-[#F4EFE6] border border-border-muted dark:border-[#3D3934] shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-150"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 3. MAIN ASYMMETRIC CONTENT                                      */}
      {/* ============================================================== */}
      <main className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 my-auto py-6 sm:py-8 lg:py-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 xl:gap-16">
        
        {/* Left Side: Editorial Identity & Scholarly Quote Block */}
        <div className="w-full lg:max-w-lg xl:max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold uppercase tracking-[0.2em] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
            Academic &amp; Scholarly Network
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold text-foreground leading-[1.18] tracking-tight mb-5">
            Where ideas meet the people who can build them.
          </h2>

          <p className="text-base sm:text-lg text-foreground-muted dark:text-[#B8B0A5] leading-relaxed font-sans max-w-md mb-7">
            An interdisciplinary workspace connecting university faculty, researchers, and students to form scholarly teams, publish proposals, and build collaborative research.
          </p>

          <div className="pt-6 border-t border-border-muted/70 dark:border-[#3D3934] grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div className="font-serif text-2xl font-bold text-foreground">450+</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-foreground-muted dark:text-[#8F887E] mt-0.5">
                Projects
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-foreground">30+</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-foreground-muted dark:text-[#8F887E] mt-0.5">
                Institutions
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-foreground">100%</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-foreground-muted dark:text-[#8F887E] mt-0.5">
                Verified
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Refined Paper-like Login Panel */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0">
          <div className="w-full sm:w-[420px] lg:w-[440px] bg-[#FFFDF8] dark:bg-[#292622] rounded-2xl border border-[#D8D1C5] dark:border-[#575048] shadow-[0_8px_32px_rgba(23,23,23,0.06),0_2px_8px_rgba(23,23,23,0.04)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)] p-8 sm:p-10 transition-all duration-200">
            
            {/* Panel Header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted dark:text-[#B8B0A5]">
                  Workspace Access
                </span>
              </div>
              <h1 className="font-serif text-[32px] sm:text-[34px] font-semibold text-foreground dark:text-[#F4EFE6] tracking-tight leading-tight">
                Welcome back.
              </h1>
              <p className="mt-2 text-sm sm:text-[15px] text-foreground-muted dark:text-[#B8B0A5] leading-normal font-sans">
                Sign in to continue to your research workspace.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div 
                className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm font-medium rounded-xl" 
                role="alert"
              >
                <AlertCircle size={17} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" aria-hidden="true" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label 
                  htmlFor="login-email" 
                  className="block text-xs font-semibold text-foreground dark:text-[#F4EFE6] uppercase tracking-wider mb-2 font-sans"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full h-[50px] rounded-xl border border-[#D8D1C5] dark:border-[#575048] bg-[#FAF7F0] dark:bg-[#211F1C] px-4 text-sm text-foreground dark:text-[#F4EFE6] placeholder:text-foreground-muted/50 dark:placeholder-[#8F887E] hover:border-foreground-muted/70 dark:hover:border-[#8F887E] focus:outline-none focus:border-[#C96F3D] focus:ring-2 focus:ring-[#C96F3D]/20 transition-all duration-150 font-sans"
                  placeholder="you@university.edu"
                />
              </div>

              <div>
                <label 
                  htmlFor="login-password" 
                  className="block text-xs font-semibold text-foreground dark:text-[#F4EFE6] uppercase tracking-wider mb-2 font-sans"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full h-[50px] rounded-xl border border-[#D8D1C5] dark:border-[#575048] bg-[#FAF7F0] dark:bg-[#211F1C] px-4 text-sm text-foreground dark:text-[#F4EFE6] placeholder:text-foreground-muted/50 dark:placeholder-[#8F887E] hover:border-foreground-muted/70 dark:hover:border-[#8F887E] focus:outline-none focus:border-[#C96F3D] focus:ring-2 focus:ring-[#C96F3D]/20 transition-all duration-150 font-sans"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] flex items-center justify-center gap-2 rounded-xl bg-[#C96F3D] hover:bg-[#A9552C] active:bg-[#964720] text-white text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96F3D] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#292622] font-sans"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <LogIn size={16} aria-hidden="true" />
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </form>

            {/* Understated Register Link */}
            <div className="mt-8 pt-6 border-t border-border-muted/60 dark:border-[#3D3934] text-center">
              <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] font-sans">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-[#C96F3D] hover:text-[#A9552C] dark:hover:text-[#D88959] underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors duration-150"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* 4. RESTRAINED ACADEMIC FOOTER                                    */}
      {/* ============================================================== */}
      <footer className="relative z-20 w-full px-6 sm:px-10 lg:px-16 pb-5 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground-muted dark:text-[#8F887E] font-sans">
        <div>
          &copy; {new Date().getFullYear()} Research Collaboration Portal. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-[11px] tracking-wide">
          <span>Peer Review Standards</span>
          <span aria-hidden="true">•</span>
          <span>Inter-University Network</span>
        </div>
      </footer>
    </div>
  );
}
