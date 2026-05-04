import React from "react";
import { cn } from "@/lib/utils";

export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className={cn("w-full h-[30px]", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="text-primary"
        />
      </svg>
    </div>
  );
}

export function BarChart({ data, labels, className }: { data: number[]; labels: string[]; className?: string }) {
  const max = Math.max(...data);
  
  return (
    <div className={cn("w-full h-[200px] flex items-end gap-1.5 sm:gap-2 px-1 sm:px-2", className)}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 h-full flex flex-col justify-end gap-2 group">
          <div className="flex-1 w-full bg-secondary rounded-t-[4px] relative flex flex-col justify-end overflow-hidden">
            <div 
              className="w-full bg-primary hover:bg-primary/80 transition-all duration-500 relative"
              style={{ height: `${(v / max) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                {v.toLocaleString()}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground text-center uppercase tracking-tighter">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
