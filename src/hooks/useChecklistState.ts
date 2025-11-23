import { useEffect, useMemo, useState } from "react";
import type { ChecklistItem } from "@/types";

const buildKey = (provinceSlug: string, disasterCode: string) => `checklist:${provinceSlug}:${disasterCode}`;

export function useChecklistState(
  provinceSlug: string,
  disasterCode: string,
  items: ChecklistItem[]
): [string[], (id: string) => void] {
  const key = useMemo(() => buildKey(provinceSlug, disasterCode), [provinceSlug, disasterCode]);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const stableItems = useMemo(() => items, [items]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as string[];
        setCheckedIds(parsed);
      } catch (err) {
        console.error("Failed to parse checklist state", err);
      }
    }
  }, [key]);

  useEffect(() => {
    // Ensure we don't keep ids that no longer exist.
    setCheckedIds((prev) => prev.filter((id) => stableItems.some((i) => i.id === id)));
  }, [stableItems]);

  const toggle = (id: string) => {
    setCheckedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(next));
      }
      return next;
    });
  };

  return [checkedIds, toggle];
}
