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

    // Fetch all sellers (personal, retail, wholesale)
    const sellers = await prisma.user.findMany({
      where: {
        role: {
          in: ['personal_seller', 'retail_seller', 'wholesale_seller'],
        },
      },
      include: {
        profile: true,
        sellerDetails: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch stats for each seller
    const sellersWithStats = await Promise.all(
      sellers.map(async (seller) => {
        const transactions = await prisma.transaction.findMany({
          where: { sellerId: seller.id },
        });

        const totalSales = transactions.length;
        const totalEarnings = transactions.reduce((sum, tx) => sum + (tx.netPayout || 0), 0);

        const listings = await prisma.product.findMany({
          where: { sellerId: seller.id },
        });

        return {
          ...seller,
          _id: seller.id,
          stats: {
            totalSales,
            totalEarnings,
            activeListings: listings.filter((p) => p.status === 'active').length,
            rating: 4.5, // TODO: Calculate from reviews
          },
        };
      })
    );

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
