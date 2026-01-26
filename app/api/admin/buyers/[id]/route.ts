import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const buyer = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { buyerId: buyer.id },
    });

    return NextResponse.json({
      buyer: {
        ...buyer,
        _id: buyer.id,
        stats: {
          totalOrders: transactions.length,
          totalSpent: transactions.reduce((sum, tx) => sum + (tx.totalAmount || 0), 0),
        },
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get buyer error:', error);
    return NextResponse.json({ error: 'Failed to fetch buyer' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const buyer = await prisma.user.update({
      where: { id },
      data: { status: body.status },
      include: { profile: true },
    });

    return NextResponse.json({
      success: true,
      buyer: { ...buyer, _id: buyer.id },
    });
  } catch (error: unknown) {
    console.error('Update buyer error:', error);
    return NextResponse.json({ error: 'Failed to update buyer' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Buyer deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Delete buyer error:', error);
    return NextResponse.json({ error: 'Failed to delete buyer' }, { status: 500 });
  }
}
