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
  HiOutlineUser
} from 'react-icons/hi';
import Cookies from 'js-cookie';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

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
      name: 'Default Components',
      href: '/dashboard/default-components',
      icon: HiOutlineTemplate
    },
    {
      name: 'New Component',
      href: '/dashboard/new',
      icon: HiOutlinePlusCircle
    },
    {
      name: 'Account Settings',
      href: '/dashboard/account',
      icon: HiOutlineUser
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