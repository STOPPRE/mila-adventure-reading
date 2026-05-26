import { useState, useCallback } from 'react';
import { callGeminiAPI } from '../utils/geminiConfig';
import { pick, clozeSentences, cognatePairs, syllableWords } from '../utils/gameData';

// System instructions for the model to behave like a friendly, educational tutor
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

export default function useGeminiAI() {
  const [loading, setLoading] = useState(false);

  /**
   * Generates a challenge for a given stop and mode.
   * Falls back to offline game data if API key is not configured or request fails.
   */
  const generateChallenge = useCallback(async (stop, mode) => {
    setLoading(true);
    let result = null;

    try {
      const isAIEnabled = localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;

      if (isAIEnabled) {
        if (mode === 'cloze') {
          const prompt = `Generate a Spanish reading comprehension challenge (MAZE-style). The setting is: "${stop.name}" (emoji: ${stop.emoji}). The sentence blank must test reading comprehension in context.`;
          result = await callGeminiAPI(prompt, SYSTEM_INSTRUCTION, CLOZE_SCHEMA);
        } else if (mode === 'cognate') {
          const prompt = `Generate a Spanish-English vocabulary challenge. The setting is: "${stop.name}" (emoji: ${stop.emoji}). The Spanish word should be a cognate (e.g. 'importante', 'delicioso', 'momento').`;
          result = await callGeminiAPI(prompt, SYSTEM_INSTRUCTION, COGNATE_SCHEMA);
        } else if (mode === 'syllable') {
          const prompt = `Generate an English multisyllabic decoding challenge. The setting is: "${stop.name}" (emoji: ${stop.emoji}). The word should be 2 to 4 syllables, suitable for a 3rd/4th grader.`;
          result = await callGeminiAPI(prompt, SYSTEM_INSTRUCTION, SYLLABLE_SCHEMA);
        }
      }
    } catch (e) {
      console.error('Failed to generate challenge with Gemini, falling back...', e);
    }

    // Offline Fallback
    if (!result) {
      if (mode === 'cloze') {
        const item = pick(clozeSentences);
        result = {
          ...item,
          narrative: `Mila corre al stop ${stop.name} ${stop.emoji}. ¡Tiene mucha energía y quiere jugar contigo!`
        };
      } else if (mode === 'cognate') {
        const item = pick(cognatePairs);
        result = {
          ...item,
          narrative: `Mila encuentra un letrero misterioso en ${stop.name} ${stop.emoji}. ¿Puedes ayudarla a traducirlo?`
        };
      } else if (mode === 'syllable') {
        const item = pick(syllableWords);
        result = {
          ...item,
          narrative: `Para cruzar el agua en ${stop.name} ${stop.emoji}, Mila necesita saltar de piedra en piedra en orden.`
        };
      }
    }

    setLoading(false);
    return result;
  }, []);

  /**
   * Generates a puppy comment in Spanish or English based on success or retry.
   */
  const getPuppyComment = useCallback(async (isCorrect, dogMood) => {
    try {
      const isAIEnabled = localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;
      if (isAIEnabled) {
        const prompt = `Generate a short response (maximum 1 sentence, max 10 words) in Spanish from Mila the puppy to Carolina.
        State of response: ${isCorrect ? 'Carolina solved a puzzle correctly! Mila is celebrating and happy' : 'Carolina made a mistake. Mila is encouraging her to try again'}.`;
        const comment = await callGeminiAPI(prompt, SYSTEM_INSTRUCTION);
        if (comment) return comment.replace(/"/g, '').trim();
      }
    } catch {}

    // Fallbacks
    if (isCorrect) {
      return pick([
        '¡Guau! ¡Excelente trabajo!',
        '¡Me encantan las galletas! ¡Gracias!',
        '¡Eres súper inteligente!',
        '¡Haces un gran equipo conmigo!'
      ]);
    } else {
      return pick([
        '¡Está bien! ¡Intentemos otra vez!',
        '¡Casi lo tienes! ¡Sigue adelante!',
        '¡Guau! ¡El próximo será mejor!'
      ]);
    }
  }, []);

  return {
    generateChallenge,
    getPuppyComment,
    loading
  };
}
