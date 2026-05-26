const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

admin.initializeApp();

// Lazy-load Gemini SDKs to minimize function cold start times
let GoogleGenAI = null;
let VertexAI = null;

/**
 * Gets the Gemini model instance using either API key or Vertex AI Service Account credentials.
 */
function getGeminiModel(systemInstruction, responseSchema = null) {
  const apiKey = process.env.GEMINI_API_KEY || '';

  if (apiKey) {
    if (!GoogleGenAI) {
      GoogleGenAI = require('@google/generative-ai').GoogleGenAI;
    }
    const genAI = new GoogleGenAI(apiKey);
    const modelOptions = {
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction,
    };
    if (responseSchema) {
      modelOptions.generationConfig = {
        responseMimeType: 'application/json',
        responseSchema: responseSchema
      };
    }
    return {
      generate: async (prompt) => {
        const model = genAI.getGenerativeModel(modelOptions);
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
    };
  } else {
    // Fall back to Google Cloud Vertex AI using default service account credentials
    if (!VertexAI) {
      VertexAI = require('@google-cloud/vertexai').VertexAI;
    }
    // Get Project ID from Firebase config
    const projectId = admin.instanceId().app.options.projectId || 'vera-family-apps';
    const vertexAI = new VertexAI({ project: projectId, location: 'us-central1' });
    
    const systemInstructionContent = systemInstruction ? {
      role: 'system',
      parts: [{ text: systemInstruction }]
    } : undefined;

    const generationConfig = responseSchema ? {
      responseMimeType: 'application/json',
      responseSchema: responseSchema
    } : undefined;

    const model = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: generationConfig,
      systemInstruction: systemInstructionContent
    });

    return {
      generate: async (prompt) => {
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        return result.response.candidates[0].content.parts[0].text;
      }
    };
  }
}

// System instructions matching game guidelines
const SYSTEM_INSTRUCTION = `
You are the AI engine for "Mila's Mundo Aventura," a fun mobile learning game for Carolina, a 9-year-old in a Spanish immersion program (end of 3rd grade / start of 4th grade).
Your job is to generate educational reading and vocabulary challenges in a playful, encouraging narrative.
- All Spanish narratives must use vocabulary and structures suitable for a Spanish immersion learner at STAMP reading level 4-5 (Intermediate Low to Connected Sentences). Use familiar topics: animals, park, friends, toys, food.
- Use simple, positive, child-friendly themes.
- Mila is a real black-and-white bicolor Retriever mix puppy. She is playful, energetic, loves treats, and wags her tail. Include her in the story!
- Always output valid, well-formed JSON matching the requested schema.
`;

const CLOZE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    narrative: { type: 'STRING', description: '2 simple sentences in Spanish describing Mila\'s action at the stop, setting up the challenge.' },
    sentence: { type: 'STRING', description: 'A Spanish sentence with a blank specified as "___".' },
    choices: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Exactly 3 choices, one of which is the correct word.'
    },
    correct: { type: 'STRING', description: 'The correct choice that completes the blank.' },
    hint: { type: 'STRING', description: 'A helpful English clue.' }
  },
  required: ['narrative', 'sentence', 'choices', 'correct', 'hint']
};

const COGNATE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    narrative: { type: 'STRING', description: '2 simple sentences in Spanish describing Mila\'s action at the stop, setting up the challenge.' },
    spanish: { type: 'STRING', description: 'A Spanish word that has an English cognate.' },
    correct: { type: 'STRING', description: 'The correct English cognate word.' },
    distractors: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Exactly 2 English words that are distractors.'
    }
  },
  required: ['narrative', 'spanish', 'correct', 'distractors']
};

const SYLLABLE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    narrative: { type: 'STRING', description: '2 simple sentences in Spanish describing Mila\'s action at the stop, setting up the challenge.' },
    word: { type: 'STRING', description: 'An English multisyllabic word appropriate for 3rd/4th grade.' },
    syllables: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'The correct syllables in order.'
    }
  },
  required: ['narrative', 'word', 'syllables']
};

/**
 * Callable Firebase Cloud Function to generate a dynamic adventure Stop.
 */
exports.generateMilaQuest = onCall({ cors: true }, async (request) => {
  const { stopName, stopEmoji, mode } = request.data || {};

  if (!mode) {
    throw new HttpsError('invalid-argument', 'The function must be called with a "mode" argument.');
  }

  let prompt = '';
  let schema = null;

  if (mode === 'cloze') {
    prompt = `Generate a Spanish reading comprehension challenge (MAZE-style). The setting is: "${stopName}" (emoji: ${stopEmoji}). The sentence blank must test reading comprehension in context.`;
    schema = CLOZE_SCHEMA;
  } else if (mode === 'cognate') {
    prompt = `Generate a Spanish-English vocabulary challenge. The setting is: "${stopName}" (emoji: ${stopEmoji}). The Spanish word should be a cognate (e.g. 'importante', 'delicioso', 'momento').`;
    schema = COGNATE_SCHEMA;
  } else if (mode === 'syllable') {
    prompt = `Generate an English multisyllabic decoding challenge. The setting is: "${stopName}" (emoji: ${stopEmoji}). The word should be 2 to 4 syllables, suitable for a 3rd/4th grader.`;
    schema = SYLLABLE_SCHEMA;
  } else {
    throw new HttpsError('invalid-argument', `Unknown game mode: ${mode}`);
  }

  try {
    const runner = getGeminiModel(SYSTEM_INSTRUCTION, schema);
    const rawResult = await runner.generate(prompt);
    return JSON.parse(rawResult);
  } catch (error) {
    console.error('Error generating Mila Quest:', error);
    throw new HttpsError('internal', `Failed to generate quest: ${error.message}`);
  }
});

/**
 * Callable Firebase Cloud Function to generate a puppy feedback bubble comment.
 */
exports.getPuppyComment = onCall({ cors: true }, async (request) => {
  const { isCorrect } = request.data || {};

  const prompt = `Generate a short response (maximum 1 sentence, max 10 words) in Spanish from Mila the puppy to Carolina.
  State of response: ${isCorrect ? 'Carolina solved a puzzle correctly! Mila is celebrating and happy' : 'Carolina made a mistake. Mila is encouraging her to try again'}.`;

  try {
    const runner = getGeminiModel(SYSTEM_INSTRUCTION);
    const comment = await runner.generate(prompt);
    return comment.replace(/"/g, '').trim();
  } catch (error) {
    console.error('Error generating Puppy Comment:', error);
    throw new HttpsError('internal', `Failed to generate comment: ${error.message}`);
  }
});
