import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle, ShieldCheck } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed in standalone mode (desktop or mobile)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // 2. Check if user dismissed banner recently (within past 24 hours)
    const dismissedAt = localStorage.getItem("educore_pwa_dismissed_at");
    if (dismissedAt) {
      const hoursSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        return;
      }
    }

    // 3. Detect iOS device (Safari doesn't support beforeinstallprompt, requires Add to Home Screen instructions)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isAppleDevice);

    // 4. Listen for Chrome/Edge/Android native prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. Detect app installed event
    const handleAppInstalled = () => {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 6. For iOS devices or browsers that don't emit prompt immediately, reveal banner gracefully after a brief delay
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setShowBanner(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native browser install dialog
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // Show iOS step-by-step modal guide
      setShowIOSModal(true);
    } else {
      // Other browsers: show manual installation guidance dialog
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("educore_pwa_dismissed_at", Date.now().toString());
  };

  if (installed || !showBanner) return null;

  return (
    <>
      <AnimatePresence>
        <motion.aside
          aria-label="Install EduCore Application"
          initial={{ y: 120, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 120, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-[430px] z-50 pointer-events-auto"
        >
          <div className="bg-[#0A2540] text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(10,37,64,0.45)] border border-indigo-400/20 backdrop-blur-xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-indigo-500/25 blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              {/* App Icon */}
              <div className="relative shrink-0">
                <div className="h-12 w-12 sm:h-13 sm:w-13 rounded-2xl bg-white/10 p-2 border border-white/20 flex items-center justify-center shadow-inner overflow-hidden">
                  <img
                    src="/favicon.png"
                    alt="EduCore Icon"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white font-bold ring-2 ring-[#0A2540]">
                  ✓
                </span>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[13px] sm:text-[14px] font-black tracking-tight text-white truncate">
                    Install EduCore App
                  </h4>
                  <span className="hidden xs:inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-1.5 py-0.5 rounded-md">
                    Fast & Offline
                  </span>
                </div>
                <p className="text-[11px] sm:text-[12px] text-indigo-200/80 leading-snug line-clamp-2 mt-0.5 font-normal">
                  Add to home screen for instant access to marks, fees, and timetables.
                </p>
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss banner"
                className="shrink-0 text-indigo-200/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            {/* Action Bar */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-300 font-semibold">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero download size</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 text-[11px] font-bold text-indigo-200 hover:text-white transition-colors"
                >
                  Not now
                </button>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="h-8 sm:h-8.5 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#0A2540] font-black text-[12px] sm:text-[12.5px] shadow-md shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Download size={13} strokeWidth={2.5} />
                  <span>Install App</span>
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* iOS / Safari / Manual Add to Home Screen Instructions Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#0A2540] p-2 flex items-center justify-center text-white shadow-md">
                    <img src="/favicon.png" alt="EduCore" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Install EduCore</h3>
                    <p className="text-xs text-slate-500">Quick 2-step setup</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                To install EduCore on your {isIOS ? "iPhone or iPad" : "browser"} and use it just like a native app:
              </p>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Share size={16} />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900">1. Tap the Share button</span>
                    <p className="text-[11px] text-slate-500">Located in your browser toolbar (bottom or top)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <PlusSquare size={16} />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900">2. Select "Add to Home Screen"</span>
                    <p className="text-[11px] text-slate-500">Scroll down and tap <span className="font-semibold text-slate-900">Add to Home Screen</span></p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full h-11 rounded-xl bg-[#0A2540] hover:bg-[#0A2540]/90 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={15} />
                <span>Got It, Thanks!</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PwaInstallBanner;

