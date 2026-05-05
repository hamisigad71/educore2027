import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Construction } from "lucide-react";

interface PortalPlaceholderProps {
  title: string;
}

export function PortalPlaceholder({ title }: PortalPlaceholderProps) {
  return (
    <div className="space-y-6">
      {/* Header section with Glass3D feel */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 p-8 lg:p-12 text-white shadow-2xl shadow-slate-900/20">
        {/* Animated background elements */}
        <motion.div 
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-violet-600/10 blur-[60px]"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 whitespace-nowrap">
              <Sparkles className="size-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">New Feature</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-medium tracking-tight mb-3">
              {title}
            </h1>
            <p className="text-slate-400 text-sm lg:text-base leading-relaxed font-medium">
              We're currently finalizing the {title} module to provide you with the most premium 
              educational management experience. Stay tuned for a world-class portal experience.
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder Content Area */}
      <Card className="border-slate-200/60 shadow-soft bg-white/50 backdrop-blur-sm rounded-[32px] overflow-hidden">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <Construction className="size-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">Module Initializing</h3>
            <p className="text-sm text-slate-500 max-w-sm font-medium leading-relaxed">
                Connect with the school administration if you need immediate information regarding {title.toLowerCase()}.
            </p>
            
            <div className="mt-8 flex gap-3">
                <div className="h-2 w-12 rounded-full bg-indigo-100" />
                <div className="h-2 w-8 rounded-full bg-indigo-200" />
                <div className="h-2 w-4 rounded-full bg-indigo-300" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
