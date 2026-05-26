// Content calibrated for end of 3rd grade / start of 4th grade Spanish immersion learner.
// All Spanish text uses vocabulary and structures consistent with Carolina's STAMP Reading Level 4
// (Intermediate Low — basic strings of sentences, familiar topics: home, family, school, public life)
// while gently stretching toward Level 5 (Connected Sentences).

// =====================================================================
// MODE 1: CLOZE TRAIL — Spanish MAZE-style sentences
// Format: sentence with one blank, three choices, one correct.
// Calibrated to test meaning-making, not vocabulary obscurity.
// =====================================================================

export const clozeSentences = [
  {
    id: 'c1',
    sentence: 'Mila tiene mucha sed. Va a beber ___.',
    choices: ['agua', 'libro', 'gato'],
    correct: 'agua',
    hint: 'When you are thirsty, what do you drink?',
  },
  {
    id: 'c2',
    sentence: 'El sol está muy fuerte hoy. Necesito mi ___ para los ojos.',
    choices: ['zapato', 'lentes', 'tenedor'],
    correct: 'lentes',
    hint: 'What protects your eyes from the sun?',
  },
  {
    id: 'c3',
    sentence: 'Carolina abrió el libro y empezó a ___ la primera página.',
    choices: ['comer', 'leer', 'correr'],
    correct: 'leer',
    hint: 'What do you do with a book?',
  },
  {
    id: 'c4',
    sentence: 'Hace frío afuera. Mila quiere ponerse su ___.',
    choices: ['suéter', 'helado', 'pelota'],
    correct: 'suéter',
    hint: 'What keeps you warm?',
  },
  {
    id: 'c5',
    sentence: 'La maestra dijo: "Por favor, ___ silenciosos en la biblioteca."',
    choices: ['corran', 'estén', 'coman'],
    correct: 'estén',
    hint: 'In the library, you should BE quiet.',
  },
  {
    id: 'c6',
    sentence: 'Mila movió la cola porque estaba muy ___ de ver a Carolina.',
    choices: ['triste', 'cansada', 'feliz'],
    correct: 'feliz',
    hint: 'Wagging tails mean a happy dog!',
  },
  {
    id: 'c7',
    sentence: 'Antes de salir al parque, Mila se puso su ___ para caminar.',
    choices: ['correa', 'cuchara', 'almohada'],
    correct: 'correa',
    hint: 'What do dogs wear when walking?',
  },
  {
    id: 'c8',
    sentence: 'El cielo está oscuro y hay nubes grandes. Va a ___ pronto.',
    choices: ['llover', 'nadar', 'bailar'],
    correct: 'llover',
    hint: 'Dark clouds mean rain is coming.',
  },
  {
    id: 'c9',
    sentence: 'Carolina tiene hambre. Va a la cocina para ___ algo de comer.',
    choices: ['romper', 'buscar', 'dormir'],
    correct: 'buscar',
    hint: 'When you are hungry, you LOOK FOR something to eat.',
  },
  {
    id: 'c10',
    sentence: 'Las flores en el jardín son de muchos ___ diferentes: rojo, amarillo, azul.',
    choices: ['números', 'colores', 'animales'],
    correct: 'colores',
    hint: 'Red, yellow, blue — these are all...',
  },
  {
    id: 'c11',
    sentence: 'Mila persiguió la pelota y la trajo de ___ en su boca.',
    choices: ['regreso', 'lluvia', 'pintura'],
    correct: 'regreso',
    hint: 'She brought it BACK.',
  },
  {
    id: 'c12',
    sentence: 'Carolina estudió mucho para el examen y sacó una ___ nota.',
    choices: ['mala', 'rota', 'buena'],
    correct: 'buena',
    hint: 'If you studied a lot, you probably got a ___ grade.',
  },
  {
    id: 'c13',
    sentence: 'Mila estaba cansada después de correr, entonces se acostó a ___.',
    choices: ['descansar', 'gritar', 'cantar'],
    correct: 'descansar',
    hint: 'When you are tired, you...',
  },
  {
    id: 'c14',
    sentence: 'El profesor explicó la lección, pero Carolina no entendió, entonces ___ una pregunta.',
    choices: ['hizo', 'comió', 'lavó'],
    correct: 'hizo',
    hint: 'When you don\'t understand, you ASK a question.',
  },
  {
    id: 'c15',
    sentence: 'En el invierno hace mucho frío, pero en el ___ hace mucho calor.',
    choices: ['otoño', 'verano', 'lunes'],
    correct: 'verano',
    hint: 'Which season is hot?',
  },
  {
    id: 'c16',
    sentence: 'Mila no quería bañarse, pero estaba muy ___ después de jugar en el lodo.',
    choices: ['sucia', 'rápida', 'alegre'],
    correct: 'sucia',
    hint: 'Playing in mud makes you...',
  },
  {
    id: 'c17',
    sentence: 'Para hacer un sándwich, primero necesitas dos rebanadas de ___.',
    choices: ['pan', 'leche', 'arena'],
    correct: 'pan',
    hint: 'A sandwich is made of two slices of...',
  },
  {
    id: 'c18',
    sentence: 'Carolina no podía dormir porque su cuarto estaba muy ___.',
    choices: ['oscuro', 'ruidoso', 'limpio'],
    correct: 'ruidoso',
    hint: 'Loud sounds make it hard to sleep.',
  },
];

// =====================================================================
// MODE 2: COGNATE HUNT — Spanish word → English cognate
// Cognates are highest-leverage vocabulary because they transfer
// directly between English and Spanish. Per Avant's Power Up guide,
// this is exactly the kind of cross-language work that pushes
// Intermediate Low → Mid.
// =====================================================================

export const cognatePairs = [
  { id: 'cog1',  spanish: 'animal',       correct: 'animal',     distractors: ['plant', 'rock'] },
  { id: 'cog2',  spanish: 'familia',      correct: 'family',     distractors: ['friend', 'fairy'] },
  { id: 'cog3',  spanish: 'importante',   correct: 'important',  distractors: ['impossible', 'imported'] },
  { id: 'cog4',  spanish: 'doctor',       correct: 'doctor',     distractors: ['dentist', 'driver'] },
  { id: 'cog5',  spanish: 'música',       correct: 'music',      distractors: ['movie', 'museum'] },
  { id: 'cog6',  spanish: 'problema',     correct: 'problem',    distractors: ['promise', 'project'] },
  { id: 'cog7',  spanish: 'planeta',      correct: 'planet',     distractors: ['plane', 'plant'] },
  { id: 'cog8',  spanish: 'famoso',       correct: 'famous',     distractors: ['family', 'fancy'] },
  { id: 'cog9',  spanish: 'diferente',    correct: 'different',  distractors: ['difficult', 'distant'] },
  { id: 'cog10', spanish: 'horrible',     correct: 'horrible',   distractors: ['hospital', 'horizon'] },
  { id: 'cog11', spanish: 'natural',      correct: 'natural',    distractors: ['national', 'normal'] },
  { id: 'cog12', spanish: 'momento',      correct: 'moment',     distractors: ['monument', 'minute'] },
  { id: 'cog13', spanish: 'información',  correct: 'information',distractors: ['imagination', 'invention'] },
  { id: 'cog14', spanish: 'invitación',   correct: 'invitation', distractors: ['information', 'invasion'] },
  { id: 'cog15', spanish: 'delicioso',    correct: 'delicious',  distractors: ['delivered', 'difficult'] },
  { id: 'cog16', spanish: 'aventura',     correct: 'adventure',  distractors: ['agency', 'avenue'] },
  { id: 'cog17', spanish: 'computadora', correct: 'computer',    distractors: ['composer', 'commander'] },
  { id: 'cog18', spanish: 'increíble',    correct: 'incredible', distractors: ['invisible', 'included'] },
  { id: 'cog19', spanish: 'historia',     correct: 'history',    distractors: ['hospital', 'hostess'] },
  { id: 'cog20', spanish: 'inteligente',  correct: 'intelligent',distractors: ['interested', 'invented'] },
];

// =====================================================================
// MODE 3: SYLLABLE STONES — English multisyllabic decoding
// Word appears, child taps stones to mark syllable breaks.
// Targets the ISSA-flagged "applies spelling knowledge: multisyllabic
// words" item directly.
// =====================================================================

export const syllableWords = [
  { id: 's1',  word: 'butter',       syllables: ['but', 'ter'], pattern: 'VC/CV' },
  { id: 's2',  word: 'happen',       syllables: ['hap', 'pen'], pattern: 'VC/CV' },
  { id: 's3',  word: 'rabbit',       syllables: ['rab', 'bit'], pattern: 'VC/CV' },
  { id: 's4',  word: 'puppy',        syllables: ['pup', 'py'], pattern: 'VC/CV' },
  { id: 's5',  word: 'window',       syllables: ['win', 'dow'], pattern: 'VC/CV' },
  { id: 's6',  word: 'basket',       syllables: ['bas', 'ket'], pattern: 'VC/CV' },
  { id: 's7',  word: 'reading',      syllables: ['read', 'ing'], pattern: 'suffix' },
  { id: 's8',  word: 'jumping',      syllables: ['jump', 'ing'], pattern: 'suffix' },
  { id: 's9',  word: 'unhappy',      syllables: ['un', 'hap', 'py'], pattern: 'prefix+VC/CV' },
  { id: 's10', word: 'remember',     syllables: ['re', 'mem', 'ber'], pattern: 'prefix+VC/CV' },
  { id: 's11', word: 'wonderful',    syllables: ['won', 'der', 'ful'], pattern: '3-syllable' },
  { id: 's12', word: 'beautiful',    syllables: ['beau', 'ti', 'ful'], pattern: '3-syllable' },
  { id: 's13', word: 'adventure',    syllables: ['ad', 'ven', 'ture'], pattern: '3-syllable' },
  { id: 's14', word: 'information',  syllables: ['in', 'for', 'ma', 'tion'], pattern: '4-syllable / -tion' },
  { id: 's15', word: 'celebration',  syllables: ['cel', 'e', 'bra', 'tion'], pattern: '4-syllable / -tion' },
  { id: 's16', word: 'invitation',   syllables: ['in', 'vi', 'ta', 'tion'], pattern: '4-syllable / -tion' },
  { id: 's17', word: 'fantastic',    syllables: ['fan', 'tas', 'tic'], pattern: '3-syllable' },
  { id: 's18', word: 'community',    syllables: ['com', 'mu', 'ni', 'ty'], pattern: '4-syllable' },
  { id: 's19', word: 'understand',   syllables: ['un', 'der', 'stand'], pattern: 'prefix+root' },
  { id: 's20', word: 'somebody',     syllables: ['some', 'bo', 'dy'], pattern: '3-syllable' },
];

// =====================================================================
// PROGRESSION
// 12-stop walk through Mila's Adventure Park. Stops alternate among
// the three modes with one bonus "Treat Stop" mid-walk and a celebration
// at the end. Each successful stop earns Mila a treat.
// =====================================================================

export const walkStops = [
  { num: 1,  mode: 'cloze',    name: 'The Front Gate',     emoji: '🌿' },
  { num: 2,  mode: 'cognate',  name: 'Bird Bridge',         emoji: '🌉' },
  { num: 3,  mode: 'syllable', name: 'Stepping Stones',     emoji: '🪨' },
  { num: 4,  mode: 'cloze',    name: 'The Picnic Meadow',   emoji: '🌼' },
  { num: 5,  mode: 'cognate',  name: 'Butterfly Path',      emoji: '🦋' },
  { num: 6,  mode: 'treat',    name: 'Treat Stop! 🦴',      emoji: '🦴' },
  { num: 7,  mode: 'syllable', name: 'Creek Crossing',      emoji: '🏞️' },
  { num: 8,  mode: 'cloze',    name: 'The Tall Trees',      emoji: '🌳' },
  { num: 9,  mode: 'cognate',  name: 'Sunny Hill',          emoji: '☀️' },
  { num: 10, mode: 'syllable', name: 'Rocky Trail',         emoji: '⛰️' },
  { num: 11, mode: 'cloze',    name: 'The Wildflower Field', emoji: '🌸' },
  { num: 12, mode: 'finish',   name: 'Home with Mila',      emoji: '🏡' },
];

// Mila's outfit progression — visual reward system, more interesting than points
export const milaOutfits = [
  { atStops: 0,  name: 'Mila',          items: [] },
  { atStops: 2,  name: 'Mila + Collar', items: ['collar'] },
  { atStops: 4,  name: 'Mila + Bandana',items: ['collar', 'bandana'] },
  { atStops: 7,  name: 'Mila + Backpack', items: ['collar', 'bandana', 'backpack'] },
  { atStops: 10, name: 'Mila the Adventurer', items: ['collar', 'bandana', 'backpack', 'hat'] },
  { atStops: 12, name: 'Mila the Champion!', items: ['collar', 'bandana', 'backpack', 'hat', 'medal'] },
];

export function currentOutfit(stopsCompleted) {
  let outfit = milaOutfits[0];
  for (const o of milaOutfits) {
    if (stopsCompleted >= o.atStops) outfit = o;
  }
  return outfit;
}

// Pick a random item from an array
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Shuffle helper
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
