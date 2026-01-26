'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import ChatbotButton from '@/components/global/ChatbotButton';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide header/footer for admin routes
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col mesh-gradient">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatbotButton />
    </div>
  );
}
