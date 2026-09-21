import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Info, ShieldCheck, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { validateLogin } from "@/lib/auth";

/**
 * SapphireAuthView — Semantic, accessible login for Standard Bank Sapphire
 * Replaces the legacy generated AccessAccount with production-grade
 * React: semantic HTML, BEM-inspired ids/classes, no vendor artifacts.
 *
 * Id/class convention:
 * - ids:   sapphire-auth-*           (kebab, deterministic for e2e/tests)
 * - classes: sapphire-auth__* / sapphire-auth--* (BEM) + Tailwind utilities
 */

export function SapphireAuthView() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("C1234567");
  const [password, setPassword] = useState("Sapphire123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const user = validateLogin(identifier, password);
    if (!user) {
      setError("Invalid C Number or email or password. Try C1234567 / Sapphire123");
      setIsSubmitting(false);
      return;
    }
    login(user);
    setIsSubmitting(false);
  };

  return (
    <main
      id="sapphire-auth-layout"
      className="sapphire-auth min-h-screen w-full bg-white flex overflow-hidden"
      aria-labelledby="sapphire-auth-title"
    >
      {/* Brand / illustration panel — semantic section, hidden on mobile */}
      <section
        id="sapphire-brand-panel"
        className="sapphire-auth__brand-panel hidden lg:flex w-[46%] xl:w-[40%] max-w-[576px] shrink-0 flex-col bg-gradient-to-b from-[#2563eb] to-[#00319c] relative overflow-hidden"
        aria-label="Sapphire brand and illustration"
      >
        {/* Decorative background circle */}
        <div
          id="sapphire-brand-backdrop-circle"
          className="sapphire-auth__brand-circle absolute left-[-120px] top-[195px] w-[851px] h-[851px] rounded-full bg-white opacity-100 pointer-events-none"
          aria-hidden="true"
        />

        {/* Brand header */}
        <header
          id="sapphire-brand-header"
          className="sapphire-auth__brand-header relative z-10 flex flex-col gap-1 px-10 pt-14"
        >
          <div className="flex items-center gap-3">
            <img
              id="sapphire-brand-standard-bank-logo"
              src="/assets/logo-standard-bank.png"
              alt="Standard Bank"
              className="h-7 w-7 object-contain bg-white rounded-md p-1"
            />
            <span className="text-white font-bold text-[30px] leading-none tracking-tight" style={{ fontFamily: "Gilroy, system-ui, sans-serif" }}>
              Internal Tools
            </span>
          </div>
          <p className="text-white/80 text-base font-medium pl-10">Because Our Customers Deserve The Best</p>
        </header>

        {/* Semantic illustration — single SVG composition (replaces 75+ legacy fragments) */}
        <div
          id="sapphire-brand-illustration"
          className="sapphire-auth__illustration relative z-10 flex-1 flex items-center justify-center px-8 py-12"
          aria-hidden="true"
        >
          <div
            id="sapphire-illustration-card"
            className="relative w-[320px] h-[320px] flex items-center justify-center"
          >
            {/* Soft illustration placeholder using semantic shapes */}
            <svg
              id="sapphire-illustration-svg"
              viewBox="0 0 320 320"
              className="w-full h-full"
              role="img"
              aria-label="Sapphire insurance illustration"
            >
              <defs>
                <linearGradient id="sapphire-illustration-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <circle cx="160" cy="160" r="120" fill="url(#sapphire-illustration-gradient)" opacity="0.15" />
              <circle cx="160" cy="140" r="52" fill="#fff" />
              <circle cx="160" cy="105" r="22" fill="#f66b72" />
              <path
                d="M110 165 Q160 220 210 165 L210 205 Q160 240 110 205 Z"
                fill="#0033aa"
              />
              <path d="M125 175 L155 175 L155 195 L125 195 Z" fill="#fff" rx="4" />
              <circle cx="192" cy="148" r="8" fill="#ffd574" stroke="#0033aa" strokeWidth="1.5" />
            </svg>
            <div
              id="sapphire-illustration-caption"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold text-white border border-white/20 whitespace-nowrap"
            >
              Trusted by Standard Bank • Stanlib Group
            </div>
          </div>
        </div>

        <div
          id="sapphire-brand-watermark"
          className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-[180px] font-black text-white leading-none select-none">S</span>
        </div>
      </section>

      {/* Auth form panel */}
      <section
        id="sapphire-auth-panel"
        className="sapphire-auth__form-panel flex-1 min-w-0 bg-white flex items-center justify-center p-6 lg:p-10 overflow-auto"
        aria-label="Authentication"
      >
        <motion.div
          id="sapphire-auth-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[433px] flex flex-col gap-8"
        >
          {/* Sapphire wordmark */}
          <header id="sapphire-auth-wordmark" className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/assets/icon-sapphire-logo.svg" alt="" className="h-7 w-7" aria-hidden="true" />
              <span className="text-[#2563eb] font-black text-2xl tracking-tight flex">
                <span>Sapphire</span>
                <span className="text-[#2563eb] ml-0.5">.</span>
              </span>
            </div>
          </header>

          {/* Form card */}
          <div
            id="sapphire-auth-form-card"
            className="sapphire-auth__form-card rounded-2xl bg-white border border-[#e2e8f0] p-8 shadow-sm"
          >
            <div className="text-center">
              <h1
                id="sapphire-auth-title"
                className="sapphire-auth__title text-[20px] font-semibold text-[#111827] leading-8"
              >
                Access account.
              </h1>
              <p
                id="sapphire-auth-subtitle"
                className="sapphire-auth__subtitle mt-2 text-sm text-[#64748b] leading-6"
              >
                Welcome to Sapphire — insurance made effortless for consultants.
              </p>
            </div>

            <form
              id="sapphire-auth-form"
              className="sapphire-auth__form mt-8 flex flex-col gap-4"
              onSubmit={handleSubmit}
              noValidate
              aria-describedby={error ? "sapphire-auth-error" : undefined}
            >
              {/* Identifier */}
              <div id="sapphire-auth-identifier-group" className="sapphire-auth__field flex flex-col gap-2">
                <label
                  htmlFor="sapphire-auth-identifier-input"
                  className="sapphire-auth__label text-xs font-semibold text-[#0f172a] sr-only"
                >
                  C Number or Standard Bank email
                </label>
                <div
                  id="sapphire-auth-identifier-wrapper"
                  className="sapphire-auth__input-wrapper relative flex items-center rounded-2xl bg-white border-2 transition-all focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/10 hover:border-[#cbd5e1]"
                  style={{ borderColor: error ? "#fecaca" : "#f1f5f9" }}
                >
                  <span className="pl-3.5 text-slate-400">
                    <User className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <input
                    id="sapphire-auth-identifier-input"
                    className="sapphire-auth__input w-full h-12 bg-transparent px-3 text-[13px] font-medium text-[#0f172a] placeholder:text-[#94a3b8] outline-none"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Standard C Number or SB email"
                    autoComplete="username"
                    autoFocus
                    aria-required="true"
                  />
                  <span className="pr-3.5 text-slate-400">
                    <Info className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </div>

              {/* Password */}
              <div id="sapphire-auth-password-group" className="sapphire-auth__field flex flex-col gap-2">
                <label
                  htmlFor="sapphire-auth-password-input"
                  className="sapphire-auth__label text-xs font-semibold text-[#0f172a] sr-only"
                >
                  Password
                </label>
                <div
                  id="sapphire-auth-password-wrapper"
                  className="sapphire-auth__input-wrapper relative flex items-center rounded-2xl bg-white border-2 transition-all focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/10 hover:border-[#cbd5e1]"
                  style={{ borderColor: error ? "#fecaca" : "#f1f5f9" }}
                >
                  <span className="pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <input
                    id="sapphire-auth-password-input"
                    className="sapphire-auth__input w-full h-12 bg-transparent px-3 text-[13px] font-medium text-[#0f172a] placeholder:text-[#94a3b8] outline-none"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    aria-required="true"
                  />
                  <button
                    id="sapphire-auth-toggle-password"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="mr-2 h-8 w-8 rounded-xl flex items-center justify-center text-[#64748b] hover:bg-slate-50 hover:text-[#2563eb] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  id="sapphire-auth-error"
                  role="alert"
                  aria-live="polite"
                  className="sapphire-auth__error rounded-xl bg-[#fef2f2] border border-[#fecaca] px-3 py-2.5 text-xs font-semibold text-[#dc2626] flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" /> {error}
                </div>
              )}

              <button
                id="sapphire-auth-submit-button"
                type="submit"
                disabled={isSubmitting}
                className="sapphire-auth__submit mt-2 h-12 rounded-2xl bg-[#2563eb] text-white text-sm font-semibold tracking-wide hover:bg-[#1d4ed8] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                      aria-hidden="true"
                    />
                    SIGNING IN…
                  </>
                ) : (
                  "SIGN IN"
                )}
              </button>

              <div
                id="sapphire-auth-test-accounts"
                className="sapphire-auth__helpers rounded-2xl bg-slate-50 border border-[#f1f5f9] p-3"
              >
                <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Test accounts</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: "C1234567", pw: "Sapphire123" },
                    { id: "C7654321", pw: "Test1234" },
                  ].map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setIdentifier(a.id);
                        setPassword(a.pw);
                      }}
                      className="rounded-xl bg-white border border-[#e2e8f0] px-3 py-2 text-left hover:border-[#2563eb]/30 hover:bg-blue-50/50 transition-colors"
                    >
                      <span className="block text-xs font-mono font-bold text-slate-800">{a.id}</span>
                      <span className="block text-[11px] text-slate-500">{a.pw}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <footer
            id="sapphire-auth-footer"
            className="sapphire-auth__footer text-center flex flex-col gap-1"
          >
            <p className="text-sm font-medium text-[#141820]">Sapphire Version 2.0</p>
            <p className="text-sm text-[#8a9099]">Sapphire is an Internal Product of The Standard Bank Stanlib Group</p>
          </footer>
        </motion.div>
      </section>
    </main>
  );
}

// Back-compat alias for legacy import path
export const AccessAccount = SapphireAuthView;
export default SapphireAuthView;
