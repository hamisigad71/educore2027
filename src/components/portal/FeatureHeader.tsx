import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface FeatureHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function FeatureHeader({ 
  title, 
  description, 
  icon, 
  badge = "New Feature", 
  className,
  actions
}: FeatureHeaderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-[40px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-800 p-8 lg:p-12 text-white shadow-[0_20px_50px_-12px_rgba(79,70,229,0.35)] mb-8", className)}>
      {/* Animated background elements */}
      <motion.div 
        className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-[80px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-indigo-400/20 blur-[60px]"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl text-center md:text-left flex items-start gap-6">
          {icon && (
            <div className="hidden lg:flex h-16 w-16 rounded-[24px] bg-white/15 backdrop-blur-md items-center justify-center shrink-0 border border-white/20 shadow-2xl">
               {icon}
            </div>
          )}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-4 whitespace-nowrap">
              <Sparkles className="size-3.5 text-indigo-200" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100">{badge}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-medium tracking-tight mb-3">
              {title}
            </h1>
            <p className="text-indigo-100/70 text-sm lg:text-base leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
