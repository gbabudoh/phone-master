import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      }
    });

    if (!user) {
      console.error('Login failed: User not found', { email });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.error('Login failed: Invalid password', { email, userId: user.id });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is suspended
    if (user.status === 'suspended') {
      return NextResponse.json(
        { error: 'Account is suspended. Please contact support.' },
        { status: 403 }
      );
    }

    // Create session
    try {
      await createSession(user);
      console.log('Login successful', { email: user.email, role: user.role, status: user.status });
    } catch (sessionError: any) {
      console.error('Session creation failed:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        _id: user.id, // for backward compatibility
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
      },
      message: user.status === 'pending_verification' 
        ? 'Your account is pending verification. Some features may be limited.'
        : undefined,
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to login';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
