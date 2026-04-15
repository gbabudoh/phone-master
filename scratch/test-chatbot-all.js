
async function testAll() {
  const providers = ['gemini', 'groq'];
  
  for (const provider of providers) {
    console.log(`\n--- Testing Provider: ${provider} ---`);
    try {
      // We simulate the env var by passing it in the request or just testing the underlying functions
      // But testing the API route is better if we can control env
      // For now, let's test the functions directly with the env vars they use
      
      // Dynamic imports to handle ESM/TS modules
      const { sendChatbotMessage } = await import('../lib/ai/gemini-api.js');
      const { sendGroqMessage } = await import('../lib/ai/groq-api.js');
      
      let result;
      if (provider === 'gemini') {
        result = await sendChatbotMessage('Why is my phone battery draining fast?');
      } else {
        result = await sendGroqMessage('Why is my phone battery draining fast?');
      }
      
      console.log('Response:', result.response);
      console.log('Topic:', result.topic);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Error testing ${provider}:`, msg);
    }
  }
}

// Set necessary environment variables for the test script
process.env.GEMINI_API_KEY = 'AIzaSyCPcO_io96FlujACU9CljH7RssZBlaiAuk';
process.env.GEMINI_MODEL = 'gemini-flash-latest';
process.env.GROQ_API_KEY = 'gsk_your_groq_key_here'; // Mock key

testAll();
