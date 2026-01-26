import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    // TODO: Add admin role check

    const products = await prisma.product.findMany({
      include: {
        seller: {
          select: {
            email: true,
            profile: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const productsWithId = products.map(p => ({
      ...p,
      _id: p.id,
      sellerId: p.seller ? { ...p.seller, _id: p.sellerId } : p.sellerId
    }));

    return NextResponse.json({ products: productsWithId });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

