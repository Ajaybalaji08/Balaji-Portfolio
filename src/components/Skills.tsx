import { Cpu, Terminal, ShieldAlert, Sparkles, Layers } from "lucide-react";
import { SkillCategory } from "../types";
import ScrollReveal from "./ScrollReveal";

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      title: "Core Languages",
      items: [
        { name: "Java (Advanced)", level: 90 },
        { name: "Python", level: 85 },
        { name: "HTML5 / CSS3", level: 90 },
        { name: "JavaScript", level: 75 },
      ]
    },
    {
      title: "Frameworks & Databases",
      items: [
        { name: "Spring Boot", level: 88 },
        { name: "REST APIs", level: 85 },
        { name: "SQL", level: 80 },
        { name: "MySQL", level: 85 },
        { name: "Flask", level: 75 },
        { name: "JPA / Hibernate", level: 80 }
      ]
    },
    {
      title: "Tools & Environments",
      items: [
        { name: "Git & GitHub", level: 90 },
        { name: "Postman API Testing", level: 85 },
        { name: "IntelliJ IDEA", level: 90 },
        { name: "Eclipse / VS Code", level: 85 },
        { name: "Apache Tomcat", level: 75 }
      ]
    }
  ];

  return (
    <section id="skills" className="min-h-screen py-24 relative flex items-center bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        
        {/* Section Heading */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Cpu size={12} className="animate-spin" style={{ animationDuration: "3s" }} />
              <span>Tech Stack</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white mb-4">
              Technical <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Arsenal</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-sans font-light">
              A comprehensive showcase of the programming languages, frameworks, tools, and technologies I use to design, build, and deploy modern, scalable software solutions.
            </p>
          </div>
        </ScrollReveal>

        {/* Skills Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {skillCategories.map((category, idx) => {
            const categoryIcons = [Layers, Terminal, Cpu];
            const CategoryIcon = categoryIcons[idx] || Layers;
            
            return (
              <ScrollReveal
                key={idx}
                direction="up"
                delay={idx * 0.12}
                duration={0.7}
                className="flex"
              >
                <div
                  className="group relative rounded-3xl bg-slate-900/30 backdrop-blur-md border border-slate-800/80 p-8 flex flex-col transition-all duration-300 hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/5 overflow-hidden w-full"
                >
                  {/* Visual top border gradient decoration */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-pink-500 to-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />

                  {/* Category Header */}
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-pink-500/30 transition-all text-pink-400">
                      <CategoryIcon size={20} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white font-sans group-hover:text-pink-400 transition-colors">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills Progress List */}
                  <div className="space-y-6 flex-1">
                    {category.items.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-sans text-sm md:text-base font-medium">
                            {skill.name}
                          </span>
                          <span className="text-slate-500 font-mono text-xs">
                            {skill.level}%
                          </span>
                        </div>
                        
                        {/* Procedural Glowing Progress Meter */}
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-[1px]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative transition-all duration-1000 group-hover:brightness-110"
                            style={{ width: `${skill.level}%` }}
                          >
                            {/* Pulsing light tip on progress bar */}
                            <div className="absolute right-0 top-0 h-full w-2 bg-white blur-[2px] animate-pulse" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
