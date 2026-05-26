import React from 'react';
import milaIdle from '../assets/mila_idle.png';
import milaRunning from '../assets/mila_running.png';
import milaCelebrating from '../assets/mila_celebrating.png';
import milaSleeping from '../assets/mila_sleeping.png';

/**
 * MilaSprite - Displays the animated cartoon puppy Mila and layers
 * the equipped accessories (collar, bandana, backpack, hat, medal) on top.
 * 
 * @param {Array} items - List of equipped outfit items ('collar', 'bandana', 'backpack', 'hat', 'medal')
 * @param {String} mood - 'idle' | 'running' | 'celebrating' | 'sleeping'
 * @param {Number} size - Width/height of the sprite container in pixels
 */
export default function MilaSprite({ items = [], mood = 'idle', size = 180 }) {
  // Map moods to the correct illustration image
  let spriteImg = milaIdle;
  let animateClass = 'mila-animate-idle';

  if (mood === 'running' || mood === 'walk') {
    spriteImg = milaRunning;
    animateClass = 'mila-animate-run';
  } else if (mood === 'celebrating' || mood === 'happy') {
    spriteImg = milaCelebrating;
    animateClass = 'mila-animate-celebrate';
  } else if (mood === 'sleeping') {
    spriteImg = milaSleeping;
    animateClass = 'mila-animate-sleep';
  }

  // Accessories placement calculations (percentages relative to sprite box)
  // Placement shifts slightly based on the sprite's posture (idle, running, celebrating, sleeping)
  const isIdle = spriteImg === milaIdle;
  const isRunning = spriteImg === milaRunning;
  const isCelebrating = spriteImg === milaCelebrating;
  const isSleeping = spriteImg === milaSleeping;

  // Render accessories relative overlays
  return (
    <div
      className={`mila-sprite-container ${animateClass}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* Base Mila Image */}
      <img
        src={spriteImg}
        alt="Mila the puppy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />

      {/* Outfit Accessories overlay */}
      {!isSleeping && (
        <svg
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          {/* Hat (if equipped) */}
          {items.includes('hat') && (
            <g transform={
              isCelebrating
                ? 'translate(6, -2) rotate(5 100 40)'
                : isRunning
                  ? 'translate(28, 4) rotate(15 100 40)'
                  : 'translate(0, 0)'
            }>
              {/* Straw or adventurer hat */}
              <path d="M 60 52 Q 100 56 140 52" fill="none" stroke="#7A5F2F" strokeWidth="6" strokeLinecap="round" />
              <path d="M 68 52 Q 100 22 132 52 Z" fill="#A28043" stroke="#7A5F2F" strokeWidth="3" />
              <rect x="76" y="47" width="48" height="5" fill="#C93B3B" rx="1.5" />
            </g>
          )}

          {/* Collar (if equipped) */}
          {items.includes('collar') && !items.includes('bandana') && (
            <g transform={
              isCelebrating
                ? 'translate(8, 20)'
                : isRunning
                  ? 'translate(36, 26) rotate(10 100 110)'
                  : 'translate(0, 0)'
            }>
              {/* Cute red collar */}
              <ellipse cx="100" cy="108" rx="26" ry="6" fill="#C93B3B" stroke="#8A2323" strokeWidth="2" />
              <circle cx="100" cy="113" r="5" fill="#D4A843" stroke="#A28043" strokeWidth="1" />
            </g>
          )}

          {/* Bandana (if equipped, goes over collar) */}
          {items.includes('bandana') && (
            <g transform={
              isCelebrating
                ? 'translate(10, 22)'
                : isRunning
                  ? 'translate(38, 26) rotate(10 100 110)'
                  : 'translate(0, 0)'
            }>
              {/* Playful polka-dot red bandana */}
              <path d="M 76 104 L 124 104 L 126 112 L 100 126 L 74 112 Z" fill="#A63D40" stroke="#6B2729" strokeWidth="2" />
              <circle cx="88" cy="110" r="2.5" fill="#FAF6F0" />
              <circle cx="100" cy="116" r="2.5" fill="#FAF6F0" />
              <circle cx="112" cy="110" r="2.5" fill="#FAF6F0" />
            </g>
          )}

          {/* Backpack (if equipped) */}
          {items.includes('backpack') && (
            <g transform={
              isCelebrating
                ? 'translate(-38, 36) rotate(-10 60 120)'
                : isRunning
                  ? 'translate(-42, 28) rotate(-15 60 120)'
                  : 'translate(0, 0)'
            }>
              {/* Hiking backpack peeking on the left/back */}
              <rect x="52" y="105" width="22" height="34" rx="5" fill="#3B7080" stroke="#254752" strokeWidth="2" />
              <path d="M 52 115 L 74 115" stroke="#254752" strokeWidth="2" />
              <path d="M 63 105 L 63 139" stroke="#254752" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>
          )}

          {/* Medal (if won) */}
          {items.includes('medal') && (
            <g transform={
              isCelebrating
                ? 'translate(10, 32)'
                : isRunning
                  ? 'translate(36, 32) rotate(10 100 125)'
                  : 'translate(0, 0)'
            }>
              {/* Shining gold star medal */}
              <path d="M 94 116 L 100 134 M 106 116 L 100 134" stroke="#C93B3B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="138" r="10" fill="#D4A843" stroke="#A28043" strokeWidth="2" />
              <polygon points="100,132 102,136 106,137 103,140 104,144 100,142 96,144 97,140 94,137 98,136" fill="white" />
            </g>
          )}
        </svg>
      )}

      {/* Styled animation wrappers inside css tags */}
      <style>{`
        .mila-sprite-container {
          transition: transform 0.3s ease;
        }
        
        .mila-animate-idle {
          animation: mila-bob 2.5s ease-in-out infinite;
        }

        .mila-animate-run {
          animation: mila-run-bounce 0.6s linear infinite;
        }

        .mila-animate-celebrate {
          animation: mila-jump 0.8s ease-in-out infinite;
        }

        .mila-animate-sleep {
          animation: mila-sleep-breath 3s ease-in-out infinite;
        }

        @keyframes mila-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes mila-run-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-2deg); }
          75% { transform: translateY(-4px) rotate(2deg); }
        }

        @keyframes mila-jump {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-25px) scaleY(1.05); }
        }

        @keyframes mila-sleep-breath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}
