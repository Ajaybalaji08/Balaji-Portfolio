import { Mail, Linkedin, Github, Terminal } from "lucide-react";

interface FooterProps {
  onOpenConsole?: () => void;
}

export default function Footer({ onOpenConsole }: FooterProps) {
  const socialIcons = [
    { icon: Mail, url: "mailto:ajaybalajigosu31@gmail.com", label: "Email Address" },
    { icon: Linkedin, url: "https://www.linkedin.com/in/ajaybalajigosu/", label: "LinkedIn Profile" },
    { icon: Github, url: "https://github.com/Ajaybalaji08", label: "GitHub Profile" },
  ];

  return (
    <footer className="py-12 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Signoff */}
        <div className="text-center md:text-left space-y-1">
          <p className="text-white font-bold font-sans text-sm tracking-widest">
            AJAY<span className="text-slate-500 font-light"> BALAJI</span>
          </p>
          <p className="text-slate-500 text-xs font-mono">
            Designed & Compiled by Gosu Ajay Balaji // © 2026
          </p>
        </div>

        {/* Social Link circles */}
        <div className="flex items-center space-x-4">
          {socialIcons.map((social, idx) => {
            const Icon = social.icon;
            return (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/30 text-slate-400 hover:text-pink-400 transition-all cursor-pointer"
                aria-label={social.label}
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>

        {/* High-tech status tag / Owner Access Port */}
        <div className="text-center md:text-right">
          <button
            onClick={onOpenConsole}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-pink-400 cursor-pointer transition-all active:scale-95"
            title="Open Control Matrix (Owner Access)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse group-hover:bg-pink-400" />
            <span>Node Core Operational</span>
            <Terminal size={10} className="opacity-60" />
          </button>
        </div>

      </div>
    </footer>
  );
}
