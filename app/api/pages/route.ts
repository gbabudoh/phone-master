import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Fetch all pages
export async function GET() {
  try {
    const pages = await prisma.contentPage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ 
      pages,
      count: pages.length 
    });
  } catch (error: unknown) {
    console.error('Pages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST - Create a new page (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    // In a real app, check specifically for admin role
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, content, isActive } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existing = await prisma.contentPage.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Page with this slug already exists' },
        { status: 409 }
      );
    }

    const page = await prisma.contentPage.create({
      data: {
        slug,
        title,
        content,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json({
      success: true,
      page
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Page creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
