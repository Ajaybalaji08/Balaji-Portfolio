import { useState, useEffect } from "react";
import { 
  X, Lock, Unlock, Terminal, Eye, Mail, Trash2, 
  AlertCircle, Monitor, Globe, LogOut, Calendar, RefreshCw 
} from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

interface Visit {
  id: string;
  ip: string;
  userAgent: string;
  url: string;
  referrer: string;
  screenResolution: string;
  deviceType: string;
  timestamp: string;
}

interface OwnerConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OwnerConsole({ isOpen, onClose }: OwnerConsoleProps) {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"visits" | "inbox">("visits");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Check URL query parameter on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      // Auto-focus or alert that admin parameter is present
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        setIsAuthorized(true);
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error || "Access Denied: Invalid Terminal Passcode");
      }
    } catch (err) {
      setError("Failed to authenticate with server gateway.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const subRes = await fetch(`/api/admin/submissions?passcode=${encodeURIComponent(passcode)}`);
      const visitRes = await fetch(`/api/admin/visits?passcode=${encodeURIComponent(passcode)}`);

      if (subRes.ok && visitRes.ok) {
        const subs = await subRes.json();
        const vsts = await visitRes.json();
        
        // Sort descending by timestamp
        setSubmissions(subs.reverse());
        setVisits(vsts.reverse());
      }
    } catch (err) {
      console.error("Failed to sync matrix telemetry:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearVisits = async () => {
    if (!window.confirm("Are you sure you want to flush all visitor tracking history?")) return;
    
    try {
      const res = await fetch("/api/admin/clear-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        setVisits([]);
      }
    } catch (err) {
      alert("Failed to wipe visits databases.");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPasscode("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900/90 border border-slate-800/80 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-blue-500/5">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 p-6 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Terminal size={18} />
            </div>
            <div>
              <h3 className="text-white font-sans font-bold text-lg">Ajay Balaji Control Matrix</h3>
              <p className="text-slate-500 text-xs font-mono">Secure Node Operations // v1.2.0</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Console Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {!isAuthorized ? (
            /* Authentication Terminal Screen */
            <div className="max-w-md mx-auto h-full flex flex-col justify-center py-12">
              <div className="text-center space-y-4 mb-8">
                <div className="inline-flex p-4 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400">
                  <Lock size={32} />
                </div>
                <h4 className="text-xl font-bold text-white font-sans">Access Key Required</h4>
                <p className="text-slate-400 text-xs md:text-sm font-sans font-light leading-relaxed">
                  Enter your secure Ajay Balaji administrator passcode to unlock real-time visit telemetry and client submissions.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="relative group">
                  <input
                    type="password"
                    placeholder="Terminal Access Key..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-2xl py-4 pl-12 pr-4 text-white font-mono placeholder-slate-700 outline-none transition-all text-sm"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400" size={16} />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-500 disabled:bg-pink-800 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Signature...</span>
                    </>
                  ) : (
                    <>
                      <Unlock size={14} />
                      <span>Authenticate Terminal</span>
                    </>
                  )}
                </button>
              </form>
              <div className="mt-8 text-center">
                <span className="text-[10px] text-slate-600 font-mono">
                  Default passcode: <span className="text-slate-500">gosu_ajay_balaji</span> (Editable via ADMIN_PASSCODE env)
                </span>
              </div>
            </div>
          ) : (
            /* Authorized Telemetry Matrix Dashboard */
            <div className="space-y-6 h-full flex flex-col">
              
              {/* Toolbar & Telemetry Stats Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
                {/* Tabs */}
                <div className="flex space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/60">
                  <button
                    onClick={() => setActiveTab("visits")}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
                      activeTab === "visits"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Eye size={13} />
                    <span>Visitor Telemetry ({visits.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("inbox")}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
                      activeTab === "inbox"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Mail size={13} />
                    <span>Inbox Transmissions ({submissions.length})</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2.5 self-end sm:self-auto">
                  <button
                    onClick={fetchData}
                    disabled={refreshing}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer flex items-center justify-center"
                    title="Refresh Data"
                  >
                    <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-400" : ""} />
                  </button>

                  {activeTab === "visits" && visits.length > 0 && (
                    <button
                      onClick={handleClearVisits}
                      className="px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Flush Visits</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-800 text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Lock Access</span>
                  </button>
                </div>
              </div>

              {/* Data Lists */}
              <div className="flex-1 overflow-y-auto min-h-[40vh]">
                {activeTab === "visits" ? (
                  /* Visits Telemetry */
                  visits.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
                      <Globe className="text-slate-600 animate-pulse" size={32} />
                      <p className="text-slate-400 text-sm font-sans font-light">No visitor tracking data logged yet.</p>
                      <p className="text-slate-600 text-xs font-mono">Visits automatically log on page initialize.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visits.map((visit) => (
                        <div 
                          key={visit.id}
                          className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850/80 hover:border-slate-800 transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                            <div className="flex items-center space-x-2.5">
                              <span className="font-mono text-xs text-slate-500">IP Matrix:</span>
                              <span className="font-mono text-sm font-bold text-white bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15">{visit.ip}</span>
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                                {visit.deviceType}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-mono">
                              <Calendar size={12} />
                              <span>{new Date(visit.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans font-light">
                            <div className="space-y-1">
                              <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Destination / URL</span>
                              <span className="text-slate-300 break-all">{visit.url}</span>
                            </div>
                            <div className="space-y-1">
                              <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Referrer Source</span>
                              <span className="text-slate-300 break-all">{visit.referrer}</span>
                            </div>
                            <div className="space-y-1">
                              <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Screen Resolution</span>
                              <span className="text-slate-300 font-mono">{visit.screenResolution}</span>
                            </div>
                          </div>
                          <div className="text-[10px] font-mono text-slate-600 bg-slate-950/20 p-2 rounded border border-slate-900/40 truncate">
                            UA: {visit.userAgent}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  /* Inbox Submissions */
                  submissions.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
                      <Mail className="text-slate-600" size={32} />
                      <p className="text-slate-400 text-sm font-sans font-light">Your transmission inbox is currently empty.</p>
                      <p className="text-slate-600 text-xs font-mono">Messages sent from the Contact form appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((sub) => (
                        <div 
                          key={sub.id}
                          className="p-6 rounded-2xl bg-slate-950/40 border border-slate-850/80 hover:border-slate-850 transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                            <div className="space-y-0.5">
                              <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">From Client</span>
                              <h5 className="text-white font-bold font-sans text-sm md:text-base">
                                {sub.name} <span className="font-light text-slate-400 text-xs ml-1.5 font-mono">({sub.email})</span>
                              </h5>
                            </div>
                            <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-mono self-end sm:self-auto">
                              <Calendar size={12} />
                              <span>{new Date(sub.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST</span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Subject Payload</span>
                            <span className="text-blue-400 font-bold text-sm font-sans">{sub.subject}</span>
                          </div>

                          <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 text-xs md:text-sm text-slate-300 font-sans font-light leading-relaxed white-space: pre-wrap">
                            {sub.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
