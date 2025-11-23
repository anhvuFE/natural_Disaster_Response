export type UserRole = "global_admin" | "local_admin";

export type Province = {
  id: string;
  name: string;
  slug: string;
  region?: string;
  defaultDisasterCode?: string;
};

export type DisasterType = {
  code: string;
  name: string;
  icon?: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  order: number;
};

export type TipsSection = {
  id: string;
  title: string;
  bullets: string[];
};

export type DisasterGuide = {
  provinceId: string;
  disasterCode: string;
  before: ChecklistItem[];
  during: TipsSection[];
  after: TipsSection[];
};

export type Shelter = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  note?: string;
  phone?: string;
  status?: "active" | "temporarily_closed";
  hours?: string;
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  category?: string;
  note?: string;
};

export type AlertLevel = "info" | "warning" | "critical";

export type Alert = {
  id: string;
  provinceId: string;
  provinceSlug?: string;
  title: string;
  content: string;
  level: AlertLevel;
  scope?: string;
  createdAt: string;
};

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
  provinceIds: string[];
};

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  provinceIds: string[];
};
