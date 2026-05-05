import React, { useState, useEffect } from "react";
import { 
  X, Check, Smartphone, Landmark, CreditCard, 
  ChevronRight, AlertCircle, Loader2 
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("selection");
        setCountdown(60);
      }, 500);
    }
  }, [open]);

  // Countdown timer for M-Pesa processing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "processing" && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && step === "processing") {
      setStep("success");
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleConfirm = () => {
    setStep("processing");
  };

  const renderSelection = () => (
    <div className="space-y-6 pt-2">
      <div className="space-y-3">
        <Label className="text-slate-600 font-medium text-[13px]">Payment Method</Label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "mpesa", label: "M-Pesa", icon: Smartphone, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
            { id: "bank", label: "Bank Transfer", icon: Landmark, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
            { id: "card", label: "Debit Card", icon: CreditCard, color: "bg-slate-50 text-slate-600 border-slate-100" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id as PaymentMethod)}
              className={cn(
                "flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200",
                method === m.id 
                  ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-100" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              )}
            >
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", m.color)}>
                <m.icon size={20} />
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
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center text-center py-12 space-y-8">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-4 border-slate-100 flex items-center justify-center">
          <Loader2 size={40} className="text-indigo-600 animate-spin" />
        </div>
        <div className="absolute inset-x-0 -bottom-4 flex justify-center">
          <span className="bg-white px-3 py-1 rounded-full border shadow-sm text-[11px] font-black text-indigo-600 tabular-nums">
            0:{countdown < 10 ? `0${countdown}` : countdown}s
          </span>
        </div>
      </div>

      <div className="space-y-3 px-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Processing Payment</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          {method === "mpesa" 
            ? "We've sent an STK push to your phone. Please enter your PIN to complete the transaction." 
            : "We are securely verifying your transaction. This will only take a moment."}
        </p>
      </div>

      <div className="w-full px-12">
        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 60, ease: "linear" }}
          />
        </div>
      </div>

      <Button 
        variant="ghost" 
        onClick={() => setStep("selection")}
        className="text-[12px] font-bold text-slate-400 hover:text-slate-600"
      >
        Cancel Transaction
      </Button>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center text-center py-10 space-y-8">
      <div className="h-20 w-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-200">
        <Check size={40} strokeWidth={3} />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Payment Successful!</h3>
        <p className="text-[14px] text-slate-500 font-medium tracking-tight px-8 leading-relaxed">
          The payment of <span className="font-bold text-slate-900">KES {amount}</span> for <span className="font-bold text-slate-900">{studentName}</span> has been processed successfully.
        </p>
      </div>

      <div className="w-full bg-slate-50/80 rounded-2xl p-5 space-y-3.5 border border-slate-100">
        <div className="flex justify-between items-center text-[12px]">
          <span className="text-slate-400 font-bold uppercase tracking-widest">Transaction ID</span>
          <span className="text-slate-900 font-black tracking-tight">{reference || "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </div>
        <div className="h-[1px] bg-slate-200" />
        <div className="flex justify-between items-center text-[12px]">
          <span className="text-slate-400 font-bold uppercase tracking-widest">Recipient</span>
          <span className="text-slate-900 font-black tracking-tight">Financial Office</span>
        </div>
      </div>

      <div className="w-full space-y-3 pt-2">
        <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
           Download Receipt
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => onOpenChange(false)}
          className="w-full h-12 text-slate-500 font-medium rounded-xl hover:bg-slate-50 transition-all"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[32px] overflow-hidden border-none shadow-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          {step === "selection" && (
            <>
              <DialogTitle className="text-[19px] font-medium text-slate-900 tracking-tight flex items-center justify-between">
                Make a Payment
                <button 
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-slate-400" />
                </button>
              </DialogTitle>
              <DialogDescription className="hidden" />
            </>
          )}
        </DialogHeader>

        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step === "selection" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step === "selection" ? 10 : -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === "selection" && renderSelection()}
              {step === "processing" && renderProcessing()}
              {step === "success" && renderSuccess()}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
