import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

// Approved monochrome architectural photography (Strictly omitting Khushal Chhabra image per directive)
import archLightcam from '../../assets/architecture/lightcamact-photography--ORVxivcks4-unsplash.jpg';
import archMilin from '../../assets/architecture/milin-john-4VGA0s1Icfs-unsplash.jpg';
import archPeter from '../../assets/architecture/pexels-peter-parker-172082580-35545379.jpg';
import archHaveli from '../../assets/architecture/Queen\'s_haveli_-_Much_kund_-_20210827_174408_HDR.jpg';

// Approved corner pattern overlays (strictly corner-anchored fragments)
import patMandala1 from '../../assets/patterns/2746540.svg';
import patMandala2 from '../../assets/patterns/mandala-svgrepo-com.svg';

import { 
  ArrowRight, 
  ArrowUpRight, 
  Search, 
  Users, 
  FolderGit2, 
  Milestone, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact Terracotta (#C96F3D) color filter from pure black SVG
  const mandalaTerracotta = "brightness(0) saturate(100%) invert(51%) sepia(47%) saturate(1487%) hue-rotate(343deg) brightness(88%) contrast(87%)";

  // Reusable broad feathered mask (derived from the successful My Requests standard)
  const heroFeatheredMask = {
    maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 22%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.28) 75%, rgba(0,0,0,0.06) 90%, rgba(0,0,0,0) 100%)',
    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 22%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.28) 75%, rgba(0,0,0,0.06) 90%, rgba(0,0,0,0) 100%)'
  };

  const editorialPhotoMask = {
    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)'
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-primary-soft selection:text-foreground">
      
      {/* ============================================================
          1. NAVBAR (Clean, compact, editorial, lightly bordered)
         ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-border-muted/70 dark:border-[#3D3934]/70 bg-background/90 dark:bg-[#1C1A18]/90 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left Brand Mark */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft dark:bg-[#6E4634] text-primary dark:text-[#F4EFE6] border border-primary/20 shadow-xs transition-colors duration-200 group-hover:bg-primary group-hover:text-surface">
              <span className="text-sm font-bold tracking-tight">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                Research Collaboration Portal
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground-muted dark:text-[#B8B0A5]">
            <a href="#explore" className="hover:text-foreground dark:hover:text-[#F4EFE6] transition-colors focus:outline-none focus-visible:underline">
              Explore
            </a>
            <a href="#how-it-works" className="hover:text-foreground dark:hover:text-[#F4EFE6] transition-colors focus:outline-none focus-visible:underline">
              How It Works
            </a>
            <a href="#features" className="hover:text-foreground dark:hover:text-[#F4EFE6] transition-colors focus:outline-none focus-visible:underline">
              Features
            </a>
            <a href="#about" className="hover:text-foreground dark:hover:text-[#F4EFE6] transition-colors focus:outline-none focus-visible:underline">
              About
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3.5">
            {/* Theme Toggle Button */}
            <button 
              type="button"
              onClick={toggleTheme} 
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-foreground-muted dark:text-[#B8B0A5] hover:text-foreground dark:hover:text-[#F4EFE6] hover:bg-surface-muted dark:hover:bg-[#24211E] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-150"
            >
              {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="shadow-doodle-sm gap-1.5">
                  Dashboard <ArrowRight size={14} />
                </Button>
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3.5 py-1.5 text-sm font-medium text-foreground-muted hover:text-foreground dark:text-[#B8B0A5] dark:hover:text-[#F4EFE6] transition-colors focus:outline-none focus-visible:underline"
                >
                  Log In
                </Link>
                
                <Link to="/register">
                  <Button size="sm" className="shadow-doodle-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button 
              type="button"
              onClick={toggleTheme} 
              aria-label="Toggle theme"
              className="p-2 rounded-md text-foreground-muted hover:text-foreground"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
              className="p-2 text-foreground-muted hover:text-foreground rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-border-muted dark:border-[#3D3934] bg-surface dark:bg-[#24211E] px-4 pt-3 pb-5 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-foreground-muted">
              <a href="#explore" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">Explore</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">How It Works</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">Features</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">About</a>
            </nav>
            <div className="pt-3 border-t border-border-muted/50 dark:border-[#3D3934]/50 flex gap-3">
              {user ? (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button size="sm" className="w-full justify-center">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="flex-1 text-center py-2 text-sm font-medium border border-border-muted rounded-md text-foreground">
                    Log In
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button size="sm" className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>


      {/* ============================================================
          2. HERO SECTION (Asymmetric editorial composition)
         ============================================================ */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:py-24">
        
        {/* Layer 1: Architectural Photography (Monochrome Lightcam / Hawa Mahal Facade, feathered into parchment) */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
          <img 
            src={archLightcam} 
            alt="" 
            className="absolute top-0 right-0 w-[58vw] min-w-[580px] max-w-[960px] h-full object-cover mix-blend-multiply dark:mix-blend-screen opacity-[0.50] dark:opacity-[0.24] dark:brightness-[0.55] dark:contrast-[115%] hidden md:block"
            style={{ ...heroFeatheredMask, filter: 'grayscale(100%) contrast(96%)' }}
          />
        </div>

        {/* Layer 2: Corner-Anchored Mandala Fragment (Only top-right corner, ~30% visible) */}
        <div className="absolute -top-[240px] -right-[240px] lg:-top-[280px] lg:-right-[280px] pointer-events-none select-none z-[1]" aria-hidden="true">
          <img 
            src={patMandala2} 
            alt="" 
            className="w-[640px] h-[640px] lg:w-[740px] lg:h-[740px] opacity-[0.68] dark:opacity-[0.42]"
            style={{ filter: mandalaTerracotta }}
          />
        </div>

        {/* Hero Content Area */}
        <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl lg:max-w-3xl">
            
            {/* Small Editorial Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary-soft/60 dark:bg-[#6E4634]/40 border border-primary/20 text-primary dark:text-[#D88959] text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Academic Research Collaboration Portal
            </div>

            {/* Main Headline (Lora 600) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-semibold font-serif text-foreground leading-[1.12] tracking-tight mb-6">
              Where research finds its collaborators.
            </h1>

            {/* Secondary Line (DM Sans 400) */}
            <p className="text-lg sm:text-xl text-foreground-muted dark:text-[#B8B0A5] leading-relaxed mb-9 max-w-xl sm:max-w-2xl font-normal">
              Discover researchers, build meaningful academic teams, and move ideas from conversation to collaboration.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link to="/projects">
                <Button size="lg" className="gap-2.5 shadow-doodle">
                  Explore Research <ArrowRight size={18} aria-hidden="true" />
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="secondary" size="lg" className="border-border-dark dark:border-[#575048]">
                  Start Collaborating
                </Button>
              </Link>
            </div>

            {/* Minimal trust annotation */}
            <div className="mt-12 pt-8 border-t border-border-muted/60 dark:border-[#3D3934]/60 flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-foreground-muted dark:text-[#8F887E]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/70" />
                <span>Interdisciplinary Networks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/70" />
                <span>Verified Faculty & Scholars</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/70" />
                <span>Milestone-Driven Workspaces</span>
              </div>
            </div>

          </div>
        </div>

      </section>


      {/* ============================================================
          3. RESEARCH NETWORK / VALUE STRIP
         ============================================================ */}
      <section className="border-y border-border-muted dark:border-[#3D3934] bg-surface/70 dark:bg-[#24211E]/70 py-6 sm:py-8 transition-colors duration-200">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border-muted/50 dark:divide-[#3D3934]/50">
            
            <div className="pt-2 md:pt-0 px-2">
              <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-1">
                DISCOVER RESEARCH
              </p>
              <p className="text-sm font-medium text-foreground-muted dark:text-[#B8B0A5]">
                Cross-domain directory across scientific & computational fields
              </p>
            </div>

            <div className="pt-4 md:pt-0 px-2">
              <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-1">
                CONNECT PEOPLE
              </p>
              <p className="text-sm font-medium text-foreground-muted dark:text-[#B8B0A5]">
                Verified professors, doctoral scholars & specialist researchers
              </p>
            </div>

            <div className="pt-4 md:pt-0 px-2">
              <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-1">
                BUILD TEAMS
              </p>
              <p className="text-sm font-medium text-foreground-muted dark:text-[#B8B0A5]">
                Structured proposals with complementary technical competencies
              </p>
            </div>

            <div className="pt-4 md:pt-0 px-2">
              <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-1">
                MOVE IDEAS FORWARD
              </p>
              <p className="text-sm font-medium text-foreground-muted dark:text-[#B8B0A5]">
                Unified workspace for milestones, documents & progress reports
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================
          4. WHAT THE PLATFORM DOES (PLATFORM FEATURES - #features)
         ============================================================ */}
      <section id="features" className="py-20 sm:py-28 relative overflow-hidden">
        
        {/* Subtle decorative corner mandala fragment (Bottom-Left) */}
        <div className="absolute -bottom-[200px] -left-[200px] pointer-events-none select-none z-0" aria-hidden="true">
          <img 
            src={patMandala1} 
            alt="" 
            className="w-[500px] h-[500px] opacity-[0.25] dark:opacity-[0.08]"
            style={{ filter: mandalaTerracotta }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="max-w-3xl mb-14 sm:mb-16">
            <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-2">
              PLATFORM CAPABILITIES
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight mb-4">
              Research, without the friction.
            </h2>
            <p className="text-base sm:text-lg text-foreground-muted dark:text-[#B8B0A5]">
              Everything you need to discover collaborators, organize projects, and keep research moving.
            </p>
          </div>

          {/* Varied Editorial Feature Grid (Not 4 identical SaaS boxes) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Feature 1: DISCOVER (Featured Large Card - 7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border-[1.5px] border-border-dark dark:border-[#575048] bg-surface dark:bg-[#292622] p-7 sm:p-9 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-doodle-sm">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary dark:bg-[#6E4634] dark:text-[#F4EFE6] text-xs font-semibold mb-6">
                  <Compass size={14} /> Domain & Expertise Discovery
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                  Discover researchers based on domain, skills, and academic profile.
                </h3>
                <p className="text-sm sm:text-base text-foreground-muted dark:text-[#B8B0A5] leading-relaxed mb-8 max-w-xl">
                  Filter verified academic profiles by specialized research domains, demonstrated technical skills, and active interests. Find the exact complementary skills your study requires.
                </p>
              </div>

              {/* Mock Discovery Filter UI preview */}
              <div className="p-4 sm:p-5 rounded-xl bg-surface-muted dark:bg-[#211F1C] border border-border-muted dark:border-[#3D3934] space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-foreground-muted">Popular Domains:</span>
                  <Badge variant="primary">Artificial Intelligence</Badge>
                  <Badge variant="neutral">Computer Vision</Badge>
                  <Badge variant="neutral">Federated Learning</Badge>
                  <Badge variant="neutral">Healthcare Informatics</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border-muted/50 dark:border-[#3D3934]/50">
                  <span className="text-xs font-medium text-foreground-muted">Competencies:</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface dark:bg-[#292622] border border-border-muted dark:border-[#3D3934] text-foreground">PyTorch</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface dark:bg-[#292622] border border-border-muted dark:border-[#3D3934] text-foreground">Graph Neural Networks</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface dark:bg-[#292622] border border-border-muted dark:border-[#3D3934] text-foreground">Biostatistics</span>
                </div>
              </div>
            </div>

            {/* Feature 2: COLLABORATE (Medium Card - 5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border-[1.5px] border-border-dark dark:border-[#575048] bg-surface dark:bg-[#292622] p-7 sm:p-9 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-doodle-sm">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary dark:bg-[#6E4634] dark:text-[#F4EFE6] text-xs font-semibold mb-6">
                  <Users size={14} /> Academic Team Formation
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                  Targeted collaboration requests with clear academic context.
                </h3>
                <p className="text-sm sm:text-base text-foreground-muted dark:text-[#B8B0A5] leading-relaxed mb-6">
                  Send targeted collaboration proposals articulating your research background, technical skills, and planned contribution. Faculty leads review applicants with complete academic context.
                </p>
              </div>

              {/* Mock Collaboration Request Snippet */}
              <div className="p-4 rounded-xl bg-surface-muted dark:bg-[#211F1C] border border-border-muted dark:border-[#3D3934]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground">Request to Join #204</span>
                  <Badge variant="warning">Pending Review</Badge>
                </div>
                <p className="text-xs text-foreground-muted italic line-clamp-2">
                  "I would like to contribute on the ResNet-50 benchmark evaluation and loss function ablation studies..."
                </p>
              </div>
            </div>

            {/* Feature 3: ORGANIZE (Medium Card - 5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border-[1.5px] border-border-dark dark:border-[#575048] bg-surface dark:bg-[#292622] p-7 sm:p-9 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-doodle-sm">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary dark:bg-[#6E4634] dark:text-[#F4EFE6] text-xs font-semibold mb-6">
                  <Milestone size={14} /> Structured Execution
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                  Phased milestones, task assignment, and progress reports.
                </h3>
                <p className="text-sm sm:text-base text-foreground-muted dark:text-[#B8B0A5] leading-relaxed mb-6">
                  Deconstruct complex investigations into actionable milestone deadlines. Assign specific tasks to scholars and collect structured periodic progress summaries.
                </p>
              </div>

              {/* Mock Milestone Progress Bar */}
              <div className="p-4 rounded-xl bg-surface-muted dark:bg-[#211F1C] border border-border-muted dark:border-[#3D3934] space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">Phase 2: Data Preprocessing</span>
                  <span className="text-primary font-bold">85% Complete</span>
                </div>
                <div className="w-full bg-surface dark:bg-[#292622] h-2 rounded-full overflow-hidden border border-border-muted/60">
                  <div className="bg-primary h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            {/* Feature 4: COMMUNICATE (Featured Card - 7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border-[1.5px] border-border-dark dark:border-[#575048] bg-surface dark:bg-[#292622] p-7 sm:p-9 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-doodle-sm">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary dark:bg-[#6E4634] dark:text-[#F4EFE6] text-xs font-semibold mb-6">
                  <FileText size={14} /> Repository & Discussion
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                  Unified documents repository and contextual project discussion.
                </h3>
                <p className="text-sm sm:text-base text-foreground-muted dark:text-[#B8B0A5] leading-relaxed mb-8 max-w-xl">
                  Maintain dataset manifests, methodology notes, and draft preprints in a project document repository. Coordinate daily findings directly inside the project chat tab.
                </p>
              </div>

              {/* Mock Documents preview */}
              <div className="p-4 sm:p-5 rounded-xl bg-surface-muted dark:bg-[#211F1C] border border-border-muted dark:border-[#3D3934] flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface dark:bg-[#292622] border border-border-muted dark:border-[#3D3934] text-xs">
                  <FileText size={16} className="text-primary" />
                  <span className="font-medium text-foreground">dataset_manifest.csv</span>
                  <span className="text-foreground-muted">(14.2 MB)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface dark:bg-[#292622] border border-border-muted dark:border-[#3D3934] text-xs">
                  <FileText size={16} className="text-primary" />
                  <span className="font-medium text-foreground">evaluation_protocol.pdf</span>
                  <span className="text-foreground-muted">(2.1 MB)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ============================================================
          5. HOW IT WORKS (#how-it-works)
         ============================================================ */}
      <section id="how-it-works" className="border-t border-border-muted dark:border-[#3D3934] bg-surface dark:bg-[#24211E] py-20 sm:py-28 transition-colors duration-200">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 sm:mb-20">
            <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-2">
              WORKFLOW ARCHITECTURE
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight mb-4">
              From idea to collaboration.
            </h2>
            <p className="text-base sm:text-lg text-foreground-muted dark:text-[#B8B0A5]">
              A transparent, four-stage workflow designed for academic rigor and peer accountability.
            </p>
          </div>

          {/* Publication-style Numbered Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative flex flex-col justify-between border-t border-border-dark/30 dark:border-[#575048] pt-6">
              <div>
                <span className="font-serif text-4xl sm:text-5xl font-semibold text-primary block mb-4">
                  01
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-2.5">
                  Discover
                </h3>
                <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] leading-relaxed">
                  Explore verified researchers, faculty publications, and active research interests across institutions.
                </p>
              </div>
              <div className="mt-8 text-xs font-semibold text-primary/80 uppercase tracking-wider">
                Phase 1: Discovery
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col justify-between border-t border-border-dark/30 dark:border-[#575048] pt-6">
              <div>
                <span className="font-serif text-4xl sm:text-5xl font-semibold text-primary block mb-4">
                  02
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-2.5">
                  Connect
                </h3>
                <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] leading-relaxed">
                  Send targeted collaboration requests outlining your research background, technical skills, and planned contribution.
                </p>
              </div>
              <div className="mt-8 text-xs font-semibold text-primary/80 uppercase tracking-wider">
                Phase 2: Engagement
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col justify-between border-t border-border-dark/30 dark:border-[#575048] pt-6">
              <div>
                <span className="font-serif text-4xl sm:text-5xl font-semibold text-primary block mb-4">
                  03
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-2.5">
                  Build
                </h3>
                <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] leading-relaxed">
                  Create project workspaces, assemble interdisciplinary teams, and define explicit milestone schedules and duties.
                </p>
              </div>
              <div className="mt-8 text-xs font-semibold text-primary/80 uppercase tracking-wider">
                Phase 3: Formation
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col justify-between border-t border-border-dark/30 dark:border-[#575048] pt-6">
              <div>
                <span className="font-serif text-4xl sm:text-5xl font-semibold text-primary block mb-4">
                  04
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-2.5">
                  Deliver
                </h3>
                <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] leading-relaxed">
                  Track phased milestones, share document repositories, review periodic progress reports, and publish findings.
                </p>
              </div>
              <div className="mt-8 text-xs font-semibold text-primary/80 uppercase tracking-wider">
                Phase 4: Publication
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ============================================================
          6. COLLABORATION WORKSPACE SHOWCASE (Framed Mock Interface)
         ============================================================ */}
      <section id="explore" className="py-20 sm:py-28 relative overflow-hidden bg-background">
        
        {/* Subtle decorative background architecture fragment */}
        <div className="absolute top-0 right-0 w-[45vw] h-full pointer-events-none select-none overflow-hidden opacity-30 dark:opacity-10 z-0" aria-hidden="true">
          <img 
            src={archMilin} 
            alt="" 
            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-screen"
            style={{ ...heroFeatheredMask, filter: 'grayscale(100%) contrast(94%)' }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14 sm:mb-16">
            <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-2">
              WORKSPACE ENVIRONMENT
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight mb-4">
              A dedicated workspace for serious research.
            </h2>
            <p className="text-base sm:text-lg text-foreground-muted dark:text-[#B8B0A5]">
              Built around the actual rhythm of academic teams—from initial literature survey to final publication.
            </p>
          </div>

          {/* Large Framed Mock Workbench Interface */}
          <div className="rounded-2xl border-[2px] border-border-dark dark:border-[#575048] bg-surface dark:bg-[#24211E] shadow-lg overflow-hidden">
            
            {/* Faux Browser Window Header */}
            <div className="h-11 px-4 border-b border-border-muted dark:border-[#3D3934] bg-surface-muted dark:bg-[#211F1C] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400/80 border border-red-500/50" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/50" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 border border-emerald-500/50" />
              </div>
              <div className="text-xs font-mono text-foreground-muted truncate max-w-sm sm:max-w-md px-3 py-1 rounded bg-surface/70 dark:bg-[#292622]/70 border border-border-muted/60">
                portal.research.edu/projects/1/workspace
              </div>
              <div className="w-12 text-right">
                <span className="text-[10px] font-semibold text-primary uppercase">Active</span>
              </div>
            </div>

            {/* Mock Project Title Area */}
            <div className="p-6 sm:p-8 border-b border-border-muted dark:border-[#3D3934]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Badge variant="primary">Active Study</Badge>
                    <span className="text-xs font-semibold text-primary bg-primary-soft dark:bg-[#6E4634] px-2 py-0.5 rounded">
                      Artificial Intelligence
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold font-serif text-foreground">
                    AI-Powered Medical Diagnosis System
                  </h3>
                  <p className="text-sm text-foreground-muted mt-1">
                    Led by <span className="font-medium text-foreground">Dr. Priya Sharma</span> · IIT Delhi · 4 Active Collaborators
                  </p>
                </div>
                
                {/* Mock Tabs Bar */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-surface-muted dark:bg-[#211F1C] border border-border-muted/80">
                  <span className="px-3 py-1 text-xs font-semibold rounded bg-surface dark:bg-[#292622] text-primary shadow-xs">
                    Milestones
                  </span>
                  <span className="px-3 py-1 text-xs font-medium text-foreground-muted">
                    Documents (8)
                  </span>
                  <span className="px-3 py-1 text-xs font-medium text-foreground-muted">
                    Reports (4)
                  </span>
                  <span className="px-3 py-1 text-xs font-medium text-foreground-muted">
                    Discussion
                  </span>
                </div>
              </div>
            </div>

            {/* Mock Workbench Internal Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-background/50 dark:bg-[#1C1A18]/50">
              
              {/* Left Column: Milestones & Reports */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Active Milestone Card */}
                <div className="p-5 rounded-xl border border-border-muted dark:border-[#3D3934] bg-surface dark:bg-[#292622]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Milestone size={18} className="text-primary" />
                      <h4 className="font-semibold text-base text-foreground">
                        Sprint 3: ResNet-50 Benchmark & Class Balancing
                      </h4>
                    </div>
                    <Badge variant="warning">Due Oct 30</Badge>
                  </div>
                  <p className="text-xs text-foreground-muted mb-4">
                    Optimize loss functions on 112,000 chest radiography datasets across rare pulmonary conditions.
                  </p>
                  
                  {/* Task list preview */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-surface-muted/60 dark:bg-[#211F1C]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="line-through text-foreground-muted">Data cleaning pipeline & normalization</span>
                      </div>
                      <span className="text-[10px] text-foreground-muted">Alice Chen</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-surface-muted/60 dark:bg-[#211F1C]">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-primary flex items-center justify-center text-[9px] text-primary">●</span>
                        <span className="text-foreground font-medium">Implement focal loss to mitigate imbalance</span>
                      </div>
                      <Badge variant="primary" className="text-[10px]">In Progress</Badge>
                    </div>
                  </div>
                </div>

                {/* Recent Progress Report Snippet */}
                <div className="p-5 rounded-xl border border-border-muted dark:border-[#3D3934] bg-surface dark:bg-[#292622]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <FileText size={15} className="text-primary" /> Latest Submission · Week 12
                    </span>
                    <span className="text-[11px] text-foreground-muted">Submitted 2 days ago</span>
                  </div>
                  <p className="text-xs text-foreground-muted leading-relaxed italic border-l-2 border-primary/50 pl-3 py-1">
                    "ResNet-50 baseline trained for 30 epochs. Current AUC: 0.87. Identified class imbalance issue with underrepresented pneumonia classes. Implementing weighted focal loss before next test split."
                  </p>
                  <p className="text-[11px] text-foreground-muted mt-2 text-right">
                    — Alice Chen (Graduate Research Scholar)
                  </p>
                </div>

              </div>

              {/* Right Column: Research Team & Repository */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Team Roster */}
                <div className="p-5 rounded-xl border border-border-muted dark:border-[#3D3934] bg-surface dark:bg-[#292622]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-4 flex items-center gap-1.5">
                    <Users size={14} className="text-primary" /> Research Collaborators
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-soft dark:bg-[#6E4634] text-primary dark:text-[#F4EFE6] font-semibold text-xs flex items-center justify-center">
                        PS
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground">Dr. Priya Sharma</p>
                        <p className="text-[11px] text-foreground-muted">Principal Investigator · IIT Delhi</p>
                      </div>
                      <Badge variant="primary" className="text-[10px]">Lead</Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-muted text-foreground font-semibold text-xs flex items-center justify-center border border-border-muted">
                        AC
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground">Alice Chen</p>
                        <p className="text-[11px] text-foreground-muted">PhD Candidate · Model Architecture</p>
                      </div>
                      <Badge variant="neutral" className="text-[10px]">Member</Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-muted text-foreground font-semibold text-xs flex items-center justify-center border border-border-muted">
                        VP
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground">Vikram Patel</p>
                        <p className="text-[11px] text-foreground-muted">Clinical Radiologist · AI Validation</p>
                      </div>
                      <Badge variant="neutral" className="text-[10px]">Member</Badge>
                    </div>
                  </div>
                </div>

                {/* Document Repository */}
                <div className="p-5 rounded-xl border border-border-muted dark:border-[#3D3934] bg-surface dark:bg-[#292622]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-3 flex items-center gap-1.5">
                    <FolderGit2 size={14} className="text-primary" /> Active Document Versions
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-surface-muted/60 dark:bg-[#211F1C]">
                      <span className="font-medium text-foreground truncate">radiology_cohort_v2.csv</span>
                      <span className="text-[10px] text-foreground-muted shrink-0">v1.2 · 42 MB</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-surface-muted/60 dark:bg-[#211F1C]">
                      <span className="font-medium text-foreground truncate">model_architecture_spec.pdf</span>
                      <span className="text-[10px] text-foreground-muted shrink-0">v2.0 · 3.4 MB</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ============================================================
          7. INDIAN ARCHITECTURAL EDITORIAL SECTION (#about)
         ============================================================ */}
      <section id="about" className="relative py-28 sm:py-36 overflow-hidden border-t border-border-muted dark:border-[#3D3934] bg-surface dark:bg-[#211F1C] transition-colors duration-200">
        
        {/* Full-width Monochrome Architectural Photography Layer (Peter Stepwell Geometry) */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
          <img 
            src={archPeter} 
            alt="" 
            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-screen opacity-[0.38] dark:opacity-[0.18] dark:brightness-[0.55] dark:contrast-[120%]"
            style={{ ...editorialPhotoMask, filter: 'grayscale(100%) contrast(98%)' }}
          />
        </div>

        {/* Editorial Text Statement */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-block w-12 h-1 bg-primary mb-8 rounded-full" />
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold font-serif text-foreground tracking-tight leading-[1.2] mb-8">
            “Research grows through exchange.”
          </h2>
          
          <p className="text-lg sm:text-2xl text-foreground-muted dark:text-[#B8B0A5] font-normal leading-relaxed max-w-2xl mx-auto">
            The strongest ideas rarely exist in isolation. They emerge when different perspectives, disciplines, and people meet.
          </p>

          <div className="mt-10 text-xs font-semibold uppercase tracking-widest text-primary">
            Academic Collaboration Manifesto
          </div>

        </div>

      </section>


      {/* ============================================================
          8. FINAL CTA
         ============================================================ */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-background border-t border-border-muted dark:border-[#3D3934]">
        
        {/* Corner-Anchored Mandala Fragment (Bottom-Right, ~30% visible) */}
        <div className="absolute -bottom-[220px] -right-[220px] pointer-events-none select-none z-0" aria-hidden="true">
          <img 
            src={patMandala1} 
            alt="" 
            className="w-[620px] h-[620px] opacity-[0.65] dark:opacity-[0.38]"
            style={{ filter: mandalaTerracotta }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-3xl">
            
            <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-3">
              BEGIN COLLABORATING
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-serif text-foreground tracking-tight leading-tight mb-5">
              Your next research collaboration could start here.
            </h2>

            <p className="text-base sm:text-lg text-foreground-muted dark:text-[#B8B0A5] leading-relaxed mb-9 max-w-xl">
              Discover people, ideas, and projects worth building together. Connect with faculty guides, student peers, and cross-disciplinary researchers.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/projects">
                <Button size="lg" className="gap-2.5 shadow-doodle">
                  Explore Research <ArrowRight size={18} aria-hidden="true" />
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="secondary" size="lg" className="border-border-dark dark:border-[#575048]">
                  Create Your Profile
                </Button>
              </Link>
            </div>

          </div>
        </div>

      </section>


      {/* ============================================================
          9. FOOTER (Quiet, minimal, academic)
         ============================================================ */}
      <footer className="border-t border-border-muted dark:border-[#3D3934] bg-surface dark:bg-[#1C1A18] py-14 sm:py-16 transition-colors duration-200">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-border-muted/60 dark:border-[#3D3934]/60">
            
            {/* Left Brand Col (2 cols on md) */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft dark:bg-[#6E4634] text-primary dark:text-[#F4EFE6] border border-primary/20 shadow-xs">
                  <span className="text-xs font-bold">R</span>
                </div>
                <span className="text-base font-semibold text-foreground">
                  Research Collaboration Portal
                </span>
              </div>
              <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] max-w-sm leading-relaxed">
                A unified editorial platform for discovering researchers, organizing interdisciplinary studies, and tracking scientific milestones.
              </p>
            </div>

            {/* Links Col 1: Explore */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Explore
              </h4>
              <ul className="space-y-2 text-sm text-foreground-muted dark:text-[#B8B0A5]">
                <li><Link to="/projects" className="hover:text-primary transition-colors">Browse Projects</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Research Domains</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">Join as Researcher</Link></li>
              </ul>
            </div>

            {/* Links Col 2: Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Platform
              </h4>
              <ul className="space-y-2 text-sm text-foreground-muted dark:text-[#B8B0A5]">
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Links Col 3: Academic */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Governance
              </h4>
              <ul className="space-y-2 text-sm text-foreground-muted dark:text-[#B8B0A5]">
                <li><span className="hover:text-primary cursor-pointer transition-colors">Academic Ethics</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Institutional Access</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Terms & Privacy</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-muted dark:text-[#8F887E]">
            <p>© {new Date().getFullYear()} Research Collaboration Portal. Designed for interdisciplinary academic research.</p>
            <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-foreground">Portal Login</Link>
              <Link to="/register" className="hover:text-foreground">Institutional Registration</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
