import React, { useEffect, useState, useRef } from 'react';
import MilaSprite from './MilaSprite';
import { walkStops } from '../utils/gameData';

// Normalized coordinates (percentage %) for the 12 stops to form a winding S-curve path
const stopCoords = [
  { x: 8,   y: 75 },  // 1. The Front Gate
  { x: 22,  y: 60 },  // 2. Bird Bridge
  { x: 18,  y: 35 },  // 3. Stepping Stones
  { x: 34,  y: 25 },  // 4. The Picnic Meadow
  { x: 48,  y: 42 },  // 5. Butterfly Path
  { x: 42,  y: 70 },  // 6. Treat Stop!
  { x: 58,  y: 78 },  // 7. Creek Crossing
  { x: 70,  y: 55 },  // 8. The Tall Trees
  { x: 84,  y: 68 },  // 9. Sunny Hill
  { x: 78,  y: 32 },  // 10. Rocky Trail
  { x: 90,  y: 22 },  // 11. The Wildflower Field
  { x: 95,  y: 50 },  // 12. Home with Mila
];

export default function InteractiveMap({ currentStop, onContinue, treats, outfit }) {
  const nextStop = walkStops[currentStop];
  const [milaPos, setMilaPos] = useState(stopCoords[Math.max(0, currentStop - 1)]);
  const [isWalking, setIsWalking] = useState(false);
  const containerRef = useRef(null);

  // Animate Mila's movement when currentStop changes
  useEffect(() => {
    const targetPos = stopCoords[Math.min(currentStop, stopCoords.length - 1)];
    
    // If it's the very start or continuing from saved, position her immediately
    if (milaPos.x === targetPos.x && milaPos.y === targetPos.y) return;

    setIsWalking(true);
    
    // Simulate walking animation delay
    const startX = milaPos.x;
    const startY = milaPos.y;
    const dx = targetPos.x - startX;
    const dy = targetPos.y - startY;
    
    let startTime = null;
    const duration = 1800; // 1.8 seconds walk

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeInOutQuad)
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setMilaPos({
        x: startX + dx * ease,
        y: startY + dy * ease
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsWalking(false);
      }
    }

    requestAnimationFrame(animate);

    // Scroll map container to keep Mila in view
    if (containerRef.current) {
      const containerWidth = containerRef.current.scrollWidth;
      const targetScroll = (targetPos.x / 100) * containerWidth - window.innerWidth / 2;
      containerRef.current.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  }, [currentStop]);

  // Generate SVG path coordinate string for drawing the winding path line
  const pathD = stopCoords.reduce((acc, coord, idx) => {
    return acc + `${idx === 0 ? 'M' : 'L'} ${(coord.x / 100) * 1200} ${(coord.y / 100) * 400} `;
  }, '');

  return (
    <div className="screen map-screen" style={{ padding: '0.5rem 0 0' }}>
      {/* Game Statistics Top bar */}
      <header className="game-header" style={{ margin: '0.5rem 1rem 1rem' }}>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-emoji">🦴</span>
            <span className="stat-num">{treats}</span>
          </div>
          <div className="stat">
            <span className="stat-emoji">🐾</span>
            <span className="stat-num">{Math.min(currentStop + 1, walkStops.length)}/{walkStops.length}</span>
          </div>
        </div>
        <div className="outfit-badge">{outfit.name}</div>
      </header>

      {/* Parallax Scrolling Map Area */}
      <div 
        className="map-scroll-container" 
        ref={containerRef}
        style={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          flex: 1,
          background: 'linear-gradient(to bottom, #C8E1F0 0%, #D8ECC8 60%, #A8D5A0 100%)',
          borderRadius: '24px 24px 0 0',
          boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Map Inner Content */}
        <div 
          className="map-world" 
          style={{
            width: '1200px', // Horizontal stretch
            height: '400px',
            position: 'relative',
            flexShrink: 0,
            overflow: 'hidden'
          }}
        >
          {/* Parallax background decor */}
          <div className="map-decor-cloud" style={{ top: '15%', left: '10%' }}>☁️</div>
          <div className="map-decor-cloud" style={{ top: '8%', left: '45%' }}>☁️</div>
          <div className="map-decor-cloud" style={{ top: '20%', left: '75%' }}>☁️</div>
          
          <div className="map-decor-tree" style={{ top: '55%', left: '15%' }}>🌳</div>
          <div className="map-decor-tree" style={{ top: '40%', left: '35%' }}>🌲</div>
          <div className="map-decor-tree" style={{ top: '65%', left: '55%' }}>🌳</div>
          <div className="map-decor-tree" style={{ top: '22%', left: '85%' }}>🌲</div>
          
          {/* Path Drawing */}
          <svg 
            width="1200" 
            height="400" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {/* Outline Path */}
            <path 
              d={pathD} 
              fill="none" 
              stroke="#D4BE8D" 
              strokeWidth="20" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Center Dashed Dirt Trail */}
            <path 
              d={pathD} 
              fill="none" 
              stroke="#FAF6F0" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeDasharray="12 12" 
            />
          </svg>

          {/* Level Stop Nodes */}
          {walkStops.map((stop, i) => {
            const coord = stopCoords[i];
            const isCompleted = i < currentStop;
            const isCurrent = i === currentStop;
            
            return (
              <div
                key={stop.num}
                className={`map-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div 
                  className="node-dot"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: isCompleted ? '#4A7C59' : isCurrent ? '#D4A843' : '#FAF6F0',
                    border: '3px solid #7A5F2F',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>
                    {isCompleted ? '✅' : stop.emoji}
                  </span>
                </div>
                <div 
                  className="node-label"
                  style={{
                    background: 'rgba(24, 42, 56, 0.85)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {stop.name}
                </div>
              </div>
            );
          })}

          {/* Mila Animated Character Avatar on Map */}
          <div
            style={{
              position: 'absolute',
              left: `${milaPos.x}%`,
              top: `${milaPos.y}%`,
              transform: `translate(-50%, -70%) scale(${isWalking ? 1 : 0.9})`,
              transition: 'transform 0.2s',
              zIndex: 3,
              pointerEvents: 'none'
            }}
          >
            <MilaSprite 
              items={outfit.items} 
              mood={isWalking ? 'running' : 'idle'} 
              size={65} 
            />
          </div>
        </div>
      </div>

      {/* Floating Next Level Dashboard Panel */}
      {nextStop && (
        <div 
          className="map-action-card"
          style={{
            background: 'white',
            borderRadius: '24px 24px 0 0',
            padding: '1.25rem 1.5rem env(safe-area-inset-bottom)',
            boxShadow: '0 -8px 24px rgba(0,0,0,0.1)',
            zIndex: 10,
            textAlign: 'center',
            borderTop: '3px solid #A28043'
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#A28043', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Next Stop
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#182A38', margin: '0 0 0.5rem' }}>
            {nextStop.emoji} {nextStop.name}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#4A6B8A', margin: '0 0 1.25rem', fontWeight: 500 }}>
            {nextStop.mode === 'cloze' && '📖 Spanish MAZE Reading challenge'}
            {nextStop.mode === 'cognate' && '🔤 English-Spanish Word twins'}
            {nextStop.mode === 'syllable' && '🪨 River crossing Syllable hop'}
            {nextStop.mode === 'treat' && '🦴 Treat stop! Reward time'}
            {nextStop.mode === 'finish' && '🏡 Mila reaches home!'}
          </p>
          <button 
            className="btn btn-primary btn-large" 
            style={{ width: '100%', maxWidth: '320px' }}
            onClick={onContinue}
            disabled={isWalking}
          >
            {isWalking ? 'Mila is walking... 🐾' : 'Let\'s Go! 🐾'}
          </button>
        </div>
      )}
      
      <style>{`
        .map-scroll-container::-webkit-scrollbar {
          height: 6px;
        }
        .map-scroll-container::-webkit-scrollbar-thumb {
          background: #C9B584;
          border-radius: 3px;
        }
        .map-decor-cloud {
          position: absolute;
          font-size: 2.2rem;
          opacity: 0.5;
        }
        .map-decor-tree {
          position: absolute;
          font-size: 1.8rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        .map-node.active .node-dot {
          animation: map-node-pulse 1.5s infinite;
        }
        @keyframes map-node-pulse {
          0% { box-shadow: 0 0 0 0 rgba(212, 168, 67, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(212, 168, 67, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 168, 67, 0); }
        }
      `}</style>
    </div>
  );
}
