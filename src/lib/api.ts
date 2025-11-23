import { Alert, DisasterGuide, DisasterType, EmergencyContact, Province, Shelter } from "@/types";

type ApiOptions = RequestInit & { token?: string };

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed (${res.status})`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export const Api = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: { id: string; name: string; role: string; provinceIds: string[] } }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    ),

  // Public
  getProvinces: () => apiRequest<Province[]>("/provinces"),
  getProvinceBySlug: (slug: string) => apiRequest<Province>(`/provinces/slug/${slug}`),
  getProvinceById: (id: string) => apiRequest<Province>(`/provinces/${id}`),
  getDisasterTypes: () => apiRequest<DisasterType[]>("/disasters"),
  createDisasterType: (data: Partial<DisasterType>, token?: string) =>
    apiRequest<DisasterType>("/disasters", { method: "POST", body: JSON.stringify(data), token }),
  updateDisasterType: (code: string, data: Partial<DisasterType>, token?: string) =>
    apiRequest<DisasterType>(`/disasters/${code}`, { method: "PUT", body: JSON.stringify(data), token }),
  deleteDisasterType: (code: string, token?: string) =>
    apiRequest<void>(`/disasters/${code}`, { method: "DELETE", token }),
  getDisasterGuide: (provinceId: string, disasterCode: string) =>
    apiRequest<DisasterGuide>(`/guides/${provinceId}/${disasterCode}`),
  getShelters: (provinceId: string) => apiRequest<Shelter[]>(`/shelters/${provinceId}`),
  getEmergencyContacts: (provinceId: string) => apiRequest<EmergencyContact[]>(`/contacts/${provinceId}`),
  getLatestAlert: (provinceId: string) => apiRequest<Alert | null>(`/alerts/latest/${provinceId}`),
  getAlertById: (id: string) => apiRequest<Alert>(`/alerts/${id}`),
  getAlerts: (provinceId: string) => apiRequest<Alert[]>(`/alerts/history/${provinceId}`),

  // Admin
  createProvince: (data: Partial<Province>, token?: string) =>
    apiRequest<Province>("/provinces", { method: "POST", body: JSON.stringify(data), token }),
  updateProvince: (id: string, data: Partial<Province>, token?: string) =>
    apiRequest<Province>(`/provinces/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  deleteProvince: (id: string, token?: string) =>
    apiRequest<void>(`/provinces/${id}`, { method: "DELETE", token }),
  updateDisasterGuide: (provinceId: string, disasterCode: string, payload: DisasterGuide, token?: string) =>
    apiRequest<DisasterGuide>(`/guides/${provinceId}/${disasterCode}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      token,
    }),
  createShelter: (provinceId: string, data: Partial<Shelter>, token?: string) =>
    apiRequest<Shelter>(`/shelters/${provinceId}`,
      { method: "POST", body: JSON.stringify(data), token }),
  updateShelter: (provinceId: string, shelterId: string, data: Partial<Shelter>, token?: string) =>
    apiRequest<Shelter>(`/shelters/${provinceId}/${shelterId}`,
      { method: "PUT", body: JSON.stringify(data), token }),
  deleteShelter: (provinceId: string, shelterId: string, token?: string) =>
    apiRequest<void>(`/shelters/${provinceId}/${shelterId}`, { method: "DELETE", token }),

  createContact: (provinceId: string, data: Partial<EmergencyContact>, token?: string) =>
    apiRequest<EmergencyContact>(`/contacts/${provinceId}`,
      { method: "POST", body: JSON.stringify(data), token }),
  updateContact: (provinceId: string, contactId: string, data: Partial<EmergencyContact>, token?: string) =>
    apiRequest<EmergencyContact>(`/contacts/${provinceId}/${contactId}`,
      { method: "PUT", body: JSON.stringify(data), token }),
  deleteContact: (provinceId: string, contactId: string, token?: string) =>
    apiRequest<void>(`/contacts/${provinceId}/${contactId}`, { method: "DELETE", token }),

  createAlert: (provinceId: string, data: Partial<Alert>, token?: string) =>
    apiRequest<Alert>(`/alerts/${provinceId}`, { method: "POST", body: JSON.stringify(data), token }),
};
