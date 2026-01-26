import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET - Fetch all conversations for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.userId as string;

    const conversations = await prisma.conversation.findMany({
      where: {
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
        },
        messages: {
          where: { receiverId: userId, isRead: false },
          select: { id: true }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    // Format conversations with the other user's info
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
      return {
        id: conv.id,
        otherUser: {
          id: otherUser.id,
          name: otherUser.sellerDetails?.companyName || 
                (otherUser.profile?.firstName && otherUser.profile?.lastName 
                  ? `${otherUser.profile.firstName} ${otherUser.profile.lastName}`
                  : otherUser.profile?.firstName || otherUser.email.split('@')[0]),
          avatar: otherUser.profile?.avatar
        },
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: conv.messages.length,
        productId: conv.productId
      };
    });

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get conversations error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const senderId = session.userId as string;
    const { receiverId, content, productId } = await request.json();

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Receiver and content are required' }, { status: 400 });
    }

    if (receiverId === senderId) {
      return NextResponse.json({ error: 'Cannot send message to yourself' }, { status: 400 });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    // Find or create conversation (ensure consistent ordering of user IDs)
    const [minId, maxId] = [senderId, receiverId].sort();
    
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId }
        ]
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: minId,
          user2Id: maxId,
          productId: productId || null,
          lastMessage: content.trim().substring(0, 100),
          lastMessageAt: new Date()
        }
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        receiverId,
        content: content.trim()
      }
    });

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: content.trim().substring(0, 100),
        lastMessageAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt
      },
      conversationId: conversation.id
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
