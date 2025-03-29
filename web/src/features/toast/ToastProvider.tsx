"use client";
import { type ReactNode, createContext, useContext, useState } from "react";

type ToastItem = {
  message: string;
  timeout?: number; // millisecs
  color: "default" | "info" | "success" | "error" | "warning" | "error";
  // soft: boolean;
  // outline: boolean;
  // dash: boolean;
};
type ToastData = {
  item: ToastItem;
  className: string;
  id: number;
};
type ToastControl = {
  push: (toast: ToastItem) => void;
};
const ToastContext = createContext<ToastControl | null>(null);
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast: please use this within ToastProvider. aborting...");
  return ctx;
}

const DEFAULT_TIMEOUT = 2000;
const ALIGN = "toast-top toast-end";

const ColorToClass = {
  default: "",
  info: "alert-info",
  success: "alert-success",
  error: "alert-error",
  warning: "alert-warning",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  return (
    <ToastContext.Provider
      value={{
        push(toast: ToastItem) {
          const className = `alert ${ColorToClass[toast.color]} ${ALIGN}"}`;
          const id = Math.random();
          setToasts((prev) => [
            ...prev,
            {
              id,
              item: toast,
              className,
            },
          ]);
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, toast.timeout ?? DEFAULT_TIMEOUT);
        },
      }}
    >
      <ul className="toast">
        {toasts.map((toast) => (
          <li key={toast.id} className={toast.className}>
            {toast.item.message}
          </li>
        ))}
      </ul>
      {children}
    </ToastContext.Provider>
  );
}
