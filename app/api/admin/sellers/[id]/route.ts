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
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const seller = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      );
    }

    // Fetch seller stats
    const transactions = await prisma.transaction.findMany({
      where: { sellerId: seller.id },
    });

    const listings = await prisma.product.findMany({
      where: { sellerId: seller.id },
    });

    return NextResponse.json({
      seller: {
        ...seller,
        _id: seller.id,
        stats: {
          totalSales: transactions.length,
          totalEarnings: transactions.reduce((sum, tx) => sum + (tx.netPayout || 0), 0),
          activeListings: listings.filter((p) => p.status === 'active').length,
          rating: 4.5,
        },
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get seller error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seller' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const seller = await prisma.user.update({
      where: { id },
      data: {
        status: body.status,
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json({
      success: true,
      seller: {
        ...seller,
        _id: seller.id,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update seller';
    console.error('Update seller error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Delete user and all related data (cascade delete handled by Prisma)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Seller deleted successfully',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete seller';
    console.error('Delete seller error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
