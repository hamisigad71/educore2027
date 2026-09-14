import React, { useState } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Loader, { ButtonLoader } from "@/components/ui/loader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  Eye, EyeOff, ArrowRight, BookOpen, GraduationCap,
  Wrench, Star, ShieldCheck, School,
  Landmark, Stethoscope, Activity, Shield, Package,
  UtensilsCrossed, FileText, UserCog, Crown, Check,
} from "lucide-react";
import OtpVerificationModal from "@/components/auth/OtpVerificationModal";
import OnboardingVideo from "./onboarding-video";


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
  const { login, loginWithSupabase, signUpWithSupabase } = useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [portal, setPortal] = useState<"primary" | "highschool">("primary");
  const [selected, setSelected] = useState<Role>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  // Video overlay state
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [videoTarget, setVideoTarget] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [joinDate, setJoinDate] = useState("");
  
  // Specific Identification States
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [tscNumber, setTscNumber] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [position, setPosition] = useState("");
  
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [pendingAuthExecution, setPendingAuthExecution] = useState<(() => Promise<void>) | null>(null);

  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [staffRole, setStaffRole] = useState<string>("dashboard");
  const [authError, setAuthError] = useState<string | null>(null);

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
  const effectiveEmail = emailInput || (selected ? `${selected}@shule.go.ke` : "");
  const deptRoles =
    portal === "highschool" ? highschoolStaffRoles : primaryStaffRoles;

  async function handleLogin() {
    if ((!selected && !emailInput) || loading) return;
    setAuthError(null);

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
    const targetRole = selected || "admin";
    const targetPath = routeMap[targetRole] || "/admin/dashboard";

    if (passwordInput && effectiveEmail) {
      if (authMode === "signup") {
        if (passwordInput !== confirmPasswordInput) {
          setAuthError("Passwords do not match.");
          return;
        }
        if (!firstName || !lastName || !selected) {
          setAuthError("Please provide your name and select a role.");
          return;
        }

        // Strict Registration Fields Validation
        if (!schoolName || !joinDate) {
          setAuthError("Please provide both School Name and Join Date.");
          return;
        }

        if (selected === "student" && (!admissionNumber || !studentClass)) {
          setAuthError("Please provide both Admission Number and Class/Grade.");
          return;
        }

        if (selected === "teacher" && (!tscNumber || !employeeNumber)) {
          setAuthError("Please provide both TSC Number and Employee Number.");
          return;
        }

        if (selected === "staff" && (!employeeNumber || !position)) {
          setAuthError("Please provide both Employee Number and Position.");
          return;
        }

        const identificationData = {
          admissionNumber: selected === 'student' ? admissionNumber : undefined,
          studentClass: (selected === 'student' || selected === 'parent') ? studentClass : undefined,
          tscNumber: selected === 'teacher' ? tscNumber : undefined,
          employeeNumber: (selected === 'teacher' || selected === 'staff') ? employeeNumber : undefined,
          position: selected === 'staff' ? position : undefined,
          schoolName: schoolName || undefined,
          joinDate: joinDate || undefined,
        };

        const dept = selected === "staff" ? staffRole : undefined;
        
        // Save pending execution details directly to localStorage for Magic Link / cross-tab resumption
        localStorage.setItem("educore_pending_registration", JSON.stringify({
          email: effectiveEmail,
          password: passwordInput,
          userData: { 
            firstName, 
            lastName, 
            phone,
            role: selected, 
            schoolId: schoolCode,
            identificationData
          },
          portal, 
          dept,
          targetPath
        }));

        // Trigger OTP Modal for local active-tab verification
        setShowOtpModal(true);
        setShowOtpModal(true);
      } else {
        const dept = selected === "staff" ? staffRole : undefined;
        setPendingAuthExecution(() => async () => {
          setLoading(true);
          const result = await loginWithSupabase(effectiveEmail, passwordInput, portal, dept);
          setLoading(false);
          if (!result.success) {
            setAuthError(result.error || "Authentication failed. Please check credentials.");
            return;
          }
          setVideoTarget(targetPath);
          setShowVideoOverlay(true);
        });

        // Trigger OTP Modal
        setShowOtpModal(true);
      }
    } else {
      // Demo preset login
      setPendingAuthExecution(() => async () => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          const dept = selected === "staff" ? staffRole : undefined;
          login(selected, portal, dept);
          setVideoTarget(targetPath);
          setShowVideoOverlay(true);
        }, 1000);
      });


      // Trigger OTP Modal
      setShowOtpModal(true);
    }
  }

  async function handleOtpSuccess() {
    setShowOtpModal(false);

    // For signup flow: read stashed payload from localStorage and complete registration
    if (authMode === "signup") {
      const rawPending = localStorage.getItem("educore_pending_registration");
      if (rawPending) {
        try {
          const pending = JSON.parse(rawPending);
          setLoading(true);

          const result = await signUpWithSupabase(
            pending.email,
            pending.password,
            pending.userData,
            pending.portal,
            pending.dept
          );

          setLoading(false);
          localStorage.removeItem("educore_pending_registration");

          if (!result.success) {
            setAuthError(result.error || "Registration failed. Please try again.");
            return;
          }

          setVideoTarget(pending.targetPath);
          setShowVideoOverlay(true);
          return;
        } catch (e) {
          setLoading(false);
          setAuthError("Unexpected error during registration. Please try again.");
          return;
        }
      }
    }

    // For login flow: run the queued pending auth action
    if (pendingAuthExecution) {
      await pendingAuthExecution();
    }
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
        <aside className="hidden lg:flex w-[480px] min-w-[480px] bg-primary flex-col p-12 relative overflow-hidden">
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

            {/* ── Top Toggles ── */}
            <div className="w-full flex flex-col gap-3 mb-8">
              {/* Portal Toggle */}
              <div className="flex bg-slate-100/80 p-1 rounded-2xl gap-1 border border-slate-200/60">
                {(["primary", "highschool"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPortal(p)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-[13px] font-bold transition-all duration-300",
                      portal === p
                        ? "bg-white text-primary shadow-md shadow-slate-200/80 border border-slate-200/80 scale-[1.01]"
                        : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                    )}
                  >
                    {p === "primary" ? (
                      <School size={15} className={portal === p ? "text-indigo-600" : "text-slate-400"} strokeWidth={2.5} />
                    ) : (
                      <GraduationCap size={15} className={portal === p ? "text-emerald-600" : "text-slate-400"} strokeWidth={2.5} />
                    )}
                    <span className={portal === p ? "text-slate-800" : ""}>
                      {p === "primary" ? "Primary" : "High School"}
                    </span>
                    {portal === p && (
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full animate-pulse",
                        p === "primary" ? "bg-indigo-500" : "bg-emerald-500"
                      )} />
                    )}
                  </button>
                ))}
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-slate-100/80 p-1 rounded-2xl gap-1 border border-slate-200/60">
                {([
                  { id: "signin", label: "Sign In", emoji: "→" },
                  { id: "signup", label: "Create Account", emoji: "✦" },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setAuthMode(m.id);
                      setAuthError(null);
                    }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-[13px] font-bold transition-all duration-300",
                      authMode === m.id
                        ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.01]"
                        : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                    )}
                  >
                    <span className={authMode === m.id ? "opacity-70 text-xs" : "opacity-0 text-xs"}>{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>


            {/* ── Greeting ── */}
            <div className="mb-8 text-center sm:text-left animate-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-[32px] font-black text-slate-900 tracking-tighter leading-[1.1] mb-2">
                {authMode === "signin" ? "Welcome back" : "Join EduCore"}
              </h2>
              <p className="text-[14px] text-slate-500 font-medium tracking-tight">
                {authMode === "signin" 
                  ? "Authentication required for secure gateway access." 
                  : "Register your account for full system access."}
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

            {/* ── Error Banner ── */}
            {authError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>{authError}</span>
              </div>
            )}

            {/* ── Credentials ── */}
            <div className="space-y-5 mb-6 animate-in slide-in-from-bottom-2 duration-500">
              
              {authMode === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">First Name</Label>
                      <Input
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Last Name</Label>
                      <Input
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Phone</Label>
                      <Input
                        type="tel"
                        placeholder="+254 7XX "
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">School Code (Optional)</Label>
                      <Input
                        type="text"
                        placeholder="BFA-2025"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all uppercase"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">School Name</Label>
                      <Input
                        type="text"
                        placeholder="e.g. Bright Futures Academy"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Join Date</Label>
                      <Input
                        type="date"
                        value={joinDate}
                        onChange={(e) => setJoinDate(e.target.value)}
                        className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all text-slate-600 block w-full"
                      />
                    </div>
                  </div>

                  {/* ── Dynamic Layout for Identification ── */}
                  <AnimatePresence mode="popLayout">
                    {selected === "student" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Admission Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. ADM/2026/001"
                            value={admissionNumber}
                            onChange={(e) => setAdmissionNumber(e.target.value)}
                            className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Class / Grade</Label>
                          <Input
                            type="text"
                            placeholder={portal === "highschool" ? "e.g. Form 3 East" : "e.g. Grade 5 Blue"}
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                            className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all"
                          />
                        </div>
                      </motion.div>
                    )}

                    {selected === "parent" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Admission Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. ADM/2026/001"
                            value={admissionNumber}
                            onChange={(e) => setAdmissionNumber(e.target.value)}
                            className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Child's Class / Grade</Label>
                          <Input
                            type="text"
                            placeholder={portal === "highschool" ? "e.g. Form 2 West" : "e.g. Grade 4 Green"}
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                            className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all"
                          />
                        </div>
                      </motion.div>
                    )}

                    {selected === "teacher" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">TSC Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. 543210"
                            value={tscNumber}
                            onChange={(e) => setTscNumber(e.target.value)}
                            className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Employee Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. EMP-998"
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                            className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all uppercase"
                          />
                        </div>
                      </motion.div>
                    )}

                    {selected === "staff" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Employee Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. STF-012"
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                            className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Position / Title</Label>
                          <Input
                            type="text"
                            placeholder="e.g. Accountant, Librarian"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  System Identity
                </Label>
                <Input
                  type="email"
                  placeholder="you@shule.go.ke"
                  value={selected && authMode === "signin" ? `${selected}@shule.go.ke` : emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  readOnly={!!selected && authMode === "signin"}
                  key={selected && authMode === "signin" ? `sel-${selected}` : "custom-email"}
                  className={cn(
                    "h-12 px-5 text-[14px] border-slate-200 rounded-[18px] transition-all duration-300",
                    "focus-visible:ring-[6px] focus-visible:ring-primary/10 focus-visible:border-primary/40",
                    selected && authMode === "signin" && "bg-slate-50/80 font-semibold text-primary border-indigo-200/50"
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                    {authMode === "signup" ? "Create Password" : "Access Key"}
                  </Label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      key={`pwd-${selected || "custom"}`}
                      className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-300"
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

                {authMode === "signup" && (
                  <div className="space-y-2 md:col-span-1 border-l pl-4 border-slate-100 hidden md:block">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm Password</Label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-300"
                      />
                    </div>
                  </div>
                )}
                {/* Mobile version for confirm password */}
                {authMode === "signup" && (
                  <div className="space-y-2 md:col-span-1 md:hidden">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm Password</Label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="h-12 px-5 text-[14px] border-slate-200 rounded-[18px] focus-visible:ring-[6px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-300"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {authMode === "signup" && passwordInput && (
                <div className="flex gap-1 mt-2">
                  <div className={cn("h-1 flex-1 rounded-full bg-slate-200 transition-all", passwordInput.length > 3 && "bg-rose-500")} />
                  <div className={cn("h-1 flex-1 rounded-full bg-slate-200 transition-all", passwordInput.length > 5 && "bg-amber-400")} />
                  <div className={cn("h-1 flex-1 rounded-full bg-slate-200 transition-all", passwordInput.length > 7 && "bg-emerald-500")} />
                </div>
              )}
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

            {/* ── Success Banner ── */}
            <AnimatePresence>
              {authSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[13px] font-semibold flex items-center gap-3 overflow-hidden"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check size={16} className="text-emerald-600" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900 leading-tight">Account Created Successfully!</p>
                    <p className="text-[11px] text-emerald-700/80 mt-0.5">Redirecting you to the dashboard...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CTA Button ── */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2"
            >
              <Button
                onClick={handleLogin}
                disabled={(!selected && !emailInput) || loading}
                className={cn(
                  "relative w-full h-14 rounded-[22px] text-[15px] font-black tracking-tight transition-all duration-500 group overflow-hidden",
                  (selected || emailInput) && !loading
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
                    authMode === "signup" ? "Create Account" : "Sign In"
                  )}
                </span>
              </Button>
            </motion.div>

            {/* ── Demo Portals (Sign In Only) ── */}
            {authMode === "signin" && (
              <div className="mt-8 animate-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-slate-100" />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Try a Demo Portal</p>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Primary Admin",   icon: <ShieldCheck size={13} />, role: "admin" as Role,    portalType: "primary" as const,    path: "/admin/dashboard",                                      color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Primary Teacher",  icon: <BookOpen size={13} />,    role: "teacher" as Role,  portalType: "primary" as const,    path: "/teacher/dashboard",                                    color: "text-sky-600",    bg: "bg-sky-50"    },
                    { label: "Primary Parent",   icon: <GraduationCap size={13}/>,role: "parent" as Role,   portalType: "primary" as const,    path: "/parent-and-student-portal/dashboard",                  color: "text-emerald-600",bg: "bg-emerald-50" },
                    { label: "HS Admin",         icon: <ShieldCheck size={13} />, role: "admin" as Role,    portalType: "highschool" as const, path: "/highschool/admin/dashboard",                           color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "HS Teacher",       icon: <BookOpen size={13} />,    role: "teacher" as Role,  portalType: "highschool" as const, path: "/highschool/teacher/dashboard",                         color: "text-sky-600",    bg: "bg-sky-50"    },
                    { label: "HS Parent",        icon: <GraduationCap size={13}/>,role: "parent" as Role,   portalType: "highschool" as const, path: "/highschool/parent-and-student-portal/dashboard",        color: "text-emerald-600",bg: "bg-emerald-50" },
                  ].map((demo) => (
                    <button
                      key={`${demo.portalType}-${demo.role}`}
                      type="button"
                      onClick={() => {
                        login(demo.role, demo.portalType);
                        navigate(demo.path);
                      }}
                      className="flex items-center gap-2.5 p-3 rounded-[16px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-sm transition-all duration-200 text-left group"
                    >
                      <div className={`h-7 w-7 rounded-xl ${demo.bg} ${demo.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {demo.icon}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 leading-tight">{demo.label}</span>
                    </button>
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

        {/* ── OTP Verification Modal ── */}
        <OtpVerificationModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          email={effectiveEmail}
          phone={phone}
          onSuccess={handleOtpSuccess}
          isSignup={authMode === "signup"}
        />

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

        {/* ── Onboarding Video Overlay ── */}
        <AnimatePresence>
          {showVideoOverlay && (
            <OnboardingVideo onComplete={() => navigate(videoTarget)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}