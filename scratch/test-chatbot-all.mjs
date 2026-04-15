import { sendChatbotMessage } from '../lib/ai/gemini-api.js';
import { sendGroqMessage } from '../lib/ai/groq-api.js';

async function testAll() {
  const providers = ['gemini', 'groq'];
  
  for (const provider of providers) {
    console.log(`\n--- Testing Provider: ${provider} ---`);
    try {
      let result;
      if (provider === 'gemini') {
        result = await sendChatbotMessage('Why is my phone battery draining fast?');
      } else {
        result = await sendGroqMessage('Why is my phone battery draining fast?');
      }
      
      console.log('Response:', result.response);
      console.log('Topic:', result.topic);
    } catch (err) {
      console.error(`Error testing ${provider}:`, err.message);
    }
  }
}

// Set necessary environment variables for the test script
process.env.GEMINI_API_KEY = 'AIzaSyCPcO_io96FlujACU9CljH7RssZBlaiAuk';
process.env.GEMINI_MODEL = 'gemini-flash-latest';
process.env.GROQ_API_KEY = 'gsk_your_groq_key_here'; // Mock key

testAll();
