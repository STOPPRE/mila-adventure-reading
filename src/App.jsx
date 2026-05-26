import { useState, useEffect, useMemo } from 'react';
import MilaSprite from './components/MilaSprite';
import InteractiveMap from './components/InteractiveMap';
import MilaDoghouse from './components/MilaDoghouse';
import MazeChallenge from './components/challenges/MazeChallenge';
import BalloonChallenge from './components/challenges/BalloonChallenge';
import RiverChallenge from './components/challenges/RiverChallenge';
import useGeminiAI from './hooks/useGeminiAI';
import { walkStops, currentOutfit } from './utils/gameData';

// ===================== START SCREEN =====================

function StartScreen({ onStart, onContinue, hasProgress, onOpenSettings, onOpenDoghouse, outfit, treats }) {
  return (
    <div className="screen start-screen">
      {/* Settings gear floating at the top-right corner */}
      <button 
        onClick={onOpenSettings} 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '1.6rem',
          background: 'white',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
          border: '2px solid #E2E8F0',
          zIndex: 10
        }}
        aria-label="Settings"
      >
        ⚙️
      </button>

      <div className="start-clouds">
        <div className="cloud cloud-1">☁️</div>
        <div className="cloud cloud-2">☁️</div>
        <div className="cloud cloud-3">☁️</div>
      </div>
      <div className="start-content">
        <div className="start-mila" style={{ padding: '1.25rem' }}>
          <MilaSprite size={180} mood="happy" items={outfit.items} />
        </div>
        <h1 className="game-title">Mila's Mundo Aventura</h1>
        <p className="game-subtitle">
          Help Mila explore the park! Solve interactive Spanish and English quests to earn treats and unlock stylish outfits.
        </p>
        <div className="start-buttons">
          {hasProgress && (
            <button className="btn btn-primary" onClick={onContinue}>
              Continue Journey →
            </button>
          )}
          <button className={`btn ${hasProgress ? 'btn-secondary' : 'btn-primary'}`} onClick={onStart}>
            {hasProgress ? 'Start Over' : "Let's Go! 🐾"}
          </button>
          {hasProgress && (
            <button 
              className="btn btn-secondary" 
              onClick={onOpenDoghouse}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              🏡 Visit Mila's Doghouse
            </button>
          )}
        </div>
        <div className="start-features">
          <div className="feature">
            <div className="feature-emoji">🌳</div>
            <div className="feature-text">2D World Map</div>
          </div>
          <div className="feature">
            <div className="feature-emoji">🤖</div>
            <div className="feature-text">Gemini Quests</div>
          </div>
          <div className="feature">
            <div className="feature-emoji">🏡</div>
            <div className="feature-text">Puppy Care</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== TREAT STOP =====================

function TreatStop({ onComplete, outfit }) {
  const [opened, setOpened] = useState(false);
  return (
    <div className="screen treat-screen">
      <div className="treat-content" style={{ border: '3px solid #FAF6F0' }}>
        <div className="treat-mila">
          <MilaSprite size={150} mood={opened ? 'celebrating' : 'happy'} items={outfit.items} />
        </div>
        <h2 className="treat-title">Treat Stop! 🦴</h2>
        <p className="treat-subtitle">
          {opened ? 'Mila says ¡Gracias! She loves her treats!' : 'You\'ve been walking hard. Tap the box to give Mila a treat!'}
        </p>
        {!opened ? (
          <button className="treat-box" onClick={() => setOpened(true)}>
            🎁
          </button>
        ) : (
          <>
            <div className="treats-rain">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="treat-falling" style={{ left: `${i * 8 + 5}%`, animationDelay: `${i * 0.1}s` }}>
                  🦴
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', maxWidth: '240px', marginTop: '1rem' }} onClick={() => onComplete(true)}>
              Keep walking →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ===================== FINISH SCREEN =====================

function FinishScreen({ treats, onReplay, outfit }) {
  return (
    <div className="screen finish-screen">
      <div className="confetti">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              background: ['#A28043', '#4A7C59', '#B8724C', '#5B8BA0', '#D4A843'][i % 5],
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="finish-content">
        <div className="finish-mila" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
          <MilaSprite size={200} mood="sleeping" items={outfit.items} />
        </div>
        <h1 className="finish-title" style={{ marginTop: '1rem' }}>¡Lo lograste! You did it!</h1>
        <p className="finish-subtitle">
          Mila made it all the way home. She is curled up taking a well-deserved nap!
        </p>
        <div className="finish-stats">
          <div className="finish-stat">
            <div className="finish-stat-num">🦴 {treats}</div>
            <div className="finish-stat-label">Treats left</div>
          </div>
          <div className="finish-stat">
            <div className="finish-stat-num">🏁 {walkStops.length}</div>
            <div className="finish-stat-label">Stops completed</div>
          </div>
          <div className="finish-stat">
            <div className="finish-stat-num">🏆</div>
            <div className="finish-stat-label">Champion Medal</div>
          </div>
        </div>
        <button className="btn btn-primary btn-large" style={{ width: '100%' }} onClick={onReplay}>
          Walk Again 🐾
        </button>
      </div>
    </div>
  );
}

// ===================== APP ROOT =====================

const STORAGE_KEY = 'milas-adventure-progress';

export default function App() {
  const [view, setView] = useState('start'); // start | trail | challenge | doghouse | treat | finish
  const [currentStop, setCurrentStop] = useState(0);
  const [treats, setTreats] = useState(0);
  const [equippedItems, setEquippedItems] = useState([]); // Custom wardrobe choices
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  
  // AI hooks
  const { generateChallenge, getPuppyComment, loading: loadingChallenge } = useGeminiAI();
  const [challengeData, setChallengeData] = useState(null);
  const [puppyComment, setPuppyComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);

  // Load saved progress and settings
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('GEMINI_API_KEY') || '';
      setApiKeyInput(savedKey);

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.currentStop !== undefined && data.currentStop < walkStops.length) {
          setHasProgress(true);
        }
      }
    } catch {}
  }, []);

  // Save progress whenever state changes
  useEffect(() => {
    if (view !== 'start') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
          currentStop, 
          treats,
          equippedItems 
        }));
      } catch {}
    }
  }, [currentStop, treats, equippedItems, view]);

  const outfit = useMemo(() => {
    // Merge standard unlocked outfit progression with custom equipment
    const standard = currentOutfit(currentStop);
    const combined = Array.from(new Set([...standard.items, ...equippedItems]));
    return {
      name: standard.name,
      items: combined
    };
  }, [currentStop, equippedItems]);

  const handleStart = () => {
    setCurrentStop(0);
    setTreats(0);
    setEquippedItems([]);
    setView('trail');
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const handleContinue = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setCurrentStop(data.currentStop || 0);
        setTreats(data.treats || 0);
        setEquippedItems(data.equippedItems || []);
      }
    } catch {}
    setView('trail');
  };

  const handleNextStop = async () => {
    const stop = walkStops[currentStop];
    if (!stop) return;

    if (stop.mode === 'finish') {
      setView('finish');
    } else if (stop.mode === 'treat') {
      setView('treat');
    } else {
      // Fetch dynamic puzzle before changing view to ensure smooth layout transitions
      setChallengeData(null);
      setPuppyComment('');
      setView('challenge');
      const data = await generateChallenge(stop, stop.mode);
      setChallengeData(data);
    }
  };

  const handleChallengeComplete = async (won) => {
    setLoadingComment(true);
    // Fetch a dynamic response from the puppy
    const comment = await getPuppyComment(won, won ? 'happy' : 'thinking');
    setPuppyComment(comment);
    setLoadingComment(false);

    // Wait a brief moment to show puppy comment, then increment and route back
    setTimeout(() => {
      if (won) setTreats((t) => t + 1);
      setCurrentStop((s) => s + 1);
      setView('trail');
    }, 2000);
  };

  const handleSkip = () => {
    setView('trail');
  };

  const handleReplay = () => {
    setCurrentStop(0);
    setTreats(0);
    setEquippedItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setView('start');
  };

  const handleSaveSettings = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKeyInput.trim());
    setShowSettings(false);
  };

  // ----- Render router -----

  if (view === 'start') {
    return (
      <>
        <StartScreen 
          onStart={handleStart} 
          onContinue={handleContinue} 
          hasProgress={hasProgress} 
          onOpenSettings={() => setShowSettings(true)}
          onOpenDoghouse={() => { handleContinue(); setView('doghouse'); }}
          outfit={outfit}
          treats={treats}
        />
        {/* API Key Modal Overlay */}
        {showSettings && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(24, 42, 56, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
              padding: '1rem'
            }}
          >
            <div 
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
                border: '3px solid #A28043'
              }}
            >
              <h3 style={{ fontSize: '1.35rem', color: '#182A38', margin: '0 0 0.5rem', fontFamily: 'Fredoka' }}>
                ⚙️ Parent Settings
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#4A6B8A', lineHeight: '1.4', margin: '0 0 1.25rem' }}>
                Paste your Google Gemini API Key below to enable dynamic, custom stories and puzzle responses. Leave empty to play using the built-in offline bank.
              </p>
              
              <input 
                type="text" 
                placeholder="AIzaSy..." 
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #CBD5E1',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem'
                }}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '10px' }}
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '10px' }}
                  onClick={handleSaveSettings}
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (view === 'finish') {
    return <FinishScreen treats={treats} onReplay={handleReplay} outfit={outfit} />;
  }

  if (view === 'treat') {
    return <TreatStop onComplete={() => { setCurrentStop((s) => s + 1); setView('trail'); }} outfit={outfit} />;
  }

  if (view === 'doghouse') {
    return (
      <MilaDoghouse 
        stopsCompleted={currentStop}
        treats={treats}
        setTreats={setTreats}
        equippedItems={equippedItems}
        setEquippedItems={setEquippedItems}
        onBack={() => setView('trail')}
        puppyComment={puppyComment}
        loadingComment={loadingComment}
      />
    );
  }

  if (view === 'challenge') {
    const stop = walkStops[currentStop];
    
    // Show spinner while loading dynamic content from Gemini
    if (loadingChallenge || !challengeData) {
      return (
        <div className="screen challenge-screen" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div className="challenge-body" style={{ justifyContent: 'center', flex: 'none', width: '100%', maxWidth: '440px', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', animation: 'spin 1.5s infinite linear' }}>🐾</div>
            <h3 style={{ fontFamily: 'Fredoka', color: '#182A38', marginTop: '1.5rem' }}>
              Mila is preparing the next quest...
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4A6B8A', marginTop: '0.5rem' }}>
              Generating a custom puzzle in {stop?.name}!
            </p>
          </div>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    if (stop?.mode === 'cloze') {
      return (
        <MazeChallenge 
          challengeData={challengeData}
          onComplete={handleChallengeComplete} 
          onSkip={handleSkip} 
          puppyComment={puppyComment}
        />
      );
    }
    
    if (stop?.mode === 'cognate') {
      return (
        <BalloonChallenge 
          challengeData={challengeData}
          onComplete={handleChallengeComplete} 
          onSkip={handleSkip} 
          puppyComment={puppyComment}
        />
      );
    }

    if (stop?.mode === 'syllable') {
      return (
        <RiverChallenge 
          challengeData={challengeData}
          onComplete={handleChallengeComplete} 
          onSkip={handleSkip} 
          puppyComment={puppyComment}
        />
      );
    }
  }

  // Default view: Interactive World Map
  return (
    <InteractiveMap 
      currentStop={currentStop} 
      onContinue={handleNextStop} 
      treats={treats} 
      outfit={outfit} 
    />
  );
}
