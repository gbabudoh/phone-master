import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { stripe, calculateCommission } from '@/lib/payment';
import { UserRole } from '@/types/user';

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // 1. Fetch product and seller info
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: { include: { sellerDetails: true } } }
    });

    if (!product || product.status !== 'active') {
      return NextResponse.json({ error: 'Product not available' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // 2. Calculate financial split
    const unitPriceInPence = Math.round(product.price * 100);
    const totalAmountInPence = unitPriceInPence * quantity;
    const commissionFeeInPence = calculateCommission(product.seller.role as UserRole, totalAmountInPence);

    // 3. Create Stripe Checkout Session with Escrow (Manual Capture)
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: product.title,
              description: product.description,
              images: product.images.slice(0, 1),
            },
            unit_amount: unitPriceInPence,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/listing/${product.id}`,
      payment_intent_data: {
        capture_method: 'manual', // This is the Escrow hold
        metadata: {
          productId,
          buyerId: session.userId,
          sellerId: product.sellerId,
          commissionFee: commissionFeeInPence.toString(),
          type: 'product_purchase'
        },
      },
      customer_email: session.email,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
