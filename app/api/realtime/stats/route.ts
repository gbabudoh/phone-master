import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendData = async () => {
        try {
          const [
            totalUsers,
            totalProducts,
            totalTransactions,
            activeSellers,
            transactions,
          ] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.transaction.count(),
            prisma.user.count({
              where: {
                role: { in: ['wholesale_seller', 'retail_seller', 'personal_seller'] },
                status: 'active',
              },
            }),
            prisma.transaction.findMany({ select: { commissionFee: true } }),
          ]);

          const totalRevenue = transactions.reduce((sum: number, tx: any) => sum + tx.commissionFee, 0);

          const data = JSON.stringify({
            totalUsers,
            totalProducts,
            totalRevenue,
            totalTransactions,
            activeSellers,
            timestamp: new Date().toISOString(),
          });

          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (error) {
          console.error('SSE error:', error);
          controller.error(error);
        }
      };

      // Send initial data
      await sendData();

      // Send updates every 5 seconds
      const interval = setInterval(async () => {
        try {
          await sendData();
        } catch (error) {
          clearInterval(interval);
          controller.close();
        }
      }, 5000);

      // Cleanup on close
      if (request.signal) {
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

