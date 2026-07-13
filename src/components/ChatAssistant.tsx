import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Loader2, Sparkles, AlertCircle, Trash2 } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatAssistant({ isOpen, onClose }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I am **Ajay Balaji's digital AI avatar**. Ask me anything about his skills, experience, recent projects, or how to contact him!",
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    "Tell me about Ajay's skills",
    "What is his experience?",
    "Show me his key projects",
    "How do I contact him?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = {
      role: "user",
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);
    setError("");

    try {
      // Map history format to simple role strings
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch response");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        role: "model",
        text: data.text || "I was unable to formulate an answer. Let's try again!",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "The AI Assistant had trouble connecting. Please check your secrets configurations.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "model",
        text: "Conversation timeline cleared. How can I assist you with Gosu Ajay Balaji's portfolio today?",
        timestamp: new Date()
      }
    ]);
    setError("");
  };

  // Custom lightweight renderer for bullets, paragraphs, and bold formatting
  const renderMarkdownText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      let trimmed = line.trim();
      const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
      if (isBullet) {
        trimmed = trimmed.replace(/^[-*]\s+/, "");
      }

      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lIdx} className="ml-5 list-disc text-slate-300 text-sm md:text-base leading-relaxed mb-1.5">
            {content}
          </li>
        );
      }

      if (trimmed === "") {
        return <div key={lIdx} className="h-2" />;
      }

      return (
        <p key={lIdx} className="text-slate-300 text-sm md:text-base leading-relaxed mb-2">
          {content}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Clickable Backdrop to close */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-auto cursor-pointer transition-all animate-fadeIn"
      />

      {/* Slide out holographic container */}
      <div className="w-full max-w-lg h-full bg-slate-950/95 border-l border-slate-800 shadow-2xl flex flex-col pointer-events-auto z-10 animate-slideIn">
        
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Bot size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-bold font-sans text-lg">Ajay Balaji AI</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-extrabold animate-pulse">
                  Active
                </span>
              </div>
              <p className="text-slate-500 text-xs font-sans">balaji -Powered Portfolio</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearHistory}
              className="text-slate-500 hover:text-white p-2 rounded-xl hover:bg-slate-900 transition-all cursor-pointer"
              title="Clear Chat History"
              aria-label="Clear Chat History"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white p-2 rounded-xl hover:bg-slate-900 transition-all cursor-pointer"
              aria-label="Close Assistant"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
                <div
                  className={`max-w-[85%] rounded-3xl p-5 flex flex-col ${
                    isUser
                      ? "bg-blue-600/90 text-white shadow-lg shadow-blue-600/10 rounded-tr-none border border-blue-500"
                      : "bg-slate-900/50 border border-slate-800/80 rounded-tl-none text-slate-300"
                  }`}
                >
                  {/* Message Sender Info */}
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 block">
                    {isUser ? "Visitor" : "Ajay Balaji AI"} //{" "}
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>

                  {/* Text contents */}
                  <div className="space-y-1 text-sm md:text-base">
                    {isUser ? <p className="leading-relaxed">{msg.text}</p> : renderMarkdownText(msg.text)}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator spinner */}
          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl rounded-tl-none p-5 text-slate-400 max-w-[85%] flex items-center space-x-3">
                <Loader2 size={16} className="animate-spin text-blue-400" />
                <span className="text-sm font-mono tracking-wide animate-pulse">Ajay Balaji AI is synchronizing response...</span>
              </div>
            </div>
          )}

          {/* Assistant Error Indicator */}
          {error && (
            <div className="rounded-2xl bg-red-950/20 border border-red-500/20 p-5 flex items-start space-x-3">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
              <div className="space-y-1">
                <h4 className="text-white text-xs font-bold font-sans">Sync Connection Refused</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-6 pb-2 pt-4 border-t border-slate-900">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-2.5">
            Suggested Queries
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSendMessage(chip)}
                className="text-xs font-medium font-sans px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Message Inputs Footer */}
        <div className="p-6 border-t border-slate-900 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              disabled={loading}
              placeholder={loading ? "Synthesizing response..." : "Ask a question..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-2xl py-4 px-4.5 text-white placeholder-slate-500 outline-none text-sm outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-700 text-white transition-all shadow-md cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Send Message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
