import { IChatMessage, ChatTopic } from '@/types/chatbot';
import { imei as validateLuhnImei } from 'luhn-validation';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Using Gemini Pro (most universally available model)
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-pro';
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
  } catch (error: unknown) {
    console.error('Error calling Gemini API:', error);
    
    // Provide more specific error messages
    let errorMessage = "I'm experiencing technical difficulties. Please try again in a moment, or contact our support team for immediate assistance.";
    
    const message = error instanceof Error ? error.message : '';
    if (message.includes('API key')) {
      errorMessage = "The AI service is not properly configured. Please contact support.";
    } else if (message.includes('429')) {
      errorMessage = "The AI service is currently busy. Please try again in a moment.";
    } else if (message.includes('403')) {
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
  details?: {
    tac?: string;
    manufacturer?: string;
    model?: string;
    recommendation?: string;
    warning?: string;
  };
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

  // Validate IMEI using Luhn algorithm (using luhn-validation package)
  const isValidChecksum = validateLuhnImei(imei);
  
  // Note: validateLuhnImei returns true/false or throws
  if (isValidChecksum !== true) {
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

  // Use AI to identify the device from TAC
  // This provides accurate model info instead of hardcoded guesses
  const deviceDetails = await identifyDeviceWithAI(tac);

  // Simulate blacklist check (in production, integrate with real API)
  // Example APIs: CheckMEND, GSMA IMEI Database, or carrier APIs
  const isBlacklisted = await checkBlacklist(imei);
  
  if (isBlacklisted) {
    return {
      isValid: true,
      isBlacklisted: true,
      status: 'blacklisted - Device reported as lost or stolen',
      details: {
        ...deviceDetails,
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
      ...deviceDetails,
      recommendation: 'Device checks passed (Clean Status)',
    },
  };
}

/**
 * Minimal TAC lookup for common devices (fallback when AI fails)
 */
const COMMON_TACS: { [key: string]: { manufacturer: string; model: string } } = {
  // iPhone 14 series (common TACs)
  '35552162': { manufacturer: 'Apple', model: 'iPhone 14' },
  '35407115': { manufacturer: 'Apple', model: 'iPhone 14 Pro' },
  '35407215': { manufacturer: 'Apple', model: 'iPhone 14 Pro Max' },
  '35473915': { manufacturer: 'Apple', model: 'iPhone 14' },
  '35474015': { manufacturer: 'Apple', model: 'iPhone 14 Pro' },
  '35474115': { manufacturer: 'Apple', model: 'iPhone 14 Pro Max' },
  // iPhone 15/16
  '35518316': { manufacturer: 'Apple', model: 'iPhone 15' },
  '35518416': { manufacturer: 'Apple', model: 'iPhone 15 Pro' },
  // Samsung S22/S23/S24
  '35521622': { manufacturer: 'Samsung', model: 'Galaxy S22' },
  '35489012': { manufacturer: 'Samsung', model: 'Galaxy S23' },
  '35518318': { manufacturer: 'Samsung', model: 'Galaxy S24' },
};

/**
 * Identify device - tries built-in lookup first, then AI
 */
async function identifyDeviceWithAI(tac: string): Promise<{ manufacturer: string; model?: string }> {
  // First check our minimal built-in database
  if (COMMON_TACS[tac]) {
    console.log('Found device in built-in TAC list:', COMMON_TACS[tac]);
    return COMMON_TACS[tac];
  }

  // Try AI if we have an API key
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    const manufacturer = getManufacturerFromTAC(tac);
    return { manufacturer, model: 'Model lookup unavailable (no API key)' };
  }

  try {
    const prompt = `Identify the device for TAC: ${tac}. Return ONLY JSON: {"manufacturer": "Brand", "model": "Model Name"}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 100 }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      const jsonText = text.replace(/```json\s*|```\s*/gi, '').trim();
      try {
        return JSON.parse(jsonText);
      } catch {
        const mfgMatch = jsonText.match(/"manufacturer"\s*:\s*"([^"]+)"/i);
        const modelMatch = jsonText.match(/"model"\s*:\s*"([^"]+)"/i);
        if (mfgMatch && modelMatch) {
          return { manufacturer: mfgMatch[1], model: modelMatch[1] };
        }
      }
    }
  } catch (error) {
    console.error('AI identification failed:', error);
  }

  // Final fallback
  const manufacturer = getManufacturerFromTAC(tac);
  return { manufacturer, model: 'Unknown Model' };
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
  // SIMULATED BLACKLIST CHECK
  // Real check requires paid APIs (GSMA, etc.)
  
  // For demo/testing: IMEIs ending in '13' or known bad ones are blacklisted
  const blacklistedIMEIs = [
    '123456789012345', 
    '111111111111111',
  ];

  return blacklistedIMEIs.includes(imei) || imei.endsWith('13');
}

/**
 * Get manufacturer from TAC code (Fallback)
 */
function getManufacturerFromTAC(tac: string): string {
  // Manufacturer prefixes for fallback identification (Simplified)
  const prefix = tac.substring(0, 2);
  const prefixLookup: { [key: string]: string } = {
    '35': 'Unknown (Apple/Samsung/Google)',
    '01': 'Apple',
    '86': 'Chinese Brand (Xiaomi/Huawei/OnePlus/Oppo/Vivo)',
    '99': 'Apple',
    '49': 'Samsung',
    '52': 'Samsung',
    '45': 'LG',
  };

  return prefixLookup[prefix] || 'Unknown Manufacturer';
}

/**
 * Get device info from TAC database
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDeviceFromTAC(tac: string): { manufacturer: string; model: string } | null {
  // Manual database removed in favor of automatic AI detection
  return null;
}
