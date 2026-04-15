import { ChatTopic } from '@/types/chatbot';

/**
 * Detect the topic of the conversation based on user message and AI response
 */
export function detectTopic(userMessage: string, aiResponse: string): ChatTopic {
  const message = (userMessage + ' ' + aiResponse).toLowerCase();

  if (message.match(/(troubleshoot|fix|problem|issue|error|not working|broken)/)) {
    return 'troubleshooting';
  }
  if (message.match(/(compatible|fit|works with|compatibility)/)) {
    return 'compatibility';
  }
  if (message.match(/(value|worth|price|cost|estimate)/)) {
    return 'value_estimate';
  }
  if (message.match(/(repair|fix|broken|damaged|screen|battery)/)) {
    return 'repair';
  }
  return 'general';
}
