import { create } from "zustand";
import { Api } from "@/lib/api";
import { sampleAlerts, sampleContacts, sampleDisasterTypes, sampleGuide, sampleShelters } from "@/lib/sampleData";
import type { Alert, DisasterGuide, DisasterType, EmergencyContact, Shelter } from "@/types";

type DisasterState = {
  disasterTypes: DisasterType[];
  guides: Record<string, Record<string, DisasterGuide>>;
  shelters: Record<string, Shelter[]>;
  contacts: Record<string, EmergencyContact[]>;
  latestAlerts: Record<string, Alert | null>;
  loading: boolean;
  normalizeProvinceId: (provinceId: string) => string;
  fetchDisasterTypes: () => Promise<DisasterType[]>;
  getGuide: (provinceId: string, disasterCode: string) => Promise<DisasterGuide>;
  setGuide: (guide: DisasterGuide) => void;
  getShelters: (provinceId: string) => Promise<Shelter[]>;
  setShelters: (provinceId: string, shelters: Shelter[]) => void;
  getContacts: (provinceId: string) => Promise<EmergencyContact[]>;
  setContacts: (provinceId: string, contacts: EmergencyContact[]) => void;
  getLatestAlert: (provinceId: string) => Promise<Alert | null>;
  setLatestAlert: (provinceId: string, alert: Alert | null) => void;
};

export const useDisasterStore = create<DisasterState>((set, get) => ({
  disasterTypes: [],
  guides: {},
  shelters: {},
  contacts: {},
  latestAlerts: {},
  loading: false,
  normalizeProvinceId: (provinceId: string) => (provinceId === "demo-province" ? "minh-hoa" : provinceId),
  fetchDisasterTypes: async () => {
    if (get().disasterTypes.length) return get().disasterTypes;
    set({ loading: true });
    try {
      const data = await Api.getDisasterTypes();
      set({ disasterTypes: data, loading: false });
      return data;
    } catch (err) {
      // fallback mẫu
      set({ disasterTypes: sampleDisasterTypes, loading: false });
      return sampleDisasterTypes;
    }
  },
  getGuide: async (provinceId, disasterCode) => {
    provinceId = get().normalizeProvinceId(provinceId);
    const cached = get().guides[provinceId]?.[disasterCode];
    if (cached) return cached;
    set({ loading: true });
    try {
      const guide = await Api.getDisasterGuide(provinceId, disasterCode);
      set((state) => ({
        guides: {
          ...state.guides,
          [provinceId]: { ...(state.guides[provinceId] || {}), [disasterCode]: guide },
        },
        loading: false,
      }));
      return guide;
    } catch (err) {
      // fallback mẫu cho province demo
      set({ loading: false });
      if (provinceId === sampleGuide.provinceId && disasterCode === sampleGuide.disasterCode) {
        set((state) => ({
          guides: {
            ...state.guides,
            [provinceId]: { ...(state.guides[provinceId] || {}), [disasterCode]: sampleGuide },
          },
        }));
        return sampleGuide;
      }
      throw err;
    }
  },
  setGuide: (guide) =>
    set((state) => ({
      guides: {
        ...state.guides,
        [guide.provinceId]: {
          ...(state.guides[guide.provinceId] || {}),
          [guide.disasterCode]: guide,
        },
      },
    })),
  getShelters: async (provinceId) => {
    provinceId = get().normalizeProvinceId(provinceId);
    const cached = get().shelters[provinceId];
    if (cached) return cached;
    try {
      const data = await Api.getShelters(provinceId);
      set((state) => ({ shelters: { ...state.shelters, [provinceId]: data } }));
      return data;
    } catch (err) {
      if (provinceId === sampleGuide.provinceId) {
        set((state) => ({ shelters: { ...state.shelters, [provinceId]: sampleShelters } }));
        return sampleShelters;
      }
      throw err;
    }
  },
  setShelters: (provinceId, items) =>
    set((state) => ({ shelters: { ...state.shelters, [state.normalizeProvinceId(provinceId)]: items } })),
  getContacts: async (provinceId) => {
    provinceId = get().normalizeProvinceId(provinceId);
    const cached = get().contacts[provinceId];
    if (cached) return cached;
    try {
      const data = await Api.getEmergencyContacts(provinceId);
      set((state) => ({ contacts: { ...state.contacts, [provinceId]: data } }));
      return data;
    } catch (err) {
      if (provinceId === sampleGuide.provinceId) {
        set((state) => ({ contacts: { ...state.contacts, [provinceId]: sampleContacts } }));
        return sampleContacts;
      }
      throw err;
    }
  },
  setContacts: (provinceId, items) =>
    set((state) => ({ contacts: { ...state.contacts, [state.normalizeProvinceId(provinceId)]: items } })),
  getLatestAlert: async (provinceId) => {
    provinceId = get().normalizeProvinceId(provinceId);
    const cached = get().latestAlerts[provinceId];
    if (cached !== undefined) return cached;
    try {
      const data = await Api.getLatestAlert(provinceId);
      set((state) => ({ latestAlerts: { ...state.latestAlerts, [provinceId]: data } }));
      return data;
    } catch (err) {
      if (provinceId === sampleGuide.provinceId) {
        const data = sampleAlerts[0] || null;
        set((state) => ({ latestAlerts: { ...state.latestAlerts, [provinceId]: data } }));
        return data;
      }
      throw err;
    }
  },
  setLatestAlert: (provinceId, alert) =>
    set((state) => ({ latestAlerts: { ...state.latestAlerts, [state.normalizeProvinceId(provinceId)]: alert } })),
}));
