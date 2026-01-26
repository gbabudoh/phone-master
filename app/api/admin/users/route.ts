import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();
    if (session.role !== 'wholesale_seller') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
        sellerDetails: true,
      }
    });

    // Prepare users for client (exclude passwords and add _id compatibility)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usersData = users.map((user: any) => {
      const { password: _password, ...userData } = user;
      void _password;
      return {
        ...userData,
        _id: user.id
      };
    });

    return NextResponse.json({ users: usersData });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

