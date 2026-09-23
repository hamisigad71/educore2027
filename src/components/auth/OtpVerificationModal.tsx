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
  const [otp, setOtp] = useState<string[]>(Array(8).fill(""));
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
      setOtp(Array(8).fill(""));
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
      let userData = {};
      if (isSignup) {
        const rawPending = localStorage.getItem("educore_pending_registration");
        if (rawPending) {
          try {
            userData = JSON.parse(rawPending).userData || {};
          } catch(e) {}
        }
      }

      const { data, error } = await supabaseSendOtp(targetDestination, selectedChannel, userData);
      
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
    setOtp(Array(8).fill(""));
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
    if (value && index < 7) {
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
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 8);
    if (/^\d{8}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      inputRefs.current[7]?.focus();
    }
  }

  async function handleVerify() {
    const enteredCode = otp.join("");
    if (enteredCode.length < 8) {
      setError("Please enter the complete 8-digit OTP code.");
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
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[32px] border-zinc-200/60 shadow-2xl bg-white shadow-black/5">
        <div className="p-8 relative">
          
          {/* Header Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-12 w-12 rounded-full bg-zinc-100/80 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shadow-sm">
              <KeyRound size={20} strokeWidth={1.5} />
            </div>
            <Badge variant="outline" className="bg-white text-zinc-500 border-zinc-200 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              Two-Factor Auth
            </Badge>
          </div>

          <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
            Confirm Your Identity
          </h3>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-8">
            Enter the 8-digit confirmation code sent to your choice of communication channel.
          </p>

          {/* Delivery Channel Selector */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-zinc-100/80 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => handleChannelSwitch("email")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-300",
                channel === "email"
                  ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50 ring-1 ring-black/5"
                  : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <Mail size={14} strokeWidth={2} />
              <span className="truncate">Email ({maskedEmail.split("@")[0]})</span>
            </button>
            <button
              type="button"
              onClick={() => handleChannelSwitch("phone")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-300",
                channel === "phone"
                  ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50 ring-1 ring-black/5"
                  : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <Phone size={14} strokeWidth={2} />
              <span className="truncate">SMS ({maskedPhone})</span>
            </button>
          </div>

          {/* OTP Digit Inputs */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-8" onPaste={handlePaste}>
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
                  "w-10 sm:w-11 h-12 sm:h-14 text-center text-xl font-semibold rounded-2xl border transition-all duration-200 outline-none",
                  digit
                    ? "border-zinc-400 text-zinc-900 bg-zinc-50 shadow-sm"
                    : "border-zinc-200 bg-zinc-50/50 focus:border-zinc-500 focus:bg-white focus:ring-4 focus:ring-zinc-100",
                  error && "border-red-400 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-red-100"
                )}
              />
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50/80 border border-red-100 text-red-700 text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} strokeWidth={2} className="flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {isVerified && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-700 text-sm font-medium flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 size={16} strokeWidth={2} className="text-emerald-500 flex-shrink-0" />
              <span>OTP Verified! Redirecting to portal...</span>
            </div>
          )}

          {/* Resend Link & Timer */}
          <div className="flex items-center justify-between text-sm mb-8">
            <span className="text-zinc-500 font-medium">Didn't receive code?</span>
            {timer > 0 ? (
              <span className="font-semibold text-zinc-600 bg-zinc-100/80 px-3 py-1 rounded-full text-xs">
                Resend in <span className="font-mono text-zinc-900">{timer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleSendOtp(channel)}
                disabled={loading}
                className="font-medium text-zinc-900 hover:text-black flex items-center gap-1.5 underline-offset-4 hover:underline transition-colors text-xs"
              >
                <RefreshCw size={14} className={cn(loading && "animate-spin")} /> Resend Code
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={verifying || isVerified || otp.join("").length < 8}
              className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-black text-white font-semibold text-base shadow-lg shadow-zinc-200/50 gap-2 transition-all duration-300"
            >
              {verifying ? (
                <>
                  <RefreshCw size={18} className="animate-spin opacity-70" /> Verifying...
                </>
              ) : isVerified ? (
                <>
                  <CheckCircle2 size={18} className="opacity-70" /> Access Granted
                </>
              ) : (
                <>
                  Confirm Code <ArrowRight size={18} className="opacity-70" />
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full h-12 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50 transition-colors"
            >
              Cancel
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
