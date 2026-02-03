import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Fetch system settings
export async function GET() {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: 'global' }
    });

    if (!settings) {
      // Create default settings if not exists
      settings = await prisma.systemSettings.create({
        data: {
          id: 'global',
          platformName: 'Phone Master',
          supportEmail: 'support@phonemaster.com',
          commissionRate: 10.0,
          minWithdrawal: 1000,
          maxWithdrawal: 100000,
        }
      });
    }

    return NextResponse.json({ settings });
  } catch (error: unknown) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update system settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate numbers
    if (body.commissionRate !== undefined) body.commissionRate = parseFloat(body.commissionRate);
    if (body.minWithdrawal !== undefined) body.minWithdrawal = parseInt(body.minWithdrawal);
    if (body.maxWithdrawal !== undefined) body.maxWithdrawal = parseInt(body.maxWithdrawal);

    const settings = await prisma.systemSettings.upsert({
      where: { id: 'global' },
      update: body,
      create: {
        id: 'global',
        ...body
      }
    });

    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error: unknown) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
