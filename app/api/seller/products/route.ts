import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    
    const products = await prisma.product.findMany({
      where: { sellerId: session.userId as string },
      orderBy: { createdAt: 'desc' },
    });

    const productsWithId = products.map(p => ({
      ...p,
      _id: p.id,
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

