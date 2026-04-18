import { Link } from "react-router-dom";

const Section = ({ title, children }) => (
  <section className="rounded-2xl border border-gray-800/60 bg-gray-900/40 p-6 sm:p-7">
    <h2 className="syne text-xl font-bold text-white mb-3">{title}</h2>
    <div className="space-y-3 text-sm leading-7 text-gray-400">{children}</div>
  </section>
);

export default function SecurityPractices() {
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
          <h1 className="syne text-3xl sm:text-5xl font-bold text-white leading-tight">Security Practices</h1>
          <p className="mt-4 text-gray-400 max-w-2xl leading-7">
            These are the security principles and implementation habits behind CyberCoach AI. The goal is to keep the extension simple, the backend transparent, and the attack surface as small as practical.
          </p>
          <p className="mt-3 text-xs text-gray-600">Last updated: {updatedDate}</p>
        </div>

        <div className="space-y-5">
          <Section title="1. Minimal-permission extension design">
            <p>
              The browser extension is designed around the principle of least privilege. It uses the smallest set of permissions needed to read the current tab URL when the user clicks the popup and to send that URL to the classifier endpoint.
            </p>
            <p>
              This approach reduces risk because the extension does not need broad background access or continuous page monitoring to provide value.
            </p>
          </Section>

          <Section title="2. Clear request boundaries">
            <p>
              The extension popup sends requests to a single backend classification endpoint. That keeps the network flow easy to audit and reduces the chance of accidental data sprawl across multiple services.
            </p>
            <p>
              For local development, the backend runs on `http://localhost:5000`. In a production deployment, the endpoint should move behind HTTPS and be protected with proper hosting controls.
            </p>
          </Section>

          <Section title="3. Model and API behavior">
            <p>
              The classifier uses a trained model and vectorizer to score URLs, then applies policy rules such as safe-domain whitelists and suspicious-pattern detection. The result is returned as a trust score, risk label, and a short explanation.
            </p>
            <p>
              The API should validate requests, reject malformed input, and avoid exposing internals that are not useful to end users. Error messages should be helpful but not leak sensitive server details.
            </p>
          </Section>

          <Section title="4. Transport security">
            <p>
              In production, traffic between the extension, website, and backend should use HTTPS only. Plain HTTP is acceptable for localhost development, but not for public deployment. Encrypting traffic protects submitted URLs and scan results from interception.
            </p>
            <p>
              CORS should be restricted to the actual frontend origins used by the product. Wildcard access should be avoided in production unless there is a strong reason and compensating controls are in place.
            </p>
          </Section>

          <Section title="5. Logging and monitoring">
            <p>
              Operational logging is useful for debugging model errors, rate spikes, and malformed requests. However, logs should not become a hidden archive of user browsing history.
            </p>
            <p>
              Good practice is to log only what is needed for maintenance, keep log retention short, and restrict access to trusted maintainers.
            </p>
          </Section>

          <Section title="6. Safe deployment guidance">
            <p>
              If you publish this project beyond local testing, use a production WSGI server, secure headers, regular dependency updates, and environment-based configuration for secrets and endpoints.
            </p>
            <p>
              The extension package should be distributed through a trusted channel, such as a verified website download or store listing, to reduce the risk of tampering.
            </p>
          </Section>

          <Section title="7. User-side safety guidance">
            <p>
              Security tools are most effective when users still follow basic hygiene: check the domain carefully, avoid unexpected downloads, and never enter passwords into a page that looks wrong even if a scanner says it is safe.
            </p>
            <p>
              The extension should be treated as a second opinion, not a replacement for judgment, MFA, browser protections, and endpoint security.
            </p>
          </Section>

          <Section title="8. Ongoing improvements">
            <p>
              Over time, the system can be improved with stronger reputation data, better phishing heuristics, and clearer UX warnings. Each new capability should be reviewed for privacy impact before release.
            </p>
          </Section>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/privacy" className="px-5 py-3 rounded-lg text-sm font-semibold text-gray-900 bg-green-400 hover:bg-green-300 transition-colors">
              Read privacy policy
            </Link>
            <Link to="/extension" className="px-5 py-3 rounded-lg text-sm font-semibold text-green-400 border border-green-400/20 bg-green-400/5 hover:bg-green-400/10 transition-colors">
              Open extension setup
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}