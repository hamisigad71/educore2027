import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogoFull } from "../components/Logo";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const TRUST_ITEMS = [
  "1,500+ Schools",
  "500k+ Students",
  "99.9% Uptime",
];

const FEATURES = [
  "Staff & student management",
  "Smart timetabling",
  "Academic Analytics",
  "Parent & student portal",
];

export default function WelcomeScreen() {
  return (
    <div className="md:hidden flex flex-col min-h-[100dvh] bg-white overflow-hidden">

      {/* ─── TOP HERO SECTION ─────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-7 pt-14 pb-8 overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(155deg, rgba(6, 22, 40, 0.55) 0%, rgba(10, 37, 64, 0.45) 55%, rgba(46, 98, 166, 0.55) 100%), url('/mobile-hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Decorative rings */}
        <div className="absolute top-[-80px] left-[-80px] w-[260px] h-[260px] rounded-full border border-white/[0.06]" />
        <div className="absolute top-[-40px] left-[-40px] w-[180px] h-[180px] rounded-full border border-white/[0.08]" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full border border-white/[0.05]" />
        <div className="absolute bottom-[20px] right-[-90px] w-[280px] h-[280px] rounded-full bg-[#2E62A6]/20 blur-3xl pointer-events-none" />
        <div className="absolute top-[30px] right-[-60px] w-[200px] h-[200px] rounded-full bg-[#2E62A6]/10 blur-2xl pointer-events-none" />

        <div className="h-[142px]" />

        {/* Headline */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-center z-10 mb-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#2E62A6]/90 mb-3" style={{ color: "#7aaee8" }}>
            
          </p>
          <h1 className="text-[2rem] font-black text-white leading-tight tracking-tight">
            Manage your school<br />
            <span className="text-[#7aaee8]">
              with clarity.
            </span>
          </h1>
          <p className="mt-3 text-[13px] text-indigo-200/70 font-medium leading-relaxed max-w-[260px] mx-auto">
            Attendance, fees, grades & parent communication — all in one place.
          </p>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="flex items-center gap-3 z-10"
        >
          {TRUST_ITEMS.map((item, i) => (
            <React.Fragment key={item}>
              <span className="text-[10px] font-black text-white/60 whitespace-nowrap">{item}</span>
              {i < TRUST_ITEMS.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Curved bottom edge */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 375 40" preserveAspectRatio="none" className="w-full h-10 block">
            <path d="M0,40 C120,5 255,5 375,40 L375,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* ─── BOTTOM WHITE SECTION ─────────────────────────────────── */}
      <div className="bg-white px-7 pt-2 pb-10">
        {/* Feature checklist */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-8"
        >
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#2E62A6] shrink-0" />
              <span className="text-[11px] font-semibold text-slate-600 leading-tight">{f}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="flex flex-row gap-3"
        >
          <Link
            to="/login?tab=register"
            className="flex items-center justify-center gap-1.5 flex-1 py-3 rounded-2xl font-black text-[12px] text-white shadow-lg active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #0A2540 0%, #2E62A6 100%)", boxShadow: "0 4px 20px rgba(10,37,64,0.45)" }}
          >
            Create Account
            <ArrowRight size={13} />
          </Link>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 flex-1 py-3 rounded-2xl font-black text-[12px] text-slate-700 border-2 border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition-all"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Professional Footer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-6"
        >
          <LogoFull className="h-[52px] w-auto opacity-70 grayscale hover:grayscale-0 transition-all duration-300" />
          
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
            <a href="#" className="hover:text-[#2E62A6] transition-colors">Support</a>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <a href="#" className="hover:text-[#2E62A6] transition-colors">Privacy</a>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <a href="#" className="hover:text-[#2E62A6] transition-colors">Terms</a>
          </div>

          <div className="flex flex-col items-center gap-1.5 pb-2">
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              &copy; {new Date().getFullYear()} EduCore. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
              🇰🇪 Proudly built for Kenyan Education
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
