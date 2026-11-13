import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogoFull } from "../components/Logo";
import { ArrowRight, ShieldCheck, Check } from "lucide-react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const TRUST_METRICS = [
  { value: "1,500+", label: "Schools" },
  { value: "500k+", label: "Learners" },
  { value: "99.9%", label: "Uptime" },
];

const HIGHLIGHTS = [
  "Staff & Learner Records",
  "Automated Timetabling",
  "CBC & KCSE Gradebooks",
  "Parent & Student Portal",
];

export default function WelcomeScreen() {
  return (
    <div className="md:hidden flex flex-col min-h-[100dvh] bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#0A2540]/10 selection:text-[#0A2540]">
      
      {/* ─── TOP HERO WITH PROFESSIONAL PHOTOGRAPHY ───────────────── */}
      <div className="relative w-full h-[54dvh] min-h-[340px] max-h-[460px] flex flex-col justify-between p-5 overflow-hidden">
        {/* Background Image with Deep Gradient Shroud */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/mobile-hero-bg.jpg')" }}
        />
        {/* Multilayered high-contrast gradient so text pops with crisp legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/75 to-[#061628]/45 pointer-events-none" />

        {/* Top Floating Brand Pill */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.05}
          className="relative z-10 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
            <div className="h-5 w-5 rounded-full bg-white/20 p-1 flex items-center justify-center">
              <img src="/favicon.png" alt="EduCore" className="h-full w-full object-contain" />
            </div>
            <span className="text-[12px] font-black tracking-tight text-white flex items-center gap-1">
              EduCore <span className="text-emerald-400 text-[10px]">●</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-bold text-emerald-300">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span>MOE Compliant</span>
          </div>
        </motion.div>

        {/* Hero Headline & Subtitle */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
          className="relative z-10 text-center px-1 mb-2"
        >
          <h1 className="text-[1.85rem] xs:text-[2.1rem] font-black text-white leading-[1.12] tracking-tight">
            Manage your school<br />
            <span className="text-emerald-300">
              with absolute clarity.
            </span>
          </h1>

          <p className="mt-2.5 text-[12.5px] text-indigo-100/85 font-normal leading-relaxed max-w-[290px] mx-auto">
            Fee reconciliation, CBC rubrics, timetables & real-time guardian updates.
          </p>

          {/* Social Proof Pill Bar */}
          <div className="mt-4 inline-flex items-center justify-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/10">
            {TRUST_METRICS.map((item, i) => (
              <React.Fragment key={item.label}>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-black text-white">{item.value}</span>
                  <span className="text-[10px] font-medium text-indigo-200/70">{item.label}</span>
                </div>
                {i < TRUST_METRICS.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── BOTTOM FLOATING CARD BODY ────────────────────────────── */}
      <div className="relative -mt-6 z-20 flex-1 flex flex-col justify-between bg-white rounded-t-[32px] shadow-[0_-12px_30px_rgba(10,37,64,0.08)] px-5 pt-6 pb-6">
        
        <div className="space-y-5">
          {/* Subtle drag-pill handle */}
          <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto -mt-2 mb-3" />

          {/* Value Proposition Pills (Clean 2-column grid) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.25}
            className="grid grid-cols-2 gap-2"
          >
            {HIGHLIGHTS.map((item) => (
              <div 
                key={item} 
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100/90 text-left"
              >
                <div className="h-4.5 w-4.5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check size={11} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Prominent Action Buttons with Emil Kowalski Direct Touch Physics */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.35}
            className="flex flex-col gap-2.5 pt-1"
          >
            <motion.div
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
            >
              <Link
                to="/login?tab=register"
                className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl font-bold text-[13.5px] text-white shadow-md shadow-[#0A2540]/25 bg-[#0A2540] hover:bg-[#0A2540]/90 transition-colors"
              >
                <span>Create Account</span>
                <ArrowRight size={15} />
              </Link>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
            >
              <Link
                to="/login"
                className="w-full h-11 flex items-center justify-center rounded-2xl font-bold text-[13px] text-slate-700 border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Clean, Non-Crowded Footer */}
        <motion.footer
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.45}
          className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-center"
        >
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} EduCore · 🇰🇪 Designed for Kenya
          </p>
        </motion.footer>

      </div>

    </div>
  );
}
