"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "./login";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  BarChart3, 
  Wallet, 
  BookOpen, 
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Smartphone,
  Globe,
  Star,
  TrendingUp,
  Bell,
  MessageSquare,
  FileText,
  Award,
  ChevronDown,
  Play,
  Menu,
  X,
  GraduationCap,
  Building2,
  Clock,
  Zap,
  Lock,
  PieChart,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Bird,
  MessageCircle,
  Link as LinkIcon,
  Camera,
  ArrowUpRight,
  Layers,
  Target,
  RefreshCw,
  CreditCard
} from "lucide-react";
import { LogoFull } from "../components/Logo";

// ─── Utility ─────────────────────────────────────────────────────────────────

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const }
  })
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const }
  })
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const }
  })
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-[0.15em]",
      className
    )}>
      {children}
    </div>
  );
}

function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("text-primary", className)}>
      {children}
    </span>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="relative text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors group"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300 rounded-full" />
    </a>
  );
}

function FeatureCard({ icon: Icon, title, description, color = "indigo", delay = 0 }: {
  icon: any; title: string; description: string; color?: string; delay?: number;
}) {
  const colorMap: Record<string, { bg: string; text: string; hover: string; glow: string }> = {
    indigo: { bg: "bg-primary/10", text: "text-primary", hover: "group-hover:bg-primary", glow: "group-hover:shadow-primary/10" },
    violet: { bg: "bg-chart-5/10", text: "text-chart-5", hover: "group-hover:bg-chart-5", glow: "group-hover:shadow-chart-5/10" },
    emerald: { bg: "bg-chart-1/10", text: "text-chart-1", hover: "group-hover:bg-chart-1", glow: "group-hover:shadow-chart-1/10" },
    amber: { bg: "bg-chart-2/10", text: "text-chart-2", hover: "group-hover:bg-chart-2", glow: "group-hover:shadow-chart-2/10" },
    sky: { bg: "bg-chart-3/20", text: "text-indigo-600", hover: "group-hover:bg-indigo-600", glow: "group-hover:shadow-indigo-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", hover: "group-hover:bg-rose-600", glow: "group-hover:shadow-rose-100" },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      whileHover={{ y: -6 }}
      className={cn(
        "relative p-7 rounded-3xl bg-card border border-border/50 shadow-sm group",
        "transition-all duration-300 hover:shadow-2xl hover:border-transparent cursor-default overflow-hidden",
        c.glow
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-secondary/50 pointer-events-none" />
      
      <div className={cn(
        "relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
        c.bg, c.text, c.hover, "group-hover:text-white group-hover:scale-110 group-hover:rotate-3"
      )}>
        <Icon size={26} />
      </div>
      <h3 className="relative text-base font-black text-foreground mb-2.5 tracking-tight">{title}</h3>
      <p className="relative text-sm text-muted-foreground leading-relaxed font-medium">{description}</p>
      
      {/* Hover border glow */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-100 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
}

function StatItem({ value, label, suffix, icon: Icon }: {
  value: string; label: string; suffix?: string; icon?: any;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="flex items-end justify-center gap-1 mb-2">
        <div className="text-4xl md:text-5xl font-black text-slate-900 tabular-nums">{value}</div>
        {suffix && <div className="text-2xl font-black text-indigo-600 mb-1">{suffix}</div>}
      </div>
      <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</div>
    </motion.div>
  );
}

function TestimonialCard({ quote, name, role, school, avatar, rating = 5, delay = 0 }: {
  quote: string; name: string; role: string; school: string; avatar: number; rating?: number; delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className="w-[85vw] sm:w-[60vw] md:w-auto shrink-0 snap-center p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/30 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex gap-1 mb-5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6 italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/10">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}`} alt={name} className="w-full h-full" />
        </div>
        <div>
          <div className="text-sm font-black text-foreground">{name}</div>
          <div className="text-[11px] text-muted-foreground font-semibold">{role} · {school}</div>
        </div>
      </div>
    </motion.div>
  );
}

function PricingCard({ tier, price, description, features, highlighted = false, delay = 0 }: {
  tier: string; price: string; description: string; features: string[]; highlighted?: boolean; delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      whileHover={{ y: -6 }}
      className={cn(
        "relative p-8 rounded-3xl border transition-all duration-300",
        highlighted
          ? "bg-primary border-primary shadow-2xl shadow-primary/20 text-primary-foreground"
          : "bg-card border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 text-foreground"
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-widest">
          Most Popular
        </div>
      )}
      <div className={cn("text-xs font-black uppercase tracking-[0.2em] mb-2", highlighted ? "text-indigo-200" : "text-indigo-600")}>
        {tier}
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-black">{price}</span>
        {price !== "Custom" && <span className={cn("text-sm font-bold", highlighted ? "text-indigo-200" : "text-slate-400")}>/term</span>}
      </div>
      <p className={cn("text-sm font-medium mb-8 leading-relaxed", highlighted ? "text-indigo-100" : "text-slate-500")}>
        {description}
      </p>
      <ul className="space-y-3.5 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm font-medium">
            <div className={cn("w-4 h-4 rounded-full flex items-center justify-center shrink-0",
              highlighted ? "bg-white/20" : "bg-indigo-50"
            )}>
              <CheckCircle2 size={10} className={highlighted ? "text-white" : "text-indigo-600"} />
            </div>
            <span className={highlighted ? "text-indigo-50" : "text-slate-600"}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/login"
        className={cn(
          "flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-black transition-all duration-200 hover:-translate-y-0.5",
          highlighted
            ? "bg-white text-primary hover:bg-secondary shadow-lg"
            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
        )}
      >
        Get Started <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}

function IntegrationBadge({ name, icon: Icon, color, image }: { name: string; icon?: any; color?: string; image?: string }) {
  return (
    <div className={cn(
      "flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm shrink-0",
      "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
    )}>
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden", !image && color)}>
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-contain p-1.5" />
        ) : (
          <Icon size={16} className="text-white" />
        )}
      </div>
      <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{name}</span>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="relative rounded-[2rem] overflow-hidden border border-slate-200/60 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] bg-white p-2 md:p-3">
      <div className="relative rounded-[1.5rem] overflow-hidden group bg-slate-50 border border-slate-100">
        <img 
          src="/waap1.png" 
          alt="EduCore Dashboard" 
          className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.05]"
        />
        
        {/* Subtle glass and gradient overlays for premium feel */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[1.5rem]" />
      </div>
    </div>
  );
}

function ProcessStep({ number, title, description, icon: Icon, delay = 0 }: {
  number: string; title: string; description: string; icon: any; delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className="relative flex flex-col items-center text-center"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 group hover:scale-105 transition-transform duration-300">
          <Icon size={32} className="text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center shadow-sm">
          <span className="text-[10px] font-black text-indigo-600">{number}</span>
        </div>
      </div>
      <h3 className="text-base font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs">{description}</p>
    </motion.div>
  );
}

function RolePortalCard({ role, description, color, icon: Icon, features, cta }: {
  role: string; description: string; color: string; icon: any; features: string[]; cta: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className={cn(
        "relative p-8 rounded-3xl border overflow-hidden group transition-all duration-300 hover:shadow-2xl",
        color
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon size={28} />
        </div>
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-1">{role}</div>
        <p className="text-sm font-medium opacity-80 leading-relaxed mb-6">{description}</p>
        <ul className="space-y-2.5 mb-8">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 size={12} className="opacity-70 shrink-0" />
              <span className="opacity-80">{f}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity group/cta"
        >
          {cta}
          <ArrowRight size={12} className="group-hover/cta:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroBgY = useTransform(scrollY, [0, 500], [0, 60]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setIsScrolled(v > 30));
    return unsub;
  }, [scrollY]);

  const faqs = [
    { q: "How does EduCore handle multi-branch schools?", a: "EduCore supports multi-campus management with a centralized admin view and branch-specific dashboards, letting principals manage independently while the board sees the full picture." },
    { q: "Is student data secure and compliant?", a: "We use AES-256 encryption at rest and TLS in transit. EduCore is GDPR-aligned and follows Kenya's Data Protection Act 2019 standards." },
    { q: "Can parents access the portal on mobile?", a: "Yes. The parent portal is fully responsive and we offer a dedicated PWA installable on both Android and iOS devices for a native app experience." },
    { q: "What payment methods are supported for school fees?", a: "We integrate natively with M-Pesa, Airtel Money, Equity Bank, and major card processors via Pesapal and Flutterwave." },
    { q: "How long does onboarding take?", a: "Most schools are fully operational within 5 business days. Our team handles data migration, staff training, and portal configuration." }
  ];

  return (
    <>
      {/* Mobile Login View */}
      <div className="md:hidden block">
        <Login />
      </div>

      {/* Desktop Homepage */}
      <div className="hidden md:block min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Serif+Display:ital@0;1&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 99px; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-2xl shadow-sm shadow-indigo-50/50 border-b border-slate-100/80"
            : "bg-transparent"
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoFull className="h-[74px]" />
            <div className="hidden sm:block w-px h-5 bg-slate-200" />
            <span className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">School ERP</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#portals">Portals</NavLink>
            <NavLink href="#testimonials">Reviews</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-200/80 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-6 space-y-4 overflow-hidden"
            >
              {["#features", "#portals", "#testimonials", "#pricing", "#faq"].map((href) => (
                <a
                  key={href}
                  href={href}
                  className="block text-sm font-semibold text-slate-600 hover:text-indigo-600 py-2 capitalize"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {href.replace("#", "")}
                </a>
              ))}
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold mt-2"
              >
                Enter Portal <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-32 overflow-hidden">
        {/* Background decoration */}
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-indigo-50 via-violet-50/30 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-50/50 to-transparent rounded-full blur-[100px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTEgMWg1OHY1OEgxVjF6IiBmaWxsPSIjZTJlOGYwIiBmaWxsLW9wYWNpdHk9Ii4zIi8+PC9nPjwvc3ZnPg==')] opacity-40" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left content */}
            <motion.div style={{ y: heroY }}>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                <Badge className="bg-indigo-50 border-indigo-100 text-indigo-600 mb-8">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  Trusted by 1,500+ Kenyan Schools
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.1}
                className="text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[1.03] tracking-tight mb-8"
              >
                The Modern
                 School ERP 
                Platform.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.2}
                className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg font-medium"
              >
                EduCore unifies administration, academics, finance, and communication into one powerful platform — purpose-built for East African institutions.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.3}
                className="flex flex-wrap gap-4 mb-14"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0 text-sm"
                >
                  Start Free Trial
                  <ArrowRight size={16} />
                </Link>
                <button className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-slate-700 font-bold border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 transition-all hover:-translate-y-1 active:translate-y-0 text-sm shadow-sm">
                  <Play size={14} className="fill-current" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Trust row */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.4}
                className="flex flex-wrap items-center gap-8"
              >
                <div className="flex -space-x-3">
                  {[20, 21, 22, 23, 24].map((seed) => (
                    <div key={seed} className="w-10 h-10 rounded-full border-3 border-white bg-slate-100 overflow-hidden shadow-sm ring-2 ring-white">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt="User avatar" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                    <span className="text-sm font-black text-slate-900 ml-1">4.9</span>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">from 2,400+ admin reviews</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-emerald-700">99.9% Uptime SLA</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right — Dashboard mockup */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="relative"
            >
              <DashboardMockup />

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-8 hidden lg:block bg-white p-4 rounded-2xl shadow-2xl border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingUp size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Attendance Rate</div>
                    <div className="text-lg font-black text-emerald-600">94.2%</div>
                    <div className="text-[9px] text-slate-400 font-bold">↑ 3.1% from last week</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-8 hidden lg:block bg-white p-4 rounded-2xl shadow-2xl border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Wallet size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Fees Collected</div>
                    <div className="text-lg font-black text-indigo-600">KES 2.4M</div>
                    <div className="text-[9px] text-slate-400 font-bold">Term 1, 2026</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ x: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/2 -translate-y-1/2 -right-10 hidden xl:block bg-white p-3 rounded-xl shadow-xl border border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Bell size={13} className="text-violet-600" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-slate-900">New Fee Alert</div>
                    <div className="text-[8px] text-slate-400">Wanjiku K. — Form 4A</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-300"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest">Scroll</div>
          <ChevronDown size={16} />
        </motion.div>
      </section>

      {/* ── MARQUEE / PARTNER LOGOS ────────────────────────────────────────── */}
      <section className="py-14 border-y border-slate-100 bg-slate-50/50 overflow-hidden">
        <div className="mb-6 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Trusted by leading institutions
        </div>
        <div className="relative">
          <div className="flex gap-10 animate-[marquee_30s_linear_infinite]" style={{ width: "max-content" }}>
            {[
              "Alliance High School", "Starehe Boys Centre", "Kenya High School",
              "Strathmore School", "Limuru Girls", "Mang'u High School",
              "St. Mary's School", "Precious Blood Riruta", "Nairobi School",
              "Alliance High School", "Starehe Boys Centre", "Kenya High School",
              "Strathmore School", "Limuru Girls", "Mang'u High School",
            ].map((name, i) => (
              <div key={i} className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm shrink-0">
                <GraduationCap size={14} className="text-indigo-400" />
                <span className="text-sm font-bold text-slate-400 whitespace-nowrap">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative p-10 md:p-16 rounded-[2.5rem] bg-indigo-600 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

            <div className="relative z-10 text-center mb-12">
              <div className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">By the numbers</div>
              <h2 className="text-3xl md:text-4xl font-black text-white">EduCore in action across East Africa</h2>
            </div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { value: "1.5", suffix: "k+", label: "Active Schools" },
                { value: "500", suffix: "k", label: "Student Profiles" },
                { value: "98", suffix: "%", label: "Client Satisfaction" },
                { value: "99.9", suffix: "%", label: "System Uptime" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl md:text-5xl font-black text-white">{stat.value}</span>
                    <span className="text-2xl font-black text-indigo-300">{stat.suffix}</span>
                  </div>
                  <div className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.15em]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────────────────── */}
      <section id="features" className="py-28 bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Badge className="bg-indigo-50 border-indigo-100 text-indigo-600 mb-5">
                <Zap size={10} /> Feature-Rich Platform
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
                Every tool your school will ever need. 
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                From admin dashboards to mobile parent portals — EduCore covers every dimension of school management with precision and elegance.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
            <FeatureCard icon={Users} title="Staff & Student Management" description="Complete profiles, class assignments, promotion workflows, and ID card generation — all in one place." color="indigo" delay={0} />
            <FeatureCard icon={Calendar} title="Smart Timetabling" description="AI-assisted scheduling that detects clashes, manages substitutions, and syncs with Google Calendar." color="violet" delay={0.05} />
            <FeatureCard icon={BarChart3} title="Academic Analytics" description="Visual dashboards for rankings, subject analysis, progressive reports, and Kenya national exam prep." color="sky" delay={0.1} />
            <FeatureCard icon={Wallet} title="Fee & Finance Suite" description="Automated invoicing with M-Pesa integration, partial payments, receipts, and arrears management." color="emerald" delay={0.15} />
            <FeatureCard icon={Smartphone} title="Parent & Student App" description="Real-time push notifications for attendance, fee dues, results, and announcements on mobile." color="amber" delay={0.2} />
            <FeatureCard icon={ShieldCheck} title="Enterprise Security" description="Role-based access, 2FA, data encryption, audit logs, and GDPR-compliant data handling." color="rose" delay={0.25} />
            <FeatureCard icon={MessageSquare} title="Communication Hub" description="Internal messaging, SMS blasts, email newsletters, and notice boards for staff and parents." color="violet" delay={0.3} />
            <FeatureCard icon={FileText} title="Report Card Engine" description="Customizable, KNEC-aligned report cards generated and distributed digitally with one click." color="sky" delay={0.35} />
            <FeatureCard icon={Award} title="Library & Resources" description="Digital library management, book borrowing, e-resources, and reading progress tracking." color="indigo" delay={0.4} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Badge className="bg-indigo-50 border-indigo-100 text-indigo-600 mb-5">
                <RefreshCw size={10} /> Simple Onboarding
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
                Up and running  in 5 days. 
              </h2>
              <p className="text-slate-500 font-medium">Our team handles everything. Zero technical expertise required from your school.</p>
            </motion.div>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-indigo-100 via-indigo-300 to-indigo-100" />

            <ProcessStep number="01" title="School Registration" description="Provide your school details and we configure your dedicated EduCore instance." icon={Building2} delay={0} />
            <ProcessStep number="02" title="Data Migration" description="We import all your existing student, staff, and financial data securely." icon={Layers} delay={0.1} />
            <ProcessStep number="03" title="Team Training" description="Live training sessions for admins, teachers, and support staff." icon={Users} delay={0.2} />
            <ProcessStep number="04" title="Go Live" description="Launch with full support. Your dedicated success manager is always available." icon={Target} delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── ROLE PORTALS ──────────────────────────────────────────────────── */}
      <section id="portals" className="py-28 bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Badge className="bg-indigo-50 border-indigo-100 text-indigo-600 mb-5">
                <Lock size={10} /> Role-Based Access
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
                A portal for every stakeholder. 
              </h2>
              <p className="text-slate-500 font-medium">Each user gets a tailored, permission-controlled experience built for their specific needs.</p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <RolePortalCard
              role="Administrator"
              description="Total oversight. Manage every dimension of your institution from one powerful command center."
              color="bg-indigo-600 text-white border-indigo-500"
              icon={ShieldCheck}
              features={["School-wide analytics", "Fee management", "Staff administration", "System configuration"]}
              cta="Admin Portal"
            />
            <RolePortalCard
              role="Teacher"
              description="Streamline classroom management, mark registers, upload results, and communicate with parents."
              color="bg-slate-900 text-white border-slate-700"
              icon={BookOpen}
              features={["Digital mark book", "Attendance tracking", "Lesson planning", "Parent messaging"]}
              cta="Teacher Portal"
            />
            <RolePortalCard
              role="Parent"
              description="Stay connected to your child's academic journey with real-time updates and fee management."
              color="bg-white text-slate-900 border-slate-200 shadow-lg"
              icon={Smartphone}
              features={["Child's results", "Fee receipts & payment", "Attendance alerts", "Teacher messaging"]}
              cta="Parent Portal"
            />
            <RolePortalCard
              role="Student"
              description="Access timetables, results, library resources, and school announcements in one place."
              color="bg-indigo-50 text-indigo-900 border-indigo-200"
              icon={GraduationCap}
              features={["My results & grades", "Class timetable", "Library resources", "Homework tracker"]}
              cta="Student Portal"
            />
          </div>
        </div>
      </section>

      {/* ── DEEP FEATURE SHOWCASE ─────────────────────────────────────────── */}
      <section className="py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Row 1 */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Badge className="bg-emerald-50 border-emerald-100 text-emerald-700 mb-6">
                <Wallet size={10} /> Fee Management
              </Badge>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-5">
                M-Pesa native fee  collection & tracking. 
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Students pay fees directly via M-Pesa Paybill and the system automatically matches payments, updates balances, and sends receipts — no manual reconciliation.
              </p>
              <div className="space-y-4">
                {[
                  "Automatic M-Pesa STK push invoicing",
                  "Partial payments & payment plans",
                  "Arrears reporting and SMS reminders",
                  "Term-by-term financial statements"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="relative">
                <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-emerald-50 to-indigo-50 p-8 border border-slate-100 shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs font-black text-slate-900">Fee Collection</div>
                        <div className="text-[10px] text-slate-400">Term 1, 2026</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">+12.4%</div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">KES 4,820,000</div>
                    <div className="text-xs text-slate-400 mb-4">of KES 6,000,000 target</div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: "80.3%" }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-400">80.3% collected</span>
                      <span className="text-[10px] text-emerald-600 font-bold">KES 1.18M pending</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "James Odhiambo", form: "4A", amount: "KES 32,000", status: "Paid", time: "2 min ago" },
                      { name: "Amina Sheikh", form: "2C", amount: "KES 18,000", status: "Paid", time: "14 min ago" },
                      { name: "Brian Mutua", form: "3B", amount: "KES 12,000", status: "Partial", time: "1 hr ago" },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt={item.name} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-900">{item.name}</div>
                            <div className="text-[9px] text-slate-400">Form {item.form}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black text-slate-900">{item.amount}</div>
                          <div className={cn("text-[9px] font-bold", item.status === "Paid" ? "text-emerald-600" : "text-amber-600")}>{item.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Row 2 */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-2 lg:order-1">
              <div className="relative">
                <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50 p-8 border border-slate-100 shadow-2xl">
                  {/* Attendance widget */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="text-xs font-black text-slate-900">Attendance — Form 3B</div>
                        <div className="text-[10px] text-slate-400">Tuesday, Jan 14 · Period 3</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black">
                        38/42 Present
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 42 }).map((_, i) => (
                        <div key={i} className={cn(
                          "aspect-square rounded-lg flex items-center justify-center text-[7px] font-black",
                          i < 38 ? "bg-indigo-100 text-indigo-700" : "bg-red-50 text-red-400"
                        )}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Present", value: "38", color: "text-indigo-600 bg-indigo-50" },
                      { label: "Absent", value: "04", color: "text-red-500 bg-red-50" },
                      { label: "Late", value: "02", color: "text-amber-500 bg-amber-50" },
                    ].map((s) => (
                      <div key={s.label} className={cn("rounded-xl p-3 text-center", s.color)}>
                        <div className="text-xl font-black">{s.value}</div>
                        <div className="text-[9px] font-bold uppercase tracking-wider opacity-70">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-1 lg:order-2">
              <Badge className="bg-indigo-50 border-indigo-100 text-indigo-600 mb-6">
                <Calendar size={10} /> Attendance
              </Badge>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-5">
                One-click attendance tracking for every class. 
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Teachers mark attendance digitally in seconds. Parents receive SMS and push notifications when their child is marked absent. Administrators see school-wide trends instantly.
              </p>
              <div className="space-y-4">
                {[
                  "Digital register with photo verification",
                  "Automated parent SMS on absence",
                  "Weekly & monthly attendance reports",
                  "Integration with M-Pesa fee alerts"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} className="text-indigo-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Integrates with tools you already use.</h2>
              <p className="text-slate-400 font-medium">Native connections to Kenya's leading payment and communication platforms.</p>
            </motion.div>
          </div>
          <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-slate-50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:after:from-slate-50 after:to-transparent">
            <div className="flex gap-4 animate-[marquee_25s_linear_infinite]" style={{ width: "max-content" }}>
              {[
                { name: "M-Pesa", image: "/logo-mpesa.png" },
                { name: "Airtel Money", image: "/logo-airtel.png" },
                { name: "Pesapal", image: "/logo-pesapal.png" },
                { name: "Google Workspace", image: "/logo-google.png" },
                { name: "Equity Bank", image: "/logo-equity.png" },
                { name: "Flutterwave", image: "/logo-flutterwave.png" },
                { name: "Africa's Talking", image: "/logo-africa.png" },
                { name: "KRA eTims", image: "/logo-kra.png" },
                // Duplicate for seamless loop
                { name: "M-Pesa", image: "/logo-mpesa.png" },
                { name: "Airtel Money", image: "/logo-airtel.png" },
                { name: "Pesapal", image: "/logo-pesapal.png" },
                { name: "Google Workspace", image: "/logo-google.png" },
                { name: "Equity Bank", image: "/logo-equity.png" },
                { name: "Flutterwave", image: "/logo-flutterwave.png" },
                { name: "Africa's Talking", image: "/logo-africa.png" },
                { name: "KRA eTims", image: "/logo-kra.png" },
              ].map((item, idx) => (
                <IntegrationBadge key={`${item.name}-${idx}`} name={item.name} image={item.image} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Badge className="bg-amber-50 border-amber-100 text-amber-700 mb-5">
                <Star size={10} className="fill-current" /> Testimonials
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
                Loved by school leaders<br /><GradientText>across Kenya.</GradientText>
              </h2>
            </motion.div>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TestimonialCard
              quote="EduCore transformed how we collect fees. M-Pesa reconciliation that used to take our bursar 3 days now happens instantly. Incredible."
              name="Mr. Samuel Kamau"
              role="Principal"
              school="Alliance High School"
              avatar={31}
              delay={0}
            />
            <TestimonialCard
              quote="As a parent, I can see my daughter's attendance and marks in real time. The mobile app is clean and gives me peace of mind."
              name="Mrs. Grace Odhiambo"
              role="Parent"
              school="Kenya High School"
              avatar={32}
              delay={0.05}
            />
            <TestimonialCard
              quote="The timetable feature alone saved us weeks of headaches. Clash detection and teacher substitution management is a game changer."
              name="Mr. Peter Mwangi"
              role="Deputy Principal"
              school="Starehe Boys Centre"
              avatar={33}
              delay={0.1}
            />
            <TestimonialCard
              quote="We onboarded 1,200 students in under a week. The EduCore team was with us every step of the way. Top-tier support."
              name="Ms. Amina Wambua"
              role="Head Teacher"
              school="Limuru Girls High School"
              avatar={34}
              delay={0.15}
            />
            <TestimonialCard
              quote="Report card generation used to take two weeks of overtime. Now it's done in an afternoon with beautiful, professional formatting."
              name="Mr. John Otieno"
              role="Academic Registrar"
              school="Nairobi School"
              avatar={35}
              delay={0.2}
            />
            <TestimonialCard
              quote="Security was our biggest concern. Role-based access means our sensitive data is protected. We passed our data audit first time."
              name="Mrs. Faith Njoroge"
              role="IT Administrator"
              school="Strathmore School"
              avatar={36}
              delay={0.25}
            />
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-28 bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Badge className="bg-indigo-50 border-indigo-100 text-indigo-600 mb-5">
                <PieChart size={10} /> Transparent Pricing
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
                Simple, scalable<br /><GradientText>pricing for all.</GradientText>
              </h2>
              <p className="text-slate-500 font-medium">No hidden fees. No long contracts. Pay per term and scale as you grow.</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <PricingCard
              tier="Starter"
              price="KES 15k"
              description="Perfect for small primary schools just getting started with digital management."
              features={["Up to 500 students", "Fee management", "Attendance tracking", "Parent portal", "Email support"]}
              delay={0}
            />
            <PricingCard
              tier="Professional"
              price="KES 35k"
              description="The complete EduCore suite for growing secondary schools and academies."
              features={["Up to 2,000 students", "All Starter features", "M-Pesa integration", "SMS notifications", "Analytics dashboard", "Priority support"]}
              highlighted
              delay={0.1}
            />
            <PricingCard
              tier="Enterprise"
              price="Custom"
              description="For large institutions, multi-campus groups, and county school boards."
              features={["Unlimited students", "Multi-campus management", "Custom integrations", "Dedicated success manager", "SLA guarantee", "On-site training"]}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Badge className="bg-indigo-50 border-indigo-100 text-indigo-600 mb-5">
                <MessageSquare size={10} /> FAQ
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
                Common <GradientText>questions.</GradientText>
              </h2>
            </motion.div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.05}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all text-left group"
                >
                  <span className="text-sm font-black text-slate-900 pr-4">{faq.q}</span>
                  <div className={cn(
                    "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all",
                    activeFaq === i ? "bg-indigo-600 text-white rotate-45" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                  )}>
                    <ChevronRight size={14} />
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-5 text-sm text-slate-500 font-medium leading-relaxed bg-indigo-50/50 rounded-b-2xl border border-t-0 border-indigo-100 -mt-1">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-indigo-600" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/30 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
            {/* Stars background */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() }}
                />
              ))}
            </div>

            <div className="relative z-10 py-12 px-5 md:py-24 md:px-20 text-center text-white">
              <Badge className="bg-white/10 border-white/20 text-white mb-6 md:mb-8">
                <GraduationCap size={10} /> Built for East Africa
              </Badge>
              <h2 className="text-3xl md:text-6xl font-black tracking-tight mb-4 md:mb-6 leading-tight serif">
                Ready to transform your<br className="hidden md:block" /> institution?
              </h2>
              <p className="text-sm md:text-lg text-indigo-100 mb-8 md:mb-12 max-w-lg mx-auto font-medium leading-relaxed">
                Join 1,500+ schools already running smarter with EduCore. Set up takes 5 days. ROI starts immediately.
              </p>
              <div className="flex items-center justify-center gap-3 md:gap-5 w-full">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 flex-1 md:flex-none px-4 py-3.5 md:px-10 md:py-5 rounded-xl md:rounded-2xl bg-white text-indigo-600 text-[11px] md:text-sm font-black shadow-2xl hover:bg-indigo-50 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  Start Free Trial
                  <ArrowRight size={14} className="md:w-4 md:h-4 shrink-0" />
                </Link>
                <button className="inline-flex items-center justify-center gap-1.5 md:gap-2 flex-1 md:flex-none px-3 py-3.5 md:px-10 md:py-5 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[11px] md:text-sm font-black hover:bg-white/20 transition-all hover:-translate-y-1">
                  <Mail size={14} className="md:w-4 md:h-4 shrink-0" />
                  Contact Sales
                </button>
              </div>
              <div className="mt-8 md:mt-10 grid grid-cols-3 gap-2 md:gap-8 text-indigo-200 text-[9px] md:text-xs font-bold max-w-sm md:max-w-none mx-auto">
                <span className="flex flex-col md:flex-row items-center text-center justify-start md:justify-center gap-1 md:gap-1.5"><CheckCircle2 size={14} className="shrink-0 md:w-4 md:h-4 opacity-80" /> <span className="leading-tight">No credit card<br className="md:hidden"/> required</span></span>
                <span className="flex flex-col md:flex-row items-center text-center justify-start md:justify-center gap-1 md:gap-1.5"><CheckCircle2 size={14} className="shrink-0 md:w-4 md:h-4 opacity-80" /> <span className="leading-tight">Free onboarding<br className="md:hidden"/> support</span></span>
                <span className="flex flex-col md:flex-row items-center text-center justify-start md:justify-center gap-1 md:gap-1.5"><CheckCircle2 size={14} className="shrink-0 md:w-4 md:h-4 opacity-80" /> <span className="leading-tight">Cancel<br className="md:hidden"/> anytime</span></span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-secondary text-muted-foreground border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            {/* Brand col */}
            <div className="md:col-span-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <span className="text-lg font-black text-slate-900">EduCore</span>
              </div>
              <p className="text-sm leading-relaxed mb-7 max-w-xs mx-auto md:mx-0 font-medium">
                The next-generation school management ecosystem. Empowering education through technology across East Africa.
              </p>
              <div className="flex justify-center md:justify-start gap-3 mb-8">
                {[Bird, MessageCircle, LinkIcon, Camera].map((Icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-500 transition-all duration-200">
                    <Icon size={14} />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center md:justify-start mx-auto md:mx-0 gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-700">All Systems Operational</span>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-3 grid grid-cols-3 gap-6">
              {[
                {
                  title: "Product",
                  links: ["Features", "Portals", "Pricing", "Security", "API Docs", "Changelog"]
                },
                {
                  title: "Company",
                  links: ["About Us", "Blog", "Careers", "Press Kit", "Partners"]
                },
                {
                  title: "Legal & Support",
                  links: ["Privacy Policy", "Terms of Service", "Data Protection", "Help Centre", "Status Page"]
                }
              ].map((col) => (
                <div key={col.title}>
                  <div className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">{col.title}</div>
                  <ul className="space-y-3.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm font-medium hover:text-indigo-600 transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Contact strip */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 py-6 md:py-8 border-y border-slate-200 mb-10 text-center md:text-left">
            {[
              { icon: Mail, label: "Email Us", value: "hello@educore.co.ke" },
              { icon: Phone, label: "Call Us", value: "+254 700 123 456" },
              { icon: MapPin, label: "Offices", value: "Nairobi, Kenya" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <item.icon size={12} className="text-indigo-600 md:w-[14px] md:h-[14px]" />
                </div>
                <div>
                  <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.label}</div>
                  <div className="text-[8px] sm:text-[10px] md:text-sm font-semibold text-slate-800 break-words max-w-[100px] md:max-w-none leading-tight md:leading-normal">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs font-semibold text-slate-500 text-center md:text-left">
              © 2026 EduCore Technologies Ltd. All rights reserved.
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <span className="text-xs font-bold text-slate-600">🇰🇪 Proudly built for Kenyan Excellence</span>
              <div className="text-xs font-semibold text-slate-400">v2.4.1</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}