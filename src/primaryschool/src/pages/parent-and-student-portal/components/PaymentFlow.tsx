import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogContent, 
  DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  CreditCard, Smartphone, Landmark, 
  Check, Loader2, Download, 
  ShieldCheck, AlertCircle, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PaymentStep = "selection" | "processing" | "success";
type PaymentMethod = "mpesa" | "bank" | "card";

interface PaymentFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

export function PaymentFlow({ open, onOpenChange, studentName }: PaymentFlowProps) {
  const [step, setStep] = useState<PaymentStep>("selection");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reference, setReference] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [checkoutId, setCheckoutId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      setStep("selection");
      setCountdown(60);
      setCheckoutId("");
      setErrorMessage("");
    }
  }, [open]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "processing" && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (step === "processing" && countdown === 0) {
      setErrorMessage("Payment request timed out");
      setStep("selection");
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "processing" && checkoutId) {
       timer = setInterval(async () => {
          try {
            const res = await fetch(`http://localhost:3001/api/stkpush/status/${checkoutId}`);
            const data = await res.json();
            if (data.success) {
               if (data.data.status === 'success') {
                  if (data.data.receipt) setReference(data.data.receipt); 
                  setStep("success");
               } else if (data.data.status === 'failed') {
                  setErrorMessage(data.data.message || "Payment cancelled or failed");
                  setStep("selection");
               }
            }
          } catch(e) {}
       }, 2000);
    }
    return () => clearInterval(timer);
  }, [step, checkoutId]);

  const handleConfirm = async () => {
    if (method !== "mpesa") {
      setStep("processing");
      return;
    }
    
    setErrorMessage("");
    setStep("processing");
    try {
      const resp = await fetch("http://localhost:3001/api/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, phone: phoneNumber, studentName, reference })
      });
      const data = await resp.json();
      if (!data.success) {
         setErrorMessage(data.message || "Failed to initiate payment");
         setStep("selection");
         return;
      }
      setCheckoutId(data.CheckoutRequestID);
    } catch(err) {
      setErrorMessage("Server error. Ensure backend is running on port 3001.");
      setStep("selection");
    }
  };

  const methods = [
    { id: "mpesa" as const, label: "M-Pesa STK", icon: Smartphone, activeColor: "text-[#00E58F]", inactiveColor: "text-slate-400", activeBg: "bg-[#00E58F]/10 border-[#00E58F]/40 shadow-[0_0_15px_-3px_rgba(0,229,143,0.3)]", inactiveBg: "bg-slate-900/50 border-white/5 hover:border-white/10 hover:bg-slate-800" },
    { id: "bank" as const, label: "Bank Transfer", icon: Landmark, activeColor: "text-blue-400", inactiveColor: "text-slate-400", activeBg: "bg-blue-500/10 border-blue-500/40 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]", inactiveBg: "bg-slate-900/50 border-white/5 hover:border-white/10 hover:bg-slate-800" },
    { id: "card" as const, label: "Debit Card", icon: CreditCard, activeColor: "text-indigo-400", inactiveColor: "text-slate-400", activeBg: "bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]", inactiveBg: "bg-slate-900/50 border-white/5 hover:border-white/10 hover:bg-slate-800" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] sm:w-[560px] sm:aspect-square sm:h-[560px] p-0 overflow-hidden border border-white/10 bg-slate-950/70 backdrop-blur-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,1)] rounded-[32px] text-slate-100 flex flex-col">
        
        {/* Abstract Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-emerald-500/10 blur-[100px] rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {step === "selection" && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col h-full"
            >
              <div className="px-8 pt-8 pb-4 relative shrink-0">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 flex items-center justify-center mb-4 shadow-inner backdrop-blur-md">
                  <ShieldCheck className="text-indigo-400" size={24} strokeWidth={1.5} />
                </div>
                <DialogTitle className="text-2xl font-extrabold tracking-tight text-white mb-1 font-sans">
                  Secure Payment
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-[13px] font-medium">
                  Settling fee balance for <span className="text-indigo-300 font-bold">{studentName}</span>
                </DialogDescription>
              </div>

              <div className="px-8 pb-8 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                {errorMessage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 backdrop-blur-sm shrink-0">
                    <AlertCircle size={16} className="text-rose-400 mt-0.5 shrink-0" />
                    <p className="text-xs font-medium text-rose-200 leading-relaxed">{errorMessage}</p>
                  </motion.div>
                )}

                <div className="space-y-3 mb-5 shrink-0">
                  <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pl-1">Payment Method</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {methods.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 p-2 aspect-square rounded-[20px] border-2 transition-all duration-300",
                          method === m.id ? m.activeBg : m.inactiveBg
                        )}
                      >
                        <div className={cn("transition-colors duration-300", method === m.id ? m.activeColor : m.inactiveColor)}>
                          <m.icon size={24} strokeWidth={1.5} />
                        </div>
                        <span className={cn("text-[10px] font-bold tracking-wide transition-colors duration-300", method === m.id ? "text-white" : "text-slate-400")}>
                          {m.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 bg-white/[0.02] border border-white/5 rounded-[20px] p-4 shrink-0 mb-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400 font-medium text-[11px] pl-1">Amount (KES) <span className="text-rose-400">*</span></Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold tracking-widest text-[13px]">KES</span>
                      <Input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00" 
                        className="pl-14 h-12 rounded-xl bg-slate-900/50 border-white/10 text-white font-mono text-[15px] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  {method === "mpesa" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2 overflow-hidden">
                      <Label className="text-slate-400 font-medium text-[11px] pl-1 flex items-center justify-between">
                        <span>M-Pesa Phone Number <span className="text-rose-400">*</span></span>
                      </Label>
                      <Input 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0712 345 678" 
                        className="h-12 rounded-xl bg-slate-900/50 border-white/10 text-white font-mono text-[15px] focus:border-[#00E58F]/50 focus:ring-1 focus:ring-[#00E58F]/50 transition-all placeholder:text-slate-700"
                      />
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-slate-400 font-medium text-[11px] pl-1">Reference / Transaction ID</Label>
                    <Input 
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Optional" 
                      className="h-12 rounded-xl bg-slate-900/50 border-white/10 text-white font-mono text-[15px] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)}
                    className="h-14 w-20 shrink-0 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl font-semibold transition-all"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    disabled={!amount || (method === "mpesa" && !phoneNumber)}
                    className="h-14 flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold rounded-2xl text-[15px] shadow-[0_10px_30px_-10px_rgba(79,70,229,0.8)] border border-indigo-400/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none disabled:border-transparent group"
                  >
                    Confirm & Pay
                    <ArrowRight className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-12 flex flex-col items-center text-center py-20 relative z-10"
            >
              <div className="relative mb-10 w-28 h-28 flex items-center justify-center">
                {/* Outer animated rings */}
                <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[ping_2s_ease-out_infinite]" />
                <div className="absolute inset-2 rounded-full border border-indigo-400/40 animate-[ping_2.5s_ease-out_infinite_animation-delay-500]" />
                
                <div className="h-20 w-20 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_40px_-5px_rgba(79,70,229,0.4)] relative z-10">
                  <Smartphone className="text-indigo-400" size={32} />
                </div>
                
                <div className="absolute -top-1 -right-1 bg-slate-900 border border-indigo-500/50 h-10 w-10 text-indigo-400 rounded-full flex items-center justify-center shadow-xl z-20">
                  <Loader2 className="animate-spin" size={18} strokeWidth={3} />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Processing Payment</h2>
              <p className="text-slate-400 font-medium mb-10 max-w-[280px] leading-relaxed text-sm">
                {method === "mpesa" 
                  ? "We've sent an STK push to your device. Please enter your PIN to confirm."
                  : "We are verifying your transaction. Please wait."}
              </p>
              
              <div className="w-full max-w-[240px] space-y-4">
                <div className="h-2 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 60, ease: "linear" }}
                    className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,1)]"
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  Timeout in {countdown}s
                </p>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-10 relative z-10 flex flex-col items-center"
            >
              <div className="relative mb-8 w-24 h-24 flex items-center justify-center pt-4">
                {/* Glowing backdrop */}
                <div className="absolute inset-0 bg-[#00E58F]/20 blur-xl rounded-full" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#00E58F]/20 to-[#00E58F]/5 border border-[#00E58F]/40 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(0,229,143,0.4)] backdrop-blur-md relative z-10"
                >
                  <Check className="text-[#00E58F]" size={36} strokeWidth={2.5} />
                </motion.div>
              </div>
              
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight text-center">Payment Successful</h2>
              <p className="text-slate-400 font-medium mb-10 text-center">Your fee payment has been confirmed.</p>
              
              <div className="w-full bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-[24px] p-6 space-y-5 mb-8 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-slate-400 font-medium text-sm">Amount Paid</span>
                  <span className="text-white font-bold text-lg tracking-tight">KES {amount}</span>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-slate-400 font-medium text-sm">Transaction ID</span>
                  <span className="text-slate-300 font-mono font-bold text-[12px] uppercase">
                    {reference || `EDU-${Math.random().toString(36).substr(2, 8)}`}
                  </span>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-slate-400 font-medium text-sm">Method</span>
                  <span className="text-slate-300 font-bold capitalize text-sm">{method}</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <Button className="w-full h-14 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold rounded-2xl gap-2 backdrop-blur-md transition-all active:scale-[0.98]">
                  <Download size={18} className="opacity-70" /> Download Official Receipt
                </Button>
                <Button 
                  onClick={() => onOpenChange(false)}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] transition-all active:scale-[0.98]"
                >
                  Done
                </Button>
              </div>

              <p className="mt-8 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-widest">
                <ShieldCheck size={14} className="text-[#00E58F]/70" />
                EduCore Financials
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
