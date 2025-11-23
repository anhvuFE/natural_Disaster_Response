import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Api } from "@/lib/api";
import { sampleProvinces } from "@/lib/sampleData";
import { fetchAddressKitProvinces } from "@/lib/addressKit";
import type { Province } from "@/types";

type ProvinceState = {
  provinces: Province[];
  loading: boolean;
  error?: string;
  currentProvince?: Province;
  lastSlug?: string;
  fetchProvinces: () => Promise<Province[]>;
  setCurrentProvince: (province?: Province) => void;
  setCurrentProvinceBySlug: (slug?: string) => Province | undefined;
};

export const useProvinceStore = create<ProvinceState>()(
  persist(
    (set, get) => ({
      provinces: [],
      loading: false,
      error: undefined,
      currentProvince: undefined,
      lastSlug: undefined,
      fetchProvinces: async () => {
        set({ loading: true, error: undefined });
        try {
          // Ưu tiên AddressKit luôn, kể cả khi đã có cache cũ
          const provinces = await fetchAddressKitProvinces();
          set({ provinces, loading: false, error: undefined });
          if (get().lastSlug) {
            const found = provinces.find((p) => p.slug === get().lastSlug);
            if (found) set({ currentProvince: found });
          }
          return provinces;
        } catch (err) {
          // Fallback: thử backend rồi tới mẫu tĩnh
          try {
            const data = await Api.getProvinces();
            set({ provinces: data, loading: false, error: "Dùng dữ liệu từ backend" });
            if (get().lastSlug) {
              const found = data.find((p) => p.slug === get().lastSlug);
              if (found) set({ currentProvince: found });
            }
            return data;
          } catch (apiErr) {
            set({ provinces: sampleProvinces, loading: false, error: "Dùng dữ liệu mẫu (không gọi được API)" });
            if (get().lastSlug) {
              const found = sampleProvinces.find((p) => p.slug === get().lastSlug);
              if (found) set({ currentProvince: found });
            }
            return sampleProvinces;
          }
        }
      },
      setCurrentProvince: (province) => set({ currentProvince: province, lastSlug: province?.slug }),
      setCurrentProvinceBySlug: (slug) => {
        if (!slug) return undefined;
        const province = get().provinces.find((p) => p.slug === slug);
        if (province) {
          set({ currentProvince: province, lastSlug: slug });
        }
        return province;
      },
    }),
    {
      name: "ndr.province",
      partialize: (state) => ({ lastSlug: state.lastSlug }),
    }
  )
);
