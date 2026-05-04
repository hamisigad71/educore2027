import React, { useState } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogoFull, LogoIcon } from "@/components/Logo";
import Loader, { ButtonLoader } from "@/components/ui/loader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  Users, Eye, EyeOff, ArrowRight, BookOpen, GraduationCap,
  Wrench, TrendingUp, Globe, Star, ShieldCheck, School,
  Landmark, Stethoscope, Activity, Shield, Package,
  UtensilsCrossed, FileText, UserCog, Sparkles, Check,
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
    iconColor: "text-indigo-600",
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
        <aside className="hidden lg:flex w-[460px] min-w-[460px] bg-slate-950 flex-col p-12 relative overflow-hidden h-full">
          {/* Subtle Branded Background orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-600/10 pointer-events-none blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-violet-600/8 pointer-events-none blur-3xl" />

          {/* Logo - Direct Implementation for Stability */}
          <div className="relative z-10 mb-8 h-16 w-fit">
             <img 
               src="/draklogo.png" 
               alt="EduCore" 
               className="h-full w-auto object-contain drop-shadow-xl" 
             />
          </div>

          {/* Headline - Centered Stack */}
          <div className="flex-1 flex flex-col justify-center relative z-10 max-w-[360px]">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 w-fit">
              <Sparkles className="size-3 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                Kenya's #1 School Platform
              </span>
            </div>

            <h1 className="serif-hero text-[34px] text-white leading-[1.1] mb-5 tracking-tight">
              Manage your school<br />
              <span className="text-indigo-200 italic">
                with absolute clarity.
              </span>
            </h1>
            
            <p className="text-[14px] text-slate-400 leading-relaxed font-medium mb-8">
              A unified ecosystem for administrators, teachers, parents and staff — engineered for excellence in Kenyan education.
            </p>

            {/* Stats - Grid Architecture */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 mb-10">
              {stats.map((s) => (
                <div key={s.label}>
                   <p className="text-2xl font-black text-white tracking-tighter">{s.value}</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Premium Testimonial Card */}
            <Card className="bg-white/[0.03] border-white/7 backdrop-blur-md rounded-[24px] overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[13px] text-slate-200 leading-relaxed font-medium italic mb-5">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-indigo-900/50">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white leading-tight">{testimonial.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>

          {/* Footer - Anchored to bottom */}
          <div className="relative z-10 mt-12 pt-6 border-t border-white/5 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                System Operational
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              v1.2.0-PRO · 🇰🇪
            </span>
          </div>
        </aside>

        {/* ══════════════════════════════════════════
            RIGHT FORM PANEL
        ══════════════════════════════════════════ */}
        <main className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
          <div className="w-full max-w-[420px]">

            {/* Mobile logo */}
            <div className="flex lg:hidden justify-center mb-8 h-12">
              <img 
                src="/draklogo.png" 
                alt="EduCore" 
                className="h-full w-auto object-contain" 
              />
            </div>

            {/* ── Portal Toggle ── */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-2">
              Environment
            </p>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl mb-8">
              {(["primary", "highschool"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPortal(p)}
                  className={cn(
                    "flex items-center justify-center gap-2 h-10 rounded-xl text-[12.5px] font-semibold transition-all duration-200",
                    portal === p
                      ? "bg-white text-indigo-700 shadow-sm border border-slate-200/70 font-bold"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {p === "primary" ? (
                    <School size={14} className={portal === p ? "text-indigo-600" : "text-slate-400"} />
                  ) : (
                    <GraduationCap size={14} className={portal === p ? "text-indigo-600" : "text-slate-400"} />
                  )}
                  {p === "primary" ? "Primary" : "High School"}
                </button>
              ))}
            </div>

            {/* ── Greeting ── */}
            <div className="mb-8">
              <h2 className="text-[26px] font-black text-slate-900 tracking-tight leading-tight mb-1">
                Welcome back
              </h2>
              <p className="text-[13px] text-slate-400 font-medium">
                Authentication required to access your dashboard.
              </p>
            </div>

            {/* ── Role Selector ── */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-3">
              Select Your Role
            </p>
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {roles.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelected(r.role)}
                  className={cn(
                    "relative rounded-2xl p-4 text-left border bg-white transition-all duration-200 group",
                    selected === r.role
                      ? "border-indigo-300 bg-indigo-50/40 shadow-[0_0_0_3px_rgba(99,102,241,0.08)]"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/60"
                  )}
                >
                  {selected === r.role && (
                    <div className="absolute top-3 right-3 h-[18px] w-[18px] rounded-full bg-indigo-600 flex items-center justify-center">
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                      r.iconBg,
                      r.iconColor
                    )}
                  >
                    {r.icon}
                  </div>
                  <p className="text-[12.5px] font-bold text-slate-900 mb-0.5 leading-tight">
                    {r.label}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium leading-snug">
                    {r.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* ── Staff Department ── */}
            {selected === "staff" && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-3">
                  Departmental Context
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {deptRoles.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setStaffRole(d.id)}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200",
                        staffRole === d.id
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-slate-100 hover:border-slate-200 text-slate-600"
                      )}
                    >
                      <div
                        className={cn(
                          "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0",
                          staffRole === d.id
                            ? "bg-white/20 text-white"
                            : "bg-slate-50 text-slate-400"
                        )}
                      >
                        <d.icon size={14} />
                      </div>
                      <span className="text-[11px] font-bold leading-tight">
                        {d.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-slate-100 mb-6" />

            {/* ── Credentials ── */}
            <div className="space-y-4 mb-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Identity
                </Label>
                <Input
                  type="email"
                  placeholder="you@shule.go.ke"
                  value={emailValue}
                  readOnly={!!selected}
                  key={selected}
                  className={cn(
                    "h-11 px-4 text-[13.5px] border-slate-200 rounded-xl transition-all",
                    "focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400",
                    selected && "bg-slate-50 font-semibold text-indigo-800 border-indigo-100"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Security Key
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    defaultValue={selected ? "demo1234" : ""}
                    key={`pwd-${selected}`}
                    className="h-11 px-4 text-[13.5px] border-slate-200 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Remember / Forgot ── */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(!!v)}
                  className="size-4 rounded-md border-slate-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <Label
                  htmlFor="remember"
                  className="text-[12px] text-slate-500 font-semibold cursor-pointer hover:text-slate-700 transition-colors"
                >
                  Persistent session
                </Label>
              </div>
              <a
                href="#"
                className="text-[12px] text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
              >
                Reset Password
              </a>
            </div>

            {/* ── CTA Button ── */}
            <Button
              onClick={handleLogin}
              disabled={!selected || loading}
              className={cn(
                "relative w-full h-12 rounded-2xl text-[14px] font-black tracking-tight transition-all duration-200 group",
                selected && !loading
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <ButtonLoader className="mr-1" />
                    Establishing Connection…
                  </>
                ) : selected ? (
                  <>
                    Initialize {selectedConfig?.label} Session
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </>
                ) : (
                  "Identity Undefined"
                )}
              </span>
            </Button>

            {/* ── Dev Hint ── */}
            {selected && (
              <div className="mt-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 p-4 animate-in slide-in-from-bottom-1 duration-300">
                <p className="text-[9.5px] font-black text-indigo-300 uppercase tracking-[0.2em] text-center mb-3">
                  Development Access
                </p>
                <div className="space-y-1.5">
                  {[
                    { key: "ID", val: emailValue },
                    { key: "SEC", val: "demo1234" },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-400">
                        {row.key}
                      </span>
                      <code className="text-[11px] font-bold text-indigo-800 bg-white/70 px-2.5 py-1 rounded-lg border border-indigo-100">
                        {row.val}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Brand Footer ── */}
            <div className="mt-8 flex flex-col items-center gap-1.5 opacity-25">
              <LogoIcon size={20} />
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                EduCore Ecosystem · v1.2.0
              </p>
            </div>
          </div>
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