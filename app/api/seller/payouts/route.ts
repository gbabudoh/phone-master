import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import type { ITransaction } from '@/types/transaction';

export async function GET() {
  try {
    const session = await requireAuth();
    
    const transactions = await prisma.transaction.findMany({
      where: { sellerId: session.userId as string }
    });

    const totalEarnings = transactions.reduce((sum: number, tx: ITransaction & { id: string }) => sum + (tx.netPayout || 0), 0);
    const pendingPayouts = transactions
      .filter((tx: ITransaction & { id: string }) => tx.payoutStatus === 'pending')
      .reduce((sum: number, tx: ITransaction & { id: string }) => sum + (tx.netPayout || 0), 0);
    const paidOut = transactions
      .filter((tx: ITransaction & { id: string }) => tx.payoutStatus === 'paid')
      .reduce((sum: number, tx: ITransaction & { id: string }) => sum + (tx.netPayout || 0), 0);

    const payouts = transactions.map((tx: ITransaction & { id: string }) => ({
      id: tx.id,
      _id: tx.id,
      date: tx.purchaseDate,
      amount: tx.netPayout,
      status: tx.payoutStatus,
      transactionId: tx.stripeChargeId,
    }));

    return NextResponse.json({
      payouts,
      stats: {
        totalEarnings,
        pendingPayouts,
        paidOut,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get payouts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

