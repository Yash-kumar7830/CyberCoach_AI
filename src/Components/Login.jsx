import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState("enter");
  const [error, setError] = useState("");

  const validateMobile = (value) => {
    return /^\d{10}$/.test(value.trim());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateMobile(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    localStorage.setItem("isLoggedIn", "true");
    setStep("done");
  };

  const resetForm = () => {
    setMobile("");
    setStep("enter");
    setError("");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-green-400/80 mb-3">Secure Mobile Login</p>
          <h1 className="syne text-3xl sm:text-4xl font-bold text-white">Login with your mobile number</h1>
          <p className="mt-4 text-gray-400 text-sm leading-7">
            This page uses a client-side verification flow. No database is used and no persistent user data is stored.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-800/60 bg-gray-900/60 p-8 shadow-xl shadow-black/20">
          {step === "enter" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300">Mobile number</label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="mt-3 w-full rounded-2xl border border-gray-800/80 bg-gray-950 px-4 py-3 text-white outline-none transition-all duration-200 focus:border-green-400/60 focus:ring-2 focus:ring-green-400/10"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-2xl bg-green-400 py-3 text-sm font-semibold text-gray-900 transition hover:bg-green-300"
              >
                Continue
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="space-y-6 text-center">
              <div className="rounded-3xl border border-green-400/20 bg-green-400/5 p-8">
                <p className="text-3xl font-bold text-green-300">✓</p>
                <h2 className="mt-4 text-2xl font-bold text-white">Logged in</h2>
                <p className="mt-2 text-sm text-gray-400">This demo currently skips OTP verification and only validates the mobile format.</p>
              </div>
              <div className="space-y-3">
                <Link
                  to="/"
                  className="block rounded-2xl bg-green-400 py-3 text-sm font-semibold text-gray-900 transition hover:bg-green-300"
                >
                  Continue to home
                </Link>
                <button
                  onClick={resetForm}
                  className="w-full rounded-2xl border border-gray-700/60 bg-gray-900/70 py-3 text-sm font-medium text-gray-300 transition hover:border-green-400/60 hover:text-white"
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>No database is used. This is a client-side demo flow only.</p>
        </div>
      </div>
    </main>
  );
}
