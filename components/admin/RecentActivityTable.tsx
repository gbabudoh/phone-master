'use client';

import { User, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with real data fetching later
const recentActivity = [
  { id: 1, type: 'user_signup', user: 'Sarah Johnson', role: 'buyer', time: '2 mins ago' },
  { id: 2, type: 'seller_approval', user: 'TechGiant Ltd', role: 'retail_seller', time: '15 mins ago' },
  { id: 3, type: 'new_listing', user: 'Mike Smith', item: 'iPhone 13 Pro', time: '1 hour ago' },
  { id: 4, type: 'user_signup', user: 'Emma Davis', role: 'buyer', time: '2 hours ago' },
  { id: 5, type: 'seller_application', user: 'Global Phones', role: 'wholesale_seller', time: '3 hours ago' },
];

export default function RecentActivityTable() {
  return (
    <div className="overflow-hidden">
      <div className="flow-root">
        <ul role="list" className="-my-5 divide-y divide-gray-100">
          {recentActivity.map((activity) => (
            <li key={activity.id} className="py-4 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2 cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.type === 'new_listing' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'new_listing' ? <ShoppingBag className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {activity.type === 'new_listing' ? (
                      <>Listed <span className="font-bold">{activity.item}</span></>
                    ) : (
                      <>New {activity.role?.replace('_', ' ') || 'User'}: <span className="font-bold">{activity.user}</span></>
                    )}
                  </p>
                  <p className="truncate text-xs text-gray-500">{activity.time}</p>
                </div>
                <div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <Link 
          href="/admin/users" 
          className="flex w-full items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
        >
          View all activity
        </Link>
      </div>
    </div>
  );
}
