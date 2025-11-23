import { toSlug } from "@/lib/string";
import type { Province } from "@/types";

const BASE_URL = import.meta.env.VITE_ADDRESSKIT_BASE || "https://addresskit.cas.so";
const DEFAULT_DATE = import.meta.env.VITE_ADDRESSKIT_EFFECTIVE_DATE || "latest";

export type AddressKitProvince = {
  id: string;
  name: string;
  code?: string;
  shortName?: string;
  fullName?: string;
  region?: string;
};

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`AddressKit error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchAddressKitProvinces(effectiveDate: string = DEFAULT_DATE): Promise<Province[]> {
  const base = BASE_URL.replace(/\/$/, "");
  const paths = [effectiveDate, effectiveDate !== "latest" ? "latest" : undefined].filter(Boolean) as string[];

  let lastError: unknown;
  for (const date of paths) {
    try {
      const url = `${base}/${date}/provinces`;
      const data = await getJson<AddressKitProvince[]>(url);
      if (!Array.isArray(data) || data.length === 0) throw new Error("AddressKit empty list");
      return data.map((p) => ({
        id: p.id || p.code || toSlug(p.name),
        name: p.name,
        slug: toSlug(p.name),
        region: p.region,
        defaultDisasterCode: "flood",
      }));
    } catch (err) {
      lastError = err;
      // try next path
    }
  }
  throw lastError instanceof Error ? lastError : new Error("AddressKit fetch failed");
}
