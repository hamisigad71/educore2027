import React, { useState } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
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
import { verifyStudentAdmissionNumber } from "@/lib/api";
import { notify } from "@/lib/notify";




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
  const { login, loginWithSupabase, signUpWithSupabase, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get("tab") === "register" ? "signup" : "signin";

  const [authMode, setAuthMode] = useState<"signin" | "signup">(initialMode);
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

  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleAuth() {
    try {
      setGoogleLoading(true);
      setAuthError(null);
      const dept = selected === "staff" ? staffRole : undefined;
      const res = await loginWithGoogle(portal, dept);
      if (!res.success) {
        setAuthError(res.error || "Google authentication failed.");
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setAuthError(err?.message || "Google authentication failed.");
      setGoogleLoading(false);
    }
  }

  async function handleLogin() {
    if ((!selected && !emailInput) || loading) return;
    setAuthError(null);

    const primaryRoutes: Record<string, string> = {
      admin:   "/admin/dashboard",
      teacher: "/teacher/dashboard",
      parent:  "/parent-and-student-portal/dashboard",
      student: "/parent-and-student-portal/dashboard",
      staff:   `/staff/${staffRole}`,
    };
    const highschoolRoutes: Record<string, string> = {
      admin:   "/highschool/admin/dashboard",
      teacher: "/highschool/teacher/dashboard",
      parent:  "/highschool/parent-and-student-portal/dashboard",
      student: "/highschool/parent-and-student-portal/dashboard",
      staff:   `/highschool/staff/${staffRole}`,
    };

    const routeMap = portal === "highschool" ? highschoolRoutes : primaryRoutes;
    const targetRole = selected || "parent";
    const targetPath = routeMap[targetRole] || "/parent-and-student-portal/dashboard";

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

        // Whitelist Verification Gate: Only officially enrolled students/guardians can register
        if (selected === "student" && admissionNumber) {
          setLoading(true);
          const verify = await verifyStudentAdmissionNumber(admissionNumber, schoolCode);
          setLoading(false);

          if (!verify.exists) {
            const errMsg = `Admission number "${admissionNumber}" was not found in the school register. Kindly contact the school administration to be enrolled.`;
            setAuthError(`Error: ${errMsg}`);
            notify.error("Enrollment Not Found", errMsg);
            return;
          }

          if (verify.alreadyClaimed) {
            const warnMsg = `Admission number "${admissionNumber}" is already registered. If this is your account, please sign in.`;
            setAuthError(`Notice: ${warnMsg}`);
            notify.warning("Already Registered", warnMsg);
            return;
          }
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

        // Trigger OTP Modal for local active-tab verification (signup only)
        setShowOtpModal(true);
      } else {
        // Sign-in: skip OTP, authenticate directly
        const dept = selected === "staff" ? staffRole : undefined;
        setLoading(true);
        const result = await loginWithSupabase(effectiveEmail, passwordInput, portal, dept);
        setLoading(false);
        if (!result.success) {
          setAuthError(result.error || "Authentication failed. Please check credentials.");
          notify.error("Sign In Failed", result.error || "Please check your email and password.");
          return;
        }
        notify.success("Welcome back!", `Signed in to ${portal === "highschool" ? "High School" : "Primary School"} portal.`);
        setVideoTarget(targetPath);
        setShowVideoOverlay(true);
      }
    } else {
      // Demo preset login: skip OTP, proceed directly
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const dept = selected === "staff" ? staffRole : undefined;
        login(selected, portal, dept);
        notify.success("Welcome back!", `Signed in as ${selected?.toUpperCase()} (${portal === "highschool" ? "High School" : "Primary School"}).`);
        setVideoTarget(targetPath);
        setShowVideoOverlay(true);
      }, 1000);
    }
  }

  async function handleOtpSuccess() {
    setShowOtpModal(false);

    // Signup flow: read stashed payload from localStorage and complete registration
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
          notify.error("Registration Failed", result.error || "Unable to complete account creation.");
          return;
        }

        notify.success("Account Created Successfully!", "Welcome to EduCore! Setting up your portal access...");
        setVideoTarget(pending.targetPath);
        setShowVideoOverlay(true);
      } catch (e) {
        setLoading(false);
        setAuthError("Unexpected error during registration. Please try again.");
        notify.error("Error", "Unexpected error during registration. Please try again.");
      }
    }
  }


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
        .login-root, .login-root * { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        .serif-hero { font-family: 'Playfair Display', Georgia, serif !important; }
      `}</style>

      <div className="login-root min-h-screen flex bg-slate-50">

        {/* ── LEFT BRAND PANEL ──────────────────────────────────────── */}
        <aside className="hidden lg:flex w-[480px] min-w-[480px] bg-primary flex-col justify-between p-10 relative overflow-hidden border-r border-indigo-950/20">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/15 pointer-events-none blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-400/10 pointer-events-none blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-amber-400/5 pointer-events-none blur-3xl" />

          {/* Top Header & Crest */}
          <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
                <img src="/favicon.png" alt="EduCore" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-[16px] font-black tracking-tight text-white flex items-center gap-1.5">
                  EduCore<span className="text-emerald-400 text-xs">●</span>
                </p>
                <p className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-widest">
                  Enterprise Academic OS
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Certified MOE</span>
            </div>
          </div>

          {/* Middle Focus Hero Content */}
          <div className="relative z-10 my-auto py-8 max-w-[380px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-5">
              <Crown className="size-3 text-amber-300" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
                Kenya & East Africa Standard
              </span>
            </div>

            <h1 className="serif-hero text-[36px] xl:text-[40px] text-white leading-[1.08] mb-4 tracking-tight">
              Manage your school<br />
              <span className="text-emerald-300 italic">
                with absolute clarity.
              </span>
            </h1>

            <p className="text-[14px] text-indigo-100/80 leading-relaxed font-normal mb-8">
              A unified, cloud-ready architecture for administrators, teachers, learners, and bursars — crafted for CBC and KCSE excellence.
            </p>

            {/* Key Statistics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="p-3 rounded-2xl bg-white/[0.04] border border-white/5">
                  <p className="text-xl font-black text-white tracking-tight">{s.value}</p>
                  <p className="text-[9px] font-bold text-indigo-200/70 uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Endorsed Testimonial */}
            <div className="bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl shadow-indigo-950/60">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-[12.5px] text-indigo-50 leading-relaxed italic mb-4 font-normal">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-[11px] font-black text-white shadow-md">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-[12px] font-bold text-white leading-tight">{testimonial.name}</p>
                  <p className="text-[10px] text-indigo-200/70 font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Status */}
          <div className="relative z-10 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium text-emerald-200">
                Supabase & M-Pesa Live
              </span>
            </div>
            <span className="text-[10px] font-bold text-indigo-200/60 uppercase tracking-widest">
              v1.2.0-PRO · 🇰🇪
            </span>
          </div>
        </aside>

        {/* ══════════════════════════════════════════
            RIGHT FORM PANEL
        ══════════════════════════════════════════ */}
        <main className="flex-1 flex flex-col items-center justify-center overflow-y-auto bg-slate-50/60 min-h-screen py-8 px-4 sm:px-6 lg:px-10">
          
          {/* Mobile Top Header */}
          <div className="lg:hidden w-full max-w-[460px] flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-white p-1.5 shadow-sm border border-slate-200/80 flex items-center justify-center">
                <img src="/favicon.png" alt="EduCore" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-[15px] font-black tracking-tight text-slate-900 leading-none">
                  EduCore<span className="text-emerald-500">●</span>
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Academic Portal
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Server
            </span>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[480px] relative z-10"
          >
            {/* Ambient Backing Glow */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <Card className="w-full relative z-10 border border-slate-200/80 shadow-[0_20px_50px_-15px_rgba(10,37,64,0.08),0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-[32px] overflow-hidden">
              
              <CardContent className="p-6 sm:p-8 lg:p-8 relative z-20">
                <div className="w-full">

            {/* ── Segmented Control Toggles (Emil Kowalski Shared-Pill Physics) ── */}
            <div className="w-full flex flex-col gap-2.5 mb-6">
              {/* Institution Portal Segmented Switch */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/70 relative">
                {(["primary", "highschool"] as const).map((p) => {
                  const active = portal === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPortal(p)}
                      className={cn(
                        "relative z-10 flex items-center justify-center gap-2 h-10 rounded-xl text-[12.5px] font-bold transition-colors duration-150 active:scale-[0.98]",
                        active ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="activePortalIndicator"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/60 z-[-1]"
                        />
                      )}
                      {p === "primary" ? (
                        <School size={14} className={cn("transition-colors", active ? "text-indigo-600" : "text-slate-400")} />
                      ) : (
                        <GraduationCap size={15} className={cn("transition-colors", active ? "text-emerald-600" : "text-slate-400")} />
                      )}
                      <span>{p === "primary" ? "Primary School" : "High School"}</span>
                      {active && (
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full ml-0.5",
                          p === "primary" ? "bg-indigo-600" : "bg-emerald-600"
                        )} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sign In / Sign Up Mode Segmented Switch */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/70 relative">
                {[
                  { id: "signin", label: "Sign In" },
                  { id: "signup", label: "Create Account" },
                ].map((m) => {
                  const active = authMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setAuthMode(m.id as "signin" | "signup");
                        setAuthError(null);
                      }}
                      className={cn(
                        "relative z-10 flex items-center justify-center gap-1.5 h-10 rounded-xl text-[12.5px] font-bold transition-colors duration-150 active:scale-[0.98]",
                        active ? "text-white" : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeAuthModeIndicator"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          className="absolute inset-0 bg-[#0A2540] rounded-xl shadow-sm z-[-1]"
                        />
                      )}
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>


            {/* ── Greeting ── */}
            <div className="mb-6 text-center sm:text-left">
              <h2 className="text-[26px] sm:text-[30px] font-black text-slate-900 tracking-tight leading-tight mb-1.5">
                {authMode === "signin" ? "Welcome back" : "Join EduCore"}
              </h2>
              <p className="text-[13px] text-slate-500 font-normal leading-normal">
                {authMode === "signin" 
                  ? "Select your profile below or enter credentials to sign in." 
                  : "Register your institution credentials for gateway access."}
              </p>
            </div>

            {/* ── Role Selector ── */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Select Your Role
              </p>
              {selected && (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-6">
              {roles.map((r, idx) => (
                <motion.button
                  key={r.role}
                  type="button"
                  onClick={() => setSelected(r.role)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative rounded-2xl p-4 text-left border transition-all duration-300 group overflow-hidden",
                    selected === r.role
                      ? "border-primary bg-indigo-50/40 shadow-sm ring-1 ring-primary"
                      : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  )}
                >
                  <AnimatePresence>
                    {selected === r.role && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-3.5 right-3.5 h-4.5 w-4.5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm"
                      >
                        <Check size={11} strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 shadow-sm",
                      r.iconBg,
                      r.iconColor,
                      selected === r.role && "scale-105"
                    )}
                  >
                    {r.icon}
                  </div>
                  <p className="text-[13px] font-bold text-slate-900 mb-0.5 leading-snug">
                    {r.label}
                  </p>
                  <p className="text-[11px] text-slate-500 font-normal leading-tight line-clamp-1">
                    {r.desc}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* ── Staff Department ── */}
            {selected === "staff" && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-normal mb-4">
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
            <div className="space-y-4 mb-5">
              
              {authMode === "signup" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">First Name</Label>
                      <Input
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Last Name</Label>
                      <Input
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Phone Number</Label>
                      <Input
                        type="tel"
                        placeholder="+254 7XX XXX XXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">School Code (Optional)</Label>
                      <Input
                        type="text"
                        placeholder="BFA-2025"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all uppercase bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">School Name</Label>
                      <Input
                        type="text"
                        placeholder="e.g. Alliance High School"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Join Date</Label>
                      <Input
                        type="date"
                        value={joinDate}
                        onChange={(e) => setJoinDate(e.target.value)}
                        className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-slate-700 block w-full bg-white"
                      />
                    </div>
                  </div>

                  {/* ── Dynamic Layout for Identification ── */}
                  <AnimatePresence mode="popLayout">
                    {selected === "student" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                      >
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Admission Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. ADM/2026/001"
                            value={admissionNumber}
                            onChange={(e) => setAdmissionNumber(e.target.value)}
                            className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all uppercase bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Class / Grade</Label>
                          <Input
                            type="text"
                            placeholder={portal === "highschool" ? "e.g. Form 3 East" : "e.g. Grade 5 Blue"}
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                            className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-white"
                          />
                        </div>
                      </motion.div>
                    )}

                    {selected === "parent" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                      >
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Student Admission Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. ADM/2026/001"
                            value={admissionNumber}
                            onChange={(e) => setAdmissionNumber(e.target.value)}
                            className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all uppercase bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Child's Class / Grade</Label>
                          <Input
                            type="text"
                            placeholder={portal === "highschool" ? "e.g. Form 2 West" : "e.g. Grade 4 Green"}
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                            className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-white"
                          />
                        </div>
                      </motion.div>
                    )}

                    {selected === "teacher" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                      >
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">TSC Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. 543210"
                            value={tscNumber}
                            onChange={(e) => setTscNumber(e.target.value)}
                            className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Employee Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. EMP-998"
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                            className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all uppercase bg-white"
                          />
                        </div>
                      </motion.div>
                    )}

                    {selected === "staff" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                      >
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Employee Number</Label>
                          <Input
                            type="text"
                            placeholder="e.g. STF-012"
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                            className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all uppercase bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Position / Title</Label>
                          <Input
                            type="text"
                            placeholder="e.g. Accountant, Librarian"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-white"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Email Address / Username
                </Label>
                <Input
                  type="email"
                  placeholder="you@shule.go.ke"
                  value={selected && authMode === "signin" ? `${selected}@shule.go.ke` : emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  readOnly={!!selected && authMode === "signin"}
                  key={selected && authMode === "signin" ? `sel-${selected}` : "custom-email"}
                  className={cn(
                    "h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl transition-all duration-200 bg-white",
                    "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                    selected && authMode === "signin" && "bg-slate-50/90 font-semibold text-primary border-indigo-200"
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className={cn("space-y-1.5", authMode === "signin" && "sm:col-span-2")}>
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    {authMode === "signup" ? "Password" : "Password / Access Key"}
                  </Label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      key={`pwd-${selected || "custom"}`}
                      className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {authMode === "signup" && (
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Confirm Password</Label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="h-11 px-4 text-[13.5px] border-slate-200/90 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {authMode === "signup" && passwordInput && (() => {
                const len = passwordInput.length;
                const hasUpper = /[A-Z]/.test(passwordInput);
                const hasNum = /[0-9]/.test(passwordInput);
                const hasSpecial = /[^A-Za-z0-9]/.test(passwordInput);
                const score = (len > 5 ? 1 : 0) + (len > 7 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);
                const level = score <= 1 ? 0 : score <= 3 ? 1 : 2;
                const labels = ["Weak", "Fair", "Strong"];
                const colors = ["text-rose-500", "text-amber-500", "text-emerald-600"];
                const segColors = [
                  ["bg-rose-500", "bg-slate-100", "bg-slate-100"],
                  ["bg-amber-400", "bg-amber-400", "bg-slate-100"],
                  ["bg-emerald-500", "bg-emerald-500", "bg-emerald-500"],
                ];
                const checks = [
                  { label: "At least 8 characters", met: len >= 8 },
                  { label: "Uppercase letter (A–Z)", met: hasUpper },
                  { label: "Number (0–9)", met: hasNum },
                  { label: "Special character (!@#...)", met: hasSpecial },
                  { label: "Passwords match", met: !!confirmPasswordInput && passwordInput === confirmPasswordInput },
                ];
                return (
                  <div className="mt-3 space-y-2.5">
                    <div className="flex items-center justify-between px-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-normal">Password strength</span>
                      <span className={cn("text-[11px] font-black transition-colors", colors[level])}>
                        {labels[level]}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {segColors[level].map((c, i) => (
                        <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", c)} />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1">
                      {checks.map(({ label, met }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <div className={cn(
                            "w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                            met ? "bg-emerald-100" : "bg-slate-100"
                          )}>
                            {met
                              ? <Check size={8} className="text-emerald-600" strokeWidth={3} />
                              : <span className="w-1 h-1 rounded-full bg-slate-300 block" />
                            }
                          </div>
                          <span className={cn(
                            "text-[10px] font-semibold leading-tight transition-colors duration-300",
                            met ? "text-emerald-700" : "text-slate-400"
                          )}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
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

            {/* ── Social / Google Auth Divider ── */}
            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-slate-200/70" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">or continue with</span>
              <div className="h-px flex-1 bg-slate-200/70" />
            </div>

            {/* ── Google Sign In / Sign Up Button ── */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full h-13 px-4 rounded-[20px] border border-slate-200 bg-white hover:bg-slate-50/80 active:bg-slate-100/90 text-slate-700 font-bold text-[14px] shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <ButtonLoader className="text-slate-600" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>
                {googleLoading 
                  ? "Connecting to Google..." 
                  : authMode === "signup" ? "Sign up with Google" : "Sign in with Google"}
              </span>
            </button>

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