import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import type { ITransaction } from '@/types/transaction';

export async function GET() {
  try {
    const session = await requireAuth();
    
    const orders = await prisma.transaction.findMany({
      where: { sellerId: session.userId as string },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const ordersWithId = orders.map((o: ITransaction & { id: string }) => ({
      ...o,
      _id: o.id,
    }));

    return NextResponse.json({ orders: ordersWithId });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

