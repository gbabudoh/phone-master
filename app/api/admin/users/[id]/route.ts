import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    if (session.role !== 'wholesale_seller') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    const { id } = await params;
    const body = await request.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...body,
      },
      include: {
        profile: true,
        sellerDetails: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        _id: user.id, // for backward compatibility
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

