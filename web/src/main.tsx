import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { assert } from "common/lib/panic.ts";
import App from "./App.tsx";

const root = assert(document.getElementById("root"), "root not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
