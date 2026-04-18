import { useState } from "react";
import { Link } from "react-router-dom";

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// Dummy data for a single user (replace with real data from your backend later)
const USER_DATA = {
  name: "Alex Rivera",
  email: "alex@example.com",
  memberSince: "Jan 2025",
  totalScans: 47,
  maliciousFound: 12,
  suspiciousFound: 8,
  safeFound: 27,
  recentScans: [
    { url: "https://paypal-verify.secure-login.com", result: "malicious", date: "2025-04-16" },
    { url: "https://dropbox.paper/file?id=123", result: "suspicious", date: "2025-04-15" },
    { url: "https://github.com/awesome-project", result: "safe", date: "2025-04-14" },
    { url: "https://fedex-delivery-update.net", result: "malicious", date: "2025-04-13" },
    { url: "https://docs.google.com/forms/d/abc", result: "safe", date: "2025-04-12" },
  ]
};

export default function BasicDashboard() {
  return (
    <main className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fade-up 0.35s ease forwards; }
      `}</style>

      <div className="relative grid-bg min-h-screen">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="syne text-2xl sm:text-3xl font-bold text-white">My Security Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Your personal scan history and threat summary</p>
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors">
              <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" size={16} />
              Back to Home
            </Link>
          </div>

          {/* user profile card */}
          <div className="rounded-xl border border-green-400/20 bg-gradient-to-br from-green-400/5 to-gray-900/80 p-6 mb-6 fade-up">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 uppercase tracking-wider">Active user</span>
                </div>
                <h2 className="syne text-xl font-bold text-white">{USER_DATA.name}</h2>
                <p className="text-sm text-gray-400">{USER_DATA.email}</p>
                <p className="text-xs text-gray-600 mt-2">Member since {USER_DATA.memberSince}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center text-green-400">
                <Icon d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" size={22} />
              </div>
            </div>
          </div>

          {/* stats row – personal only */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 fade-up">
            <div className="rounded-xl border border-gray-800/60 bg-gray-900/40 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total URLs checked</p>
              <p className="syne text-3xl font-bold text-green-400 mt-1">{USER_DATA.totalScans}</p>
            </div>
            <div className="rounded-xl border border-gray-800/60 bg-gray-900/40 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Malicious found</p>
              <p className="syne text-3xl font-bold text-red-400 mt-1">{USER_DATA.maliciousFound}</p>
            </div>
            <div className="rounded-xl border border-gray-800/60 bg-gray-900/40 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Suspicious</p>
              <p className="syne text-3xl font-bold text-amber-400 mt-1">{USER_DATA.suspiciousFound}</p>
            </div>
            <div className="rounded-xl border border-gray-800/60 bg-gray-900/40 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Safe</p>
              <p className="syne text-3xl font-bold text-green-400 mt-1">{USER_DATA.safeFound}</p>
            </div>
          </div>

          {/* recent scans table */}
          <div className="rounded-xl border border-gray-800/60 bg-gray-900/40 overflow-hidden fade-up">
            <div className="p-4 border-b border-gray-800/60">
              <h3 className="syne text-lg font-bold text-white">📋 Recent URL scans</h3>
              <p className="text-xs text-gray-500 mt-0.5">Last 5 checked links</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800/60 bg-gray-900/80">
                  <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3">URL</th>
                    <th className="px-4 py-3">Result</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {USER_DATA.recentScans.map((scan, idx) => (
                    <tr key={idx} className="border-b border-gray-800/40 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-300 truncate max-w-xs">{scan.url}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
                          ${scan.result === "malicious" ? "bg-red-400/10 text-red-400 border border-red-400/20" : ""}
                          ${scan.result === "suspicious" ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : ""}
                          ${scan.result === "safe" ? "bg-green-400/10 text-green-400 border border-green-400/20" : ""}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full
                            ${scan.result === "malicious" ? "bg-red-400" : ""}
                            ${scan.result === "suspicious" ? "bg-amber-400" : ""}
                            ${scan.result === "safe" ? "bg-green-400" : ""}
                          `} />
                          {scan.result}
                        </span>
                       </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{scan.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 text-center border-t border-gray-800/60">
              <Link to="/scan" className="text-xs text-green-400 hover:text-green-300 transition-colors">+ Scan a new URL →</Link>
            </div>
          </div>

          {/* simple tip card (optional) */}
          <div className="mt-6 rounded-xl border border-gray-800/60 bg-gray-900/40 p-4 fade-up">
            <div className="flex items-center gap-2 mb-2">
              <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={16} className="text-green-400" />
              <h3 className="syne text-sm font-bold text-white">Did you know?</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Phishing emails often create urgency (“your account will be closed”). Always check the sender’s address carefully before clicking.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}