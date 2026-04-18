// src/Components/ExtensionSetup.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function ExtensionSetup() {
  const [browser, setBrowser] = useState("chrome");
  const [installationStep, setInstallationStep] = useState(1);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Detect user's browser
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("chrome")) setBrowser("chrome");
    else if (userAgent.includes("firefox")) setBrowser("firefox");
    else if (userAgent.includes("edg")) setBrowser("edge");
    else if (userAgent.includes("safari")) setBrowser("safari");
    else setBrowser("other");
  }, []);

  const browserLogos = {
    chrome: "🌐",
    firefox: "🦊",
    edge: "🔷",
    safari: "🧭",
    other: "🌍"
  };

  const extensionLinks = {
    chrome: "https://chrome.google.com/webstore/detail/cybercoach-ai-phishing-guard",
    firefox: "https://addons.mozilla.org/firefox/addon/cybercoach-ai",
    edge: "https://microsoftedge.microsoft.com/addons/detail/cybercoach-ai",
    safari: "#" // Safari requires App Store
  };

  const handleInstallExtension = () => {
    if (extensionLinks[browser]) {
      window.open(extensionLinks[browser], "_blank");
      setInstallationStep(2);
    } else {
      alert("Manual installation guide will be shown");
    }
  };

  const handleCheckPermissions = () => {
    // In a real extension, you'd check if extension is installed
    // For now, simulate permission check
    setPermissionGranted(true);
    setInstallationStep(3);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .browser-card:hover {
          transform: translateY(-2px);
          border-color: rgba(74,222,128,0.3);
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="syne text-2xl sm:text-3xl font-bold text-white">Browser Extension</h1>
            <p className="text-gray-500 text-sm mt-1">Protect yourself while browsing any website</p>
          </div>
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-green-400/5 to-gray-900/80 border border-green-400/20 rounded-xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-green-400/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl">🛡️</span>
            </div>
            <h2 className="syne text-xl font-bold text-white">CyberCoach AI Browser Extension</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
              Automatically scans every URL you visit and warns you before opening malicious links
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-3">
              <div className="w-10 h-10 mx-auto bg-green-400/10 rounded-full flex items-center justify-center mb-2">
                <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={18} className="text-green-400" />
              </div>
              <p className="text-xs text-gray-400">Real-time URL scanning</p>
            </div>
            <div className="text-center p-3">
              <div className="w-10 h-10 mx-auto bg-green-400/10 rounded-full flex items-center justify-center mb-2">
                <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={18} className="text-green-400" />
              </div>
              <p className="text-xs text-gray-400">Instant warning popups</p>
            </div>
            <div className="text-center p-3">
              <div className="w-10 h-10 mx-auto bg-green-400/10 rounded-full flex items-center justify-center mb-2">
                <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={18} className="text-green-400" />
              </div>
              <p className="text-xs text-gray-400">Syncs with your dashboard</p>
            </div>
          </div>

          {/* Installation Steps */}
          <div className="border-t border-gray-800/60 pt-6">
            <h3 className="font-semibold text-white mb-4">📦 Installation Steps</h3>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${installationStep >= 1 ? 'bg-green-400/5 border border-green-400/20' : 'bg-gray-900/30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${installationStep >= 1 ? 'bg-green-400 text-gray-900' : 'bg-gray-700 text-gray-400'}`}>1</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Install extension from store</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Detected browser: <span className="text-green-400">{browser.charAt(0).toUpperCase() + browser.slice(1)} {browserLogos[browser]}</span>
                  </p>
                  {installationStep === 1 && (
                    <button
                      onClick={handleInstallExtension}
                      className="mt-2 px-4 py-1.5 bg-green-400 text-gray-900 rounded-lg text-xs font-semibold hover:bg-green-300 transition-colors"
                    >
                      Install for {browser.charAt(0).toUpperCase() + browser.slice(1)} →
                    </button>
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${installationStep >= 2 ? 'bg-green-400/5 border border-green-400/20' : 'bg-gray-900/30 opacity-60'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${installationStep >= 2 ? 'bg-green-400 text-gray-900' : 'bg-gray-700 text-gray-400'}`}>2</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Pin extension to toolbar</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Click the puzzle piece icon <span className="text-gray-400">🧩</span> in your browser toolbar and pin CyberCoach AI
                  </p>
                  {installationStep === 2 && (
                    <button
                      onClick={handleCheckPermissions}
                      className="mt-2 px-4 py-1.5 bg-gray-800 border border-gray-700 text-white rounded-lg text-xs font-semibold hover:bg-gray-700 transition-colors"
                    >
                      I've pinned it →
                    </button>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${installationStep >= 3 ? 'bg-green-400/5 border border-green-400/20' : 'bg-gray-900/30 opacity-60'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${installationStep >= 3 ? 'bg-green-400 text-gray-900' : 'bg-gray-700 text-gray-400'}`}>3</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Grant necessary permissions</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Extension needs permission to read and modify website data to protect you
                  </p>
                  {installationStep === 3 && !permissionGranted && (
                    <button
                      onClick={() => {
                        // In real implementation, this would trigger Chrome's permission API
                        alert("In production: This would request browser permissions.\n\nFor now, permissions are granted in the extension's manifest.json");
                        setPermissionGranted(true);
                        setInstallationStep(4);
                      }}
                      className="mt-2 px-4 py-1.5 bg-green-400 text-gray-900 rounded-lg text-xs font-semibold hover:bg-green-300 transition-colors"
                    >
                      Grant Permissions →
                    </button>
                  )}
                  {permissionGranted && (
                    <p className="mt-2 text-xs text-green-400">✓ Permissions granted successfully</p>
                  )}
                </div>
              </div>

              {/* Step 4 - Complete */}
              {installationStep >= 4 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-400/10 border border-green-400/30">
                  <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 text-gray-900">✓</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-400">All set! Extension is active</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      CyberCoach AI will now protect you while browsing. Try visiting a suspicious link test site to see it in action.
                    </p>
                    <Link to="/dashboard" className="inline-block mt-3 text-xs text-green-400 hover:text-green-300">
                      Go to Dashboard →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manual Installation Guide */}
        <div className="bg-gray-900/40 border border-gray-800/60 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={16} className="text-green-400" />
            Manual Installation (Developer Mode)
          </h3>
          <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
            <li>Download the extension ZIP file from <a href="#" className="text-green-400 hover:underline">GitHub Release</a></li>
            <li>Extract the folder to a permanent location on your computer</li>
            <li>Go to <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">chrome://extensions/</code> (Chrome/Edge) or <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">about:debugging</code> (Firefox)</li>
            <li>Enable "Developer mode" (top right corner)</li>
            <li>Click "Load unpacked" and select the extracted folder</li>
            <li>The extension is now installed and will auto-update</li>
          </ol>
          <p className="text-xs text-gray-600 mt-3">
             Manual mode requires re-installation for updates. We recommend using the store version above.
          </p>
        </div>

        {/* Permissions Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
             We only request necessary permissions to protect you. No data is ever sold or misused.
            <br />
            <a href="/privacy" className="text-green-400 hover:underline">Privacy Policy</a> · 
            <a href="/security" className="text-green-400 hover:underline ml-2">Security Practices</a>
          </p>
        </div>
      </div>
    </main>
  );
}