import { useState, useEffect } from "react";
import { Search, GitFork, Star, Users, BookOpen, Layers, Terminal, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { GitHubStats } from "../types";
import ScrollReveal from "./ScrollReveal";

export default function GitHubDashboard() {
  const [username, setUsername] = useState("Ajaybalaji08");
  const [searchVal, setSearchVal] = useState("");
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async (uname: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/github/${uname}`);
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub profile analytics");
      }
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while communicating with GitHub gateway");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(username);
  }, [username]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setUsername(searchVal.trim());
    }
  };

  return (
    <section id="github" className="min-h-screen py-24 relative flex items-center bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        
        {/* Section Heading */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles size={12} className="animate-spin" style={{ animationDuration: "5s" }} />
              <span>Integration</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white mb-4">
              GitHub <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Live Matrix</span>
            </h2>

          </div>
        </ScrollReveal>

        {/* User Search Bar */}
        <ScrollReveal direction="up" delay={0.15} duration={0.6}>
          <div className="max-w-md mx-auto mb-16">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <input
                type="text"
                placeholder="Search GitHub Username..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 focus:border-blue-500 rounded-2xl py-4.5 pl-12 pr-28 text-white placeholder-slate-500 outline-none transition-all text-sm md:text-base font-sans"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                <span>Sync</span>
              </button>
            </form>
          </div>
        </ScrollReveal>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="text-blue-400 animate-spin mb-4" size={48} />
            <p className="text-slate-400 font-mono text-sm animate-pulse">Establishing secure handshake with GitHub gateway...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md mx-auto rounded-3xl bg-red-950/20 border border-red-500/20 p-8 flex flex-col items-center text-center">
            <AlertCircle className="text-red-400 mb-4" size={40} />
            <h3 className="text-white font-bold text-lg mb-2">Sync Connection Interrupted</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {error}. You can retry or search with a different username.
            </p>
            <button
              onClick={() => fetchStats("Ajaybalaji08")}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-sm font-medium transition-all"
            >
              Reset to Default Profile
            </button>
          </div>
        )}

        {/* Dashboard Grid Content */}
        {!loading && !error && stats && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Main stats profile card */}
            <div className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="relative">
                  <img
                    src={stats.avatar_url}
                    alt={`${stats.name}'s Avatar`}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-800 group-hover:border-blue-500 transition-colors shadow-lg"
                  />
                  {stats.is_mock && (
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-pink-500 text-[10px] font-mono text-white tracking-widest uppercase font-extrabold shadow-sm">
                      Cached
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stats.name}</h3>
                  <p className="text-blue-400 font-mono text-sm mb-2">@{stats.username}</p>
                  <p className="text-slate-400 text-sm max-w-md font-light leading-relaxed">{stats.bio}</p>
                </div>
              </div>

              {/* General details */}
              <div className="flex flex-wrap items-center justify-center gap-6 border-t md:border-t-0 border-slate-800 md:pt-0 pt-6 w-full md:w-auto">
                <div className="text-center md:text-right px-4">
                  <span className="block text-2xl font-extrabold text-white">{stats.followers}</span>
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Followers</span>
                </div>
                <div className="h-8 w-[1px] bg-slate-800 hidden md:block" />
                <div className="text-center md:text-right px-4">
                  <span className="block text-2xl font-extrabold text-white">{stats.public_repos}</span>
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Repos</span>
                </div>
              </div>
            </div>

            {/* Stats Cards & Languages Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Star / Fork matrix */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-xs text-slate-500 font-mono uppercase tracking-wider">Repository Stars</span>
                    <span className="block text-3xl font-extrabold text-white">{stats.stars}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Star size={20} className="fill-amber-400/10" />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-xs text-slate-500 font-mono uppercase tracking-wider">Project Forks</span>
                    <span className="block text-3xl font-extrabold text-white">{stats.forks}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <GitFork size={20} />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-xs text-slate-500 font-mono uppercase tracking-wider">Contributions</span>
                    <span className="block text-3xl font-extrabold text-white">{stats.contributions}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Users size={20} />
                  </div>
                </div>

                {/* Recent Repos List */}
                <div className="sm:col-span-3 rounded-3xl bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-8 space-y-6">
                  <div className="flex items-center space-x-2 text-white font-bold text-lg mb-2">
                    <BookOpen size={18} className="text-blue-400" />
                    <span>Recent Repositories</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.recent_repos.map((repo, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-800 flex items-center justify-between transition-all"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-white text-sm md:text-base">{repo.name}</span>
                          <span className="block text-xs font-mono text-slate-500">{repo.language}</span>
                        </div>
                        <div className="flex items-center space-x-3.5 text-xs text-slate-400 font-mono">
                          <div className="flex items-center space-x-1">
                            <Star size={12} className="text-amber-400" />
                            <span>{repo.stars}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitFork size={12} className="text-blue-400" />
                            <span>{repo.forks}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Language split breakdown */}
              <div className="rounded-3xl bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-white font-bold text-lg mb-6">
                    <Terminal size={18} className="text-pink-400" />
                    <span>Language Matrix</span>
                  </div>
                  <div className="space-y-6">
                    {stats.languages.map((lang, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-xs md:text-sm">
                          <span className="text-slate-300 font-medium flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                            <span>{lang.name}</span>
                          </span>
                          <span className="text-slate-500 font-mono">{lang.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ backgroundColor: lang.color, width: `${lang.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-8 border-t border-slate-800/40 mt-8">
                  <p className="text-slate-500 font-mono text-xs">
                    Live Data parsed directly from GitHub API
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
