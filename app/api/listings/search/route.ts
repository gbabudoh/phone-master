import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const condition = searchParams.get('condition') || 'all';
    const grade = searchParams.get('grade') || 'all';
    const networkStatus = searchParams.get('networkStatus') || 'all';
    const sellerType = searchParams.get('sellerType') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build filter query for Prisma
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'active',
      seller: {
        status: 'active', // Only show products from active/verified sellers
      },
    };

    // Filter by seller type (role)
    if (sellerType !== 'all') {
      where.seller = {
        ...where.seller,
        role: sellerType
      };
    }

    if (category !== 'all') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (where as any).category = category;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        {
          handsetDetails: {
            path: ['model'],
            string_contains: query,
          }
        },
        {
          handsetDetails: {
            path: ['brand'],
            string_contains: query,
          }
        },
      ];
    }

    // JSONB filtering for condition, grade, networkStatus
    if (category === 'handset') {
      if (condition !== 'all') {
        where.handsetDetails = {
          ...(where.handsetDetails || {}),
          path: ['condition'],
          equals: condition
        };
      }
      if (grade !== 'all') {
        where.handsetDetails = {
          ...(where.handsetDetails || {}),
          path: ['grade'],
          equals: grade
        };
      }
      if (networkStatus !== 'all') {
        where.handsetDetails = {
          ...(where.handsetDetails || {}),
          path: ['networkStatus'],
          equals: networkStatus
        };
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          seller: {
            select: {
              role: true,
              profile: true,
              sellerDetails: {
                select: {
                  companyName: true
                }
              }
            }
          }
        }
      }),
      prisma.product.count({ where }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productsWithId = (products as any[]).map((p) => ({
      ...p,
      _id: p.id,
      sellerType: p.seller?.role,
      sellerName: p.seller?.sellerDetails?.companyName || p.seller?.profile?.firstName || 'Seller'
    }));

    return NextResponse.json({
      products: productsWithId,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}

