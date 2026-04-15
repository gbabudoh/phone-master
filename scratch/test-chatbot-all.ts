
async function testAll() {
  // Set necessary environment variables BEFORE importing/executing AI modules
  process.env.GEMINI_API_KEY = 'AIzaSyCPcO_io96FlujACU9CljH7RssZBlaiAuk';
  process.env.GEMINI_MODEL = 'gemini-flash-latest';
  process.env.GROQ_API_KEY = 'gsk_your_groq_key_here'; // Mock key

  // Dynamic imports to ensure env vars are picked up
  const { sendChatbotMessage } = await import('../lib/ai/gemini-api');
  const { sendGroqMessage } = await import('../lib/ai/groq-api');

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error testing ${provider}:`, errorMessage);
    }
  }
}

testAll();
