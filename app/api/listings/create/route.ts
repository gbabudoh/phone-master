import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkIMEI } from '@/lib/ai/gemini-api';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const productData = body;
    const sellerId = session.userId as string;

    // Verify seller exists and has permission
    const seller = await prisma.user.findUnique({
      where: { id: sellerId }
    });

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      );
    }

    // Check if user is a seller (not a buyer)
    if (seller.role === 'buyer') {
      return NextResponse.json(
        { error: 'Buyers cannot create listings. Please upgrade to a seller account.' },
        { status: 403 }
      );
    }

    // Check listing limits for personal sellers
    if (seller.role === 'personal_seller') {
      const activeListings = await prisma.product.count({
        where: {
          sellerId,
          status: 'active',
        },
      });

      if (activeListings >= 5) {
        return NextResponse.json(
          { error: 'Maximum 5 active listings allowed for personal sellers' },
          { status: 400 }
        );
      }
    }

    // Validate IMEI for handsets
    if (productData.category === 'handset' && productData.handsetDetails?.IMEI) {
      const imeiCheck = await checkIMEI(productData.handsetDetails.IMEI);
      
      if (!imeiCheck.isValid) {
        return NextResponse.json(
          { error: 'Invalid IMEI number' },
          { status: 400 }
        );
      }

      if (imeiCheck.isBlacklisted) {
        productData.status = 'under_review';
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        sellerId,
        category: productData.category,
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock || 1),
        images: productData.images || [],
        status: (productData.status || 'active'),
        handsetDetails: productData.handsetDetails || null,
        accessoryDetails: productData.accessoryDetails || null,
        serviceDetails: productData.serviceDetails || null,
      }
    });

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        _id: product.id, // for backward compatibility
      }
    }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create listing';
    console.error('Create listing error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

