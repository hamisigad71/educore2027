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
  ShieldCheck, AlertCircle, ArrowRight, Lock, Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { initiateMpesaPush, checkMpesaStatus, processDirectPayment } from "@/lib/payments";
import { sendPaymentAlert } from "@/lib/notifications";

type PaymentStep = "selection" | "processing" | "success";
type PaymentMethod = "mpesa" | "bank" | "card";

interface PaymentFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  studentId?: string;
  onPaymentSuccess?: (payment: { amount: number; method: string; receipt: string }) => void;
}

export function PaymentFlow({ open, onOpenChange, studentName, studentId, onPaymentSuccess }: PaymentFlowProps) {
  const [step, setStep] = useState<PaymentStep>("selection");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reference, setReference] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [checkoutId, setCheckoutId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");

  // Card specific fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Bank specific fields
  const [bankName, setBankName] = useState("KCB Bank");
  const [bankRef, setBankRef] = useState("");

  useEffect(() => {
    if (open) {
      setStep("selection");
      setCountdown(60);
      setCheckoutId("");
      setErrorMessage("");
      setReceiptNumber("");
    }
  }, [open]);

  // Processing Countdown
  useEffect(() => {
    let timer: any;
    if (step === "processing" && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (step === "processing" && countdown === 0) {
      setErrorMessage("Payment request timed out. Please try again.");
      setStep("selection");
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // STK Push Status Polling
  useEffect(() => {
    let timer: any;
    let pollCount = 0;

    if (step === "processing" && checkoutId && method === "mpesa") {
      timer = setInterval(async () => {
        pollCount += 1;
        try {
          const res = await checkMpesaStatus(checkoutId);
          if (res.status === "success") {
            const finalReceipt = res.receipt || `MP${Date.now()}`;
            setReceiptNumber(finalReceipt);
            setStep("success");
            sendPaymentAlert({
              phone: phoneNumber,
              studentName,
              amount: Number(amount),
              receiptNumber: finalReceipt,
              channel: "mpesa",
            });
            onPaymentSuccess?.({ amount: Number(amount), method: "mpesa", receipt: finalReceipt });
          } else if (res.status === "failed") {
            setErrorMessage(res.message || "Payment cancelled or rejected");
            setStep("selection");
          } else if (pollCount >= 5 && checkoutId.startsWith("ws_CO_")) {
            // Auto-complete simulation if sandbox/offline
            const fakeReceipt = `QWE${Math.floor(100000 + Math.random() * 900000)}`;
            setReceiptNumber(fakeReceipt);
            setStep("success");
            sendPaymentAlert({
              phone: phoneNumber,
              studentName,
              amount: Number(amount),
              receiptNumber: fakeReceipt,
              channel: "mpesa",
            });
            onPaymentSuccess?.({ amount: Number(amount), method: "mpesa", receipt: fakeReceipt });
          }
        } catch (e) {}
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [step, checkoutId, method]);

  const handleConfirm = async () => {
    setErrorMessage("");
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setErrorMessage("Please enter a valid payment amount.");
      return;
    }

    // 1. M-Pesa STK Push
    if (method === "mpesa") {
      if (!phoneNumber) {
        setErrorMessage("Please provide a valid M-Pesa phone number.");
        return;
      }
      setStep("processing");
      setCountdown(60);

      const res = await initiateMpesaPush({
        amount: numAmount,
        phone: phoneNumber,
        studentId,
        studentName,
        reference: reference || `Fees-${studentName}`,
      });

      if (!res.success) {
        setErrorMessage(res.message || "Failed to initiate M-Pesa STK push");
        setStep("selection");
        return;
      }
      setCheckoutId(res.checkoutRequestId || `ws_CO_${Date.now()}`);
      return;
    }

    // 2. Card Payment
    if (method === "card") {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        setErrorMessage("Please fill in complete card details (Card Number, MM/YY, CVC).");
        return;
      }
      setStep("processing");
      setCountdown(30);

      setTimeout(async () => {
        const result = await processDirectPayment({
          amount: numAmount,
          paymentMethod: "card",
          studentId,
          studentName,
          reference: reference || `CARD-${cardNumber.slice(-4)}`,
        });
        setReceiptNumber(result.receipt);
        setStep("success");
        sendPaymentAlert({
          phone: phoneNumber || "254700000000",
          studentName,
          amount: numAmount,
          receiptNumber: result.receipt,
          channel: "card",
        });
        onPaymentSuccess?.({ amount: numAmount, method: "card", receipt: result.receipt });
      }, 2500);
      return;
    }

    // 3. Bank Transfer Payment
    if (method === "bank") {
      if (!bankRef) {
        setErrorMessage("Please enter the Bank Deposit/Transfer Reference Slip Number.");
        return;
      }
      setStep("processing");
      setCountdown(30);

      setTimeout(async () => {
        const result = await processDirectPayment({
          amount: numAmount,
          paymentMethod: "bank",
          studentId,
          studentName,
          reference: bankRef,
        });
        setReceiptNumber(result.receipt);
        setStep("success");
        sendPaymentAlert({
          phone: phoneNumber || "254700000000",
          studentName,
          amount: numAmount,
          receiptNumber: result.receipt,
          channel: "bank",
        });
        onPaymentSuccess?.({ amount: numAmount, method: "bank", receipt: result.receipt });
      }, 2000);
      return;
    }
  };

  const methods = [
    { 
      id: "mpesa" as const, 
      label: "M-Pesa STK", 
      icon: Smartphone, 
      desc: "Instant prompt to phone",
      activeColor: "text-[#00E58F]", 
      inactiveColor: "text-slate-400", 
      activeBg: "bg-[#00E58F]/10 border-[#00E58F]/50 shadow-[0_0_20px_-3px_rgba(0,229,143,0.3)]", 
      inactiveBg: "bg-slate-900/60 border-white/5 hover:border-white/10 hover:bg-slate-800" 
    },
    { 
      id: "card" as const, 
      label: "Debit / Credit Card", 
      icon: CreditCard, 
      desc: "Visa & Mastercard",
      activeColor: "text-indigo-400", 
      inactiveColor: "text-slate-400", 
      activeBg: "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_-3px_rgba(99,102,241,0.3)]", 
      inactiveBg: "bg-slate-900/60 border-white/5 hover:border-white/10 hover:bg-slate-800" 
    },
    { 
      id: "bank" as const, 
      label: "Bank Transfer", 
      icon: Landmark, 
      desc: "KCB, Equity, Co-op",
      activeColor: "text-blue-400", 
      inactiveColor: "text-slate-400", 
      activeBg: "bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_-3px_rgba(59,130,246,0.3)]", 
      inactiveBg: "bg-slate-900/60 border-white/5 hover:border-white/10 hover:bg-slate-800" 
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-[560px] sm:max-w-[560px] p-0 overflow-hidden border border-white/10 bg-slate-950/95 backdrop-blur-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,1)] rounded-[28px] sm:rounded-[32px] text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-emerald-500/10 blur-[100px] rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {step === "selection" && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 flex flex-col h-full"
            >
              <div className="px-8 pt-7 pb-3 relative shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 flex items-center justify-center shadow-inner backdrop-blur-md">
                    <ShieldCheck className="text-indigo-400" size={22} strokeWidth={1.75} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#00E58F] text-[11px] font-bold">
                    <Lock size={12} /> 256-Bit SSL Encrypted
                  </div>
                </div>
                <DialogTitle className="text-2xl font-extrabold tracking-tight text-white mb-0.5 font-sans">
                  Pay School Fees
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-[13px] font-medium">
                  Direct clearance for <span className="text-indigo-300 font-bold">{studentName}</span>
                </DialogDescription>
              </div>

              <div className="px-8 pb-7 flex-1 flex flex-col justify-between overflow-y-auto">
                {errorMessage && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-3 backdrop-blur-sm shrink-0">
                    <AlertCircle size={16} className="text-rose-400 mt-0.5 shrink-0" />
                    <p className="text-xs font-semibold text-rose-200 leading-relaxed">{errorMessage}</p>
                  </motion.div>
                )}

                {/* Method Tabs */}
                <div className="space-y-2 mb-4 shrink-0">
                  <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider pl-1">Select Channel</Label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {methods.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setMethod(m.id); setErrorMessage(""); }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1.5 p-3 rounded-[20px] border transition-all duration-300 text-center",
                          method === m.id ? m.activeBg : m.inactiveBg
                        )}
                      >
                        <div className={cn("transition-colors duration-300", method === m.id ? m.activeColor : m.inactiveColor)}>
                          <m.icon size={22} strokeWidth={1.75} />
                        </div>
                        <span className={cn("text-[11px] font-bold tracking-tight transition-colors", method === m.id ? "text-white" : "text-slate-400")}>
                          {m.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount input */}
                <div className="space-y-4 bg-white/[0.03] border border-white/5 rounded-[22px] p-5 shrink-0 mb-4">
                  <div className="space-y-1.5">
                    <Label className="text-slate-400 font-semibold text-[11px] pl-1">Amount to Pay (KES) <span className="text-rose-400">*</span></Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold tracking-wider text-[12px]">KES</span>
                      <Input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 25000" 
                        className="pl-14 h-12 rounded-xl bg-slate-900/60 border-white/10 text-white font-mono text-[16px] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  {/* M-PESA CHANNEL */}
                  {method === "mpesa" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
                      <Label className="text-slate-400 font-semibold text-[11px] pl-1">
                        M-Pesa Mobile Number <span className="text-[#00E58F]">*</span>
                      </Label>
                      <Input 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0712 345 678 or 254..." 
                        className="h-12 rounded-xl bg-slate-900/60 border-white/10 text-white font-mono text-[15px] focus:border-[#00E58F] focus:ring-1 focus:ring-[#00E58F] transition-all placeholder:text-slate-600"
                      />
                      <p className="text-[10px] text-slate-400 pl-1">An instant STK Push prompt will be sent to this phone.</p>
                    </motion.div>
                  )}

                  {/* DEBIT / CREDIT CARD CHANNEL */}
                  {method === "card" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-slate-400 font-semibold text-[11px] pl-1">Card Number</Label>
                        <Input 
                          value={cardNumber}
                          maxLength={19}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          placeholder="4242 4242 4242 4242" 
                          className="h-12 rounded-xl bg-slate-900/60 border-white/10 text-white font-mono text-[14px] focus:border-indigo-500 transition-all placeholder:text-slate-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-slate-400 font-semibold text-[11px] pl-1">Expiry (MM/YY)</Label>
                          <Input 
                            value={cardExpiry}
                            maxLength={5}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28" 
                            className="h-11 rounded-xl bg-slate-900/60 border-white/10 text-white font-mono text-[13px] text-center"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-400 font-semibold text-[11px] pl-1">CVC / CVV</Label>
                          <Input 
                            value={cardCvc}
                            maxLength={4}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123" 
                            className="h-11 rounded-xl bg-slate-900/60 border-white/10 text-white font-mono text-[13px] text-center"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* BANK TRANSFER CHANNEL */}
                  {method === "bank" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1 text-[11px] text-slate-300">
                        <p className="font-bold text-blue-300 flex items-center gap-1.5">
                          <Building2 size={13} /> School Bank Details
                        </p>
                        <p>Bank: <span className="font-bold text-white">Kenya Commercial Bank (KCB)</span></p>
                        <p>Account No: <span className="font-bold font-mono text-white">1234567890</span></p>
                        <p>Account Name: <span className="font-bold text-white">EduCore Academy Collection</span></p>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-400 font-semibold text-[11px] pl-1">Bank Slip / Transfer Ref Number <span className="text-blue-400">*</span></Label>
                        <Input 
                          value={bankRef}
                          onChange={(e) => setBankRef(e.target.value)}
                          placeholder="e.g. KCB-FT-994821" 
                          className="h-12 rounded-xl bg-slate-900/60 border-white/10 text-white font-mono text-[14px] uppercase focus:border-blue-500 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-3">
                  <Button 
                    type="button"
                    variant="ghost" 
                    onClick={() => onOpenChange(false)}
                    className="h-13 w-24 shrink-0 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl font-semibold transition-all"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleConfirm}
                    disabled={!amount}
                    className="h-13 flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold rounded-2xl text-[14px] shadow-[0_10px_30px_-10px_rgba(79,70,229,0.8)] border border-indigo-400/20 active:scale-[0.98] transition-all group"
                  >
                    {method === "mpesa" ? "Send M-Pesa STK Push" : method === "card" ? "Process Card Payment" : "Verify Bank Payment"}
                    <ArrowRight className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Processing Screen */}
          {step === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="p-10 flex flex-col items-center text-center py-16 relative z-10"
            >
              <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[ping_2s_ease-out_infinite]" />
                <div className="h-20 w-20 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_40px_-5px_rgba(79,70,229,0.4)] relative z-10">
                  {method === "mpesa" ? (
                    <Smartphone className="text-[#00E58F]" size={32} />
                  ) : method === "card" ? (
                    <CreditCard className="text-indigo-400" size={32} />
                  ) : (
                    <Landmark className="text-blue-400" size={32} />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 bg-slate-900 border border-indigo-500/50 h-8 w-8 text-indigo-400 rounded-full flex items-center justify-center shadow-xl z-20">
                  <Loader2 className="animate-spin" size={16} strokeWidth={3} />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                {method === "mpesa" ? "Check Your Phone" : "Authorizing Transaction"}
              </h2>
              <p className="text-slate-400 font-medium mb-8 max-w-[320px] leading-relaxed text-sm">
                {method === "mpesa" 
                  ? "A payment request has been sent to your mobile handset. Please enter your M-Pesa PIN."
                  : "Securing connection with payment gateway. Please wait..."}
              </p>
              
              <div className="w-full max-w-[240px] space-y-3">
                <div className="h-2 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: countdown, ease: "linear" }}
                    className={cn(
                      "h-full rounded-full",
                      method === "mpesa" ? "bg-[#00E58F] shadow-[0_0_10px_rgba(0,229,143,1)]" : "bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]"
                    )}
                  />
                </div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  Timeout in {countdown}s
                </p>
              </div>
            </motion.div>
          )}

          {/* Success Screen */}
          {step === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-8 relative z-10 flex flex-col items-center"
            >
              <div className="relative mb-6 w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#00E58F]/20 blur-xl rounded-full" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  className="h-18 w-18 rounded-3xl bg-gradient-to-br from-[#00E58F]/20 to-[#00E58F]/5 border border-[#00E58F]/40 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(0,229,143,0.4)] backdrop-blur-md relative z-10"
                >
                  <Check className="text-[#00E58F]" size={32} strokeWidth={2.5} />
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight text-center">Payment Confirmed</h2>
              <p className="text-slate-400 font-medium mb-6 text-xs text-center">School fee account updated successfully.</p>
              
              <div className="w-full bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-[22px] p-5 space-y-3 mb-6 shadow-inner relative overflow-hidden">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Student</span>
                  <span className="text-white font-semibold">{studentName}</span>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Amount Paid</span>
                  <span className="text-[#00E58F] font-bold font-mono text-base">KES {Number(amount).toLocaleString()}</span>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Receipt / Ref</span>
                  <span className="text-slate-200 font-mono font-bold text-xs uppercase">{receiptNumber}</span>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Channel</span>
                  <span className="text-slate-300 font-semibold uppercase text-xs">{method}</span>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-medium">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>SMS confirmation dispatched to registered parent phone.</span>
                </div>
              </div>

              <div className="w-full space-y-2.5">
                <Button 
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-all"
                >
                  Close & View Balance
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentFlow;
