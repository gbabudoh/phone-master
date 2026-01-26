import { NextRequest, NextResponse } from 'next/server';
import { sendChatbotMessage } from '@/lib/ai/gemini-api';
import { IChatMessage } from '@/types/chatbot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Chatbot request received:', {
      messageLength: message.length,
      historyLength: conversationHistory.length,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    });

    const history: IChatMessage[] = conversationHistory.map((msg: IChatMessage) => ({
      sender: msg.sender,
      content: msg.content,
      timestamp: new Date(msg.timestamp || Date.now()),
    }));

    const result = await sendChatbotMessage(message, history);

    console.log('Chatbot response generated:', {
      responseLength: result.response.length,
      topic: result.topic,
    });

    return NextResponse.json({
      response: result.response,
      topic: result.topic,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chatbot API error:', {
      message,
      error,
    });
    return NextResponse.json(
      { 
        error: 'Failed to process chatbot request',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
      },
      { status: 500 }
    );
  }
}

