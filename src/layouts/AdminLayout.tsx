import { Outlet } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar, { adminLinks } from "@/components/admin/AdminSidebar";
import { useProvinceStore } from "@/store/provinceStore";

export default function AdminLayout() {
  return (
    <div className="shell text-slate-900 overflow-x-hidden">
      <AdminNavbar />
      <div className="mx-auto flex w-full max-w-6xl gap-4 px-3 py-4 sm:px-4 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 pb-8 overflow-hidden">
          <MobileAdminNav />
          <div className="min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileAdminNav() {
  const provinces = useProvinceStore((s) => s.provinces);
  const pid = provinces[0]?.id || "";
  const disasterCode = provinces[0]?.defaultDisasterCode || "flood";
  return (
    <div className="mb-3 block md:hidden">
      <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm">
        {adminLinks.map((link) => {
          const to = link.to.replace(":provinceId", pid).replace(":disasterCode", disasterCode);
          const disabled = link.to.includes(":provinceId") && !pid;
          return (
            <a
              key={link.to}
              href={disabled ? "#" : to}
              className={`flex min-w-[110px] items-center gap-1 rounded-full px-3 py-1.5 text-slate-700 ${
                disabled ? "cursor-not-allowed opacity-60" : "hover:bg-slate-50"
              }`}
            >
              {link.icon}
              <span className="truncate">{link.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
