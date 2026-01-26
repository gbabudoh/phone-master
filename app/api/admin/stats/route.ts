import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();
    if (session.role !== 'wholesale_seller') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalProducts,
      totalTransactions,
      activeSellers,
      pendingVerifications,
      transactions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.transaction.count(),
      prisma.user.count({
        where: {
          role: { in: ['wholesale_seller', 'retail_seller', 'personal_seller'] },
          status: 'active',
        },
      }),
      prisma.user.count({ where: { status: 'pending_verification' } }),
      prisma.transaction.findMany({
        select: { commissionFee: true }
      }),
    ]);

    const totalRevenue = transactions.reduce((sum: number, tx: any) => sum + (tx.commissionFee || 0), 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalRevenue,
        totalTransactions,
        activeSellers,
        pendingVerifications,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}

