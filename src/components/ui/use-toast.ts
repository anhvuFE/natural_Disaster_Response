import { useEffect, useState } from "react";

export type ToastVariant = "default" | "destructive";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function toast(input: Omit<Toast, "id"> & { id?: string }) {
  const id = input.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const duration = input.duration ?? 3200;
  const next: Toast = { ...input, id };
  toasts = [...toasts, next];
  emit();

  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }

  return { id, dismiss: () => dismiss(id) };
}

export function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function useToast() {
  return { toast, dismiss };
}

export function useToastState() {
  const [state, setState] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (next: Toast[]) => setState(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
}
