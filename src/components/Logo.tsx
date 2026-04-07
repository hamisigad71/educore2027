import React from "react";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/logo.png";

/**
 * Specular sweep effect — the light streak
 */
const LOGO_STYLES = `
  .logo-specular-sweep {
    position: absolute;
    top: -30%;
    left: -100%;
    width: 60%;
    height: 200%;
    background: linear-gradient(
      105deg,
      transparent                    0%,
      rgba(255,255,255,0.02)        20%,
      rgba(255,255,255,0.48)        45%,
      rgba(255,255,255,0.65)        50%,
      rgba(255,255,255,0.48)        55%,
      rgba(255,255,255,0.02)        80%,
      transparent                   100%
    );
    transform: skewX(-15deg);
    pointer-events: none;
    z-index: 4;
    animation: specularBadgeSweep 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes specularBadgeSweep {
    0%   { left: -100%; opacity: 0; }
    5%   { opacity: 1; }
    45%  { left: 150%; opacity: 1; }
    50%  { left: 150%; opacity: 0; }
    100% { left: 150%; opacity: 0; }
  }
`;

/**
 * LogoFull — full logo image (icon + EduCore text)
 * Use on the login page and splash screens
 */
export function LogoFull({ 
  src = LOGO_SRC, 
  className = "h-[40px] w-auto",
  style
}: { 
  src?: string; 
  className?: string; 
  style?: React.CSSProperties 
}) {
  return (
    <div className={cn("relative overflow-hidden inline-block shrink-0", className)} style={style}>
      <style>{LOGO_STYLES}</style>
      <img
        src={src}
        alt="EduCore"
        className="h-full w-auto"
        style={{ objectFit: "contain" }}
      />
      <div className="logo-specular-sweep" />
    </div>
  );
}

/**
 * LogoIcon — icon portion of the logo, cropped to the top graphic part
 * Used in compact spaces: sidebar header, topbar
 */
export function LogoIcon({ 
  src = LOGO_SRC, 
  className = "h-[40px] w-auto",
  style
}: { 
  src?: string; 
  className?: string; 
  style?: React.CSSProperties 
}) {
  return (
    <div className={cn("relative overflow-hidden inline-block shrink-0", className)} style={style}>
      <style>{LOGO_STYLES}</style>
      <img
        src={src}
        alt="EduCore"
        className="h-full w-auto"
        style={{ objectFit: "contain", objectPosition: "top center" }}
      />
      <div className="logo-specular-sweep" />
    </div>
  );
}
