import { ExternalLink, Github, Sparkles, CheckCircle2 } from "lucide-react";
import { Project } from "../types";
import ScrollReveal from "./ScrollReveal";

export default function Projects() {
  const projectsList: Project[] = [
    {
      name: "MyDiary — Secure Personal Diary Platform",
      tech: ["Java", "Spring Boot", "Hibernate JPA", "JSP", "MySQL", "Apache Tomcat"],
      description: "Designed and developed a full-stack personal diary application that enables users to securely create, organize, edit, and manage personal notes through an intuitive interface. Built using Spring Boot with Hibernate JPA and MySQL, the application follows modern MVC architecture while providing reliable CRUD operations and efficient database management.",
      github: "https://github.com/Ajaybalaji08",
      link: "#",
      linkLabel: "🚀 Live Demo",
      highlights: [
        "Secure user authentication",
        "Complete CRUD functionality",
        "Optimized database interactions",
        "Responsive user interface",
        "Clean MVC architecture"
      ]
    },
    {
      name: "Multilingual AI Text-to-Image Generator",
      tech: ["Python", "Flask", "Stable Diffusion", "Google Translate API"],
      description: "Built an AI-powered web application that transforms multilingual text prompts into AI-generated artwork using Stable Diffusion. The platform integrates language translation, making creative AI accessible to users across multiple languages.",
      github: "https://github.com/Ajaybalaji08",
      link: "#",
      linkLabel: "🚀 Live Demo",
      highlights: [
        "AI image generation",
        "Multilingual prompt support",
        "Real-time image creation",
        "Interactive web interface",
        "AI model integration"
      ]
    },
    {
      name: "AI Job Title Prediction System",
      tech: ["Python", "Scikit-learn", "TF-IDF", "SVM", "Gradient Boosting", "KNN"],
      description: "Developed a Natural Language Processing pipeline that predicts professional job titles from resume content using TF-IDF feature extraction and machine learning models. The research was presented at the MIDAS-2025 International Conference.",
      github: "https://github.com/Ajaybalaji08",
      link: "#",
      linkLabel: "📄 Research Paper",
      highlights: [
        "Resume text classification",
        "NLP feature engineering",
        "Multiple ML algorithms",
        "Model evaluation",
        "Research publication"
      ]
    }
  ];

  return (
    <section id="projects" className="min-h-screen py-24 relative flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        
        {/* Section Heading */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles size={12} className="animate-pulse" />
              <span>Showcase</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white mb-4">
              Featured <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto font-sans font-light leading-relaxed">
              A curated collection of full-stack applications, AI-powered solutions, research-driven innovations, and immersive digital experiences. Every project represents my passion for solving real-world problems through clean architecture, modern technologies, and thoughtful design.
            </p>
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projectsList.map((project, idx) => (
            <ScrollReveal
              key={idx}
              direction="up"
              delay={idx * 0.15}
              duration={0.7}
              className="flex"
            >
              <div
                className="group relative rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-blue-500/30 p-8 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-6px] hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden w-full"
              >
                {/* Background gradient flare */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-colors" />

                <div>
                  {/* Visual Indicator of Project */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                      Project // 0{idx + 1}
                    </span>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 group-hover:scale-125 group-hover:bg-pink-500 transition-all duration-300" />
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-snug">
                    {project.name}
                  </h3>

                  {/* Project Description */}
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-light mb-6">
                    {project.description}
                  </p>

                  {/* Highlights section */}
                  {project.highlights && (
                    <div className="mb-6">
                      <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2.5">
                        Highlights
                      </span>
                      <ul className="space-y-1.5">
                        {project.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                            <CheckCircle2 size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech Badges */}
                  <div className="mb-8">
                    <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2.5">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((techItem, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-900 text-[10px] font-mono group-hover:border-blue-500/20 transition-all"
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 border-t border-slate-800/60 pt-6">
                  {project.link && (
                    <a
                      href={project.link}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-600/10 group-hover:shadow-blue-600/20"
                    >
                      <ExternalLink size={14} />
                      <span>{project.linkLabel || "Launch App"}</span>
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-400 text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
                      aria-label="View source on GitHub"
                    >
                      <Github size={14} />
                      <span>Source</span>
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
