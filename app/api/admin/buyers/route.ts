import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all buyers
    const buyers = await prisma.user.findMany({
      where: { role: 'buyer' },
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch stats for each buyer
    const buyersWithStats = await Promise.all(
      buyers.map(async (buyer) => {
        const transactions = await prisma.transaction.findMany({
          where: { buyerId: buyer.id },
        });

        return {
          ...buyer,
          _id: buyer.id,
          stats: {
            totalOrders: transactions.length,
            totalSpent: transactions.reduce((sum, tx) => sum + (tx.totalAmount || 0), 0),
          },
        };
      })
    );

    return NextResponse.json({ buyers: buyersWithStats });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get buyers error:', error);
    return NextResponse.json({ error: 'Failed to fetch buyers' }, { status: 500 });
  }
}
