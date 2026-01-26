import { IChatMessage, ChatTopic } from '@/types/chatbot';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Using Gemini 2.5 Flash (faster and free tier) - can be changed to gemini-2.5-pro or gemini-pro-latest
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Send a message to the Phone Genius chatbot
 */
export async function sendChatbotMessage(
  message: string,
  conversationHistory: IChatMessage[] = []
): Promise<{ response: string; topic?: ChatTopic }> {
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('GEMINI_API_KEY is not configured');
    // Fallback response if API key is not configured
    return {
      response: "I'm Phone Genius, your mobile device assistant! I can help with troubleshooting, compatibility checks, and device information. Please configure the GEMINI_API_KEY environment variable to enable full AI capabilities.",
      topic: 'general',
    };
  }

  try {
    // Build context from conversation history
    const context = conversationHistory
      .slice(-10) // Last 10 messages for context
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are Phone Genius, a helpful AI assistant for Phone Master, a mobile phone marketplace and support platform. 
    
Your role is to help users with:
- Troubleshooting mobile device issues
- Checking compatibility between devices and accessories
- Providing information about mobile phones
- Estimating device values
- Directing users to appropriate support resources

${context ? `Previous conversation:\n${context}\n\n` : ''}
User: ${message}
Assistant:`;

    console.log('Calling Gemini API:', {
      url: GEMINI_API_URL,
      model: GEMINI_MODEL,
      hasKey: !!GEMINI_API_KEY,
      keyLength: GEMINI_API_KEY?.length || 0,
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { raw: errorText };
      }
      
      console.error('Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: GEMINI_API_URL,
      });
      
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    let aiResponse = '';
    if (data.candidates && data.candidates.length > 0) {
      aiResponse = data.candidates[0]?.content?.parts?.[0]?.text || '';
    } else if (data.text) {
      aiResponse = data.text;
    }
    
    if (!aiResponse) {
      console.error('Unexpected Gemini API response format:', data);
      aiResponse = "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }

    // Simple topic detection (can be enhanced)
    const topic = detectTopic(message, aiResponse);

    return {
      response: aiResponse,
      topic,
    };
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    
    // Provide more specific error messages
    let errorMessage = "I'm experiencing technical difficulties. Please try again in a moment, or contact our support team for immediate assistance.";
    
    if (error.message?.includes('API key')) {
      errorMessage = "The AI service is not properly configured. Please contact support.";
    } else if (error.message?.includes('429')) {
      errorMessage = "The AI service is currently busy. Please try again in a moment.";
    } else if (error.message?.includes('403')) {
      errorMessage = "Access denied. Please check the API configuration.";
    }
    
    return {
      response: errorMessage,
      topic: 'general',
    };
  }
}

/**
 * Detect the topic of the conversation
 */
function detectTopic(userMessage: string, aiResponse: string): ChatTopic {
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

/**
 * Check IMEI against blacklist and validate authenticity
 */
export async function checkIMEI(imei: string): Promise<{
  isValid: boolean;
  isBlacklisted: boolean;
  status: string;
  details?: any;
}> {
  // Basic IMEI validation (15 digits)
  const isValid = /^\d{15}$/.test(imei);
  
  if (!isValid) {
    return {
      isValid: false,
      isBlacklisted: false,
      status: 'invalid - IMEI must be 15 digits',
    };
  }

  // Validate IMEI using Luhn algorithm (checksum validation)
  const isValidChecksum = validateIMEIChecksum(imei);
  
  if (!isValidChecksum) {
    return {
      isValid: false,
      isBlacklisted: false,
      status: 'invalid - Failed checksum validation (likely fake)',
    };
  }

  // Extract TAC (Type Allocation Code) - first 8 digits
  const tac = imei.substring(0, 8);
  
  // Check against known fake/invalid TAC ranges
  const isFakeTAC = checkFakeTAC(tac);
  
  if (isFakeTAC) {
    return {
      isValid: false,
      isBlacklisted: false,
      status: 'fake - Invalid manufacturer code detected',
    };
  }

  // Simulate blacklist check (in production, integrate with real API)
  // Example APIs: CheckMEND, GSMA IMEI Database, or carrier APIs
  const isBlacklisted = await checkBlacklist(imei);
  
  if (isBlacklisted) {
    return {
      isValid: true,
      isBlacklisted: true,
      status: 'blacklisted - Device reported as lost or stolen',
      details: {
        warning: 'This device has been reported to authorities',
        recommendation: 'Do not purchase this device',
      },
    };
  }

  // Device is valid and clean
  return {
    isValid: true,
    isBlacklisted: false,
    status: 'clean - Device is valid and not blacklisted',
    details: {
      tac,
      manufacturer: getManufacturerFromTAC(tac),
      recommendation: 'Device appears to be genuine',
    },
  };
}

/**
 * Validate IMEI using Luhn algorithm (checksum)
 */
function validateIMEIChecksum(imei: string): boolean {
  let sum = 0;

  // Process all 15 digits from right to left
  // Double every second digit (from the right, starting at position 2)
  for (let i = 0; i < imei.length; i++) {
    let digit = parseInt(imei[i]);
    
    // Double digits at odd positions (0-indexed: 1, 3, 5, 7, 9, 11, 13)
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  // Valid if sum is divisible by 10
  return sum % 10 === 0;
}

/**
 * Check if TAC is in known fake/invalid range
 */
function checkFakeTAC(tac: string): boolean {
  // Known fake TAC ranges (common in counterfeit devices)
  const fakeTACRanges = [
    '00000000', '11111111', '22222222', '33333333',
    '44444444', '55555555', '66666666', '77777777',
    '88888888', '99999999', '12345678', '00000001',
  ];

  return fakeTACRanges.includes(tac);
}

/**
 * Check IMEI against blacklist database
 * In production, integrate with real API like CheckMEND or GSMA
 */
async function checkBlacklist(imei: string): Promise<boolean> {
  // Simulate blacklist check
  // In production, call actual blacklist API:
  // - CheckMEND API
  // - GSMA IMEI Database
  // - Carrier blacklist APIs
  
  // For demo purposes, mark specific IMEIs as blacklisted
  const blacklistedIMEIs = [
    '123456789012345', // Example blacklisted IMEI
    '111111111111111',
  ];

  return blacklistedIMEIs.includes(imei);
}

/**
 * Get manufacturer from TAC code
 */
function getManufacturerFromTAC(tac: string): string {
  // Common TAC prefixes (first 2 digits indicate manufacturer)
  const manufacturers: { [key: string]: string } = {
    '01': 'Apple',
    '35': 'Apple',
    '86': 'Apple',
    '99': 'Apple',
    '35': 'Samsung',
    '35': 'Nokia',
    '35': 'Huawei',
    '35': 'Xiaomi',
    '35': 'OnePlus',
    '35': 'Google',
    '35': 'Sony',
    '35': 'LG',
    '35': 'Motorola',
    '35': 'HTC',
  };

  const prefix = tac.substring(0, 2);
  return manufacturers[prefix] || 'Unknown Manufacturer';
}

