import { useState, useEffect } from "react";
import { Menu, X, Bot, Compass, User, Briefcase, Cpu, Award, Github, Linkedin, Mail } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export default function Navbar({ activeSection, onSectionChange, onToggleChat, isChatOpen }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Home", icon: Compass },
    { id: "about", label: "About", icon: User },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "experience", label: "Experience", icon: Award },
    { id: "github", label: "GitHub", icon: Github },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/75 backdrop-blur-md border-b border-slate-800/50 py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("hero")}
          className="flex items-center space-x-2 text-white font-sans text-xl font-bold tracking-wider hover:opacity-90 group cursor-pointer"
        >
          <span className="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-pink-400 transition-colors">
            AJAY
          </span>
          <span className="text-slate-300 font-light">BALAJI</span>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium tracking-wide flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "text-white bg-slate-800/60 border border-blue-500/30 shadow-md shadow-blue-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                <Icon size={15} className={isActive ? "text-blue-400 animate-pulse" : "text-slate-500"} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="h-6 w-[1px] bg-slate-800 mx-2" />

          {/* AI Assistant Toggle Button */}
          <button
            onClick={onToggleChat}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all cursor-pointer border ${
              isChatOpen
                ? "bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/20"
                : "bg-blue-600/80 text-white border-blue-500 hover:bg-blue-500/90 shadow-lg shadow-blue-600/20"
            }`}
          >
            <Bot size={16} className={isChatOpen ? "animate-bounce" : "animate-pulse"} />
            <span>AI Assistant</span>
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center space-x-4 md:hidden">
          {/* AI Assistant Micro Toggle */}
          <button
            onClick={onToggleChat}
            className={`p-2 rounded-full border transition-all ${
              isChatOpen
                ? "bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/20"
                : "bg-blue-600 text-white border-blue-500"
            }`}
            aria-label="Toggle AI Assistant"
          >
            <Bot size={18} className={isChatOpen ? "animate-bounce" : ""} />
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] bg-slate-950/95 backdrop-blur-lg border-t border-slate-900 z-30 px-6 py-8 flex flex-col space-y-4 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full py-3.5 px-5 rounded-xl text-left font-medium text-base flex items-center space-x-4 transition-all ${
                  isActive
                    ? "text-white bg-slate-900 border border-blue-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon size={20} className={isActive ? "text-blue-400" : "text-slate-500"} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="border-t border-slate-900 my-4 pt-4">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onToggleChat();
              }}
              className="w-full py-4 rounded-xl font-medium text-center flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white shadow-lg"
            >
              <Bot size={20} />
              <span>Open AI Assistant</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
