import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch single banner
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const banner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      banner: {
        ...banner,
        _id: banner.id,
      } 
    });
  } catch (error) {
    console.error('Banner fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

// PUT - Update banner
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Add authentication check for admin
    const { id } = await params;
    const body = await request.json();

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...body,
      },
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      banner: {
        ...banner,
        _id: banner.id,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update banner';
    console.error('Banner update error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Delete banner
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Add authentication check for admin
    const { id } = await params;

    await prisma.banner.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    console.error('Banner delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}

