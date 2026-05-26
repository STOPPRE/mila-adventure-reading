import React, { useState, useEffect } from 'react';
import { Languages, Trophy, HelpCircle } from 'lucide-react';
import MilaSprite from '../MilaSprite';
import useSoundEffects from '../../hooks/useSoundEffects';

const BALLOON_COLORS = [
  'linear-gradient(to bottom, #EF4444, #B91C1C)', // Red
  'linear-gradient(to bottom, #3B82F6, #1D4ED8)', // Blue
  'linear-gradient(to bottom, #10B981, #047857)', // Green
  'linear-gradient(to bottom, #F59E0B, #B45309)', // Orange
  'linear-gradient(to bottom, #8B5CF6, #6D28D9)'  // Purple
];

export default function BalloonChallenge({ challengeData, onComplete, onSkip, puppyComment }) {
  const { spanish, correct, distractors, narrative } = challengeData;
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [poppedIndex, setPoppedIndex] = useState(null);

  // Sound Engine
  const { playPop, playCheer, playIncorrect, playTick } = useSoundEffects();

  useEffect(() => {
    const choicesList = [correct, ...distractors];
    setShuffledChoices(choicesList.sort(() => Math.random() - 0.5));
  }, [correct, distractors]);

  const handlePop = (choice, index) => {
    if (selected !== null) return;
    
    playPop(); // Pop sound effect!
    setSelected(choice);
    setPoppedIndex(index);
    const isCorrect = choice === correct;

    setTimeout(() => {
      setShowResult(true);
      if (isCorrect) {
        playCheer();
      } else {
        playIncorrect();
      }
      setTimeout(() => {
        onComplete(isCorrect);
      }, 2500);
    }, 800);
  };

  return (
    <div className="screen challenge-screen balloon-screen">
      <div className="challenge-header">
        <button className="back-btn" onClick={() => { playTick(); onSkip(); }}>← Exit</button>
        <div className="challenge-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Languages size={14} color="#C4A456" /> Cognates Match
        </div>
      </div>

      <div className="challenge-body">
        {/* Story Intro */}
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

        {/* Word Display Panel */}
        <div 
          className="cognate-word-card" 
          style={{ 
            padding: '12px 16px', 
            background: '#FAF6F0', 
            border: '2px solid #E2E8F0',
            borderRadius: '16px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <div className="cognate-flag" style={{ fontSize: '0.7rem' }}>🇪🇸 Spanish Word</div>
          <div className="cognate-word" style={{ fontSize: '1.8rem', color: '#182A38', fontWeight: 'bold' }}>{spanish}</div>
        </div>

        {/* Balloon Floating Stage */}
        <div 
          className="balloon-stage"
          style={{
            width: '100%',
            height: '180px',
            position: 'relative',
            background: 'linear-gradient(to bottom, #BAE6FD 0%, #E0F2FE 100%)', // Sky background
            borderRadius: '20px',
            overflow: 'hidden',
            border: '3px solid #7DD3FC',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 10px'
          }}
        >
          {/* Cloud decorations */}
          <div className="cloud-small" style={{ left: '10%', top: '20%' }}>☁️</div>
          <div className="cloud-small" style={{ right: '15%', top: '15%' }}>☁️</div>

          {/* Mila sitting on the ground */}
          <div 
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10
            }}
          >
            <MilaSprite 
              mood={
                showResult 
                  ? (selected === correct ? 'celebrating' : 'thinking') 
                  : 'idle'
              } 
              size={65} 
            />
          </div>

          {/* Render Balloon objects */}
          {shuffledChoices.map((choice, idx) => {
            const isPopped = poppedIndex === idx;
            const isSelected = selected === choice;
            const isCorrect = choice === correct;

            return (
              <div 
                key={choice}
                style={{
                  position: 'relative',
                  height: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  animation: !selected ? `balloon-float ${2 + (idx % 2) * 0.5}s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${idx * 0.2}s`,
                  zIndex: 5,
                  opacity: isPopped && showResult && !isCorrect ? 0.3 : 1,
                  transform: isPopped && showResult && !isCorrect ? 'scale(0.8)' : 'none',
                  transition: 'all 0.5s'
                }}
              >
                {/* Balloon shape */}
                {!isPopped ? (
                  <button
                    disabled={selected !== null}
                    onClick={() => handlePop(choice, idx)}
                    style={{
                      width: '64px',
                      height: '76px',
                      background: BALLOON_COLORS[idx % BALLOON_COLORS.length],
                      borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                      boxShadow: 'inset -6px -6px 12px rgba(0,0,0,0.15), 0 6px 10px rgba(0,0,0,0.1)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontFamily: 'Fredoka',
                      fontWeight: 'bold',
                      fontSize: choice.length > 8 ? '0.7rem' : '0.82rem',
                      padding: '4px',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    {choice}
                    {/* Balloon highlight */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '12px',
                      width: '10px',
                      height: '16px',
                      background: 'rgba(255,255,255,0.4)',
                      borderRadius: '50%'
                    }} />
                    {/* Knot */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderBottom: '6px solid rgba(0,0,0,0.3)'
                    }} />
                  </button>
                ) : (
                  /* Pop explosion particle */
                  <div style={{
                    width: '64px',
                    height: '76px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    animation: 'pop-scale 0.5s forwards'
                  }}>
                    {isCorrect ? '💥🎉' : '💨'}
                  </div>
                )}
                {/* String */}
                <div style={{
                  width: '2px',
                  height: '40px',
                  background: 'rgba(0,0,0,0.2)',
                  marginTop: '4px'
                }} />
              </div>
            );
          })}
        </div>

        {/* Hint and feedback area */}
        <div style={{ width: '100%', minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {showResult && (
            <div 
              style={{
                background: selected === correct ? '#D4EDDA' : '#FFF3CD',
                border: `2px solid ${selected === correct ? '#C3E6CB' : '#FFEEBA'}`,
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: selected === correct ? '#155724' : '#856404',
                fontWeight: 'bold',
                textAlign: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                animation: 'slideUp 0.3s ease-out',
                maxWidth: '90%'
              }}
            >
              💬 {selected === correct 
                ? `Mila: "${puppyComment || '¡Excelente! "'+spanish+'" and "'+correct+'" are word twins! 🐾'}"`
                : `Mila: "${puppyComment || 'Oh, "'+spanish+'" means "'+correct+'" in English. 🐾'}"`
              }
            </div>
          )}

          {!selected && (
            <div style={{ fontSize: '0.85rem', color: '#4A6B8A', fontWeight: 600, textAlign: 'center' }}>
              Tap the balloon with the English Word Twin (cognate)!
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cloud-small {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.4;
        }

        @keyframes balloon-float {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }

        @keyframes pop-scale {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
