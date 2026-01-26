'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  Image, 
  Settings,
  Menu,
  X,
  LogOut,
  Store,
  UserCircle
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/sellers', label: 'Sellers', icon: Store },
  { href: '/admin/buyers', label: 'Buyers', icon: UserCircle },
  { href: '/admin/users', label: 'All Users', icon: Users },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { logout } = useAuth();

  // Don't wrap login page with ProtectedRoute or sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="flex h-screen bg-[#f8fafc] relative overflow-hidden">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-cyan/10 blur-[120px]" />
        </div>

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white/70 backdrop-blur-xl border-r border-white/40 text-foreground transition-all duration-300 flex flex-col z-10`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
            {sidebarOpen && (
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Admin
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 cursor-pointer"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold shadow-sm shadow-primary/5'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 cursor-pointer ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 w-full group cursor-pointer"
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform cursor-pointer" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto relative z-10">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

