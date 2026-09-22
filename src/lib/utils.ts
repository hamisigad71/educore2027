import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  let result = "just now";
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    if (diffInSeconds >= secondsInUnit) {
      const value = Math.floor(diffInSeconds / secondsInUnit);
      result = `${value} ${unit}${value > 1 ? 's' : ''}`;
      break;
    }
  }
  
  if (result !== "just now" && options?.addSuffix) {
    result += " ago";
  }
  
  return result;
}
