import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SkyleApp from "./NewApp.tsx";

// Service Worker登録
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("✅ SW登録成功", reg))
      .catch((err) => console.error("❌ SW登録失敗", err));
  });
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SkyleApp />
  </StrictMode>
);
