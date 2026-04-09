import React, { useState } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogoFull, LogoIcon } from "@/components/Logo";
import Loader, { ButtonLoader } from "@/components/ui/loader";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// lucide
import {
  Users, Eye, EyeOff, CheckCircle2,
  ArrowRight, BookOpen, GraduationCap,
  Wrench, TrendingUp, Globe, Award, ShieldCheck, School,
  Landmark, Stethoscope, Activity, Shield, Bus, Package,
  UtensilsCrossed, FileText, UserCog
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleConfig = {
  role: Role;
  label: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accentColor: string;
};

// ─── Roles ────────────────────────────────────────────────────────────────────

const roles: RoleConfig[] = [
  {
    role: "admin",
    label: "Administrator",
    desc: "Full system access & reports",
    icon: <ShieldCheck size={18} />,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    accentColor: "bg-indigo-50 ring-2 ring-indigo-500/20",
  },
  {
    role: "teacher",
    label: "Teacher",
    desc: "Marks, attendance & classes",
    icon: <BookOpen size={18} />,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentColor: "bg-sky-50 ring-2 ring-sky-500/20",
  },
  {
    role: "parent",
    label: "Parent / Student",
    desc: "Results, fees & attendance",
    icon: <GraduationCap size={18} />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentColor: "bg-emerald-50 ring-2 ring-emerald-500/20",
  },
  {
    role: "staff",
    label: "Staff / Worker",
    desc: "Tasks, attendance & notices",
    icon: <Wrench size={18} />,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentColor: "bg-amber-50 ring-2 ring-amber-500/20",
  },
];

// ─── Left panel stats ─────────────────────────────────────────────────────────

const stats = [
  { icon: <Users size={14} />, value: "12K+", label: "Students" },
  { icon: <Globe size={14} />, value: "340+", label: "Schools" },
  { icon: <TrendingUp size={14} />, value: "99.9%", label: "Uptime" },
];

// ─── Testimonial ──────────────────────────────────────────────────────────────

const testimonial = {
  quote: "EduCore transformed how we manage our school. Fee tracking alone saves us hours every week.",
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
    { id: "dashboard", label: "General Staff", icon: Wrench },
    { id: "bursar", label: "Bursar's Office", icon: Landmark },
    { id: "admissions", label: "Admissions Office", icon: GraduationCap },
    { id: "inventory", label: "Inventory & ICT", icon: Package },
    { id: "library", label: "School Library", icon: BookOpen },
    { id: "sanatorium", label: "Health Clinic", icon: Stethoscope },
    { id: "boarding", label: "Boarding & Welfare", icon: Activity },
    { id: "operations", label: "Site Operations", icon: Shield },
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

  function handleLogin() {
    if (!selected || loading) return;
    setLoading(true);
    setProgress(0);

    // Increment progress over 5s
    const duration = 5000;
    const interval = 40;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    const timer = setInterval(() => {
      setProgress(prev => Math.min(100, prev + increment));
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
      
      const routeMap = portal === "highschool" ? highschoolRoutes : primaryRoutes;
      navigate(routeMap[selected]);
    }, duration);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
        .login-root, .login-root * { font-family: 'DM Sans', sans-serif !important; }
        .serif-hero { font-family: 'DM Serif Display', serif !important; }
      `}</style>

      <div className="login-root min-h-screen bg-slate-50 flex">

        {/* ── LEFT BRAND PANEL ──────────────────────────────────────── */}
        <aside className="hidden lg:flex w-[440px] min-w-[440px] bg-[#1E1B4B] flex-col p-12 relative overflow-hidden">
          {/* Orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-600/15 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-violet-600/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-900/20 pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10 mb-12">
            <LogoFull src="/draklogo.png" className="h-[110px] w-auto" />
          </div>

          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400 mb-4">
              Kenya's #1 School Platform
            </p>
            <h1 className="serif-hero text-[40px] text-white leading-[1.15] mb-5">
              Manage your school<br />
              <em className="text-indigo-300 not-italic">with clarity.</em>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              A unified platform for administrators, teachers, parents and staff — built specifically for Kenyan schools.
            </p>

            {/* Stats */}
            <div className="flex gap-0 mt-10 divide-x divide-white/10">
              {stats.map((s) => (
                <div key={s.label} className="px-6 first:pl-0 last:pr-0">
                  <div className="flex items-center gap-1.5 mb-1 text-indigo-300">
                    {s.icon}
                  </div>
                  <p className="text-[22px] font-semibold text-white leading-none">{s.value}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-10 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.04]">
              <div className="flex items-start gap-1.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} size={11} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-[12px] text-slate-300 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-2.5 mt-3">
                <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white">{testimonial.name}</p>
                  <p className="text-[10px] text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live footer */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/[0.07] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs text-slate-400 font-medium">Bright Futures Academy</span>
            </div>
            <span className="text-[10px] text-slate-600">v1.0 · 🇰🇪</span>
          </div>
        </aside>

        {/* ── RIGHT FORM PANEL ──────────────────────────────────────── */}
        <main className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto bg-white lg:bg-slate-50">
          <div className="w-full max-w-[420px]">

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center justify-center mb-10">
              <LogoFull src="/logo.png" className="h-[110px] w-auto" />
            </div>

            {/* Portal Selector */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Select Portal
              </p>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                {(['primary', 'highschool'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPortal(p)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      portal === p
                        ? "bg-white text-indigo-700 shadow-sm border border-slate-200 font-semibold"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {p === 'primary' ? <School size={14} className={portal === p ? "text-indigo-500" : "text-slate-400"} /> : <BookOpen size={14} className={portal === p ? "text-indigo-500" : "text-slate-400"} />}
                    {p === 'primary' ? 'Primary' : 'High School'}
                  </button>
                ))}
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1.5">
                Welcome back
              </h2>
              <p className="text-sm text-slate-500">Select your role and sign in to continue</p>
            </div>

            {/* ── Role Selector ──────────────────────────────────────── */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Your role
              </p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSelected(r.role)}
                    className={cn(
                      "relative rounded-2xl p-4 text-left transition-all duration-200 bg-white group border-0",
                      selected === r.role
                        ? r.accentColor + " shadow-indigo-100 shadow-lg scale-[1.02]"
                        : "hover:bg-slate-50 hover:shadow-sm"
                    )}
                  >
                    {selected === r.role && (
                      <span className="absolute top-2.5 right-2.5">
                        <CheckCircle2 size={13} className={r.iconColor} />
                      </span>
                    )}
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2.5", r.iconBg, r.iconColor)}>
                      {r.icon}
                    </div>
                    <p className="text-[12px] font-semibold text-slate-800 leading-tight mb-0.5">{r.label}</p>
                    <p className="text-[10px] text-slate-400 leading-snug">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Staff Department Selector ─────────────────────────────── */}
            {selected === "staff" && (() => {
              const deptRoles = portal === "highschool" ? highschoolStaffRoles : primaryStaffRoles;
              return (
                <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    Select Department
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {deptRoles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setStaffRole(role.id)}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200",
                          staffRole === role.id
                            ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500/10 shadow-sm"
                            : "bg-white border-slate-100 hover:border-slate-200 text-slate-500"
                        )}
                      >
                        <div className={cn(
                          "h-7 w-7 rounded-lg flex items-center justify-center shrink-0",
                          staffRole === role.id ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400"
                        )}>
                          <role.icon size={14} />
                        </div>
                        <span className={cn(
                          "text-[11px] font-bold leading-tight",
                          staffRole === role.id ? "text-indigo-900" : "text-slate-600"
                        )}>
                          {role.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            <Separator className="my-5" />

            {/* ── Credentials ────────────────────────────────────────── */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-slate-600">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@shule.go.ke"
                  value={emailValue}
                  readOnly={!!selected}
                  key={selected}
                  className={cn(
                    "h-10 text-sm border-slate-200 rounded-lg placeholder:text-slate-300",
                    "focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500",
                    selected && "bg-slate-50 text-slate-600"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-slate-600">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    defaultValue={selected ? "demo1234" : ""}
                    key={`pwd-${selected}`}
                    className={cn(
                      "h-10 text-sm border-slate-200 rounded-lg pr-10 placeholder:text-slate-300",
                      "focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mt-4 mb-5">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(!!v)}
                  className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <Label htmlFor="remember" className="text-xs text-slate-500 font-normal cursor-pointer select-none">
                  Remember me for 30 days
                </Label>
              </div>
              <a href="#" className="text-xs text-indigo-600 font-medium hover:underline transition-colors">
                Forgot password?
              </a>
            </div>

            {/* CTA */}
            <Button
              onClick={handleLogin}
              disabled={!selected || loading}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-semibold transition-all duration-150",
                selected && !loading
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200/60"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              )}
            >
              {loading ? (
                <><ButtonLoader className="mr-2" />Signing in…</>
              ) : selected ? (
                <>Sign in as {selectedConfig?.label}<ArrowRight size={14} className="ml-2" /></>
              ) : (
                "Select a role to continue"
              )}
            </Button>

            {/* Demo credentials hint */}
            {selected && (
              <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Demo credentials</span>
                  <Badge variant="secondary" className={cn(
                    "text-[10px] h-4 px-2 border-0 font-semibold",
                    selectedConfig?.iconBg, selectedConfig?.iconColor
                  )}>
                    {selectedConfig?.label}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  {[
                    { key: "Email", val: emailValue },
                    { key: "Password", val: "demo1234" },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400 w-16 flex-shrink-0">{row.key}</span>
                      <code className="text-slate-700 font-mono bg-white border border-slate-100 rounded px-1.5 py-0.5 text-[11px]">
                        {row.val}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <p className="text-center text-[11px] text-slate-400 mt-8">
              EduCore v1.0 — Built for Kenyan Schools 🇰🇪
            </p>
          </div>
        </main>

        {/* Branded Loader Overlay */}
        {loading && (
          <Loader 
            fullScreen 
            variant="progress"
            text="Securing your session" 
            subText="Bright Futures Academy · School Management System"
            size="lg"
            progress={progress}
            steps={["Authenticating", "Loading Environment", "Fetching Modules", "Syncing Data", "Ready"]}
          />
        )}
      </div>
    </>
  );
}