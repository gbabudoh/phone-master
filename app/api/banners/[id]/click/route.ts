import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Track banner click
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.banner.update({
      where: { id },
      data: {
        clicks: {
          increment: 1,
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Banner click tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}

