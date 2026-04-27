import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();
    if (session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch all stats efficiently
    const [
      userCount,
      sellerCount,
      productCount,
      transactionCount,
      revenueResult,
      pendingSellersCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          role: { in: ['personal_seller', 'retail_seller', 'wholesale_seller'] },
          status: 'active',
        },
      }),
      prisma.product.count(),
      prisma.transaction.count(),
      prisma.transaction.aggregate({
        _sum: {
          commissionFee: true,
        },
      }),
      prisma.user.count({
        where: {
          role: { in: ['personal_seller', 'retail_seller', 'wholesale_seller'] },
          status: 'pending_verification',
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers: userCount,
        totalSellers: sellerCount,
        totalProducts: productCount,
        totalTransactions: transactionCount,
        totalRevenue: revenueResult._sum.commissionFee || 0,
        pendingApprovals: pendingSellersCount,
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
