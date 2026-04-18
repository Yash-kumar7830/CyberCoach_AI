import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // update path as needed

const LINKS = {
  Product: [
    { name: "URL Scanner",    path: "/" },
    { name: "Threat Quiz",    path: "/quiz/general" },
    { name: "Dashboard",      path: "/dashboard" },
    { name: "Pricing",        path: "/pricing" },
  ],
  Company: [
    { name: "About",          path: "/about" },
    { name: "Blog",           path: "/blog" },
    { name: "Careers",        path: "/careers" },
    { name: "Contact",        path: "/contact" },
  ],
  Legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Use",   path: "/terms" },
    { name: "Cookie Policy",  path: "/cookies" },
    { name: "Security Practices", path: "/security" },
  ],
};

const SOCIALS = [
  {
    label: "Twitter / X",
    href: "https://x.com",
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    isPath: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-950 border-t border-gray-800/60 text-gray-400"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand column — spans 2 on lg */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <img
                src={logo}
                alt="CyberCoach AI"
                className="h-10 w-10 rounded-full object-cover bg-white/5 p-1 ring-1 ring-green-400/20 transition-transform duration-300 group-hover:scale-110"
              />
              <span
                className="font-bold text-lg tracking-tight text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Cyber<span className="text-green-400">Coach</span>
                <span className="text-green-400/50 font-normal"> AI</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-500 max-w-xs mb-6">
              AI-powered cybersecurity intelligence that keeps individuals and organisations safe from evolving online threats.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-green-400/30 hover:bg-green-400/5 transition-all duration-200"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke={s.isPath ? "none" : "currentColor"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4
                className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-sm text-gray-500 hover:text-green-400 transition-colors duration-150"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {year} CyberCoach AI. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}