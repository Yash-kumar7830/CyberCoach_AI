import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png"; // update path as needed

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Quiz", path: "/quiz/general" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Settings", path: "/extension" },  // ← Points to your extension route
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── Header ── */}
      <header
        className={`sticky top-0 z-50 border-b border-green-900/30 backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "bg-gray-950/95 shadow-lg shadow-black/40"
            : "bg-gray-950/80"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="CyberCoach AI — Home"
          >
            <img
              src={logo}
              alt="CyberCoach AI logo"
              className="h-10 w-10 rounded-full object-cover bg-white/5 p-1 ring-1 ring-green-400/20 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-bold text-lg tracking-tight text-white">
              Cyber<span className="text-green-400">Coach</span>
              <span className="text-green-400/60 font-normal"> AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                aria-current={isActive(link.path) ? "page" : undefined}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-green-400 bg-green-400/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-green-400" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Login — desktop only */}
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-900 bg-green-400 hover:bg-green-300 active:scale-95 transition-all duration-200 shadow-md shadow-green-900/30 hover:shadow-green-400/20"
            >
              Log in
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-green-900/40 bg-white/5 text-gray-300 hover:text-white hover:bg-green-400/10 hover:border-green-400/30 transition-all duration-200"
            >
              <div className="w-4 flex flex-col gap-1.25">
                <span
                  className={`block h-px bg-current rounded transition-all duration-300 origin-center ${
                    menuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block h-px bg-current rounded transition-all duration-200 ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-px bg-current rounded transition-all duration-300 origin-center ${
                    menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Mobile Drawer ── */}
      <nav
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`md:hidden fixed top-16 left-0 right-0 z-50 bg-gray-950 border-b border-green-900/30 transition-all duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              aria-current={isActive(link.path) ? "page" : undefined}
              className={`flex items-center justify-between px-3 py-3.5 rounded-lg text-base font-medium border transition-all duration-150 ${
                isActive(link.path)
                  ? "text-green-400 bg-green-400/10 border-green-400/20"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="w-2 h-2 rounded-full bg-green-400" />
              )}
            </Link>
          ))}

          {/* Mobile Login */}
          <Link
            to="/login"
            className="mt-2 w-full text-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-900 bg-green-400 hover:bg-green-300 active:scale-95 transition-all duration-200"
          >
            Log in
          </Link>
        </div>
      </nav>
    </>
  );
}