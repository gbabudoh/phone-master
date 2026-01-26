'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import MessagesPage from '@/components/dashboard/MessagesPage';

export default function PersonalSellerMessagesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = 'Messages | Phone Master';
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-foreground/60">Chat with buyers about your listings</p>
      </div>
      <MessagesPage />
    </div>
  );
}
