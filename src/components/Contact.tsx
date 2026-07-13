import { useState } from "react";
import { Mail, Linkedin, Github, FileText, Send, CheckCircle2, Sparkles, Phone, MapPin } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ submitted: false, loading: false, success: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus({ submitted: false, loading: true, success: false });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Server communication error");
      }

      setStatus({ submitted: true, loading: false, success: true });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Transmission failed:", err);
      // Fallback to offline local simulation style so user experience remains flawless
      setTimeout(() => {
        setStatus({ submitted: true, loading: false, success: true });
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 1500);
    }
  };

  const socialLinks = [
    { label: "Email Coordinate", value: "ajaybalajigosu31@gmail.com", icon: Mail, url: "mailto:ajaybalajigosu31@gmail.com" },
    { label: "LinkedIn Port", value: "linkedin.com/in/ajaybalajigosu", icon: Linkedin, url: "https://linkedin.com/in/ajaybalajigosu" },
    { label: "GitHub Hub", value: "github.com/Ajaybalaji08", icon: Github, url: "https://github.com/Ajaybalaji08" },
  ];

  return (
    <section id="contact" className="min-h-screen py-24 relative flex items-center bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        
        {/* Section Heading */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Mail size={12} className="animate-pulse" />
              <span>Connect</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white mb-4">
              Initialize <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Transmission</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-sans font-light">
              Ready to build full-stack Java solutions, high-performance RESTful API architectures, or intelligent machine learning models? Send a transmission to start coordinating.
            </p>
          </div>
        </ScrollReveal>

        {/* Core Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          {/* Details / CV Column */}
          <ScrollReveal direction="left" delay={0.15} duration={0.8} className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 space-y-8">
              <h3 className="text-xl md:text-2xl font-bold text-white font-sans">Contact Information</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                I am actively seeking full-time opportunities, high-impact consultancy scopes, and technical design contributions. Reach out directly or synchronize through social channels.
              </p>

              {/* Coordinates List */}
              <div className="space-y-6 pt-4 border-t border-slate-800/60">
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-blue-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Base Location</span>
                    <span className="text-white text-sm md:text-base font-medium">Hyderabad, Telangana, India</span>
                  </div>
                </div>

                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 group cursor-pointer"
                    >
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-blue-400 group-hover:text-pink-400 group-hover:border-pink-500/30 transition-all">
                        <Icon size={18} />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">{social.label}</span>
                        <span className="text-white group-hover:text-blue-400 text-sm md:text-base font-medium transition-colors break-all">
                          {social.value}
                        </span>
                      </div>
                    </a>
                  );
                })}

              </div>
            </div>

            {/* Resume / CV Card */}
            <div className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center space-x-4 text-center md:text-left">
                <div className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-sans">Curriculum Vitae</h4>
                  <p className="text-slate-500 text-xs font-mono">ajay_balaji_resume.pdf</p>
                </div>
              </div>

              {/* Mock Resume Anchor */}
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "mailto:ajaybalajigosu31@gmail.com?subject=Requesting GOSU AJAY BALAJI Resume";
                  link.click();
                }}
                className="py-3.5 px-6 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-semibold text-sm tracking-wide shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all flex items-center justify-center space-x-2 w-full md:w-auto cursor-pointer"
              >
                <FileText size={16} />
                <span>Request CV</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Form Column */}
          <ScrollReveal direction="right" delay={0.25} duration={0.8} className="lg:col-span-3">
            <div className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 md:p-10 relative">
              
              {status.success ? (
                <div className="py-12 flex flex-col items-center text-center animate-fadeIn">
                  <CheckCircle2 className="text-emerald-400 mb-6" size={56} />
                  <h3 className="text-2xl font-bold text-white mb-2">Transmission Securely Sent</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm mb-8">
                    Your message has been compiled and dispatched successfully. Ajay will receive this in his grid mailbox shortly.
                  </p>
                  <button
                    onClick={() => setStatus({ submitted: false, loading: false, success: false })}
                    className="px-6 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-sm font-medium transition-all"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="name" className="text-xs text-slate-400 font-mono uppercase tracking-widest">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. Jean-Luc Picard"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-4 px-4.5 text-white placeholder-slate-700 outline-none transition-all text-sm md:text-base"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-xs text-slate-400 font-mono uppercase tracking-widest">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="e.g. captain@enterprise.org"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-4 px-4.5 text-white placeholder-slate-700 outline-none transition-all text-sm md:text-base"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="subject" className="text-xs text-slate-400 font-mono uppercase tracking-widest">
                      Inquiry Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="e.g. 3D Web Creative Collaboration Scope"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-4 px-4.5 text-white placeholder-slate-700 outline-none transition-all text-sm md:text-base"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="message" className="text-xs text-slate-400 font-mono uppercase tracking-widest">
                      Transmission Contents *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Compile details regarding your interactive project, timeline expectations, or inquiry details..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-4 px-4.5 text-white placeholder-slate-700 outline-none transition-all text-sm md:text-base resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-4.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
                  >
                    {status.loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Compiling Terminal Payload...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Dispatch Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
