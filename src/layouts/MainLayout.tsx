import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar";

export default function MainLayout() {
  return (
    <div className="shell text-slate-900">
      <Navbar />
      <main className="px-3 pb-16 pt-4 sm:px-4">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
