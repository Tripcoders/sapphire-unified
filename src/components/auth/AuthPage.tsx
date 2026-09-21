import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Info, Sparkles, ShieldCheck, Zap, Users } from "lucide-react";
import { validateLogin, validateCNumber, TEST_ACCOUNTS, type AgentUser } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

type Mode = "signin" | "signup";

export function AuthPage({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [identifier, setIdentifier] = useState("C1234567");
  const [password, setPassword] = useState("Sapphire123");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState({ name: "", cNumber: "", email: "", password: "", confirm: "" });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const user = validateLogin(identifier, password);
    if (!user) {
      setError("Invalid C Number / email or password. Try one of the test accounts.");
      setLoading(false);
      return;
    }
    login(user);
    setLoading(false);
    onAuthenticated();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateCNumber(signupData.cNumber)) {
      setError("C Number must be in format C + 7 digits (e.g. C1234567)");
      return;
    }
    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (signupData.password !== signupData.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    const newUser: AgentUser = {
      id: `agent_${Date.now()}`,
      cNumber: signupData.cNumber.toUpperCase(),
      name: signupData.name || "New Consultant",
      email: signupData.email || `${signupData.cNumber.toLowerCase()}@standardbank.co.za`,
      role: "Insurance Consultant",
      roleCode: "CONSULTANT",
      branch: "Johannesburg Central",
      branchCode: "JHB_CENTRAL",
      avatar: (signupData.name || "NC").split(" ").map((s) => s[0]).join("").slice(0,2).toUpperCase(),
      phone: "+27 82 000 0000",
    };
    login(newUser);
    setLoading(false);
    onAuthenticated();
  };

  const fillTest = (c: string, pw: string) => {
    setIdentifier(c);
    setPassword(pw);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left illustration */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex w-[46%] relative bg-gradient-to-b from-[#2563eb] to-[#00319c] overflow-hidden flex-col"
      >
        {/* white blob */}
        <div className="absolute -right-24 top-[12%] h-[640px] w-[640px] rounded-full bg-white/95" />
        {/* content */}
        <div className="relative z-10 p-10 flex flex-col h-full text-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[16px] bg-white text-[#2563eb] flex items-center justify-center font-bold">â—†</div>
            <span className="font-semibold tracking-tight">Sapphire</span>
            <span className="text-white/70 text-xs ml-1">by Standard Bank</span>
          </div>

          <div className="mt-14">
            <h1 className="text-4xl font-bold leading-tight">Internal Tools</h1>
            <p className="text-white/80 mt-2 text-sm">Because Our Customers Deserve The Best</p>
          </div>

          {/* Illustration placeholder - stylized */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="relative w-[420px] h-[420px]">
              {/* soft shadow circle */}
              <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
              {/* person card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[420px] rounded-[32px] bg-white shadow-2xl overflow-hidden p-6 flex flex-col gap-4 border border-white/20"
              >
                <div className="h-32 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <Users className="h-14 w-14 text-[#2563eb]/70" strokeWidth={1.6} />
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                  <div className="h-3 w-full rounded-full bg-slate-100" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="sapphire-card p-3 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700">Verified</span>
                  </div>
                  <div className="sapphire-card p-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <span className="text-xs font-semibold text-slate-700">Instant</span>
                  </div>
                </div>
                <div className="mt-auto flex items-center gap-2 text-xs text-slate-500">
                  <Sparkles className="h-4 w-4 text-[#2563eb]" /> Sapphire makes insurance a breeze
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
            <span>Stanlib Group â€¢ Secure internal access</span>
            <span>v2.0</span>
          </div>
        </div>
      </motion.div>

      {/* Right form */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* top brand mobile */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6">
          <div className="h-8 w-8 rounded-[16px] bg-[#2563eb] text-white flex items-center justify-center font-bold">â—†</div>
          <span className="font-bold text-[#2563eb]">sapphire</span>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[420px]"
          >
            {/* header */}
            <div className="text-center mb-8">
              <div className="mx-auto hidden lg:flex h-10 w-10 rounded-[16px] bg-[#2563eb] text-white items-center justify-center font-bold mb-4">â—†</div>
              <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Access account.</h2>
              <p className="text-[13.5px] text-slate-500 mt-2 leading-relaxed">
                Welcome to Sapphire a way to make <br /> insurance a breeze for consultants.
              </p>
            </div>

            {/* toggle */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 py-2.5 rounded-[16px] text-sm font-semibold transition-all ${mode === "signin" ? "bg-white" : "text-slate-500 hover:text-slate-700"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-2.5 rounded-[16px] text-sm font-semibold transition-all ${mode === "signup" ? "bg-white" : "text-slate-500 hover:text-slate-700"}`}
              >
                Create Account
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === "signin" ? (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignIn}
                  className="space-y-4"
                >
                  <div className="sapphire-card p-7 space-y-4">
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-700 tracking-wide">Standard C Number or SB email</label>
                      <div className="relative group">
                        <input
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="C1234567 or name@standardbank.co.za"
                          className="w-full h-[52px] rounded-2xl border-2 border-[#F1F5F9] bg-white px-4 pr-10 text-[14px] font-medium placeholder:text-slate-400 outline-none transition-all hover:border-[#F1F5F9] focus:border-[#2563eb] focus:ring-0"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-[16px] bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:bg-[#2563eb]/10 group-focus-within:text-[#2563eb] transition-colors">
                          <Info className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-700 tracking-wide">Password</label>
                      <div className="relative group">
                        <input
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full h-[52px] rounded-2xl border-2 border-[#F1F5F9] bg-white px-4 pr-11 text-[14px] font-medium placeholder:text-slate-400 outline-none transition-all hover:border-[#F1F5F9] focus:border-[#2563eb] focus:ring-0"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-[16px] bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="flex justify-end">
                        <a className="text-xs font-semibold text-[#2563eb] hover:underline">Forgot password?</a>
                      </div>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs font-medium text-red-700">
                        {error}
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="w-full h-[52px] rounded-2xl bg-[#2563eb] text-white font-semibold text-sm"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Signing inâ€¦
                        </>
                      ) : (
                        "SIGN IN"
                      )}
                    </motion.button>
                  </div>

                  {/* test accounts */}
                  <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#2563eb]" /> Test accounts â€” tap to fill
                    </p>
                    <div className="grid gap-2">
                      {TEST_ACCOUNTS.slice(0, 3).map((a) => (
                        <button
                          key={a.cNumber}
                          type="button"
                          onClick={() => fillTest(a.cNumber, a.password)}
                          className="flex items-center justify-between rounded-[16px] bg-white border border-slate-200 px-3 py-2.5 text-left hover:border-[#2563eb]/30 hover:bg-blue-50/50 transition-colors group"
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-[#2563eb]">{a.cNumber} â€¢ {a.name}</p>
                            <p className="text-[11px] text-slate-500">{a.email}</p>
                          </div>
                          <span className="text-[11px] font-mono bg-slate-900 text-white px-2 py-1 rounded-lg">{a.password}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">Internal tool: Use your Standard Bank C Number + password.</p>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignUp}
                  className="space-y-4"
                >
                  <div className="sapphire-card p-7 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Full Name</label>
                        <input
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          placeholder="e.g. Tal Hassal"
                          className="w-full h-[48px] rounded-2xl border-2 border-[#F1F5F9] bg-white px-4 text-sm font-medium outline-none hover:border-[#F1F5F9] focus:border-[#2563eb] focus:ring-0 transition-all"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700">C Number</label>
                          <input
                            value={signupData.cNumber}
                            onChange={(e) => setSignupData({ ...signupData, cNumber: e.target.value })}
                            placeholder="C1234567"
                            className="w-full h-[48px] rounded-2xl border-2 border-[#F1F5F9] bg-white px-4 text-sm font-mono font-medium tracking-wide outline-none hover:border-[#F1F5F9] focus:border-[#2563eb] focus:ring-0 transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700">SB Email</label>
                          <input
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            placeholder="name@standardbank.co.za"
                            className="w-full h-[48px] rounded-2xl border-2 border-[#F1F5F9] bg-white px-4 text-sm outline-none hover:border-[#F1F5F9] focus:border-[#2563eb] focus:ring-0 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Password</label>
                        <input
                          type={showPw ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          placeholder="Create password"
                          className="w-full h-[48px] rounded-2xl border-2 border-[#F1F5F9] bg-white px-4 text-sm outline-none hover:border-[#F1F5F9] focus:border-[#2563eb] focus:ring-0 transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                        <input
                          type={showPw ? "text" : "password"}
                          value={signupData.confirm}
                          onChange={(e) => setSignupData({ ...signupData, confirm: e.target.value })}
                          placeholder="Repeat password"
                          className="w-full h-[48px] rounded-2xl border-2 border-[#F1F5F9] bg-white px-4 text-sm outline-none hover:border-[#F1F5F9] focus:border-[#2563eb] focus:ring-0 transition-all"
                          required
                        />
                      </div>
                    </div>
                    {error && <div className="rounded-2xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs font-medium text-red-700">{error}</div>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-[52px] rounded-2xl bg-[#2563eb] text-white font-semibold text-sm"
                    >
                      {loading ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Creatingâ€¦</> : "CREATE ACCOUNT"}
                    </button>
                    <label className="flex items-center gap-2 text-xs text-slate-500">
                      <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} className="rounded" /> Show passwords
                    </label>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-xs text-slate-400 mt-6">
              Sapphire Version 2.0 â€¢ Sapphire is an Internal Product of The Standard Bank Stanlib Group
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}




