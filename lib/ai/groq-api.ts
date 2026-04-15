import { IChatMessage, ChatTopic } from '@/types/chatbot';
import { detectTopic } from './ai-utils';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Send a message to the Phone Genius chatbot using Groq
 */
export async function sendGroqMessage(
  message: string,
  conversationHistory: IChatMessage[] = []
): Promise<{ response: string; topic?: ChatTopic }> {
  // Check if API key is configured
  if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_your_groq_key_here') {
    console.warn('GROQ_API_KEY is not configured');
    return {
      response: "Groq AI is not configured. Please provide a valid GROQ_API_KEY in the environment variables.",
      topic: 'general',
    };
  }

  try {
    // Format history for Groq (OpenAI format)
    const messages = [
      {
        role: 'system',
        content: 'You are Phone Genius, a helpful AI assistant for Phone Master. Help users with troubleshooting, compatibility, and device info. Be concise and professional.',
      },
      ...conversationHistory.slice(-6).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const statusCode = response.status;
      
      console.error('Groq API error:', {
        status: statusCode,
        error: errorData,
      });
      
      throw new Error(`Groq API Error ${statusCode}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content || '';
    
    if (!aiResponse) {
      console.error('Unexpected Groq API response format:', data);
      aiResponse = "I apologize, but I'm having trouble processing your request with Groq right now.";
    }

    const topic = detectTopic(message, aiResponse);

    return {
      response: aiResponse,
      topic,
    };
  } catch (error: unknown) {
    console.error('Error calling Groq API:', error);
    
    let errorMessage = "I'm experiencing technical difficulties (Groq). Please try again in a moment.";
    const errMessage = error instanceof Error ? error.message : '';

    console.error('[Groq] Error details:', errMessage);

    if (errMessage.includes('401')) {
      errorMessage = "Invalid Groq API key. Please check your GROQ_API_KEY.";
    } else if (errMessage.includes('429')) {
      errorMessage = "Groq rate limit exceeded. Please try again later.";
    } else if (errMessage.includes('404')) {
      errorMessage = "Groq model not found. Please check your GROQ_MODEL setting.";
    }
    
    return {
      response: errorMessage,
      topic: 'general',
    };
  }
}
