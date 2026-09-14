import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogoFull } from "../components/Logo";
import { ArrowRight, CheckCircle2 } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function OnboardingVideo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("to") || "/";

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [playerReady, setPlayerReady] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = initPlayer;
  }, []);

  function initPlayer() {
    playerRef.current = new window.YT.Player("yt-player", {
      videoId: "9SarCXRMwng",
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        mute: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => setPlayerReady(true),
        onStateChange: (e: any) => {
          if (e.data === window.YT.PlayerState.ENDED) {
            setVideoEnded(true);
          }
        },
      },
    });
  }

  // Countdown after video ends
  useEffect(() => {
    if (!videoEnded) return;
    if (countdown <= 0) {
      navigate(destination);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [videoEnded, countdown, navigate, destination]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0A2540] overflow-hidden relative">

      {/* Background subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#2E62A6]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2E62A6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 pt-10 pb-4"
      >
        <LogoFull className="h-10 w-auto" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 size={12} className="text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-400">Account Created!</span>
        </div>
      </motion.div>

      {/* Welcome text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="relative z-10 text-center px-6 py-5"
      >
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Welcome to <span className="text-[#7aaee8]">EduCore</span>
        </h1>
        <p className="text-sm text-white/50 font-medium mt-1">
          Watch a quick intro while we set up your portal
        </p>
      </motion.div>

      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="relative z-10 flex-1 mx-5 mb-6 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        style={{ minHeight: "200px" }}
      >
        {!playerReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1f3c] gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#2E62A6] border-t-white animate-spin" />
            <span className="text-xs text-white/40 font-semibold">Loading video...</span>
          </div>
        )}
        <div id="yt-player" className="w-full h-full min-h-[220px]" />
      </motion.div>

      {/* Bottom navigation bar */}
      <div className="relative z-10 px-5 pb-10">
        <AnimatePresence>
          {!videoEnded ? (
            <motion.button
              key="skip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => navigate(destination)}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
            >
              Skip intro
              <ArrowRight size={15} />
            </motion.button>
          ) : (
            <motion.div
              key="proceed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-white/60 text-xs font-semibold">
                Redirecting to your portal in <span className="text-white font-black">{countdown}s</span>...
              </p>
              <button
                onClick={() => navigate(destination)}
                className="w-full py-4 rounded-2xl font-black text-sm text-white active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #0A2540 0%, #2E62A6 100%)",
                  boxShadow: "0 4px 20px rgba(10,37,64,0.45)",
                }}
              >
                Go to My Portal
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
