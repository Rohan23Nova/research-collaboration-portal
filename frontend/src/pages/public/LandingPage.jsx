// frontend/src/pages/public/LandingPage.jsx
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight, BookOpen, Users, Milestone, ShieldCheck, Sun, Moon } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
              <span className="text-lg font-bold text-white">R</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Research Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Log in</Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            Accelerate <span className="text-indigo-600 dark:text-indigo-500">Research</span> Collaboration
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            A unified platform for student researchers, faculty guides, and external experts to manage projects, track milestones, and share knowledge.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Start Collaborating <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Everything you need to publish faster</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={BookOpen} 
              title="Project Workspaces" 
              desc="Centralized repositories for project descriptions, domains, and required skills." 
            />
            <FeatureCard 
              icon={Users} 
              title="Team Management" 
              desc="Seamlessly handle collaboration requests, roles, and project member access." 
            />
            <FeatureCard 
              icon={Milestone} 
              title="Milestone Tracking" 
              desc="Break down research into actionable tasks and track progress reports." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Role-Based Security" 
              desc="Strict RBAC ensuring faculty, students, and admins only see what they should." 
            />
          </div>
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6 shadow-sm">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <Icon size={20} />
      </div>
      <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
}
