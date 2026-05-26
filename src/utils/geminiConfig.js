// Wrapper for clientside Gemini API requests using the REST endpoint.
// Designed with safety fallbacks if the API key is not present or calls fail.

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Calls the Gemini API using fetch.
 * Falls back to null if no key is configured or on errors.
 */
export async function callGeminiAPI(prompt, systemInstruction = '', responseSchema = null) {
  // Try to find API key in localStorage or environment variables
  const apiKey = localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    console.warn('Gemini API Key is missing. Storing in localStorage or env VITE_GEMINI_API_KEY will enable dynamic AI quests.');
    return null;
  }

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    }
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [
        { text: systemInstruction }
      ]
    };
  }

  if (responseSchema) {
    requestBody.generationConfig.responseMimeType = 'application/json';
    requestBody.generationConfig.responseSchema = responseSchema;
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (responseSchema) {
      return JSON.parse(textResponse);
    }
    return textResponse;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}
