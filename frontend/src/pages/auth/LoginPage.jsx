import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import archHaveli from '../../assets/architecture/Queen\'s_haveli_-_Much_kund_-_20210827_174408_HDR.jpg';
import patMandala1 from '../../assets/patterns/2746540.svg';
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side composition */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-background dark:bg-[#24211E] overflow-hidden items-center justify-center border-r border-border-muted dark:border-[#4A443D] select-none" aria-hidden="true">
        {/* Layer 1: Monochrome Queen's Haveli Photo blended into parchment background */}
        <img 
          src={archHaveli} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply dark:mix-blend-screen opacity-[0.67] dark:opacity-[0.24] dark:brightness-[0.55] dark:contrast-[115%] pointer-events-none z-[1]"
          style={{ 
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.40) 70%, rgba(0,0,0,0) 100%)', 
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.40) 70%, rgba(0,0,0,0) 100%)', 
            filter: 'grayscale(100%) contrast(94%) brightness(98%)' 
          }}
        />

        {/* Soft atmospheric gradient wash ensuring complete parchment integration in between image and text */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/40 to-transparent dark:from-[#24211E]/60 dark:via-[#24211E]/20 dark:to-transparent pointer-events-none z-[1]" />

        {/* Layer 2: Dominant Terracotta Mandala (Top-Left corner quadrant crop) */}
        <img 
          src={patMandala1} 
          alt="" 
          className="absolute -top-[160px] -left-[160px] w-[520px] h-[520px] max-w-none opacity-[0.68] dark:opacity-[0.44] pointer-events-none z-[2]"
          style={{ filter: 'brightness(0) saturate(100%) invert(51%) sepia(47%) saturate(1487%) hue-rotate(343deg) brightness(88%) contrast(87%)' }}
        />

        <div className="relative z-10 text-left p-12 max-w-lg">
          <div className="w-12 h-12 bg-primary-soft dark:bg-[#6E4634] text-primary dark:text-[#F4EFE6] rounded-xl flex items-center justify-center mb-6 shadow-sm border border-primary/20">
            <span className="text-xl font-bold">R</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground dark:text-[#F4EFE6] mb-4">Research Portal</h1>
          <p className="text-lg text-[#1C1A18] dark:text-[#B8B0A5] leading-relaxed font-normal">
            A collaborative environment for academic research, planning, and knowledge sharing.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
        {/* Theme toggle */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            type="button"
            onClick={toggleTheme} 
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-foreground-muted dark:text-[#B8B0A5] hover:bg-surface-muted dark:hover:bg-[#34302B] hover:text-foreground dark:hover:text-[#F4EFE6] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-150"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Sign in to access your research projects
            </p>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-surface dark:bg-[#292622] py-8 px-4 shadow-sm border border-border-muted dark:border-[#3D3934] sm:rounded-xl sm:px-10">
              
              {error && (
                <div className="mb-6 flex items-center gap-2.5 p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm font-medium rounded-lg" role="alert">
                  <AlertCircle size={16} className="shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full rounded-md border-[1.5px] border-border-dark dark:border-[#575048] bg-surface dark:bg-[#211F1C] px-3 py-2 text-foreground dark:text-[#F4EFE6] placeholder:text-foreground-muted/70 dark:placeholder-[#8F887E] hover:border-foreground-muted dark:hover:border-[#8F887E] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 sm:text-sm transition-all duration-200"
                    placeholder="you@university.edu"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full rounded-md border-[1.5px] border-border-dark dark:border-[#575048] bg-surface dark:bg-[#211F1C] px-3 py-2 text-foreground dark:text-[#F4EFE6] placeholder:text-foreground-muted/70 dark:placeholder-[#8F887E] hover:border-foreground-muted dark:hover:border-[#8F887E] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 sm:text-sm transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center gap-2 rounded-md bg-primary text-surface dark:text-[#F4EFE6] px-4 py-2.5 text-sm font-semibold border-2 border-border-dark dark:border-[#575048] shadow-doodle-sm hover:bg-primary-hover dark:hover:bg-[#D88959] active:translate-x-[0.5px] active:translate-y-[0.5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <LogIn size={16} aria-hidden="true" />
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-foreground-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-semibold text-primary hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
