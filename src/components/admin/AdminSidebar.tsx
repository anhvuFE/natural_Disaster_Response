import { Link, NavLink } from "react-router-dom";
import { ShieldCheck, BellRing, MapPin, ListChecks, Phone, Globe2, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useProvinceStore } from "@/store/provinceStore";

export const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: <ShieldCheck className="h-4 w-4" /> },
  { to: "/admin/alerts", label: "Cảnh báo", icon: <BellRing className="h-4 w-4" /> },
  { to: "/admin/content/:provinceId/:disasterCode", label: "Nội dung", icon: <ListChecks className="h-4 w-4" /> },
  { to: "/admin/shelters/:provinceId", label: "Nơi trú ẩn", icon: <MapPin className="h-4 w-4" /> },
  { to: "/admin/contacts/:provinceId", label: "Số khẩn cấp", icon: <Phone className="h-4 w-4" /> },
  { to: "/admin/provinces", label: "Danh sách tỉnh", icon: <Globe2 className="h-4 w-4" /> },
  { to: "/admin/disasters", label: "Loại thiên tai", icon: <ShieldCheck className="h-4 w-4" /> },
  { to: "/admin/users", label: "Người dùng", icon: <Users className="h-4 w-4" /> },
];

export default function AdminSidebar() {
  const user = useAuthStore((s) => s.user);
  const provinces = useProvinceStore((s) => s.provinces);
  const pid = user?.provinceIds?.[0] || provinces[0]?.id || "";
  const disasterCode = provinces.find((p) => p.id === pid)?.defaultDisasterCode || "flood";

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <div className="sticky top-3 flex max-h-[calc(100vh-24px)] flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-3 py-4 shadow-sm">
        <div className="px-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Điều hướng</div>
        <nav className="flex flex-col gap-1 overflow-auto pr-1">
          {adminLinks.map((link) => {
            const to = link.to.replace(":provinceId", pid).replace(":disasterCode", disasterCode);
            const disabled = link.to.includes(":provinceId") && !pid;
            return (
              <NavLink
                key={link.to}
                to={disabled ? "#" : to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    disabled
                      ? "cursor-not-allowed text-slate-400"
                      : isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <span className="text-slate-500">{link.icon}</span>
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
