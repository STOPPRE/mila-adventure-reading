import React, { useState, useEffect } from 'react';
import MilaSprite from '../MilaSprite';

export default function MazeChallenge({ challengeData, onComplete, onSkip, puppyComment }) {
  const { sentence, choices, correct, hint, narrative } = challengeData;
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [runningPath, setRunningPath] = useState(null); // 'left' | 'middle' | 'right'

  // Shuffle choices once on mount
  const [shuffledChoices, setShuffledChoices] = useState([]);
  useEffect(() => {
    setShuffledChoices([...choices].sort(() => Math.random() - 0.5));
  }, [choices]);

  const handleSelect = (choice, index) => {
    if (selected !== null) return;
    
    setSelected(choice);
    // Map index to path name for animation
    const paths = ['left', 'middle', 'right'];
    setRunningPath(paths[index]);

    const isCorrect = choice === correct;
    
    // Trigger sequence: run, show result banner, complete challenge
    setTimeout(() => {
      setShowResult(true);
      setTimeout(() => {
        onComplete(isCorrect);
      }, 2500);
    }, 1200);
  };

  const parts = sentence.split('___');

  return (
    <div className="screen challenge-screen maze-screen">
      <div className="challenge-header">
        <button className="back-btn" onClick={onSkip}>← Exit</button>
        <div className="challenge-badge">📖 Spanish MAZE</div>
      </div>

      <div className="challenge-body">
        {/* Dynamic AI Story Narrative */}
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

        {/* Maze Stage Area */}
        <div 
          className="maze-stage"
          style={{
            width: '100%',
            height: '160px',
            position: 'relative',
            background: 'linear-gradient(to bottom, #A8D5A0 0%, #74B568 100%)',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '3px solid #6B8E6B'
          }}
        >
          {/* Paths backgrounds */}
          <div className="maze-path left-path" />
          <div className="maze-path middle-path" />
          <div className="maze-path right-path" />

          {/* Mila Avatar */}
          <div 
            className={`maze-mila-position ${runningPath ? `run-${runningPath}` : ''}`}
            style={{
              position: 'absolute',
              bottom: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
              transition: 'all 1s ease-in-out',
              zIndex: 10
            }}
          >
            <MilaSprite 
              mood={
                showResult 
                  ? (selected === correct ? 'celebrating' : 'thinking') 
                  : (runningPath ? 'running' : 'idle')
              } 
              size={70} 
            />
          </div>

          {/* Target bones at end of paths */}
          {!selected && (
            <>
              <div className="target-bone" style={{ left: '18%', top: '20px' }}>🍖</div>
              <div className="target-bone" style={{ left: '50%', top: '20px' }}>🍖</div>
              <div className="target-bone" style={{ left: '82%', top: '20px' }}>🍖</div>
            </>
          )}

          {/* Success items */}
          {showResult && selected === correct && (
            <div className="gold-sparkle" style={{
              position: 'absolute',
              top: '25px',
              left: runningPath === 'left' ? '18%' : runningPath === 'middle' ? '50%' : '82%',
              transform: 'translateX(-50%)',
              fontSize: '2rem',
              animation: 'spin-bounce 1s infinite'
            }}>
              🌟
            </div>
          )}
        </div>

        {/* Sentence Puzzle */}
        <div className="cloze-sentence" style={{ padding: '12px', fontSize: '1.25rem', width: '100%' }}>
          {parts[0]}
          <span className={`cloze-blank ${selected ? 'filled' : ''} ${showResult ? (selected === correct ? 'correct' : 'wrong') : ''}`}>
            {selected || '_____'}
          </span>
          {parts[1]}
        </div>

        {/* Interactive Paths Options Buttons */}
        <div 
          className="maze-paths-options"
          style={{
            display: 'flex',
            width: '100%',
            gap: '10px',
            marginTop: '5px'
          }}
        >
          {shuffledChoices.map((choice, i) => {
            const isSelected = selected === choice;
            const isCorrect = showResult && choice === correct;
            const isWrong = showResult && isSelected && choice !== correct;

            return (
              <button
                key={choice}
                disabled={selected !== null}
                onClick={() => handleSelect(choice, i)}
                className={`choice-btn ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px 4px',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#A28043', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {i === 0 ? 'Path 1' : i === 1 ? 'Path 2' : 'Path 3'}
                </span>
                <span style={{ fontWeight: 'bold' }}>{choice}</span>
              </button>
            );
          })}
        </div>

        {/* Hints and Speech Bubble Panel */}
        <div style={{ width: '100%', minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* AI Puppy feedback bubble */}
          {showResult && (
            <div 
              style={{
                background: '#FAF6F0',
                border: '2px solid #FAF6F0',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: '#182A38',
                fontWeight: 'bold',
                textAlign: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                animation: 'slideUp 0.3s ease-out'
              }}
            >
              💬 Mila: "{puppyComment || (selected === correct ? '¡Guau! ¡Excelente! 🐾' : '¡Casi! ¡El próximo intento será mejor! 🐾')}"
            </div>
          )}

          {!selected && !showHint && (
            <button className="hint-btn" onClick={() => setShowHint(true)}>
              💡 Need a hint?
            </button>
          )}
          {showHint && !selected && (
            <div className="hint-box" style={{ width: '100%' }}>{hint}</div>
          )}
        </div>
      </div>

      <style>{`
        .maze-path {
          position: absolute;
          width: 32px;
          background: #C9B584;
          border-left: 2px solid #FAF6F0;
          border-right: 2px solid #FAF6F0;
          bottom: 0;
          height: 120px;
        }
        .left-path {
          left: 18%;
          transform: rotate(-30deg) scaleY(1.2);
          transform-origin: bottom center;
        }
        .middle-path {
          left: 50%;
          transform: translateX(-50%);
        }
        .right-path {
          left: 82%;
          transform: rotate(30deg) scaleY(1.2);
          transform-origin: bottom center;
        }
        
        .target-bone {
          position: absolute;
          font-size: 1.6rem;
          transform: translateX(-50%);
          animation: map-node-pulse 1.5s infinite;
        }

        .maze-mila-position.run-left {
          left: 18%;
          bottom: 90px;
          transform: translateX(-50%) scale(0.65);
        }
        .maze-mila-position.run-middle {
          left: 50%;
          bottom: 95px;
          transform: translateX(-50%) scale(0.65);
        }
        .maze-mila-position.run-right {
          left: 82%;
          bottom: 90px;
          transform: translateX(-50%) scale(0.65);
        }

        @keyframes spin-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          50% { transform: translateX(-50%) translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
