import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut } from "lucide-react";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

const links = [
  { to: "/admin", key: "admin.nav.dashboard" },
  { to: "/admin/alerts", key: "admin.nav.alerts" },
  { to: "/admin/provinces/:id", key: "admin.nav.provinceConfig" },
  { to: "/admin/provinces", key: "admin.nav.provincesList" },
  { to: "/admin/disasters", key: "admin.nav.disasters" },
  { to: "/admin/users", key: "admin.nav.users" },
];

export default function AdminNavbar() {
  const { user, logout } = useAuthStore();
  const { t } = useI18n();

  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-4">
        <Link to="/admin" className="flex items-center gap-2 font-semibold text-slate-900">
          <ShieldCheck className="h-6 w-6 text-brand-600" />
          {t("admin.nav.console")}
        </Link>
        <div className="flex items-center gap-2 text-sm text-slate-700 sm:gap-3">
          <LanguageSwitcher />
          {user ? (
            <>
              <span className="hidden sm:inline">{user.name}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                {user.role}
              </span>
              <Button size="sm" variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t("admin.nav.logout")}
              </Button>
            </>
          ) : (
            <Button asChild size="sm" variant="secondary">
              <Link to="/admin/login">{t("admin.nav.login")}</Link>
            </Button>
          )}
        </div>
      </div>
      {/* Nav links ẩn, đã chuyển sang sidebar */}
    </header>
  );
}
