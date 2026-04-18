import { Link } from "react-router-dom";

const Section = ({ title, children }) => (
  <section className="rounded-2xl border border-gray-800/60 bg-gray-900/40 p-6 sm:p-7">
    <h2 className="syne text-xl font-bold text-white mb-3">{title}</h2>
    <div className="space-y-3 text-sm leading-7 text-gray-400">{children}</div>
  </section>
);

export default function PrivacyPolicy() {
  const updatedDate = "April 18, 2026";

  return (
    <main className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-green-400/70 mb-3">Legal</p>
          <h1 className="syne text-3xl sm:text-5xl font-bold text-white leading-tight">Privacy Policy</h1>
          <p className="mt-4 text-gray-400 max-w-2xl leading-7">
            This policy explains how CyberCoach AI handles URL scanning data, browser-extension usage, and website interactions. The focus of the product is rapid threat detection with minimal data retention.
          </p>
          <p className="mt-3 text-xs text-gray-600">Last updated: {updatedDate}</p>
        </div>

        <div className="space-y-5">
          <Section title="1. Information we process">
            <p>
              When you paste a URL into the website or submit one through the extension popup, CyberCoach AI processes that URL to classify it as safe, suspicious, or malicious. We may also process a normalized version of the URL so the classifier can evaluate it consistently across browser variants.
            </p>
            <p>
              The extension can read the active tab URL only when you intentionally use the popup action. It does not need to continuously monitor your browsing session to work.
            </p>
          </Section>

          <Section title="2. How we use the data">
            <p>
              URL data is used for one purpose only: security analysis. The classifier checks the URL against our model, reputation logic, suspicious keyword patterns, and other lightweight heuristics so it can return a risk score and recommendation.
            </p>
            <p>
              We use the response to display scan results on the website, in the browser extension popup, or in any connected dashboard experience. We do not use scan data for advertising, behavioral profiling, or unrelated analytics.
            </p>
          </Section>

          <Section title="3. Data retention">
            <p>
              By design, the product is built to be low-retention. The API can process requests without requiring a user account, and the interface is intended to show results immediately rather than build a long-term profile of your browsing activity.
            </p>
            <p>
              If server logs are enabled for debugging or abuse prevention, they should be treated as operational records only and kept for the shortest practical period. In production, log retention should be limited and access-controlled.
            </p>
          </Section>

          <Section title="4. Sharing and disclosure">
            <p>
              We do not sell your scanned URLs. We also do not share URL data with third-party advertisers or unrelated data brokers. Operational access should be limited to the people who maintain the service and its infrastructure.
            </p>
            <p>
              In the event of abuse, security incidents, or legal requests, limited information may be reviewed to protect the platform and users. Any such review should be proportionate and documented.
            </p>
          </Section>

          <Section title="5. Browser extension permissions">
            <p>
              The extension uses minimal permissions required for its scan flow, such as reading the active tab when you click the extension icon. This is necessary so you can check a link without copying it into the website first.
            </p>
            <p>
              The extension should not request unnecessary access to cookies, passwords, history, microphone, camera, or unrelated browsing data. If additional permissions are ever needed, they should be explained clearly before installation.
            </p>
          </Section>

          <Section title="6. User control">
            <p>
              You control what you scan. If you do not want a URL analyzed, simply do not submit it. You may also remove the extension at any time from your browser to stop all extension-side processing.
            </p>
            <p>
              If you use the website, you can stop at any time and no account creation is required for basic scans in the current setup.
            </p>
          </Section>

          <Section title="7. Security boundaries">
            <p>
              CyberCoach AI is a detection and decision-support tool. It reduces risk, but it cannot guarantee that every malicious link will be identified. Phishing and malware campaigns evolve quickly, and no automated system can promise perfect results.
            </p>
            <p>
              You should still verify domain names, avoid entering credentials into suspicious pages, and use browser and operating-system protections alongside this tool.
            </p>
          </Section>

          <Section title="8. Changes to this policy">
            <p>
              This policy may be updated as the product evolves. If the extension, backend, or dashboard starts collecting different data, the policy should be revised to match the new behavior.
            </p>
          </Section>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/extension" className="px-5 py-3 rounded-lg text-sm font-semibold text-gray-900 bg-green-400 hover:bg-green-300 transition-colors">
              Go to extension setup
            </Link>
            <Link to="/security" className="px-5 py-3 rounded-lg text-sm font-semibold text-green-400 border border-green-400/20 bg-green-400/5 hover:bg-green-400/10 transition-colors">
              Read security practices
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}