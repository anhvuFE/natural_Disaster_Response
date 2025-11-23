import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type BadgeVariant = "default" | "info" | "warning" | "critical" | "outline";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-900 text-white",
  info: "bg-blue-50 text-blue-700 border border-blue-200",
  warning: "bg-amber-50 text-amber-800 border border-amber-200",
  critical: "bg-red-50 text-red-700 border border-red-200",
  outline: "border border-slate-300 text-slate-800",
};

export function Badge({ variant = "default", className, ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
