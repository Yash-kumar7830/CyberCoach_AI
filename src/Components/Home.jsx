import { useState, useRef } from "react";
import { Link } from "react-router-dom";

/* ── tiny inline icons ── */
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const SERVICES = [
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Threat Detection",
    desc: "Instantly scan any URL for malware, phishing traps, and suspicious redirects using multi-layer AI analysis.",
    tag: "Core",
    tagColor: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  {
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    title: "SSL Verification",
    desc: "Validate certificates, check expiry dates, and verify chain-of-trust to ensure encrypted connections are legitimate.",
    tag: "Security",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    title: "Reputation Score",
    desc: "Cross-reference against 40+ threat intelligence databases and assign a real-time trust score for every domain.",
    tag: "Intel",
    tagColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Phishing AI",
    desc: "Deep-learning model trained on millions of phishing samples identifies deceptive patterns invisible to basic scanners.",
    tag: "AI",
    tagColor: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Risk Dashboard",
    desc: "Visualise historical scan data, threat trends, and organisation-wide exposure in a real-time analytics dashboard.",
    tag: "Analytics",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  },
  {
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    title: "Security Training",
    desc: "Gamified cyber-awareness quizzes and simulations that turn every team member into your first line of defence.",
    tag: "Education",
    tagColor: "text-teal-400 bg-teal-400/10 border-teal-400/20",
  },
];

const STATS = [
  { value: "40+", label: "Threat databases" },
  { value: "99.7%", label: "Detection accuracy" },
  { value: "< 2s", label: "Average scan time" },
  { value: "2M+", label: "URLs analysed" },
];

/* ── Result badge helper ── */
const riskConfig = {
  safe:    { label: "Safe",    ring: "border-green-400/40",  bg: "bg-green-400/8",   dot: "bg-green-400",  text: "text-green-400"  },
  warning: { label: "Warning", ring: "border-amber-400/40",  bg: "bg-amber-400/8",   dot: "bg-amber-400",  text: "text-amber-400"  },
  danger:  { label: "Danger",  ring: "border-red-400/40",    bg: "bg-red-400/8",     dot: "bg-red-400",    text: "text-red-400"    },
};

export default function Home() {
  const [url, setUrl]         = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");
  const inputRef              = useRef(null);

  // In your Home component, replace the handleScan function:

const handleScan = async (e) => {
  e?.preventDefault();
  const trimmed = url.trim();
  if (!trimmed) { 
    setError("Please enter a URL to scan."); 
    return; 
  }
  if (!/^https?:\/\//i.test(trimmed)) { 
    setError("URL must start with http:// or https://"); 
    return; 
  }

  setError("");
  setResult(null);
  setLoading(true);

  try {
    // Change this to your local backend
    const res = await fetch("http://localhost:5000/api/classify", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: trimmed }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    setResult(data);
  } catch (err) {
    console.error("API Error:", err);
    setError("Analysis failed. Make sure the backend server is running on port 5000.");
  } finally {
    setLoading(false);
  }
};

  const cfg = result ? riskConfig[result.risk] ?? riskConfig.warning : null;

  return (
    <main className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes pulse-ring {
          0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.25); }
          50%      { box-shadow: 0 0 0 10px rgba(74,222,128,0); }
        }
        .scan-btn:not(:disabled):hover { animation: pulse-ring 1.4s ease-in-out infinite; }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fade-up 0.45s ease forwards; }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 1s linear infinite; }
      `}</style>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden grid-bg">
        {/* glow blobs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-green-500/5 blur-3xl pointer-events-none" />
        <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-green-400/4 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          {/* badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-400/20 bg-green-400/5 text-green-400 text-xs font-medium mb-6 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Cyber Threat Analysis
          </span>

          <h1 className="syne text-4xl sm:text-5xl lg:text-6xl font-800 leading-tight mb-5">
            Is that link{" "}
            <span className="text-green-400 relative">
              safe
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-green-400/0 via-green-400 to-green-400/0" />
            </span>
            {" "}to open?
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Paste any URL below. Our AI scans for phishing, malware, and reputation risks in under 2 seconds.
          </p>

          {/* Search bar */}
          <form onSubmit={handleScan} className="relative">
            <div className={`flex items-center gap-0 rounded-xl border transition-all duration-200 overflow-hidden bg-gray-900 ${
              error ? "border-red-500/50" : "border-gray-700/60 focus-within:border-green-400/50"
            }`}>
              {/* lock icon */}
              <span className="pl-4 text-gray-500 shrink-0">
                <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={18} />
              </span>

              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                placeholder="https://example.com/suspicious-link"
                className="flex-1 bg-transparent px-3 py-4 text-sm text-white placeholder-gray-600 outline-none min-w-0"
              />

              <button
                type="submit"
                disabled={loading}
                className="scan-btn shrink-0 m-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-900 bg-green-400 hover:bg-green-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="spin-slow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Scanning
                  </span>
                ) : "Scan URL"}
              </button>
            </div>

            {error && (
              <p className="mt-2 text-xs text-red-400 text-left pl-1">{error}</p>
            )}
          </form>

          <p className="mt-3 text-xs text-gray-600">
            No account required · Results powered by Claude AI · Data never stored
          </p>
        </div>
      </section>

      {/* ── AI Result ── */}
      {(loading || result) && (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 -mt-2 pb-12 fade-up">
          {loading && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 text-center">
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <svg className="spin-slow text-green-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <span className="text-sm">Analysing URL with AI…</span>
              </div>
            </div>
          )}

          {result && cfg && (
            <div className={`rounded-xl border ${cfg.ring} ${cfg.bg} p-6`}>
              {/* header row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={`text-xs font-semibold uppercase tracking-widest ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{result.summary}</p>
                </div>
                {/* trust score ring */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full border-2 ${cfg.ring} flex items-center justify-center`}>
                    <span className={`text-lg font-bold ${cfg.text}`}>{result.score}</span>
                  </div>
                  <span className="text-xs text-gray-600 mt-1">trust</span>
                </div>
              </div>

              {/* meta row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="rounded-lg bg-gray-900/50 px-3 py-2">
                  <p className="text-xs text-gray-600 mb-0.5">SSL</p>
                  <p className={`text-sm font-medium ${result.ssl ? "text-green-400" : "text-red-400"}`}>
                    {result.ssl ? "Valid" : "Invalid / Missing"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-900/50 px-3 py-2">
                  <p className="text-xs text-gray-600 mb-0.5">Domain Age</p>
                  <p className="text-sm font-medium text-gray-300">{result.domain_age}</p>
                </div>
                <div className="rounded-lg bg-gray-900/50 px-3 py-2 col-span-2 sm:col-span-1">
                  <p className="text-xs text-gray-600 mb-0.5">Flags</p>
                  <p className="text-sm font-medium text-gray-300">{result.flags?.length || 0} detected</p>
                </div>
              </div>

              {/* flags */}
              {result.flags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.flags.map((f, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-900/70 border border-gray-700/50 text-gray-400">
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {/* recommendation */}
              <div className="flex items-start gap-2 rounded-lg bg-gray-900/50 border border-gray-800/60 px-3 py-2.5">
                <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={16} />
                <p className="text-xs text-gray-400 leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Stats bar ── */}
      <section className="border-y border-gray-800/60 bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="syne text-2xl sm:text-3xl font-bold text-green-400">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        {/* heading */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest text-green-400/70 uppercase mb-3">
            What we offer
          </span>
          <h2 className="syne text-3xl sm:text-4xl font-bold text-white mb-4">
            Full-spectrum cyber protection
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            From real-time threat detection to security awareness training — everything your team needs to stay protected.
          </p>
        </div>

        {/* cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc, i) => (
            <div
              key={i}
              className="group relative rounded-xl border border-gray-800/70 bg-gray-900/40 p-6 hover:border-green-400/25 hover:bg-gray-900/70 transition-all duration-300 cursor-default"
            >
              {/* subtle corner glow on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: "radial-gradient(circle at top left, rgba(74,222,128,0.04), transparent 60%)" }} />

              {/* icon */}
              <div className="w-10 h-10 rounded-lg bg-green-400/8 border border-green-400/15 flex items-center justify-center text-green-400 mb-4 group-hover:bg-green-400/12 transition-colors duration-300">
                <Icon d={svc.icon} size={18} />
              </div>

              {/* tag */}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${svc.tagColor} mb-3 inline-block`}>
                {svc.tag}
              </span>

              <h3 className="syne text-base font-bold text-white mb-2">{svc.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="relative rounded-2xl border border-green-400/15 bg-linear-to-br from-green-400/5 via-gray-900 to-gray-900 overflow-hidden px-8 py-12 text-center">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative">
            <h2 className="syne text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to secure your organisation?
            </h2>
            <p className="text-gray-400 text-sm mb-7 max-w-md mx-auto">
              Start for free — no credit card required. Upgrade when you need advanced threat intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/quiz/general"
                className="px-6 py-3 rounded-lg text-sm font-semibold text-gray-900 bg-green-400 hover:bg-green-300 transition-all duration-200 active:scale-95 shadow-lg shadow-green-900/30">
                Take the quiz
              </Link>
              <Link to="/dashboard"
                className="px-6 py-3 rounded-lg text-sm font-medium text-gray-300 border border-gray-700/60 hover:border-green-400/30 hover:text-white transition-all duration-200">
                View dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}