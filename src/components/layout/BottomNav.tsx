import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export type BottomNavItem = {
  to: string;
  label: string;
  icon: React.ElementType;
};

interface BottomNavProps {
  items: BottomNavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      // Handle both window scroll and element scroll (since main is overflow-y-auto)
      const currentScrollY = target.scrollTop !== undefined ? target.scrollTop : window.scrollY;
      
      // Threshold to avoid flickering on tiny scrolls
      const threshold = 10;
      
      if (Math.abs(currentScrollY - lastScrollY) > threshold) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    // Use capture phase to catch scroll events from children like <main>
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [lastScrollY]);

  return (
    <nav 
      className={cn(
        "lg:hidden fixed left-4 right-4 z-50 transition-all duration-500 ease-in-out",
        isVisible ? "bottom-4 opacity-100 translate-y-0" : "-bottom-20 opacity-0 translate-y-10"
      )}
    >
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-lg shadow-indigo-500/10 h-16 flex items-center justify-around px-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-200 group relative",
                isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={cn(
                    "transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-105"
                  )}
                  fill={isActive ? "currentColor" : "none"}
                  fillOpacity={isActive ? 0.2 : 0}
                />
                <span className="text-[10px] font-semibold tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                   <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-600 animate-in fade-in zoom-in duration-300" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
