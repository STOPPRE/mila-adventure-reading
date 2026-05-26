import React, { useState, useEffect } from 'react';
import MilaSprite from './MilaSprite';
import { milaOutfits } from '../utils/gameData';

export default function MilaDoghouse({ 
  stopsCompleted, 
  treats, 
  setTreats, 
  equippedItems, 
  setEquippedItems, 
  onBack,
  puppyComment,
  loadingComment
}) {
  const [activeTab, setActiveTab] = useState('dress'); // 'dress' | 'care'
  const [dogMood, setDogMood] = useState('idle');
  const [bubbleText, setBubbleText] = useState('¡Hola! ¡Qué bueno verte en mi casita! 🐾');
  const [particles, setParticles] = useState([]); // heart or bubble particles

  // Unlocked items based on stops completed
  const unlockedItems = [];
  if (stopsCompleted >= 2) unlockedItems.push('collar');
  if (stopsCompleted >= 4) unlockedItems.push('bandana');
  if (stopsCompleted >= 7) unlockedItems.push('backpack');
  if (stopsCompleted >= 10) unlockedItems.push('hat');
  if (stopsCompleted >= 12) unlockedItems.push('medal');

  // Load custom feedback puppy comment when requested
  useEffect(() => {
    if (puppyComment) {
      setBubbleText(puppyComment);
    }
  }, [puppyComment]);

  const toggleEquipped = (item) => {
    if (equippedItems.includes(item)) {
      setEquippedItems(equippedItems.filter(i => i !== item));
    } else {
      setEquippedItems([...equippedItems, item]);
    }
    setDogMood('celebrating');
    spawnParticles('❤️');
    setTimeout(() => setDogMood('idle'), 1000);
  };

  const spawnParticles = (char, count = 8) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      char,
      x: 50 + (Math.random() - 0.5) * 40,
      y: 40 + (Math.random() - 0.5) * 20,
      delay: Math.random() * 0.4,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  };

  const handleFeed = () => {
    if (treats < 1) {
      setBubbleText('¡Oh no! No tienes suficientes huesos... ¡Necesitamos caminar más! 🦴');
      return;
    }
    setTreats(t => t - 1);
    setDogMood('happy'); // Chew pose
    setBubbleText('¡Guau! ¡Qué delicioso! ¡Gracias! 🦴😋');
    spawnParticles('🍖', 6);
    setTimeout(() => setDogMood('idle'), 1500);
  };

  const handlePet = () => {
    setDogMood('celebrating');
    setBubbleText('¡Te quiero, Carolina! ¡Jeje, eso hace cosquillas! 🥰');
    spawnParticles('❤️', 10);
    setTimeout(() => setDogMood('idle'), 1500);
  };

  const handleWash = () => {
    if (treats < 1) {
      setBubbleText('¡Uy, no hay jabón! Consigue más huesos para bañarme. 🧼');
      return;
    }
    setTreats(t => t - 1);
    setDogMood('happy');
    setBubbleText('¡Brr! ¡El agua está fresquita y limpia! 🧼🧼');
    spawnParticles('🫧', 12);
    setTimeout(() => setDogMood('idle'), 2000);
  };

  return (
    <div className="screen doghouse-screen" style={{ background: 'linear-gradient(180deg, #E0F2FE 0%, #FAF6F0 100%)' }}>
      <header className="challenge-header">
        <button className="back-btn" onClick={onBack}>← Back to trail</button>
        <div className="challenge-badge">🏡 Mila's Doghouse</div>
      </header>

      <div className="doghouse-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        {/* Puppy Presentation Area */}
        <div 
          className="doghouse-stage"
          style={{
            position: 'relative',
            width: '100%',
            height: '220px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.4) 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #FAF6F0',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}
        >
          {/* Floating Speech Bubble */}
          <div 
            className="doghouse-bubble"
            style={{
              position: 'absolute',
              top: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              borderRadius: '16px',
              padding: '8px 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#182A38',
              textAlign: 'center',
              border: '2px solid #E2E8F0',
              maxWidth: '85%',
              zIndex: 10
            }}
          >
            {loadingComment ? 'Pensando... 🐾' : bubbleText}
            {/* Bubble arrow */}
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid white'
            }} />
          </div>

          {/* Mila Character */}
          <MilaSprite items={equippedItems} mood={dogMood} size={160} />

          {/* Particle Effects Canvas */}
          {particles.map(p => (
            <span
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                fontSize: '1.5rem',
                animation: 'particle-rise 1.5s forwards ease-out',
                animationDelay: `${p.delay}s`,
                pointerEvents: 'none',
                opacity: 0,
                zIndex: 6
              }}
            >
              {p.char}
            </span>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div 
          className="doghouse-tabs"
          style={{
            display: 'flex',
            width: '100%',
            gap: '8px',
            background: 'rgba(24, 42, 56, 0.05)',
            padding: '4px',
            borderRadius: '14px'
          }}
        >
          <button 
            className={`tab-btn ${activeTab === 'dress' ? 'active' : ''}`}
            onClick={() => setActiveTab('dress')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              background: activeTab === 'dress' ? 'white' : 'transparent',
              color: activeTab === 'dress' ? '#182A38' : '#64748B',
              boxShadow: activeTab === 'dress' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            🧢 Dress Up Chest
          </button>
          <button 
            className={`tab-btn ${activeTab === 'care' ? 'active' : ''}`}
            onClick={() => setActiveTab('care')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              background: activeTab === 'care' ? 'white' : 'transparent',
              color: activeTab === 'care' ? '#182A38' : '#64748B',
              boxShadow: activeTab === 'care' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            🍖 Mila Care
          </button>
        </div>

        {/* Tab Content Display */}
        <div style={{ width: '100%', flex: 1 }}>
          {activeTab === 'dress' ? (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                width: '100%'
              }}
            >
              {['collar', 'bandana', 'backpack', 'hat', 'medal'].map(item => {
                const isUnlocked = unlockedItems.includes(item);
                const isEquipped = equippedItems.includes(item);
                
                return (
                  <button
                    key={item}
                    disabled={!isUnlocked}
                    onClick={() => toggleEquipped(item)}
                    style={{
                      background: 'white',
                      border: `3px solid ${isEquipped ? '#A28043' : '#E2E8F0'}`,
                      borderRadius: '16px',
                      padding: '12px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: isUnlocked ? 1 : 0.5,
                      boxShadow: isEquipped ? '0 4px 10px rgba(162,128,67,0.1)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>
                      {item === 'collar' && '📿'}
                      {item === 'bandana' && '🧣'}
                      {item === 'backpack' && '🎒'}
                      {item === 'hat' && '🤠'}
                      {item === 'medal' && '🥇'}
                    </span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#182A38', textTransform: 'capitalize' }}>
                        {item}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: isUnlocked ? '#4A7C59' : '#94A3B8' }}>
                        {isUnlocked ? (isEquipped ? 'Equipped' : 'Equip') : 'Locked'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Pet Care interactions */
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%',
                background: 'white',
                padding: '16px',
                borderRadius: '20px',
                border: '2px solid #FAF6F0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold', color: '#182A38', fontSize: '0.9rem' }}>My Treat Bag:</span>
                <span style={{ background: '#FAF6F0', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', color: '#A28043', border: '1px solid #E2E8F0' }}>
                  🦴 {treats} Treats
                </span>
              </div>

              {/* Action buttons */}
              <button 
                className="btn btn-secondary" 
                onClick={handleFeed}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}
              >
                <span>🍖 Feed Mila a Treat</span>
                <span style={{ background: 'rgba(162,128,67,0.1)', padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: '#A28043' }}>
                  Costs 1 🦴
                </span>
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={handleWash}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}
              >
                <span>🫧 Give Mila a Bubble Bath</span>
                <span style={{ background: 'rgba(162,128,67,0.1)', padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: '#A28043' }}>
                  Costs 1 🦴
                </span>
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={handlePet}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}
              >
                <span>❤️ Pet Mila</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4A7C59' }}>
                  FREE
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes particle-rise {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-80px) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
