import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ShieldCheck, Mail, Phone, RefreshCw, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { sendOtpCode as supabaseSendOtp, verifyOtpCode as supabaseVerifyOtp } from "@/lib/supabase";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  phone?: string;
  onSuccess: () => void;
  isSignup?: boolean;
}

export default function OtpVerificationModal({
  isOpen,
  onClose,
  email,
  phone,
  onSuccess,
  isSignup = false,
}: OtpVerificationModalProps) {
  const { toast } = useToast();
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generate OTP & start countdown on modal open
  useEffect(() => {
    if (isOpen) {
      handleSendOtp(channel);
    } else {
      setOtp(Array(6).fill(""));
      setError(null);
      setIsVerified(false);
    }
  }, [isOpen]);

  // Countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  // Verify via Supabase Auth
  async function handleSendOtp(selectedChannel: "email" | "phone") {
    setLoading(true);
    setError(null);
    setTimer(30);

    const targetDestination = selectedChannel === "email" ? email : (phone || "+254 712 345 678");

    try {
      const { data, error } = await supabaseSendOtp(targetDestination, selectedChannel);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: selectedChannel === "email" ? "✉️ OTP Sent via Email" : "💬 OTP Sent via Phone (SMS)",
        description: "Please check your inbox or messages for the code.",
        duration: 8000,
      });
    } catch (err: any) {
      setError(err.message || "Failed to send OTP code. Please check your Supabase Auth configuration.");
    } finally {
      setLoading(false);
    }
  }
  function handleChannelSwitch(newChannel: "email" | "phone") {
    if (newChannel === channel) return;
    setChannel(newChannel);
    setOtp(Array(6).fill(""));
    setError(null);
    handleSendOtp(newChannel);
  }

  function handleInputChange(index: number, value: string) {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-advance to next input box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      inputRefs.current[5]?.focus();
    }
  }

  async function handleVerify() {
    const enteredCode = otp.join("");
    if (enteredCode.length < 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const targetDestination = channel === "email" ? email : (phone || "+254 712 345 678");

      // Verify against Supabase 
      const { error: supaErr } = await supabaseVerifyOtp(targetDestination, enteredCode, channel, isSignup);
      
      if (supaErr) {
        throw new Error(supaErr.message || "Invalid OTP verification code. Please check and try again.");
      }

      setIsVerified(true);
      toast({
        title: "Access Confirmed 🎉",
        description: "OTP verified successfully. Redirecting to your dashboard...",
      });

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Verification failed. Invalid OTP code.");
      setIsVerified(false);
    } finally {
      setVerifying(false);
    }
  }

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + "*".repeat(b.length))
    : "user@shule.go.ke";

  const maskedPhone = phone
    ? phone.replace(/(\+\d{3}\s?\d{3})(\d{3})(\d{3})/, "$1 *** $3")
    : "+254 7** *** **8";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-[32px] border-slate-200/80 shadow-2xl bg-white">
        <div className="p-7 relative">
          
          {/* Header Icon */}
          <div className="flex items-center justify-between mb-5">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <KeyRound size={22} />
            </div>
            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1">
              Two-Factor Auth
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
            Confirm Your Identity
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
            Enter the 6-digit confirmation code sent to your choice of communication channel.
          </p>

          {/* Delivery Channel Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/70 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => handleChannelSwitch("email")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all",
                channel === "email"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Mail size={14} />
              <span className="truncate">Email ({maskedEmail.split("@")[0]})</span>
            </button>
            <button
              type="button"
              onClick={() => handleChannelSwitch("phone")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all",
                channel === "phone"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Phone size={14} />
              <span className="truncate">SMS ({maskedPhone})</span>
            </button>
          </div>



          {/* OTP Digit Inputs */}
          <div className="flex items-center justify-between gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={cn(
                  "w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 transition-all outline-none shadow-sm shadow-slate-200",
                  digit
                    ? "border-indigo-600 text-indigo-950 bg-indigo-50/50"
                    : "border-slate-300 bg-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100",
                  error && "border-red-400 bg-red-50/30 text-red-900"
                )}
              />
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={15} className="flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {isVerified && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>OTP Verified! Redirecting to portal...</span>
            </div>
          )}

          {/* Resend Link & Timer */}
          <div className="flex items-center justify-between text-xs mb-6">
            <span className="text-slate-400 font-medium">Didn't receive code?</span>
            {timer > 0 ? (
              <span className="font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Resend in <span className="text-indigo-600 font-mono">{timer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleSendOtp(channel)}
                disabled={loading}
                className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 underline-offset-4 hover:underline"
              >
                <RefreshCw size={12} className={cn(loading && "animate-spin")} /> Resend OTP Code
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <Button
              onClick={handleVerify}
              disabled={verifying || isVerified || otp.join("").length < 6}
              className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 gap-2"
            >
              {verifying ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Verifying Code...
                </>
              ) : isVerified ? (
                <>
                  <CheckCircle2 size={16} /> Access Granted
                </>
              ) : (
                <>
                  Confirm & Access Portal <ArrowRight size={16} />
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full h-10 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Cancel & Back to Login
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
