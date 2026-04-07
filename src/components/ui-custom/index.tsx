import React, { useState } from "react";

export function cn(...a: (string | false | undefined | null)[]) {
  return a.filter(Boolean).join(" ");
}

// ========================
// Button
// ========================
export function Button({
  className = "",
  variant = "default",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline" | "secondary" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  const base = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none rounded-xl";
  const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-11 px-5 text-base", icon: "h-9 w-9" }[size];
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow",
    ghost: "hover:bg-slate-100 text-slate-700",
    outline: "border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white",
    secondary: "bg-slate-900 text-white hover:bg-black/90 shadow-sm",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
  }[variant];
  return <button className={cn(base, sizes, variants, className)} {...props} />;
}

// ========================
// Input
// ========================
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500",
        props.className
      )}
    />
  );
}

// ========================
// Select
// ========================
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500",
        props.className
      )}
    />
  );
}

// ========================
// Textarea
// ========================
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500",
        props.className
      )}
    />
  );
}

// ========================
// Badge
// ========================
export function Badge({
  children, variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const map = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-indigo-100 text-indigo-700",
  }[variant];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", map)}>{children}</span>;
}

// ========================
// Card
// ========================
export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

export function CardHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-100">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

// ========================
// Table
// ========================
export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            {headers.map((h) => <th key={h} className="py-2.5 px-3 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

// ========================
// Empty State
// ========================
export function Empty({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h10M4 17h6" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="font-medium text-slate-900">{title}</p>
      {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
    </div>
  );
}

// ========================
// Skeleton
// ========================
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-slate-100", className)} />;
}

// ========================
// Modal / Dialog
// ========================
export function Modal({
  open, onClose, title, children, footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h4 className="font-semibold">{title}</h4>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-slate-100" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="border-t border-slate-100 p-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

// ========================
// Toast
// ========================
export function useToast() {
  const [toasts, setToasts] = useState<{ id: number; title: string; desc?: string }[]>([]);
  const push = (t: { title: string; desc?: string }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 2800);
  };
  const View = () => (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className="min-w-[280px] rounded-xl border border-slate-200 bg-white shadow-lg p-3 animate-in slide-in-from-bottom-2">
          <p className="text-sm font-medium text-slate-900">{t.title}</p>
          {t.desc && <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>}
        </div>
      ))}
    </div>
  );
  return { push, View };
}

// ========================
// Charts
// ========================
export function Sparkline({ data }: { data: number[] }) {
  const w = 180, h = 48, pad = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const norm = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const step = (w - pad * 2) / (data.length - 1);
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${norm(v)}`).join(" ");
  const area = `${d} L ${pad + (data.length - 1) * step} ${h - pad} L ${pad} ${h - pad} Z`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <path d={area} fill="rgba(79,70,229,0.12)" />
      <path d={d} fill="none" stroke="#4F46E5" strokeWidth={2} />
    </svg>
  );
}

export function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const w = 520, h = 180, pad = 28;
  const max = Math.max(...data, 1);
  const bw = (w - pad * 2) / data.length - 8;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <g key={i}>
          <line x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} stroke="#e2e8f0" />
        </g>
      ))}
      {data.map((v, i) => {
        const x = pad + i * ((w - pad * 2) / data.length) + 4;
        const bh = (v / max) * (h - pad * 2);
        return (
          <g key={i}>
            <rect x={x} y={h - pad - bh} width={bw} height={bh} rx="8" fill="#4F46E5" opacity="0.9" />
            <text x={x + bw / 2} y={h - 6} textAnchor="middle" fontSize="11" fill="#64748b">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}
