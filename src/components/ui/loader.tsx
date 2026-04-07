"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/Logo";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "minimal" | "dots" | "pulse" | "progress";
  text?: string;
  subText?: string;
  fullScreen?: boolean;
  className?: string;
  progress?: number;
  steps?: string[];
}

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE_MAP = {
  sm: { outer: 48, border: 3,   logo: 18, dot: 7,  gap: 6  },
  md: { outer: 64, border: 4,   logo: 26, dot: 9,  gap: 7  },
  lg: { outer: 80, border: 5,   logo: 32, dot: 11, gap: 8  },
  xl: { outer: 96, border: 6,   logo: 40, dot: 13, gap: 10 },
};

// ─── Shared spring ────────────────────────────────────────────────────────────

const SPIN = {
  animate: { rotate: 360 },
  transition: { duration: 1.1, repeat: Infinity, ease: "linear" as const },
};

// ─── Logo hex mark (used across variants) ─────────────────────────────────────

function HexMark({ size }: { size: number }) {
  return (
    <LogoIcon src="/loader,logo.png" className="w-full h-full" style={{ width: size, height: size }} />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Variant: Glass (default)
// Conic-gradient ring with breathing logo
// ══════════════════════════════════════════════════════════════════════════════

function GlassSpinner({ size }: { size: keyof typeof SIZE_MAP }) {
  const cfg = SIZE_MAP[size];
  return (
    <div className="relative" style={{ width: cfg.outer, height: cfg.outer }}>
      {/* Spinning arc */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `${cfg.border}px solid transparent`,
          borderTopColor: "#4F46E5",
          borderRightColor: "#818CF8",
        }}
        {...SPIN}
      />

      {/* Second ring offset — creates a trail effect */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: cfg.border + 3,
          border: `${Math.max(cfg.border - 1, 2)}px solid transparent`,
          borderTopColor: "rgba(99,91,255,0.25)",
          borderLeftColor: "rgba(129,140,248,0.15)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />

      {/* Centre logo */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center font-bold text-indigo-600"
        animate={{ scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <HexMark size={cfg.logo} />
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Variant: Minimal
// Clean dual-arc spinner, no logo
// ══════════════════════════════════════════════════════════════════════════════

function MinimalSpinner({ size }: { size: keyof typeof SIZE_MAP }) {
  const cfg = SIZE_MAP[size];
  return (
    <div className="relative" style={{ width: cfg.outer, height: cfg.outer }}>
      {/* Track */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `${cfg.border}px solid #EEF2FF` }}
      />
      {/* Arc */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `${cfg.border}px solid transparent`,
          borderTopColor: "#4F46E5",
          borderRightColor: "#818CF8",
        }}
        {...SPIN}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Variant: Dots
// Three bouncing indigo dots with stagger
// ══════════════════════════════════════════════════════════════════════════════

function DotsLoader({ size }: { size: keyof typeof SIZE_MAP }) {
  const cfg = SIZE_MAP[size];
  return (
    <div className="flex items-center" style={{ gap: cfg.gap }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full bg-indigo-600"
          style={{ width: cfg.dot, height: cfg.dot }}
          animate={{ y: [0, -(cfg.dot * 1.2), 0], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 0.75,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Variant: Pulse
// Ripple rings radiating from a white card with logo
// ══════════════════════════════════════════════════════════════════════════════

function PulseLoader({ size }: { size: keyof typeof SIZE_MAP }) {
  const cfg = SIZE_MAP[size];
  return (
    <div className="relative" style={{ width: cfg.outer, height: cfg.outer }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: `${cfg.border - 1}px solid #4F46E5` }}
          initial={{ scale: 0.5, opacity: 0.9 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Core logo container — transparent, no border */}
      <div
        className="absolute flex items-center justify-center p-0"
        style={{ inset: cfg.outer * 0.15 }}
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <HexMark size={cfg.logo * 1.1} />
        </motion.div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Variant: Progress
// Horizontal bar with step pills and live percentage
// ══════════════════════════════════════════════════════════════════════════════

function ProgressLoader({
  progress = 0,
  steps = ["Authenticating", "Loading data", "Syncing classes", "Ready"],
  size,
}: {
  progress?: number;
  steps?: string[];
  size: keyof typeof SIZE_MAP;
}) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)));
  const activeStep = Math.min(
    Math.floor((pct / 100) * steps.length),
    steps.length - 1
  );

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center gap-6">
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="shrink-0 mb-4"
      >
        <HexMark size={130} />
      </motion.div>

      {/* Progress info row */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
            Loading EduCore
          </span>
          <span className="text-[11px] font-bold text-indigo-600 min-w-[32px] text-right">
            {pct}%
          </span>
        </div>
        {/* Track */}
        <div className="h-2 rounded-full bg-indigo-50 overflow-hidden border border-indigo-100 shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <motion.div
              key={s}
              className={cn(
                "text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-colors",
                done  ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                active ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                         "bg-slate-50 text-slate-400 border-slate-200"
              )}
              animate={{ opacity: active ? 1 : done ? 0.9 : 0.5 }}
            >
              {done ? "✓ " : ""}{s}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main export
// ══════════════════════════════════════════════════════════════════════════════

export default function Loader({
  size = "md",
  variant = "default",
  text,
  subText,
  fullScreen = false,
  className,
  progress = 0,
  steps,
}: LoaderProps) {

  const renderSpinner = () => {
    switch (variant) {
      case "minimal":  return <MinimalSpinner size={size} />;
      case "dots":     return <DotsLoader size={size} />;
      case "pulse":    return <PulseLoader size={size} />;
      case "progress": return <ProgressLoader size={size} progress={progress} steps={steps} />;
      default:         return <GlassSpinner size={size} />;
    }
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-5", className)}>
      {renderSpinner()}

      {/* Label */}
      <AnimatePresence>
        {text && (
          <motion.div
            className="text-center space-y-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">
              {text}
            </p>
            {subText && (
              <p className="text-[10px] text-slate-400">{subText}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ── Full-screen overlay ─────────────────────────────────────────────────────
  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Drifting orbs */}
        <motion.div
          className="absolute rounded-full bg-indigo-50/80 pointer-events-none"
          style={{ width: 320, height: 320, top: "10%", left: "15%" }}
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full bg-violet-50/60 pointer-events-none"
          style={{ width: 200, height: 200, bottom: "15%", right: "20%" }}
          animate={{ x: [0, -16, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute rounded-full bg-indigo-50/50 pointer-events-none"
          style={{ width: 140, height: 140, top: "60%", left: "10%" }}
          animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Content container — with width constraint to keep it centered */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-10 w-full max-w-[400px] px-6 text-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {content}

          {/* School badge — minimal version */}
          <div className="flex items-center gap-2 opactiy-80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
              Bright Futures Academy
            </span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return content;
}

// ══════════════════════════════════════════════════════════════════════════════
// Named sub-exports
// ══════════════════════════════════════════════════════════════════════════════

/** Inline button spinner — white ring, drop-in for <Button> */
export function ButtonLoader({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("w-4 h-4 rounded-full border-2 border-white/30 border-t-white", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
    />
  );
}

/** Shimmer skeleton placeholder — matches slate card background */
export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-slate-100", className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/** Inline progress bar — pass 0–100 */
export function InlineProgressLoader({
  progress,
  label = "Loading…",
  className,
}: {
  progress: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)));
  return (
    <div className={cn("space-y-2 w-full", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
        <motion.span
          key={pct}
          className="text-[11px] font-semibold text-indigo-600"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {pct}%
        </motion.span>
      </div>
      <div className="h-1.5 rounded-full bg-indigo-50 border border-indigo-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}