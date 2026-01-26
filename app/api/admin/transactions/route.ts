import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session.role !== 'wholesale_seller') { // Using wholesale_seller as admin for now based on lib/auth.ts isAdmin
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      include: {
        buyer: { select: { email: true } },
        seller: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const transactionsWithId = transactions.map((t) => ({
      ...t,
      _id: t.id,
      buyerId: t.buyerId,
      sellerId: t.sellerId,
      buyerEmail: t.buyer?.email,
      sellerEmail: t.seller?.email,
    }));

    return NextResponse.json({ transactions: transactionsWithId });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

