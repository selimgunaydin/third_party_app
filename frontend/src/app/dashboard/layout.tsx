"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button, Link, Divider } from "@nextui-org/react";
import {
  HiOutlineTemplate,
  HiOutlinePlusCircle,
  HiOutlineViewGrid,
  HiOutlineLogout,
  HiOutlineCube,
  HiOutlineUser,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineChartBar,
} from "react-icons/hi";
import Cookies from "js-cookie";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isComponentsOpen, setIsComponentsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const handleLogout = () => {
    Cookies.remove("access_token");
    router.push("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HiOutlineViewGrid,
    },
  ];

  const analyticsItems = [
    {
      name: "Analytics Dashboard",
      href: "/dashboard/analytics",
      icon: HiOutlineChartBar,
    },
    {
      name: "Analytics Report",
      href: "/dashboard/analytics/analytics-report",
      icon: HiOutlineChartBar,
    },
  ];

  const componentItems = [
    {
      name: "Default Components",
      href: "/dashboard/components/default-components",
      icon: HiOutlineTemplate,
    },
    {
      name: "New Component",
      href: "/dashboard/components/new",
      icon: HiOutlinePlusCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg transition-all duration-300 ease-in-out">
        {/* Logo Area */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="p-2 rounded-lg bg-primary/10">
            <HiOutlineCube className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
            SelAI
          </span>
        </div>

        {/* Menu Items */}
        <nav className="p-3 flex flex-col h-[calc(100vh-4rem)] justify-between">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white font-medium shadow-md shadow-primary/20 scale-[0.98]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary hover:scale-[0.98]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
            <div className="space-y-1">
              <button
                onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-primary group ${
                  analyticsItems.some((item) => pathname === item.href)
                    ? "bg-gray-50 text-primary"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <HiOutlineChartBar className="w-5 h-5" />
                  <span className="text-sm">Analytics</span>
                </div>
                <div
                  className={`transition-transform duration-200 ${
                    isAnalyticsOpen ? "rotate-180" : ""
                  }`}
                >
                  <HiOutlineChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Dropdown Items */}
              <div
                className={`pl-4 space-y-1 overflow-hidden transition-all duration-200 ${
                  isAnalyticsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {analyticsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white font-medium shadow-md shadow-primary/20 scale-[0.98]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-primary hover:scale-[0.98]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            {/* Components Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsComponentsOpen(!isComponentsOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-primary group ${
                  componentItems.some((item) => pathname === item.href)
                    ? "bg-gray-50 text-primary"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <HiOutlineTemplate className="w-5 h-5" />
                  <span className="text-sm">Components</span>
                </div>
                <div
                  className={`transition-transform duration-200 ${
                    isComponentsOpen ? "rotate-180" : ""
                  }`}
                >
                  <HiOutlineChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Dropdown Items */}
              <div
                className={`pl-4 space-y-1 overflow-hidden transition-all duration-200 ${
                  isComponentsOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {componentItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white font-medium shadow-md shadow-primary/20 scale-[0.98]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-primary hover:scale-[0.98]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-2">
            {/* Account Settings */}
            <Link
              href="/dashboard/profile"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/profile"
                  ? "bg-primary text-white font-medium shadow-md shadow-primary/20 scale-[0.98]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary hover:scale-[0.98]"
              }`}
            >
              <HiOutlineUser className="w-5 h-5" />
              <span className="text-sm">Account</span>
            </Link>
            <Divider className="mb-4" />
            <Button
              color="danger"
              variant="light"
              startContent={<HiOutlineLogout className="w-5 h-5" />}
              className="w-full justify-start font-medium text-sm hover:scale-[0.98] transition-transform duration-200"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
