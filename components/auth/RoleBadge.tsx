'use client';

import { UserRole } from '@/types/user';
import { UserCircle, User, Store, Building2 } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleConfig: Record<string, { label: string; icon: typeof UserCircle; color: string }> = {
  buyer: {
    label: 'Buyer',
    icon: User,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  personal_seller: {
    label: 'Individual Seller',
    icon: User,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  retail_seller: {
    label: 'Retail Seller',
    icon: Store,
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  wholesale_seller: {
    label: 'Wholesale Seller',
    icon: Building2,
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  admin: {
    label: 'Admin',
    icon: Building2,
    color: 'bg-red-100 text-red-800 border-red-200',
  },
};

export default function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const config = roleConfig[role] || roleConfig.buyer;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.color} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </span>
  );
}

