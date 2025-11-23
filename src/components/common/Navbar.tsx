import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home } from "lucide-react";
import ProvinceQuickLink from "@/components/common/ProvinceQuickLink";

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/admin", label: "Admin" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 font-semibold text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-500 text-white shadow-lg shadow-brand-200/60">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div>SafeProvinces</div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">Cảnh báo & hướng dẫn</p>
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ProvinceQuickLink />
          <nav className="hidden flex-wrap items-center gap-1 text-sm font-semibold text-slate-600 sm:flex">
            {navLinks.map((item) => {
              const active = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-3 py-2 transition hover:text-slate-900 ${
                    active ? "bg-slate-900 text-white shadow-sm" : "hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Button asChild variant="outline" size="sm" className="sm:hidden">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
