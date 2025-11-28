import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SkyleApp from "./NewApp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SkyleApp />
  </StrictMode>
);
