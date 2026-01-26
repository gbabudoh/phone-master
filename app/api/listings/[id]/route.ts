import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              }
            },
            sellerDetails: {
              select: {
                companyName: true,
              }
            },
            // Count seller's completed transactions for reviews
            soldTransactions: {
              where: {
                escrowStatus: 'released'
              },
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate seller stats
    const sellerData = {
      id: product.seller.id,
      email: product.seller.email,
      role: product.seller.role,
      createdAt: product.seller.createdAt,
      firstName: product.seller.profile?.firstName || null,
      lastName: product.seller.profile?.lastName || null,
      avatar: product.seller.profile?.avatar || null,
      businessName: product.seller.sellerDetails?.companyName || null,
      reviewCount: product.seller.soldTransactions.length,
      // Mock rating for now (in production, calculate from actual reviews)
      rating: product.seller.soldTransactions.length > 0 ? 4.5 + Math.random() * 0.5 : null,
    };

    return NextResponse.json({ 
      product: {
        ...product,
        _id: product.id,
        seller: sellerData,
      } 
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user owns the product or is admin
    if (product.sellerId !== session.userId && session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Prepare update data - only include valid Product fields
    const {
      title,
      description,
      price,
      stock,
      images,
      category,
      status,
      handsetDetails,
      accessoryDetails,
      serviceDetails,
      wholesaleDetails,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (images !== undefined) updateData.images = images;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;
    if (handsetDetails !== undefined) updateData.handsetDetails = handsetDetails;
    if (accessoryDetails !== undefined) updateData.accessoryDetails = accessoryDetails;
    if (serviceDetails !== undefined) updateData.serviceDetails = serviceDetails;
    if (wholesaleDetails !== undefined) updateData.wholesaleDetails = wholesaleDetails;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      product: {
        ...updatedProduct,
        _id: updatedProduct.id,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user owns the product or is admin
    if (product.sellerId !== session.userId && session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

