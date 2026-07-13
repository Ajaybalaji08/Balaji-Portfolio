import React, { useState, useEffect } from "react";
import { ArrowDown, Bot, Compass, User, Briefcase, Cpu, Award, Github, Sparkles, Clock } from "lucide-react";

// Components
import HeroScene from "./components/HeroScene";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import GitHubDashboard from "./components/GitHubDashboard";
import LinkedInDashboard from "./components/LinkedInDashboard";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatAssistant from "./components/ChatAssistant";
import ScrollReveal from "./components/ScrollReveal";
import OwnerConsole from "./components/OwnerConsole";

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Check URL query parameters for admin mode on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      setIsConsoleOpen(true);
    }
  }, []);

  // Digital Clock telemetry updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Visitor Telemetry Tracking on Mount
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const payload = {
          url: window.location.href,
          referrer: document.referrer || "Direct",
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          deviceType: window.innerWidth < 768 ? "Mobile" : window.innerWidth < 1024 ? "Tablet" : "Desktop",
        };
        
        await fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Visit tracking skipped/failed:", err);
      }
    };

    const timer = setTimeout(trackVisit, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll spy system to track active viewport sections
  useEffect(() => {
    const sections = ["hero", "about", "projects", "skills", "experience", "github", "linkedin", "contact"];
    
    const handleScroll = () => {
      // Find the navbar height to offset spy
      const navbar = document.getElementById("main-navbar");
      const offset = navbar ? navbar.offsetHeight + 100 : 150;
      const scrollPosition = window.scrollY + offset;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen text-slate-300 font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden bg-slate-950">
      
      {/* 3D Immersive Celestial Starfield Background (Persistent) */}
      <HeroScene activeSection={activeSection} />

      {/* Sleek Floated Header */}
      <Navbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* 1. HERO SECTION */}
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center items-center relative px-6 text-center pt-20"
      >
        <div className="max-w-4xl mx-auto space-y-8 z-10 animate-fadeIn">
          
          {/* UTC/Telemetry HUD bar */}
          <div className="inline-flex items-center space-x-4 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>UTC COORDINATE SHIELD</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center space-x-1.5 text-blue-400">
              <Clock size={12} />
              <span>{currentTime || "00:00:00"}</span>
            </span>
          </div>

          {/* Main Display Typography */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-sans font-extrabold tracking-tight text-white select-none">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                AJAY BALAJI
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light font-sans text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Where robust full-stack Java systems, high-performance Spring Boot RESTful APIs, and intelligent deep learning architectures marry beautiful responsive web design.
            </p>
          </div>

          {/* Bullet HUD highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto pt-4 text-xs font-mono text-slate-400">
            <div className="p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-800">
              <span className="block text-white font-bold text-sm">Spring Boot</span>
              <span>Java REST APIs</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-800">
              <span className="block text-white font-bold text-sm">MySQL</span>
              <span>Relational DB</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-800 col-span-2 sm:col-span-1">
              <span className="block text-white font-bold text-sm">Stable Diffusion</span>
              <span>AI Integration</span>
            </div>
          </div>

          {/* Action Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={() => scrollToSection("projects")}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
            >
              <Compass size={16} />
              <span>Explore Ajay's Work</span>
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Bot size={16} className="text-blue-400" />
              <span>Consult AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Scroll anchor tag */}
        <button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-3.5 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all bg-slate-950/60 backdrop-blur-sm cursor-pointer animate-bounce"
          aria-label="Scroll down to About section"
        >
          <ArrowDown size={18} />
        </button>
      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/20 via-purple-500/25 via-pink-500/20 to-transparent" />
      </div>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="min-h-screen py-24 relative flex items-center bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Creative Bio block */}
            <ScrollReveal direction="right" duration={0.8} className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
                <User size={12} />
                <span>Identity</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white leading-tight">
                Engineering the Future, <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">One Experience at a Time</span>
              </h2>
              <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed font-sans">
                I’m <strong className="text-white">Gosu Ajay Balaji</strong> — a Full Stack Java Developer, Creative Web Designer, and AI Enthusiast passionate about building software that is elegant, scalable, and impactful. I believe great technology is more than functional—it should be intuitive, performant, and crafted with purpose.
              </p>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light font-sans">
                With expertise in Java, Spring Boot, React, MySQL, Python, REST APIs, and modern web technologies, I design and develop end-to-end applications that combine robust backend architecture with engaging user experiences. From enterprise-grade CRUD systems and secure APIs to interactive web interfaces, I enjoy turning complex ideas into reliable digital products.
              </p>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light font-sans">
                As a Computer Science and Business Systems graduate, I bring together software engineering principles and business thinking to create solutions that are both technically sound and practically valuable. I continuously explore emerging technologies, including Artificial Intelligence, cloud computing, and modern software architecture, to stay ahead in an ever-evolving digital landscape.
              </p>
              
              {/* Simple metrics */}
              <div className="pt-6 border-t border-slate-900">
                <div>
                  <span className="block text-3xl font-extrabold text-white">R.V.R & J.C</span>
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">College of Engineering</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Aesthetic Wireframe Bento visual card */}
            <ScrollReveal direction="left" delay={0.15} duration={0.8} className="rounded-3xl bg-slate-900/30 backdrop-blur-md border border-slate-800/80 p-8 space-y-8 relative overflow-hidden group w-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-colors" />
              
              <div className="flex items-center space-x-2 text-pink-400 font-mono text-xs uppercase tracking-widest">
                <Sparkles size={12} className="animate-pulse" />
                <span>Philosophical Compass</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-white font-sans">Vision & Mission</h3>
                <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed italic border-l-2 border-pink-500 pl-4 py-1 bg-pink-500/5 rounded-r-xl">
                  "Turning ideas into intelligent software. Engineering experiences that inspire. Building the future with code."
                </p>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  Every project is an opportunity to learn, innovate, and deliver meaningful results. My goal is to build software that not only solves problems but also leaves a lasting impression through performance, usability, and thoughtful design.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800/60">
                <div className="flex items-start space-x-3 text-slate-400 text-sm">
                  <span className="text-blue-400 font-mono font-bold shrink-0">// 01</span>
                  <span><strong>Elegant Software</strong>: Writing pristine, well-structured codebases with industry-standard patterns.</span>
                </div>
                <div className="flex items-start space-x-3 text-slate-400 text-sm">
                  <span className="text-blue-400 font-mono font-bold shrink-0">// 02</span>
                  <span><strong>Intelligent Core</strong>: Utilizing AI workflows, translation layers, and generative modeling integrations.</span>
                </div>
                <div className="flex items-start space-x-3 text-slate-400 text-sm">
                  <span className="text-blue-400 font-mono font-bold shrink-0">// 03</span>
                  <span><strong>Business Synergy</strong>: Bridging tech frameworks and customer-facing business logic seamlessly.</span>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500/20 via-purple-500/25 via-blue-500/20 to-transparent" />
      </div>

      {/* 3. PROJECTS SECTION */}
      <Projects />

      {/* SECTION DIVIDER */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/20 via-indigo-500/25 via-purple-500/20 to-transparent" />
      </div>

      {/* 4. TECH SKILLS SECTION */}
      <Skills />

      {/* SECTION DIVIDER */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/20 via-pink-500/25 via-blue-500/20 to-transparent" />
      </div>

      {/* 5. EXPERIENCE EXPEDITION */}
      <Experience />

      {/* SECTION DIVIDER */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/20 via-purple-500/25 via-pink-500/20 to-transparent" />
      </div>

      {/* 6. GITHUB METRIC MATRIX */}
      <GitHubDashboard />

      {/* SECTION DIVIDER */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500/20 via-purple-500/25 via-blue-500/20 to-transparent" />
      </div>

      {/* 6.5. LINKEDIN PROFESSIONAL MATRIX */}
      <LinkedInDashboard />

      {/* SECTION DIVIDER */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/20 via-indigo-500/25 via-purple-500/20 to-transparent" />
      </div>

      {/* 7. CONTACT / RESUME DOWNLOAD */}
      <Contact />

      {/* FOOTER */}
      <Footer onOpenConsole={() => setIsConsoleOpen(true)} />

      {/* FLOATING CHAT DRAWER */}
      <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* OWNER ADMIN CONSOLE MODAL */}
      <OwnerConsole isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />

    </div>
  );
}
