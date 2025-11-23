import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

export type SelectOption = { label: string; value: string; hint?: string };

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function Select({ label, placeholder = "Chọn", value, options, onChange, disabled, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-1", className)} ref={containerRef}>
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left text-sm text-slate-900 shadow-sm transition",
          "border-slate-300 hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:bg-slate-100",
          open ? "ring-2 ring-brand-500/50" : ""
        )}
      >
        <span className={cn("truncate", selected ? "text-slate-900" : "text-slate-500")}>{selected?.label || placeholder}</span>
        <ChevronsUpDown className="h-4 w-4 text-slate-500" />
      </button>
      {open && (
        <div className="relative">
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            <ul className="max-h-56 overflow-auto py-1 text-sm text-slate-900">
              {options.map((opt) => {
                const active = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 px-3 py-2 hover:bg-slate-50",
                      active ? "bg-blue-50" : ""
                    )}
                  >
                    <Check className={cn("h-4 w-4 text-brand-600", active ? "opacity-100" : "opacity-0")}/>
                    <div className="flex-1">
                      <div className="font-semibold">{opt.label}</div>
                      {opt.hint && <div className="text-xs text-slate-500">{opt.hint}</div>}
                    </div>
                  </li>
                );
              })}
              {options.length === 0 && <li className="px-3 py-2 text-xs text-slate-500">Không có lựa chọn</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
