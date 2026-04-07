import React, { useState } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogoFull } from "@/components/Logo";

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
  Users, Eye, EyeOff, Loader2, CheckCircle2,
  ArrowRight, BookOpen, GraduationCap,
  Wrench, TrendingUp, Globe, Award, Crown,
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
    desc: "Full system access — students, fees, staff, reports",
    icon: <Crown size={15} />,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    accentColor: "border-indigo-500 bg-indigo-50/60",
  },
  {
    role: "teacher",
    label: "Teacher",
    desc: "Enter marks, take attendance, manage classes",
    icon: <BookOpen size={15} />,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentColor: "border-sky-500 bg-sky-50/60",
  },
  {
    role: "parent",
    label: "Parent / Student",
    desc: "View results, fees balance, attendance reports",
    icon: <GraduationCap size={15} />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentColor: "border-emerald-500 bg-emerald-50/60",
  },
  {
    role: "staff",
    label: "Staff / Worker",
    desc: "Track tasks, attendance and school notices",
    icon: <Wrench size={15} />,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentColor: "border-amber-500 bg-amber-50/60",
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

  const [selected, setSelected] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const selectedConfig = roles.find((r) => r.role === selected);
  const emailValue = selected ? `${selected}@shule.go.ke` : "";

  function handleLogin() {
    if (!selected || loading) return;
    setLoading(true);
    setTimeout(() => {
      login(selected);
      const routeMap: Record<string, string> = {
        admin:   "/admin/dashboard",
        teacher: "/teacher/dashboard",
        parent:  "/parent-and-student-portal/dashboard",
        staff:   "/staff/dashboard",
      };
      navigate(routeMap[selected]);
    }, 900);
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
                      "relative rounded-xl p-3.5 text-left border-[1.5px] transition-all duration-150 bg-white group",
                      selected === r.role
                        ? r.accentColor + " shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/80"
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
                <><Loader2 size={15} className="mr-2 animate-spin" />Signing in…</>
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
      </div>
    </>
  );
}