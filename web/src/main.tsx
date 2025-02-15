import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { assert } from "./lib/panic.ts";

const root = assert(document.getElementById("root"), "root not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
