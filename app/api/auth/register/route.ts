import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role = 'buyer', storeName } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    // All sellers need admin activation, only buyers are active immediately
    const status = role === 'buyer' ? 'active' : 'pending_verification';
    
    // Determine if we need seller details (for retail and wholesale sellers)
    const needsSellerDetails = role === 'retail_seller' || role === 'wholesale_seller';
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as UserRole,
        status: status as UserStatus,
        profile: {
          create: {
            firstName,
            lastName,
          }
        },
        ...(needsSellerDetails && {
          sellerDetails: {
            create: {
              companyName: storeName || null,
              plan: role === 'wholesale_seller' ? 'wholesale_sub' : 'retail_sub',
            }
          }
        })
      },
      include: {
        profile: true,
        sellerDetails: true,
      }
    });

    // Create session
    try {
      await createSession(user);
      console.log('Registration successful', { email: user.email, role: user.role, status: user.status });
    } catch (sessionError: unknown) {
      console.error('Session creation failed during registration:', sessionError);
      // Still return success, but log the error
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
        sellerDetails: user.sellerDetails,
      },
      message: user.status === 'pending_verification' 
        ? 'Your account is pending verification. You can log in, but some features may be limited.'
        : undefined,
    }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to register';
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

