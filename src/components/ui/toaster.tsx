import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dismiss, useToastState } from "./use-toast";

export function Toaster() {
  const toasts = useToastState();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex max-h-screen w-full max-w-sm flex-col gap-3 overflow-hidden">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg",
            toast.variant === "destructive" ? "border-red-200 bg-red-50" : ""
          )}
        >
          <div className="flex items-start gap-3 px-4 py-3">
            <div className="flex-1">
              {toast.title && <p className="text-sm font-semibold text-slate-900">{toast.title}</p>}
              {toast.description && <p className="text-sm text-slate-700">{toast.description}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
