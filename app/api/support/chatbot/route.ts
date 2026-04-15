import { NextRequest, NextResponse } from 'next/server';
import { sendChatbotMessage as sendGeminiMessage } from '@/lib/ai/gemini-api';
import { sendGroqMessage } from '@/lib/ai/groq-api';
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

    const preferredProvider = process.env.PREFERRED_AI_PROVIDER || 'gemini';
    
    console.log('Chatbot request received:', {
      provider: preferredProvider,
      messageLength: message.length,
      historyLength: conversationHistory.length,
    });

    const history: IChatMessage[] = conversationHistory.map((msg: IChatMessage) => ({
      sender: msg.sender,
      content: msg.content,
      timestamp: new Date(msg.timestamp || Date.now()),
    }));

    let result;
    if (preferredProvider === 'groq') {
      console.log('[Chatbot] Using Groq provider');
      result = await sendGroqMessage(message, history);
    } else {
      console.log('[Chatbot] Using Gemini provider');
      result = await sendGeminiMessage(message, history);
    }

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

