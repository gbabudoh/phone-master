import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ conversationId: string }>;
}

// GET - Fetch messages for a conversation
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const userId = session.userId as string;
    const { conversationId } = await params;

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true, avatar: true } },
            sellerDetails: { select: { companyName: true } }
          }
        },
        user2: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true, avatar: true } },
            sellerDetails: { select: { companyName: true } }
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        senderId: true,
        receiverId: true,
        isRead: true,
        createdAt: true
      }
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false
      },
      data: { isRead: true }
    });

    const otherUser = conversation.user1Id === userId ? conversation.user2 : conversation.user1;

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        otherUser: {
          id: otherUser.id,
          name: otherUser.sellerDetails?.companyName || 
                (otherUser.profile?.firstName && otherUser.profile?.lastName 
                  ? `${otherUser.profile.firstName} ${otherUser.profile.lastName}`
                  : otherUser.profile?.firstName || otherUser.email.split('@')[0]),
          avatar: otherUser.profile?.avatar
        }
      },
      messages
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
