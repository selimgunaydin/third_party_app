'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Button,
  Link,
  Divider
} from '@nextui-org/react';
import { 
  HiOutlineTemplate, 
  HiOutlinePlusCircle,
  HiOutlineViewGrid,
  HiOutlineLogout,
  HiOutlineCube,
  HiOutlineUser,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineChartBar
} from 'react-icons/hi';
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isComponentsOpen, setIsComponentsOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('access_token');
    router.push('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HiOutlineViewGrid
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: HiOutlineChartBar
    }
  ];

  const componentItems = [
    {
      name: 'Default Components',
      href: '/dashboard/components/default-components',
      icon: HiOutlineTemplate
    },
    {
      name: 'New Component',
      href: '/dashboard/components/new',
      icon: HiOutlinePlusCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200">
        {/* Logo Area */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200">
          <HiOutlineCube className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">Widget Builder</span>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex flex-col h-[calc(100vh-4rem)] justify-between">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Components Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsComponentsOpen(!isComponentsOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 hover:text-primary ${
                  componentItems.some(item => pathname === item.href) ? 'bg-gray-100 text-primary' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <HiOutlineTemplate className="w-5 h-5" />
                  <span>Components</span>
                </div>
                {isComponentsOpen ? (
                  <HiOutlineChevronDown className="w-4 h-4" />
                ) : (
                  <HiOutlineChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Dropdown Items */}
              <div className={`pl-4 space-y-1 ${isComponentsOpen ? 'block' : 'hidden'}`}>
                {componentItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Account Settings */}
            <Link
              href="/dashboard/profile"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/dashboard/profile'
                  ? 'bg-primary text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
              }`}
            >
              <HiOutlineUser className="w-5 h-5" />
              <span>Account</span>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="p-2">
            <Divider className="mb-4" />
            <Button
              color="danger"
              variant="light"
              startContent={<HiOutlineLogout className="w-5 h-5" />}
              className="w-full justify-start font-medium"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 