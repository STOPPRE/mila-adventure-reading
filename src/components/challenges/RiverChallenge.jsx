import React, { useState, useMemo } from 'react';
import { Waves, HelpCircle } from 'lucide-react';
import MilaSprite from '../MilaSprite';
import useSoundEffects from '../../hooks/useSoundEffects';

export default function RiverChallenge({ challengeData, onComplete, onSkip, puppyComment }) {
  const { word, syllables, narrative } = challengeData;
  const letters = word.split('');

  // Sound Engine
  const { playTick, playSplash, playCheer, playIncorrect } = useSoundEffects();

  // Correct split positions (after which letter index, 1-indexed)
  const correctSplits = useMemo(() => {
    const splits = [];
    let pos = 0;
    for (let i = 0; i < syllables.length - 1; i++) {
      pos += syllables[i].length;
      splits.push(pos);
    }
    return splits;
  }, [syllables]);

  const [userSplits, setUserSplits] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [resultGood, setResultGood] = useState(false);
  const [hopState, setHopState] = useState('idle'); // 'idle' | 'hopping' | 'splash' | 'crossing'
  const [activeHopIndex, setActiveHopIndex] = useState(-1); // which syllable group Mila is hopping on

  const toggleSplit = (pos) => {
    if (showResult) return;
    playTick(); // click split!
    setUserSplits((s) =>
      s.includes(pos) ? s.filter((x) => x !== pos) : [...s, pos].sort((a, b) => a - b)
    );
  };

  const checkAnswer = () => {
    playTick();
    const sorted = [...userSplits].sort((a, b) => a - b);
    const matches =
      sorted.length === correctSplits.length &&
      sorted.every((v, i) => v === correctSplits[i]);
    
    setResultGood(matches);
    setShowResult(true);

    // Trigger hopping animations sequence
    setHopState('hopping');
    
    let hopSeq = 0;
    const maxHops = syllables.length;

    function runHopSequence() {
      if (hopSeq < maxHops) {
        setActiveHopIndex(hopSeq);
        // Play wood step tick sound for each hop!
        playTick();
        hopSeq++;
        setTimeout(runHopSequence, 600);
      } else {
        // Final landing
        if (matches) {
          playCheer(); // Success Chime!
          setHopState('crossing'); // crossed successfully
          setActiveHopIndex(maxHops); // on right bank
          setTimeout(() => onComplete(true), 2000);
        } else {
          playSplash(); // SPLASH noise!
          setHopState('splash');
          setTimeout(() => {
            // reset back to left bank after splash
            setActiveHopIndex(-1);
            setHopState('idle');
            setTimeout(() => onComplete(false), 2000);
          }, 1500);
        }
      }
    }

    setTimeout(runHopSequence, 400);
  };

  const numTargets = syllables.length;

  return (
    <div className="screen challenge-screen river-screen">
      <div className="challenge-header">
        <button className="back-btn" onClick={() => { playTick(); onSkip(); }}>← Exit</button>
        <div className="challenge-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Waves size={14} color="#C4A456" /> Syllable Stones
        </div>
      </div>

      <div className="challenge-body">
        {/* Narrative introduction */}
        <div 
          className="narrative-box"
          style={{
            background: 'rgba(24, 42, 56, 0.03)',
            borderLeft: '4px solid #182A38',
            padding: '10px 14px',
            borderRadius: '0 12px 12px 0',
            fontSize: '0.85rem',
            lineHeight: '1.4',
            color: '#182A38',
            fontWeight: '500',
            width: '100%',
            marginBottom: '4px'
          }}
        >
          {narrative}
        </div>

        {/* River Stage Animation Area */}
        <div 
          className="river-stage"
          style={{
            width: '100%',
            height: '170px',
            position: 'relative',
            background: 'linear-gradient(to bottom, #7DD3FC 0%, #0284C7 100%)', // Water
            borderRadius: '20px',
            overflow: 'hidden',
            border: '3px solid #0369A1'
          }}
        >
          {/* Green River Banks */}
          <div className="river-bank bank-left" style={{ left: 0 }} />
          <div className="river-bank bank-right" style={{ right: 0 }} />
          
          {/* Animated Water Ripples */}
          <div className="water-ripple ripple-1" />
          <div className="water-ripple ripple-2" />

          {/* Stepping Stones inside the river */}
          <div 
            className="river-stones-container"
            style={{
              position: 'absolute',
              top: '55%',
              left: '12%',
              right: '12%',
              display: 'flex',
              justifyContent: 'space-around',
              transform: 'translateY(-50%)',
              zIndex: 3
            }}
          >
            {syllables.map((syl, idx) => (
              <div 
                key={idx}
                className="river-stepping-stone"
                style={{
                  width: '60px',
                  height: '42px',
                  background: '#64748B',
                  borderRadius: '50%',
                  border: '2px solid #475569',
                  boxShadow: '0 6px 0 #334155, 0 8px 12px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontFamily: 'Fredoka',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  animation: activeHopIndex === idx && hopState === 'hopping' ? 'stone-compress 0.4s' : 'none'
                }}
              >
                {syl}
              </div>
            ))}
          </div>

          {/* Mila Sprite Hop animation wrapper */}
          <div
            className={`river-mila-avatar ${
              activeHopIndex === -1 
                ? 'pos-left-bank' 
                : activeHopIndex === syllables.length 
                  ? 'pos-right-bank' 
                  : `pos-stone-${activeHopIndex}`
            } ${hopState === 'splash' ? 'is-splash' : ''}`}
            style={{
              position: 'absolute',
              bottom: '15px',
              zIndex: 10,
              transition: 'all 0.5s ease-out'
            }}
          >
            <MilaSprite 
              mood={
                hopState === 'splash' 
                  ? 'thinking' 
                  : hopState === 'hopping' || hopState === 'crossing'
                    ? 'running' 
                    : (showResult && resultGood ? 'celebrating' : 'idle')
              } 
              size={55} 
            />
          </div>

          {/* Splashing visual emoji */}
          {hopState === 'splash' && (
            <div 
              style={{
                position: 'absolute',
                left: '50%',
                top: '60%',
                transform: 'translate(-50%, -50%)',
                fontSize: '2.5rem',
                animation: 'ripple-expand 1s forwards'
              }}
            >
              💦🌊
            </div>
          )}
        </div>

        {/* Letter Stones Syllables split selection */}
        <div className="syllable-prompt" style={{ fontSize: '0.85rem' }}>
          Tap between letters to break the word into <strong>{numTargets} syllables</strong>:
        </div>

        {/* Letters container */}
        <div className="word-river" style={{ padding: '8px', minHeight: '65px' }}>
          {letters.map((letter, i) => (
            <div key={i} className="letter-group">
              <div className="letter-stone" style={{ width: '32px', height: '38px', fontSize: '1.2rem' }}>
                {letter}
              </div>
              {i < letters.length - 1 && (
                <button
                  className={`split-marker ${userSplits.includes(i + 1) ? 'active' : ''} ${
                    showResult ? (correctSplits.includes(i + 1) ? 'correct' : userSplits.includes(i + 1) ? 'wrong' : '') : ''
                  }`}
                  onClick={() => toggleSplit(i + 1)}
                  disabled={showResult}
                  style={{ height: '32px' }}
                  aria-label={`Split at position ${i + 1}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Status board */}
        <div className="syllable-status" style={{ fontSize: '0.82rem' }}>
          You've made <strong>{userSplits.length}</strong> split{userSplits.length !== 1 ? 's' : ''} ({numTargets - 1} needed)
        </div>

        {/* Action button / results */}
        <div style={{ width: '100%', minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {!showResult && (
            <button
              className="btn btn-primary"
              onClick={checkAnswer}
              disabled={userSplits.length === 0}
              style={{ width: '100%', maxWidth: '240px' }}
            >
              Check it! →
            </button>
          )}

          {showResult && (
            <div 
              className={`result-banner ${resultGood ? 'result-good' : 'result-try'}`}
              style={{ padding: '8px 12px', fontSize: '0.9rem', maxWidth: '90%' }}
            >
              {resultGood
                ? `Perfect! ${syllables.join(' · ')} 🎉`
                : `The right way: ${syllables.join(' · ')}`}
            </div>
          )}
          
          {showResult && (
            <div style={{ fontSize: '0.8rem', color: '#182A38', fontWeight: 'bold', marginTop: '4px' }}>
              💬 Mila: "{puppyComment || (resultGood ? '¡Saltas genial! 🐾' : '¡Ay! ¡Al agua patos! Intentemos otra vez 🐾')}"
            </div>
          )}
        </div>
      </div>

      <style>{`
        .river-bank {
          position: absolute;
          width: 14%;
          height: 100%;
          background: #A8D5A0;
          border-top: 4px solid #74B568;
          z-index: 2;
        }
        .bank-left { border-right: 3px solid #6B8E6B; }
        .bank-right { border-left: 3px solid #6B8E6B; }

        .water-ripple {
          position: absolute;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          animation: ripple-move 4s infinite linear;
        }
        .ripple-1 { width: 40px; height: 10px; top: 30%; left: 30%; }
        .ripple-2 { width: 50px; height: 12px; top: 70%; right: 25%; animation-delay: 2s; }

        @keyframes ripple-move {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(60px); opacity: 0; }
        }

        /* Avatar placements */
        .river-mila-avatar.pos-left-bank { left: 4%; bottom: 42px; transform: scale(1.1); }
        .river-mila-avatar.pos-right-bank { right: 4%; bottom: 42px; transform: scale(1.1) scaleX(-1); }
        
        .river-mila-avatar.pos-stone-0 { left: 22%; bottom: 78px; transform: scale(0.8); }
        .river-mila-avatar.pos-stone-1 { left: 45%; bottom: 78px; transform: scale(0.8); }
        .river-mila-avatar.pos-stone-2 { left: 68%; bottom: 78px; transform: scale(0.8); }
        .river-mila-avatar.pos-stone-3 { left: 80%; bottom: 78px; transform: scale(0.8); }

        .river-mila-avatar.is-splash {
          bottom: 22px !important;
          left: 50% !important;
          transform: scale(0.7) rotate(90deg) !important;
          opacity: 0.8;
        }

        @keyframes stone-compress {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.9, 0.7); }
        }

        @keyframes ripple-expand {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
