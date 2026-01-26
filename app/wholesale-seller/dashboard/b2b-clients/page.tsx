'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Building2, Mail, Phone, Globe, MoreVertical, CheckCircle2, Clock, XCircle, TrendingUp, Users, PoundSterling } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface B2BClient {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  status: 'active' | 'pending' | 'inactive';
  totalOrders: number;
  totalRevenue: number;
  lastOrder: string;
  creditLimit: number;
  paymentTerms: string;
}

export default function B2BClientsPage() {
  const [clients, setClients] = useState<B2BClient[]>([]);
  