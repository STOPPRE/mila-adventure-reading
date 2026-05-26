# Mila's Adventure Park 🐾

A web game built for Carolina to practice three skills flagged in her end-of-3rd-grade assessments:

1. **Spanish reading comprehension (MAZE)** — cloze sentences with 3-choice answers
2. **Spanish ↔ English vocabulary** — cognate matching
3. **English multisyllabic decoding** — syllable splitting

Take Mila on a 12-stop walk through the park. Each stop is one of the three challenge types. Earn treats. Watch Mila gain a collar, bandana, backpack, hat, and finally a gold medal as you progress. Progress saves to `localStorage`.

## Tech

- React 18 + Vite
- No external runtime dependencies beyond React (chart-free, game logic is pure React state)
- Single-page app, mobile-first, designed for ~9-year-old hands on a phone

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

Output lands in `dist/`. Deploy that folder to any static host (Firebase Hosting, Netlify, Vercel, GitHub Pages).

## Live version

https://milas-adventure-park.web.app

## File map

| File | What it does |
|------|--------------|
| `src/App.jsx` | All screens (Start, Trail, Cloze, Cognate, Syllable, Treat, Finish) and the root state machine. ~580 lines. |
| `src/Mila.jsx` | The animated SVG puppy. Accepts an `items` array (`collar`, `bandana`, `backpack`, `hat`, `medal`) and `mood` (`happy`, `thinking`, `celebrating`). |
| `src/gameData.js` | All content: 18 Spanish cloze sentences, 20 cognate pairs, 20 syllable words, the 12-stop walk, the outfit progression. **Edit this file to add/change content.** |
| `src/index.css` | All styling. CSS variables for the palette at the top. |
| `src/main.jsx` | React entry point. |

## How to add new content

Open `src/gameData.js`. Each list (clozeSentences, cognatePairs, syllableWords) takes the same shape — just append new entries.

```js
// New cloze sentence
{
  id: 'c19',
  sentence: 'Carolina y Mila fueron al ___ para jugar.',
  choices: ['parque', 'libro', 'reloj'],
  correct: 'parque',
  hint: 'Where do you go to play outside?',
}
```

```js
// New cognate pair
{ id: 'cog21', spanish: 'elefante', correct: 'elephant', distractors: ['element', 'elegant'] }
```

```js
// New syllable word
{ id: 's21', word: 'computer', syllables: ['com', 'pu', 'ter'], pattern: '3-syllable' }
```

Save the file. If the dev server is running it'll hot-reload. Otherwise rebuild.

## Deploy to Firebase (Vera-family-apps pattern)

```bash
npm run build
cd dist
# Create firebase.json pointing to a site name of your choice
firebase deploy --only hosting:milas-adventure-park --project vera-family-apps
```
