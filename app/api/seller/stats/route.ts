import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    
    const [activeListings, totalSales, transactions] = await Promise.all([
      prisma.product.count({ 
        where: {
          sellerId: session.userId as string, 
          status: 'active' 
        }
      }),
      prisma.transaction.count({ 
        where: { sellerId: session.userId as string } 
      }),
      prisma.transaction.findMany({ 
        where: { sellerId: session.userId as string },
        select: { netPayout: true }
      }),
    ]);

    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.netPayout, 0);
    const totalViews = 0; // TODO: Implement view tracking

    return NextResponse.json({
      stats: {
        activeListings,
        totalSales,
        revenue: totalRevenue,
        totalViews,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

