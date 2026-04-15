
async function testGemini() {
  const GEMINI_API_KEY = 'AIzaSyCPcO_io96FlujACU9CljH7RssZBlaiAuk';
  const GEMINI_MODEL = 'gemini-flash-latest';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  console.log('Testing Gemini API with model:', GEMINI_MODEL);
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, are you there?',
          }],
        }],
      }),
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testGemini();
