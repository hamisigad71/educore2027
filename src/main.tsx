import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initializeDemoSchoolData } from "./lib/demoSchoolSeed";

// Initialize 15-student test dataset and whitelist for instant onboarding & portal verification
initializeDemoSchoolData();

// Clean unregister any old/broken service workers to prevent blank cached screens
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
