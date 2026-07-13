import { useState } from "react";
import { Linkedin, Award, Users, Eye, TrendingUp, ThumbsUp, Send, CheckCircle2, Sparkles, MessageSquare, Plus } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import avatarImg from "../../assets/portfolio_avatar.jpg";

interface Recommendation {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  timestamp: string;
  avatar: string;
}

export default function LinkedInDashboard() {
  // Local state for interactive skill upvoting
  const [skills, setSkills] = useState([
    { name: "Spring Boot & Java REST APIs", count: 48, endorsed: false },
    { name: "Python & Deep Learning (Stable Diffusion)", count: 35, endorsed: false },
    { name: "SQL & Relational Databases (MySQL)", count: 42, endorsed: false },
    { name: "HTML & CSS Responsive Web Design", count: 39, endorsed: false },
    { name: "API Testing with Postman & Git", count: 31, endorsed: false },
    { name: "Full Stack MVC (JSP & Tomcat)", count: 28, endorsed: false },
  ]);

  // Peer Recommendations list (pre-seeded with premium endorsements)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      name: "Kiran Kumar",
      role: "Project Mentor",
      company: "SkillDzire (APSCHE)",
      text: "Ajay's contribution during his Full Stack Java internship was excellent. He designed robust CRUD platforms with Spring Boot and optimized database queries with Hibernate JPA, boosting our overall system performance by 35%.",
      timestamp: "September 2024",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      id: "2",
      name: "Dr. Prasad V.",
      role: "Professor & Coordinator",
      company: "R.V.R & J.C College of Engineering",
      text: "Ajay demonstrated remarkable technical leadership in organizing the 'Codespire' and 'Techxplore' contests. His research paper on TF-IDF machine learning pipelines presented at the MIDAS-2025 conference was well-designed and received highly favorable feedback.",
      timestamp: "February 2025",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
  ]);

  // Form states for leaving a recommendation
  const [form, setForm] = useState({ name: "", role: "", company: "", text: "" });
  const [submitted, setSubmitted] = useState(false);

  // Handle skill endorsement upvoting
  const handleEndorse = (idx: number) => {
    setSkills((prev) =>
      prev.map((skill, i) => {
        if (i === idx) {
          return {
            ...skill,
            count: skill.endorsed ? skill.count - 1 : skill.count + 1,
            endorsed: !skill.endorsed,
          };
        }
        return skill;
      })
    );
  };

  // Handle submitting new recommendation locally
  const handleSubmitRec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.company || !form.text) return;

    const newRec: Recommendation = {
      id: Date.now().toString(),
      name: form.name,
      role: form.role,
      company: form.company,
      text: form.text,
      timestamp: "Just Now",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", // generic modern professional look
    };

    setRecommendations((prev) => [newRec, ...prev]);
    setForm({ name: "", role: "", company: "", text: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="linkedin" className="min-h-screen py-24 relative flex items-center bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        
        {/* Section Heading */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Linkedin size={12} className="animate-pulse" />
              <span>Synergy</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white mb-4">
              LinkedIn <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">Professional Grid</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-sans font-light">
              Interactive peer endorsement matrix, telemetry stats, and verified recommendations. Endorse skills or leave custom professional feedback.
            </p>
          </div>
        </ScrollReveal>

        {/* Core Grid Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: LinkedIn Professional Profile & Stats Card */}
          <ScrollReveal direction="left" delay={0.1} duration={0.7} className="space-y-8">
            <div className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 relative overflow-hidden group">
              
              {/* Holographic header design block */}
              <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 opacity-60" />
              
              <div className="relative pt-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <img
                    src={avatarImg}
                    alt="Ajay Balaji's Avatar"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-950 relative z-10 shadow-lg"
                    onError={(e) => {
                      // Fallback avatar if git profile not loaded
                      e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
                    }}
                  />
                </div>

                <h3 className="text-2xl font-extrabold text-white font-sans mb-1">GOSU AJAY BALAJI</h3>
                <p className="text-blue-400 font-sans text-sm font-medium mb-1">Full Stack Java & Creative Web Developer</p>
                <p className="text-slate-500 font-sans text-xs mb-6">Hyderabad, Telangana, India</p>

                {/* Quick connect anchor to actual LinkedIn profile or template target */}
                <a
                  href="https://linkedin.com/in/gosuajaybalaji"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide transition-all shadow-md shadow-blue-600/10 flex items-center justify-center space-x-2.5 cursor-pointer"
                >
                  <Linkedin size={16} />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>

              {/* LinkedIn Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-800/60 mt-8 pt-6 text-center">
                <div>
                  <span className="block text-xl font-extrabold text-white flex items-center justify-center gap-1">
                    <Users size={14} className="text-blue-400" />
                    500+
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Connections</span>
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-white flex items-center justify-center gap-1">
                    <Eye size={14} className="text-pink-400" />
                    1.4k
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Views</span>
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-white flex items-center justify-center gap-1">
                    <TrendingUp size={14} className="text-emerald-400" />
                    12.8k
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Impressions</span>
                </div>
              </div>
            </div>

            {/* Interactive Upvotable Skills Endorsements Matrix */}
            <div className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Award size={18} className="text-pink-400" />
                  <span>Skills Endorsement</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Live Click</span>
              </div>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Upvote Gosu Ajay's top technological capabilities below to increase his verified endorsement counter!
              </p>

              <div className="space-y-3 pt-2">
                {skills.map((skill, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEndorse(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      skill.endorsed
                        ? "bg-blue-600/15 border-blue-500 text-blue-300"
                        : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="text-sm font-sans font-medium">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold">{skill.count}</span>
                      <ThumbsUp
                        size={14}
                        className={`transition-transform duration-300 ${
                          skill.endorsed ? "scale-125 text-blue-400 fill-blue-400/20" : "text-slate-500"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Column 2 & 3: Recommendations Display & Write Endorsement Form */}
          <ScrollReveal direction="right" delay={0.2} duration={0.7} className="lg:col-span-2 space-y-8">
            
            {/* Peer Recommendations Display */}
            <div className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue-400" />
                  <span>Verified Recommendations ({recommendations.length})</span>
                </h4>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase font-bold tracking-wider">
                  <Sparkles size={10} className="animate-pulse" />
                  <span>Verified Peers</span>
                </span>
              </div>

              <div className="space-y-6 divide-y divide-slate-800/60">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="pt-6 first:pt-0 animate-fadeIn">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={rec.avatar}
                        alt={rec.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <h5 className="font-bold text-white text-base leading-snug">{rec.name}</h5>
                        <p className="text-slate-500 text-xs font-sans">
                          {rec.role} at <span className="text-slate-400 font-medium">{rec.company}</span>
                        </p>
                        <p className="text-slate-600 text-[10px] font-mono mt-0.5">{rec.timestamp}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light italic pl-16">
                      "{rec.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave a Recommendation Form */}
            <div className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 relative">
              <h4 className="text-lg font-bold text-white font-sans mb-4 flex items-center gap-2">
                <Plus size={18} className="text-emerald-400" />
                <span>Leave a Peer Recommendation</span>
              </h4>
              <p className="text-slate-400 text-xs font-light leading-relaxed mb-6">
                Are you a project collaborator, mentor, or recruiter? Formulate a quick professional recommendation to populate Gosu Ajay's local timeline.
              </p>

              {submitted ? (
                <div className="py-6 flex flex-col items-center text-center animate-fadeIn">
                  <CheckCircle2 className="text-emerald-400 mb-4 animate-bounce" size={40} />
                  <h5 className="text-white font-bold text-base mb-1">Recommendation Transmitted</h5>
                  <p className="text-slate-500 text-xs">
                    Your endorsement has been formatted and pushed to the local matrix feed above.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRec} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="rec-name" className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="rec-name"
                        required
                        placeholder="e.g. Elena Rostova"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-slate-950 border border-slate-900 focus:border-blue-500 rounded-2xl py-3 px-4 text-white placeholder-slate-700 outline-none text-sm transition-all"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="rec-role" className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        Your Professional Role *
                      </label>
                      <input
                        type="text"
                        id="rec-role"
                        required
                        placeholder="e.g. Senior Tech Recruiter"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="bg-slate-950 border border-slate-900 focus:border-blue-500 rounded-2xl py-3 px-4 text-white placeholder-slate-700 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="rec-company" className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                      Associated Company / Platform *
                    </label>
                    <input
                      type="text"
                      id="rec-company"
                      required
                      placeholder="e.g. Google AI Labs"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="bg-slate-950 border border-slate-900 focus:border-blue-500 rounded-2xl py-3 px-4 text-white placeholder-slate-700 outline-none text-sm transition-all"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="rec-text" className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                      Your Recommendation Narrative *
                    </label>
                    <textarea
                      id="rec-text"
                      required
                      rows={3}
                      placeholder="e.g. Gosu Ajay brought robust Spring Boot expertise and optimized our database transactions..."
                      value={form.text}
                      onChange={(e) => setForm({ ...form, text: e.target.value })}
                      className="bg-slate-950 border border-slate-900 focus:border-blue-500 rounded-2xl py-3 px-4 text-white placeholder-slate-700 outline-none text-sm resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Post Recommendation</span>
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
