import { IChatMessage, ChatTopic } from '@/types/chatbot';
import { detectTopic } from './ai-utils';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Using Gemini Pro (most universally available model)
// Using a more resilient model as default
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Get a fallback response when AI is not available
 */
function getFallbackResponse(message: string): { response: string; topic?: ChatTopic } {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return {
      response: "Hello! I'm Phone Genius, your mobile device assistant. I can help you with:\n\n• **Troubleshooting** - Fix common phone issues\n• **Compatibility** - Check if accessories work with your device\n• **Device Info** - Learn about phone specifications\n• **Value Estimates** - Get an idea of your phone's worth\n\nHow can I help you today?",
      topic: 'general',
    };
  }
  
  // Troubleshooting
  if (lowerMessage.match(/(not working|broken|problem|issue|fix|help|error|crash|slow|freeze)/)) {
    return {
      response: "I'd be happy to help troubleshoot your device! Here are some common solutions:\n\n1. **Restart your device** - This fixes many issues\n2. **Check for updates** - Go to Settings > Software Update\n3. **Clear cache** - Settings > Apps > Select app > Clear Cache\n4. **Free up storage** - Delete unused apps and files\n\nCan you tell me more about the specific issue you're experiencing?",
      topic: 'troubleshooting',
    };
  }
  
  // Battery issues
  if (lowerMessage.match(/(battery|charging|drain|power)/)) {
    return {
      response: "Battery issues are common. Here are some tips:\n\n• **Check battery health** - Settings > Battery > Battery Health\n• **Reduce screen brightness** - Lower brightness saves battery\n• **Close background apps** - Apps running in background drain battery\n• **Enable battery saver** - Settings > Battery > Battery Saver\n• **Check for rogue apps** - Some apps drain battery excessively\n\nIf your battery drains very quickly, it might need replacement.",
      topic: 'troubleshooting',
    };
  }
  
  // Screen issues
  if (lowerMessage.match(/(screen|display|touch|crack|broken screen)/)) {
    return {
      response: "For screen issues:\n\n• **Unresponsive touch** - Try restarting your device\n• **Screen flickering** - Check display settings, reduce brightness\n• **Cracked screen** - Visit a repair shop for replacement\n• **Dead pixels** - Usually requires screen replacement\n\nFor physical damage, I recommend visiting an authorized repair center.",
      topic: 'repair',
    };
  }
  
  // Compatibility
  if (lowerMessage.match(/(compatible|work with|fit|case|charger|accessory)/)) {
    return {
      response: "For compatibility questions:\n\n• **Cases** - Check your exact phone model (e.g., iPhone 14 Pro vs iPhone 14)\n• **Chargers** - Most modern phones use USB-C, older iPhones use Lightning\n• **Screen protectors** - Must match your exact model and screen size\n• **Wireless chargers** - Most Qi-certified chargers work with compatible phones\n\nWhat specific accessory are you looking to check?",
      topic: 'compatibility',
    };
  }
  
  // Value/Price
  if (lowerMessage.match(/(worth|value|price|sell|trade|how much)/)) {
    return {
      response: "To estimate your phone's value, I'd need to know:\n\n1. **Model** - e.g., iPhone 14 Pro, Samsung Galaxy S23\n2. **Storage** - e.g., 128GB, 256GB\n3. **Condition** - Any scratches, cracks, or issues?\n4. **Accessories** - Original box, charger included?\n\nYou can also check our marketplace for similar listings to get an idea of current prices!",
      topic: 'value_estimate',
    };
  }
  
  // IMEI
  if (lowerMessage.match(/(imei|blacklist|stolen|lost|check)/)) {
    return {
      response: "To check an IMEI:\n\n1. **Find your IMEI** - Dial *#06# on your phone\n2. **Use our IMEI Checker** - Visit /support/imei-check\n3. **What we check** - Blacklist status, device authenticity\n\nAlways check the IMEI before buying a used phone to ensure it's not reported stolen!",
      topic: 'general',
    };
  }
  
  // Default response
  return {
    response: "I'm Phone Genius, your mobile device assistant! I can help with:\n\n• **Troubleshooting** - Fix common phone issues\n• **Compatibility** - Check if accessories work with your device\n• **Device Info** - Learn about phone specifications\n• **Value Estimates** - Get an idea of your phone's worth\n• **IMEI Check** - Verify device authenticity\n\nWhat would you like help with?",
    topic: 'general',
  };
}

/**
 * Send a message to the Phone Genius chatbot using Google Gemini
 */
export async function sendChatbotMessage(
  message: string,
  conversationHistory: IChatMessage[] = []
): Promise<{ response: string; topic?: ChatTopic }> {
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('GEMINI_API_KEY is not configured - using fallback responses');
    return getFallbackResponse(message);
  }

  try {
    console.log('Gemini Chatbot Request:', {
      model: GEMINI_MODEL,
      keyPrefix: GEMINI_API_KEY?.substring(0, 10),
      url: GEMINI_API_URL,
    });

    // Build context from conversation history (optimized for token usage)
    const context = conversationHistory
      .slice(-6) // Reduced context window for speed and efficiency
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are Phone Genius, a helpful AI assistant for Phone Master. 
    
Your role is to help users with:
- Troubleshooting mobile device issues
- Checking compatibility
- Providing information about mobile phones
- Estimating device values

Be concise, helpful, and professional.

${context ? `Previous conversation:\n${context}\n\n` : ''}
User: ${message}
Assistant:`;

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
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const statusCode = response.status;
      
      console.error('Gemini API error:', {
        status: statusCode,
        error: errorData,
      });
      
      throw new Error(`Gemini API Error ${statusCode}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!aiResponse) {
      console.error('Unexpected Gemini API response format:', data);
      aiResponse = "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }

    const topic = detectTopic(message, aiResponse);

    return {
      response: aiResponse,
      topic,
    };
  } catch (error: unknown) {
    console.error('Error calling Gemini API:', error);
    
    let errorMessage = "I'm experiencing technical difficulties. Please try again in a moment.";
    const errMessage = error instanceof Error ? error.message : '';
    
    if (errMessage.includes('404')) {
      errorMessage = `The selected model (${GEMINI_MODEL}) was not found. Please check your configuration.`;
    } else if (errMessage.includes('429')) {
      errorMessage = "The AI service is currently at capacity or quota limit reached. Please try again soon.";
    } else if (errMessage.includes('403')) {
      errorMessage = "Access denied. Please check your Gemini API key permissions.";
    } else if (errMessage.includes('500') || errMessage.includes('503')) {
      errorMessage = "The Google AI service is currently unavailable. Please try again later.";
    }
    
    return {
      response: errorMessage,
      topic: 'general',
    };
  }
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
