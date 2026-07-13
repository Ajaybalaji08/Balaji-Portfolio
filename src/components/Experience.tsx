import { Award, Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { ExperienceItem } from "../types";
import ScrollReveal from "./ScrollReveal";

export default function Experience() {
  const experiences: ExperienceItem[] = [
    {
      role: "Full Stack Java Intern",
      company: "SkillDzire (APSCHE)",
      duration: "Jul 2024 - Sep 2024",
      description: "Developed and deployed 3+ full-stack CRUD applications using Spring Boot, reducing manual data entry by 40%. Built RESTful APIs, improving frontend-backend communication speed by 30%. Managed version control using Git and tested APIs with Postman, ensuring 95% bug-free deployment. Collaborated with cross-functional teams, accelerating feature delivery by 20%."
    },
    {
      role: "B.Tech in Computer Science and Business Systems",
      company: "R.V.R & J.C College of Engineering, Guntur",
      duration: "2022 - Present",
      description: "Pursuing undergraduate studies. Studying core subjects including Data Structures, Database Management, Software Engineering, Object Oriented Programming with Java, and modern business ecosystems."
    },
    {
      role: "Host & Coordinator (Codespire & Techxplore)",
      company: "R.V.R & J.C College of Engineering",
      duration: "2024 - 2025",
      description: "Organized 'Codespire' (a competitive coding contest on C and Python) and 'Techxplore' (a technical poster presentation contest), fostering technical creativity, problem-solving, and competitive spirit among 150+ students."
    }
  ];

  return (
    <section id="experience" className="min-h-screen py-24 relative flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        
        {/* Section Heading */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Award size={12} className="animate-bounce" />
              <span>Milestones</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white mb-4">
              Professional <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">Expedition</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-sans font-light">
              A chronological timeline of my roles, impact contributions, and technological achievements in creative development environments.
            </p>
          </div>
        </ScrollReveal>

        {/* Experience Timeline */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical central tracking line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-emerald-500 to-slate-900 opacity-30 transform -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              
              return (
                <ScrollReveal
                  key={idx}
                  direction={isEven ? "right" : "left"}
                  delay={0.1}
                  duration={0.8}
                  className={`flex flex-col md:flex-row items-start md:items-center relative ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Glowing Node */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center transform -translate-x-1/2 z-20 shadow-lg shadow-emerald-400/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  {/* Empty Spacer column for desktop alignment */}
                  <div className="hidden md:block w-1/2" />

                  {/* Experience Card */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-10">
                    <div className="group relative rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/30 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5">
                      
                      {/* Floating Duration Tag */}
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono mb-4">
                        <Calendar size={12} className="text-emerald-400" />
                        <span>{exp.duration}</span>
                      </div>

                      {/* Role & Company */}
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                        {exp.role}
                      </h3>
                      <h4 className="text-slate-400 font-sans text-sm md:text-base font-medium mb-4 flex items-center space-x-2">
                        <Briefcase size={14} className="text-slate-500" />
                        <span>{exp.company}</span>
                      </h4>

                      {/* Description */}
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light mb-4">
                        {exp.description}
                      </p>

                      {/* Impact Checkmarks list (procedural addition for beautiful UI density) */}
                      <div className="flex items-center space-x-2.5 text-xs text-emerald-400/80 font-mono mt-4 pt-4 border-t border-slate-800/60">
                        <CheckCircle2 size={12} className="text-emerald-400" />
                        <span>Verified Professional Contributor</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
