"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ToastType = "info" | "success" | "error";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastApi {
  push: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ message: string; type: ToastType }>;
      const id = crypto.randomUUID();
      setItems((prev) => [{ id, message: custom.detail.message, type: custom.detail.type }, ...prev].slice(0, 4));
      setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, 2400);
    };

    window.addEventListener("app-toast", handler as EventListener);
    return () => window.removeEventListener("app-toast", handler as EventListener);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      push: (message, type = "info") => {
        window.dispatchEvent(new CustomEvent("app-toast", { detail: { message, type } }));
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-md border px-3 py-2 text-sm shadow-sm ${
              item.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : item.type === "error"
                  ? "border-red-300 bg-red-50 text-red-900"
                  : "border-slate-300 bg-white text-slate-900"
            }`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      push: () => {},
    };
  }
  return ctx;
}

export function pushToast(message: string, type: ToastType = "info") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app-toast", { detail: { message, type } }));
  }
}
