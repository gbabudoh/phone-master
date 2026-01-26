import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch all stats
    const [users, sellers, products, transactions] = await Promise.all([
      prisma.user.findMany(),
      prisma.user.findMany({
        where: {
          role: { in: ['personal_seller', 'retail_seller', 'wholesale_seller'] },
          status: 'active',
        },
      }),
      prisma.product.findMany(),
      prisma.transaction.findMany(),
    ]);

    const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.commissionFee || 0), 0);
    const pendingSellers = await prisma.user.findMany({
      where: {
        role: { in: ['personal_seller', 'retail_seller', 'wholesale_seller'] },
        status: 'pending',
      },
    });

    return NextResponse.json({
      stats: {
        totalUsers: users.length,
        totalSellers: sellers.length,
        totalProducts: products.length,
        totalTransactions: transactions.length,
        totalRevenue,
        pendingApprovals: pendingSellers.length,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
