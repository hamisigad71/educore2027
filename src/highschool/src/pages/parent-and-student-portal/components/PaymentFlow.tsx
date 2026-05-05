import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogContent, 
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  CreditCard, Smartphone, Landmark, 
  ArrowRight, ShieldCheck, Check, 
  Loader2, Download, ExternalLink,
  ChevronRight, Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PaymentStep = "selection" | "processing" | "success";
type PaymentMethod = "mpesa" | "bank" | "card";

interface PaymentFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

export default function PaymentFlow({ open, onOpenChange, studentName }: PaymentFlowProps) {
  const [step, setStep] = useState<PaymentStep>("selection");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reference, setReference] = useState("");
  const [countdown, setCountdown] = useState(60);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setStep("selection");
      setCountdown(60);
    }
  }, [open]);

  // Handle processing timer
  useEffect(() => {
    if (step === "processing" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === "processing" && countdown === 0) {
      setStep("success");
    }
  }, [step, countdown]);

  const handleConfirm = () => {
    setStep("processing");
  };

  const methods = [
    { id: "mpesa" as const, label: "M-Pesa STK", icon: Smartphone, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "bank" as const, label: "Bank Transfer", icon: Landmark, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: "card" as const, label: "Debit Card", icon: CreditCard, color: "text-slate-600", bg: "bg-slate-50" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl rounded-[32px]">
        {/* Step-based Content */}
        <AnimatePresence mode="wait">
          {step === "selection" && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 sm:p-8"
            >
              <DialogHeader className="mb-6">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                  <CreditCard className="text-indigo-600" size={24} />
                </div>
                <DialogTitle className="text-[19px] font-medium text-slate-900 tracking-tight flex items-center justify-between">Make a Payment</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium pt-1">
                  Secure fee payment for <span className="text-indigo-600 font-medium">{studentName}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-600 font-medium text-[13px]">Payment Method</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {methods.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-300",
                          method === m.id 
                            ? "border-indigo-600 bg-indigo-50/50 shadow-sm" 
                            : "border-slate-100 bg-white hover:border-slate-200"
                        )}
                      >
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", m.bg)}>
                          <m.icon size={20} className={m.color} />
                        </div>
                        <span className="text-[12px] font-medium text-slate-700 tracking-tight">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-[13px]">Amount (KES) <span className="text-rose-500">*</span></Label>
                    <Input 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 10000" 
                      className="h-12 rounded-xl bg-white border-slate-200 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                  </div>

                  {method === "mpesa" && (
                    <div className="space-y-2">
                      <Label className="text-slate-600 font-medium text-[13px]">M-Pesa Phone Number <span className="text-rose-500">*</span></Label>
                      <Input 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0712 345 678" 
                        className="h-12 rounded-xl bg-white border-slate-200 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                      <p className="text-[10px] text-slate-400 font-medium">An STK Push request will be sent to this number.</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-[13px]">Reference / Transaction ID</Label>
                    <Input 
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Optional — e.g. M-Pesa code" 
                      className="h-12 rounded-xl bg-white border-slate-200 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-indigo-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Payments are processed securely. A receipt will be emailed to your registered address upon confirmation.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Button 
                    onClick={handleConfirm}
                    disabled={!amount || (method === "mpesa" && !phoneNumber)}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                  >
                    <CreditCard size={16} className="mr-2" /> {method === "mpesa" ? "Pay with M-Pesa" : "Confirm Payment"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)}
                    className="w-full h-12 text-slate-500 font-medium rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Cancel Transaction
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-10 flex flex-col items-center text-center py-16"
            >
              <div className="relative mb-8">
                <div className="h-24 w-24 rounded-[32px] bg-indigo-50 flex items-center justify-center animate-pulse">
                  <Smartphone className="text-indigo-600" size={40} />
                </div>
                <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-slate-50">
                  <Loader2 className="text-indigo-600 animate-spin" size={18} />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Payment</h2>
              <p className="text-slate-500 font-medium mb-8 max-w-[280px]">
                {method === "mpesa" 
                  ? "We've sent an STK push to your phone. Please enter your PIN to confirm."
                  : "We are verifying your transaction with the bank. Please wait."}
              </p>
              
              <div className="w-full max-w-[200px] space-y-3">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 60 }}
                    className="h-full bg-indigo-600"
                  />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Valid for {countdown}s
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
              className="p-8"
            >
              <div className="flex flex-col items-center text-center pt-4">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-xl shadow-emerald-50">
                  <Check className="text-emerald-600" size={32} strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Payment Successful!</h2>
                <p className="text-slate-500 font-medium mb-8">Your fee payment has been confirmed.</p>
                
                <div className="w-full bg-slate-50 rounded-[24px] p-5 space-y-4 mb-8 border border-slate-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Amount Paid</span>
                    <span className="text-slate-900 font-bold">KES {amount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Transaction ID</span>
                    <span className="text-slate-900 font-mono font-bold text-[11px]">EDU-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Method</span>
                    <span className="text-slate-900 font-bold capitalize">{method}</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold rounded-xl gap-2 shadow-lg shadow-slate-200">
                    <Download size={16} /> Download Receipt
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)}
                    className="w-full h-11 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs uppercase tracking-widest"
                  >
                    Done
                  </Button>
                </div>

                <p className="mt-6 text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  Verified and Secured by EduCore Financials
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
