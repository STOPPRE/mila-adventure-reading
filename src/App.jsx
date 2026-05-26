import { useState, useEffect, useMemo } from 'react';
import { Volume2, VolumeX, Settings, Bone, Trophy, Sparkles, Home, ChevronRight, RefreshCw } from 'lucide-react';
import MilaSprite from './components/MilaSprite';
import InteractiveMap from './components/InteractiveMap';
import InteractiveMap3D from './components/InteractiveMap3D';
import MilaDoghouse from './components/MilaDoghouse';
import MazeChallenge from './components/challenges/MazeChallenge';
import BalloonChallenge from './components/challenges/BalloonChallenge';
import RiverChallenge from './components/challenges/RiverChallenge';
import useGeminiAI from './hooks/useGeminiAI';
import useSoundEffects from './hooks/useSoundEffects';
import { walkStops, currentOutfit } from './utils/gameData';

// ===================== START SCREEN =====================

function StartScreen({ 
  onStart, 
  onContinue, 
  hasProgress, 
  onOpenSettings, 
  onOpenDoghouse, 
  outfit, 
  muted, 
  onToggleMute, 
  playTick 
}) {
  return (
    <div className="screen start-screen">
      {/* Settings & Sound controls floating at the top corner */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px', zIndex: 10 }}>
        <button 
          onClick={() => { onToggleMute(); }} 
          style={{
            background: 'white',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
            border: '2px solid #E2E8F0',
          }}
          aria-label="Toggle Sound"
        >
          {muted ? <VolumeX size={18} color="#A63D40" /> : <Volume2 size={18} color="#4A7C59" />}
        </button>
        <button 
          onClick={onOpenSettings} 
          style={{
            background: 'white',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
            border: '2px solid #E2E8F0',
          }}
          aria-label="Settings"
        >
          <Settings size={18} color="#64748B" />
        </button>
      </div>

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
              Continue Journey <ChevronRight size={18} style={{ display: 'inline', marginLeft: '4px' }} />
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
              <Home size={18} color="#A28043" /> Visit Mila's Doghouse
            </button>
          )}
        </div>
        <div className="start-features">
          <div className="feature">
            <div className="feature-emoji">🗺️</div>
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

function TreatStop({ onComplete, outfit, playCheer, playPop }) {
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
          <button className="treat-box" onClick={() => { playPop(); setOpened(true); }}>
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
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', maxWidth: '240px', marginTop: '1rem' }} 
              onClick={() => { playCheer(); onComplete(true); }}
            >
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
            <div className="finish-stat-num" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Bone size={20} color="#A28043" /> {treats}
            </div>
            <div className="finish-stat-label">Treats left</div>
          </div>
          <div className="finish-stat">
            <div className="finish-stat-num">🏁 {walkStops.length}</div>
            <div className="finish-stat-label">Stops completed</div>
          </div>
          <div className="finish-stat">
            <div className="finish-stat-num"><Trophy size={20} color="#D4A843" style={{ display: 'inline' }} /></div>
            <div className="finish-stat-label">Champion Medal</div>
          </div>
        </div>
        <button className="btn btn-primary btn-large" style={{ width: '100%' }} onClick={onReplay}>
          <RefreshCw size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Walk Again 🐾
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
  const [mapMode, setMapMode] = useState('3d'); // '3d' | '2d'
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  
  // AI hooks
  const { generateChallenge, getPuppyComment, loading: loadingChallenge } = useGeminiAI();
  const [challengeData, setChallengeData] = useState(null);
  const [puppyComment, setPuppyComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);

  // Sound Engine
  const { muted, toggleMute, playPop, playTick, playBark, playCheer } = useSoundEffects();

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

  // Play chime on completing game
  useEffect(() => {
    if (view === 'finish') {
      playCheer();
      setTimeout(playBark, 800);
    }
  }, [view]);

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
    const standard = currentOutfit(currentStop);
    const combined = Array.from(new Set([...standard.items, ...equippedItems]));
    return {
      name: standard.name,
      items: combined
    };
  }, [currentStop, equippedItems]);

  const handleStart = () => {
    playCheer();
    setCurrentStop(0);
    setTreats(0);
    setEquippedItems([]);
    setView('trail');
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const handleContinue = () => {
    playCheer();
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
      setChallengeData(null);
      setPuppyComment('');
      setView('challenge');
      const data = await generateChallenge(stop, stop.mode);
      setChallengeData(data);
    }
  };

  const handleChallengeComplete = async (won) => {
    setLoadingComment(true);
    const comment = await getPuppyComment(won);
    setPuppyComment(comment);
    setLoadingComment(false);

    setTimeout(() => {
      if (won) setTreats((t) => t + 1);
      setCurrentStop((s) => s + 1);
      setView('trail');
    }, 2000);
  };

  const handleSkip = () => {
    playTick();
    setView('trail');
  };

  const handleReplay = () => {
    playPop();
    setCurrentStop(0);
    setTreats(0);
    setEquippedItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setView('start');
  };

  const handleSaveSettings = () => {
    playCheer();
    localStorage.setItem('GEMINI_API_KEY', apiKeyInput.trim());
    setShowSettings(false);
  };

  const handleToggleMute = () => {
    toggleMute();
    // Play a brief bark if unmuting to let the user hear
    if (muted) {
      // It is currently muted, so it will become unmuted. Play a test sound.
      setTimeout(playBark, 50);
    }
  };

  // ----- Render router -----

  if (view === 'start') {
    return (
      <>
        <StartScreen 
          onStart={handleStart} 
          onContinue={handleContinue} 
          hasProgress={hasProgress} 
          onOpenSettings={() => { playTick(); setShowSettings(true); }}
          onOpenDoghouse={() => { playBark(); handleContinue(); setView('doghouse'); }}
          outfit={outfit}
          muted={muted}
          onToggleMute={handleToggleMute}
          playTick={playTick}
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
              <h3 style={{ fontSize: '1.35rem', color: '#182A38', margin: '0 0 0.5rem', fontFamily: 'Fredoka', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings size={20} color="#A28043" /> Parent Settings
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

              {/* Local Sound Setting in settings modal too */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#182A38' }}>Game Sounds:</span>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleToggleMute}
                  style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  {muted ? <><VolumeX size={14} /> Muted</> : <><Volume2 size={14} /> Sound On</>}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '10px' }}
                  onClick={() => { playTick(); setShowSettings(false); }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '10px' }}
                  onClick={handleSaveSettings}
                >
                  Save Settings
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
    return (
      <TreatStop 
        onComplete={() => { setCurrentStop((s) => s + 1); setView('trail'); }} 
        outfit={outfit} 
        playCheer={playCheer}
        playPop={playPop}
      />
    );
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

  if (mapMode === '3d') {
    return (
      <InteractiveMap3D 
        currentStop={currentStop} 
        onContinue={handleNextStop} 
        treats={treats} 
        outfit={outfit} 
        onOpenSettings={() => setShowSettings(true)}
        onSwitch2D={() => setMapMode('2d')}
      />
    );
  }

  return (
    <InteractiveMap 
      currentStop={currentStop} 
      onContinue={handleNextStop} 
      treats={treats} 
      outfit={outfit} 
      onOpenSettings={() => setShowSettings(true)}
      onSwitch3D={() => setMapMode('3d')}
    />
  );
}
