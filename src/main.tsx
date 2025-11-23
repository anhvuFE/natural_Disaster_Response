import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "@/pages/HomePage";
import ProvincePage from "@/pages/ProvincePage";
import AlertDetailPage from "@/pages/AlertDetailPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminContentPage from "@/pages/admin/AdminContentPage";
import AdminSheltersPage from "@/pages/admin/AdminSheltersPage";
import AdminContactsPage from "@/pages/admin/AdminContactsPage";
import AdminAlertsPage from "@/pages/admin/AdminAlertsPage";
import AdminProvinceConfigPage from "@/pages/admin/AdminProvinceConfigPage";
import AdminProvincesPage from "@/pages/admin/AdminProvincesPage";
import AdminDisastersPage from "@/pages/admin/AdminDisastersPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { Toaster } from "@/components/ui/toaster";

const router = createBrowserRouter(
  [
    {
      element: <MainLayout />, // navbar + outlet
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/province/:slug", element: <ProvincePage /> },
        { path: "/alert/:id", element: <AlertDetailPage /> },
      ],
    },
    { path: "/admin/login", element: <AdminLoginPage /> },
    {
      path: "/admin",
      element: <AdminLayout />, // admin shell with nav
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: "content/:provinceId/:disasterCode", element: <AdminContentPage /> },
        { path: "provinces/:id", element: <AdminProvinceConfigPage /> },
        { path: "provinces", element: <AdminProvincesPage /> },
        { path: "disasters", element: <AdminDisastersPage /> },
        { path: "users", element: <AdminUsersPage /> },
        { path: "alerts", element: <AdminAlertsPage /> },
        { path: "shelters/:provinceId", element: <AdminSheltersPage /> },
        { path: "contacts/:provinceId", element: <AdminContactsPage /> },
        { path: "alerts/:provinceId", element: <AdminAlertsPage /> },
      ],
    },
  ],
  {
    future: { v7_startTransition: true },
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
    <Toaster />
  </React.StrictMode>
);
