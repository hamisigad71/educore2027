import React, { useState } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogoFull, LogoIcon } from "@/components/Logo";
import Loader, { ButtonLoader } from "@/components/ui/loader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  Users, Eye, EyeOff, ArrowRight, BookOpen, GraduationCap,
  Wrench, TrendingUp, Globe, Star, ShieldCheck, School,
  Landmark, Stethoscope, Activity, Shield, Package,
  UtensilsCrossed, FileText, UserCog, Crown, Check,
  Home,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleConfig = {
  role: Role;
  label: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
};

// ─── Roles ────────────────────────────────────────────────────────────────────

const roles: RoleConfig[] = [
  {
    role: "admin",
    label: "Administrator",
    desc: "Full system access & reports",
    icon: <ShieldCheck size={17} />,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-700",
  },
  {
    role: "teacher",
    label: "Teacher",
    desc: "Marks, attendance & classes",
    icon: <BookOpen size={17} />,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    role: "parent",
    label: "Parent / Student",
    desc: "Results, fees & attendance",
    icon: <GraduationCap size={17} />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    role: "staff",
    label: "Staff / Worker",
    desc: "Tasks, attendance & notices",
    icon: <Wrench size={17} />,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "12K+", label: "Students" },
  { value: "340+", label: "Schools" },
  { value: "99.9%", label: "Uptime" },
];

// ─── Testimonial ──────────────────────────────────────────────────────────────

const testimonial = {
  quote:
    "EduCore transformed how we manage our school. Fee tracking alone saves us hours every week.",
  name: "Mr. James Kamau",
  role: "Principal · Starehe Boys' Centre",
  initials: "JK",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [portal, setPortal] = useState<"primary" | "highschool">("primary");
  const [selected, setSelected] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [staffRole, setStaffRole] = useState<string>("dashboard");

  const highschoolStaffRoles = [
    { id: "dashboard",  label: "General Staff",    icon: Wrench },
    { id: "bursar",     label: "Bursar's Office",   icon: Landmark },
    { id: "admissions", label: "Admissions Office", icon: GraduationCap },
    { id: "inventory",  label: "Inventory & ICT",   icon: Package },
    { id: "library",    label: "School Library",    icon: BookOpen },
    { id: "sanatorium", label: "Health Clinic",     icon: Stethoscope },
    { id: "boarding",   label: "Boarding & Welfare",icon: Activity },
    { id: "operations", label: "Site Operations",   icon: Shield },
  ];

  const primaryStaffRoles = [
    { id: "dashboard",   label: "General Staff",    icon: Wrench },
    { id: "headteacher", label: "Head Teacher",      icon: UserCog },
    { id: "bursar",      label: "Bursar's Office",   icon: Landmark },
    { id: "secretary",   label: "Secretary / Clerk", icon: FileText },
    { id: "canteen",     label: "Canteen & Kitchen", icon: UtensilsCrossed },
  ];

  const selectedConfig = roles.find((r) => r.role === selected);
  const emailValue = selected ? `${selected}@shule.go.ke` : "";
  const deptRoles =
    portal === "highschool" ? highschoolStaffRoles : primaryStaffRoles;

  function handleLogin() {
    if (!selected || loading) return;
    setLoading(true);
    setProgress(0);

    const duration = 5000;
    const interval = 40;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + increment));
    }, interval);

    setTimeout(() => {
      clearInterval(timer);
      const dept = selected === "staff" ? staffRole : undefined;
      login(selected, portal, dept);

      const primaryRoutes: Record<string, string> = {
        admin:   "/admin/dashboard",
        teacher: "/teacher/dashboard",
        parent:  "/parent-and-student-portal/dashboard",
        staff:   `/staff/${staffRole}`,
      };
      const highschoolRoutes: Record<string, string> = {
        admin:   "/highschool/admin/dashboard",
        teacher: "/highschool/teacher/dashboard",
        parent:  "/highschool/parent-and-student-portal/dashboard",
        staff:   `/highschool/staff/${staffRole}`,
      };

      const routeMap =
        portal === "highschool" ? highschoolRoutes : primaryRoutes;
      navigate(routeMap[selected]);
    }, duration);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Serif+Display:ital@0;1&display=swap');
        .login-root, .login-root * { font-family: 'DM Sans', sans-serif !important; }
        .serif-hero { font-family: 'DM Serif Display', serif !important; }
      `}</style>

      <div className="login-root min-h-screen flex bg-slate-50">

        {/* ── LEFT BRAND PANEL ──────────────────────────────────────── */}
        {/*
          DESKTOP CHANGE 1: Reduced panel width from w-[460px] min-w-[460px]
          to w-[400px] min-w-[400px] — was dominating too much of the viewport
          (~36% on 1280px). Now sits at ~31%, giving the form side more room.
        */}
        <aside className="hidden lg:flex w-[400px] min-w-[400px] bg-primary flex-col p-12 relative overflow-hidden">
          {/* Subtle Branded Background orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/15 pointer-events-none blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-500/10 pointer-events-none blur-3xl" />

          {/*
            DESKTOP CHANGE 2: Edge-to-Edge Hero Branding
            Removed negative margins and gradient overlays to maximize image clarity.
            The image now spans the full width of the side panel for maximum impact.
          */}
          <div className="relative z-10 -mx-12 -mt-12 mb-10 overflow-hidden border-b border-indigo-300/10 group">
            <img
              src="/login-hero.png"
              alt="EduCore Branding"
              className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-[1.02]"
            />
          </div>

          {/* Headline - Centered Stack */}
          <div className="flex-1 flex flex-col justify-center relative z-10 max-w-[340px]">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 w-fit">
              <Crown className="size-3 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                Kenya's #1 School Platform
              </span>
            </div>

            <h1 className="serif-hero text-[34px] text-white leading-[1.1] mb-5 tracking-tight">
              Manage your school<br />
              <span className="text-emerald-300 italic">
                with absolute clarity.
              </span>
            </h1>
            
            <p className="text-[14px] text-indigo-300/80 leading-relaxed font-medium mb-8">
              A unified ecosystem for administrators, teachers, parents and staff — engineered for excellence in Kenyan education.
            </p>

            {/* Stats - Grid Architecture */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-indigo-300/10 mb-10">
              {stats.map((s) => (
                <div key={s.label}>
                   <p className="text-2xl font-black text-white tracking-tighter">{s.value}</p>
                   <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Premium Testimonial Card */}
            <Card className="bg-white/[0.03] border-white/5 backdrop-blur-md rounded-[24px] overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[13px] text-indigo-100 leading-relaxed font-medium italic mb-5">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-600 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-indigo-950/50">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white leading-tight">{testimonial.name}</p>
                      <p className="text-[10px] text-indigo-400 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>

          {/* Footer - Anchored to bottom */}
          <div className="relative z-10 mt-12 pt-6 border-t border-indigo-300/10 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] text-indigo-300 font-bold">
                System Operational
              </span>
            </div>
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
              v1.2.0-PRO · 🇰🇪
            </span>
          </div>
        </aside>

        {/* ══════════════════════════════════════════
            RIGHT FORM PANEL
        ══════════════════════════════════════════ */}
        <main className="flex-1 flex flex-col items-center lg:justify-center overflow-y-auto bg-white lg:bg-slate-50/50">
          
          {/* Marketing Image - True Full Width on Mobile */}
          <div className="lg:hidden w-full overflow-hidden rounded-b-[40px] shadow-sm shadow-slate-200 bg-white">
            <img 
              src="/wwp1.png" 
              alt="EduCore Features" 
              className="w-full h-auto block" 
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden"
          >
            {/* ── Background Orbs (Glass3D Atmos) ── */}
            <motion.div
              className="absolute rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"
              style={{ width: 400, height: 400, top: "20%", left: "10%" }}
              animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full bg-amber-500/5 blur-[100px] pointer-events-none"
              style={{ width: 300, height: 300, bottom: "20%", right: "10%" }}
              animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none"
              style={{ width: 250, height: 250, top: "50%", left: "60%" }}
              animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/*
              DESKTOP CHANGE 3: Reduced lg padding from lg:p-12 to lg:p-8
              on the card so the full form fits without scrolling on a standard
              1366×768 laptop screen.
            */}
            <Card className="w-full max-w-[480px] relative z-10 border border-white/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08),0_0_1px_rgba(255,255,255,1)_inset] bg-white/70 backdrop-blur-3xl rounded-[40px] transition-all duration-1000 overflow-hidden">
              {/* Grain/Noise Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              <CardContent className="p-7 sm:p-10 lg:p-8 relative z-20">
                <div className="w-full">

            {/* Mobile logo */}
            <div className="flex lg:hidden justify-center mb-10">
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src="/loader,logo.png" 
                alt="EduCore" 
                className="h-19 w-auto object-contain brightness-110" 
              />
            </div>

            {/* ── Portal Toggle ── */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-2">
              Environment
            </p>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl mb-8 border border-slate-200/50">
              {(["primary", "highschool"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPortal(p)}
                  className={cn(
                    "flex items-center justify-center gap-2 h-10 rounded-xl text-[12.5px] font-semibold transition-all duration-200",
                    portal === p
                      ? "bg-white text-primary shadow-sm border border-slate-200/70 font-bold"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {p === "primary" ? (
                    <School size={14} className={portal === p ? "text-primary" : "text-slate-400"} />
                  ) : (
                    <GraduationCap size={14} className={portal === p ? "text-primary" : "text-slate-400"} />
                  )}
                  {p === "primary" ? "Primary" : "High School"}
                </button>
              ))}
            </div>

            {/* ── Greeting ── */}
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-[32px] font-black text-slate-900 tracking-tighter leading-[1.1] mb-2">
                Welcome back
              </h2>
              <p className="text-[14px] text-slate-500 font-medium tracking-tight">
                Authentication required for secure gateway access.
              </p>
            </div>

            {/* ── Role Selector ── */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
              Select Your Role
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {roles.map((r, idx) => (
                <motion.button
                  key={r.role}
                  type="button"
                  onClick={() => setSelected(r.role)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    /*
                      DESKTOP CHANGE 4: Reduced role card border-radius from
                      rounded-[28px] to rounded-2xl (24px). At smaller card
                      sizes the 28px radius was collapsing into a pill shape.
                    */
                    "relative rounded-2xl p-5 text-left border transition-all duration-500 group overflow-hidden",
                    selected === r.role
                      ? "border-primary/40 bg-white shadow-[0_12px_24px_-8px_rgba(10,37,64,0.15)] ring-1 ring-primary/10"
                      : "border-slate-100 bg-slate-50/30 hover:border-primary/30 hover:bg-white"
                  )}
                >
                  <AnimatePresence>
                    {selected === r.role && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-4 right-4 h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-indigo-50"
                      >
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500",
                      r.iconBg,
                      r.iconColor,
                      selected === r.role && "scale-110"
                    )}
                  >
                    {r.icon}
                  </div>
                  <p className="text-[13px] font-bold text-slate-900 mb-1 leading-tight">
                    {r.label}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    {r.desc}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* ── Staff Department ── */}
            {selected === "staff" && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-4">
                  Departmental Access
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {deptRoles.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setStaffRole(d.id)}
                      className={cn(
                        "flex items-center gap-3 p-3.5 rounded-[18px] border text-left transition-all duration-300",
                        staffRole === d.id
                          ? "bg-primary border-primary text-white shadow-lg shadow-slate-300"
                          : "bg-white border-slate-200/60 hover:border-primary/30 text-slate-600"
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0",
                          staffRole === d.id
                            ? "bg-white/20 text-white"
                            : "bg-slate-50 text-slate-400"
                        )}
                      >
                        <d.icon size={15} />
                      </div>
                      <span className="text-[11.5px] font-bold leading-tight">
                        {d.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent mb-6" />

            {/* ── Credentials ── */}
            <div className="space-y-5 mb-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  System Identity
                </Label>
                <Input
                  type="email"
                  placeholder="you@shule.go.ke"
                  value={emailValue}
                  readOnly={!!selected}
                  key={selected}
                  className={cn(
                    "h-12 px-5 text-[14px] border-slate-200 rounded-[18px] transition-all duration-300",
                    "focus-visible:ring-[6px] focus-visible:ring-primary/10 focus-visible:border-primary/40",
                    selected && "bg-slate-50/80 font-semibold text-primary border-indigo-200/50"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Access Key
                </Label>
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    defaultValue={selected ? "demo1234" : ""}
                    key={`pwd-${selected}`}
                    className="h-11 px-5 text-[14px] border-slate-200 rounded-[16px] focus-visible:ring-[6px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Remember / Forgot ── */}
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(!!v)}
                  className="size-4.5 rounded-lg border-slate-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300"
                />
                <Label
                  htmlFor="remember"
                  className="text-[13px] text-slate-500 font-semibold cursor-pointer hover:text-slate-700 transition-colors"
                >
                  Trust this device
                </Label>
              </div>
              <a
                href="#"
                className="text-[13px] text-primary font-bold hover:text-indigo-800 transition-colors"
              >
                Forgot access key?
              </a>
            </div>

            {/* ── CTA Button ── */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2"
            >
              <Button
                onClick={handleLogin}
                disabled={!selected || loading}
                className={cn(
                  "relative w-full h-14 rounded-[22px] text-[15px] font-black tracking-tight transition-all duration-500 group overflow-hidden",
                  selected && !loading
                    ? "bg-primary hover:bg-[var(--primary)]/90 text-white shadow-[0_20px_40px_-12px_rgba(10,37,64,0.3)]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <ButtonLoader className="mr-2" />
                      Synchronizing Environment…
                    </>
                  ) : selected ? (
                    <>
                      Initialize {selectedConfig?.label}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </>
                  ) : (
                    "Select Role to Continue"
                  )}
                </span>
              </Button>
            </motion.div>

            {/*
              DESKTOP CHANGE 5: Quick Access hint is now gated behind
              process.env.NODE_ENV === "development" so demo credentials
              are never exposed in production builds.
            */}
            {selected && process.env.NODE_ENV === "development" && (
              <div className="mt-6 rounded-[22px] bg-slate-50/50 border border-slate-100 p-5 animate-in slide-in-from-bottom-2 duration-500">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] text-center mb-4">
                  Quick Access
                </p>
                <div className="space-y-2">
                  {[
                    { key: "ID", val: emailValue },
                    { key: "KEY", val: "demo1234" },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">
                        {row.key}
                      </span>
                      <code className="text-[11.5px] font-bold text-primary bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                        {row.val}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Brand Footer ── */}
            <div className="mt-12 flex flex-col items-center gap-2 opacity-30">
              <img 
                src="/logo.png" 
                alt="EduCore" 
                className="h-6 w-auto object-contain grayscale" 
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Secure Authentication Gateway
              </p>
            </div>
            </div>
            </CardContent>
          </Card>
          </motion.div>
        </main>

        {/* ── Full-screen Loader ── */}
        {loading && (
          <Loader
            fullScreen
            variant="progress"
            text="Securing your session"
            subText="Bright Futures Academy · School Management System"
            size="lg"
            progress={progress}
            steps={[
              "Authenticating",
              "Loading Environment",
              "Fetching Modules",
              "Syncing Data",
              "Ready",
            ]}
          />
        )}
      </div>
    </>
  );
}