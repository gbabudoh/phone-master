import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { IBanner } from '@/types/banner';

// GET - Fetch all active banners
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('active') !== 'false';
    const admin = searchParams.get('admin') === 'true';

    let where: Record<string, unknown> = {};

    if (activeOnly && !admin) {
      // Only show active banners that are within their date range
      const now = new Date();
      where = {
        isActive: true,
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      };
    } else if (admin) {
      // Admin can see all banners
      where = {};
    } else {
      // Default: show active banners
      where = { isActive: true };
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const bannersWithId = banners.map((b: IBanner & { id: string }) => ({
      ...b,
      _id: b.id,
    }));

    console.log(`Found ${banners.length} banners with where:`, JSON.stringify(where));

    return NextResponse.json({ 
      banners: bannersWithId,
      count: banners.length 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch banners';
    console.error('Banner fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch banners',
        message: errorMessage,
        banners: [] 
      },
      { status: 500 }
    );
  }
}

// POST - Create a new banner
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin
    const body = await request.json();
    const bannerData = {
      ...body,
      order: body.order || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    };

    const banner = await prisma.banner.create({
      data: bannerData
    });

    return NextResponse.json({
      success: true,
      banner: {
        ...banner,
        _id: banner.id,
      },
    }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create banner';
    console.error('Banner creation error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

