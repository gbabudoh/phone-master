import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { jwtVerify } from 'jose';
import { UserRole, SellerPlan } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { role, storeName } = await request.json();

    // Validate inputs
    const validRoles = ['personal_seller', 'retail_seller', 'wholesale_seller'];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role selected' }, { status: 400 });
    }

    // Get user from token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const userId = payload.userId as string;

    // Determine plan based on role
    let sellerPlan: SellerPlan = SellerPlan.free;
    if (role === 'wholesale_seller') {
      sellerPlan = SellerPlan.wholesale_sub;
    } else if (role === 'retail_seller') {
      sellerPlan = SellerPlan.retail_sub;
    }

    // Update user and upsert seller details
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role as UserRole,
        sellerDetails: {
          upsert: {
            create: {
              plan: sellerPlan,
              companyName: storeName || undefined,
              activeListings: 0,
            },
            update: {
              plan: sellerPlan,
              companyName: storeName || undefined,
            },
          },
        },
      },
      include: {
        sellerDetails: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user,
      message: 'Account upgraded successfully' 
    });

  } catch (error: unknown) {
    console.error('Upgrade error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
