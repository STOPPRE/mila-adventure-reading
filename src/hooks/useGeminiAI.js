import { useState, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../utils/firebaseConfig';
import { pick, clozeSentences, cognatePairs, syllableWords } from '../utils/gameData';

export default function useGeminiAI() {
  const [loading, setLoading] = useState(false);

  /**
   * Generates a challenge for a given stop and mode by calling the secure Firebase Cloud Function.
   * Falls back to offline game data if the call fails or Firebase is unavailable.
   */
  const generateChallenge = useCallback(async (stop, mode) => {
    setLoading(true);
    let result = null;

    try {
      // Direct call to Firebase Cloud Function
      const generateMilaQuest = httpsCallable(functions, 'generateMilaQuest');
      const response = await generateMilaQuest({
        stopName: stop.name,
        stopEmoji: stop.emoji,
        mode: mode
      });
      result = response.data;
    } catch (e) {
      console.warn('Failed to fetch challenge from Firebase Function, falling back to local bank...', e);
    }

    // Offline Local Fallback
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
   * Generates a puppy comment in Spanish by calling the secure Firebase Cloud Function.
   */
  const getPuppyComment = useCallback(async (isCorrect) => {
    try {
      const getCommentFunc = httpsCallable(functions, 'getPuppyComment');
      const response = await getCommentFunc({ isCorrect });
      if (response.data) {
        return response.data;
      }
    } catch (e) {
      console.warn('Failed to fetch puppy comment from Firebase Function, using local fallback...', e);
    }

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
