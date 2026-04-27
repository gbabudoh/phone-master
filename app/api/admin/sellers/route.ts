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

    // Fetch all sellers
    const sellers = await prisma.user.findMany({
      where: {
        role: { in: ['personal_seller', 'retail_seller', 'wholesale_seller'] },
      },
      include: {
        profile: true,
        sellerDetails: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const sellerIds = sellers.map(s => s.id);

    // Fetch transaction stats for all sellers in one go
    const transactionStats = await prisma.transaction.groupBy({
      by: ['sellerId'],
      where: { sellerId: { in: sellerIds } },
      _count: { _all: true },
      _sum: { netPayout: true },
    });

    // Fetch product stats for all sellers in one go
    const productStats = await prisma.product.groupBy({
      by: ['sellerId'],
      where: { 
        sellerId: { in: sellerIds },
        status: 'active'
      },
      _count: { _all: true },
    });

    const sellersWithStats = sellers.map((seller) => {
      const txStat = transactionStats.find(s => s.sellerId === seller.id);
      const prodStat = productStats.find(s => s.sellerId === seller.id);

      return {
        ...seller,
        _id: seller.id,
        stats: {
          totalSales: txStat?._count._all || 0,
          totalEarnings: txStat?._sum.netPayout || 0,
          activeListings: prodStat?._count._all || 0,
          rating: 4.5, // TODO: Implement review system
        },
      };
    });

    return NextResponse.json({ sellers: sellersWithStats });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get sellers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sellers' },
      { status: 500 }
    );
  }
}
