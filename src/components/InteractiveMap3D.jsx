import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Billboard, useTexture, CatmullRomLine } from '@react-three/drei';
import { Bone, Footprints, Settings, Trophy, Compass, Layers } from 'lucide-react';
import * as THREE from 'three';
import { walkStops } from '../utils/gameData';
import useSoundEffects from '../hooks/useSoundEffects';
import milaIdle from '../assets/mila_idle.png';
import milaRunning from '../assets/mila_running.png';

// 3D coordinates for the 12 stops (winding through the 3D park coordinates)
const stopCoords3D = [
  new THREE.Vector3(-4, 0.1, 3.5),   // 1. The Front Gate
  new THREE.Vector3(-2.2, 0.1, 2.5),  // 2. Bird Bridge
  new THREE.Vector3(-2.8, 0.1, 0.5),  // 3. Stepping Stones
  new THREE.Vector3(-1.0, 0.1, -0.5), // 4. The Picnic Meadow
  new THREE.Vector3(0.5, 0.1, 1.0),   // 5. Butterfly Path
  // Loop curve
  new THREE.Vector3(-0.2, 0.1, 2.8),  // 6. Treat Stop!
  new THREE.Vector3(1.8, 0.1, 3.2),   // 7. Creek Crossing
  new THREE.Vector3(2.5, 0.1, 1.2),   // 8. The Tall Trees
  new THREE.Vector3(4.2, 0.1, 2.5),   // 9. Sunny Hill
  new THREE.Vector3(3.6, 0.1, 0.2),   // 10. Rocky Trail
  new THREE.Vector3(4.8, 0.1, -1.0),  // 11. The Wildflower Field
  new THREE.Vector3(5.5, 0.1, 0.5),   // 12. Home with Mila
];

// Helper components for 3D elements inside the R3F Canvas

function ParkTerrain() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#A8D5A0" roughness={0.9} />
      </mesh>
      
      {/* Surrounding landscape hills */}
      <mesh position={[-8, -1, -6]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshStandardMaterial color="#74B568" roughness={0.8} />
      </mesh>
      <mesh position={[6, -1, -7]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshStandardMaterial color="#6B8E6B" roughness={0.8} />
      </mesh>
      <mesh position={[2, -2, 7]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshStandardMaterial color="#82C474" roughness={0.8} />
      </mesh>
    </group>
  );
}

function LowPolyTree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
        <meshStandardMaterial color="#5C4033" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <coneGeometry args={[0.5, 1.2, 5]} />
        <meshStandardMaterial color="#4A7C59" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Cloud({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.3, -0.1, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
      <mesh position={[-0.3, -0.1, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

function MilaBillboard({ position, isWalking }) {
  const idleTex = useTexture(milaIdle);
  const runTex = useTexture(milaRunning);
  
  // Wobble / jump effect during walking
  const ref = useRef();
  useFrame((state) => {
    if (ref.current && isWalking) {
      ref.current.position.y = 0.5 + Math.abs(Math.sin(state.clock.getElapsedTime() * 10)) * 0.25;
    } else if (ref.current) {
      ref.current.position.y = 0.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    }
  });

  return (
    <group ref={ref} position={[position.x, 0.5, position.z]}>
      <Billboard>
        <mesh>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial 
            map={isWalking ? runTex : idleTex} 
            transparent 
            alphaTest={0.5} 
          />
        </mesh>
      </Billboard>
    </group>
  );
}

function CameraController({ targetPosition }) {
  const { camera } = useThree();
  useFrame(() => {
    // Smoothly interpolate camera lookAt and position towards Mila
    const desiredCameraPos = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y + 4.5,
      targetPosition.z + 5.5
    );
    camera.position.lerp(desiredCameraPos, 0.05);
  });
  return null;
}

export default function InteractiveMap3D({ currentStop, onContinue, treats, outfit, onOpenSettings, onSwitch2D }) {
  const nextStop = walkStops[currentStop];
  const [milaPos, setMilaPos] = useState(stopCoords3D[Math.max(0, currentStop - 1)]);
  const [isWalking, setIsWalking] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  const { playTick, playBark } = useSoundEffects();

  // WebGL compatibility check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      if (!supported) setWebGlSupported(false);
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  // Animate Mila running along the 3D path coordinates
  useEffect(() => {
    const targetPos = stopCoords3D[Math.min(currentStop, stopCoords3D.length - 1)];
    if (milaPos.equals(targetPos)) return;

    setIsWalking(true);
    const startPos = milaPos.clone();
    const duration = 1800; // 1.8s
    let startTime = null;
    let lastTickProgress = 0;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Linear interpolation in 3D space
      const currentPos = new THREE.Vector3().lerpVectors(startPos, targetPos, ease);
      setMilaPos(currentPos);

      if (progress - lastTickProgress > 0.2) {
        playTick();
        lastTickProgress = progress;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsWalking(false);
        playBark();
      }
    }

    requestAnimationFrame(animate);
  }, [currentStop]);

  // Fallback to 2D Map if WebGL is unsupported
  if (!webGlSupported) {
    return onSwitch2D();
  }

  return (
    <div className="screen map-screen" style={{ padding: '0.5rem 0 0', display: 'flex', flexDirection: 'column' }}>
      {/* Game Statistics Top bar */}
      <header className="game-header" style={{ margin: '0.5rem 1rem 1rem', zIndex: 20 }}>
        <div className="header-stats" style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Bone size={18} color="#A28043" />
            <span className="stat-num">{treats}</span>
          </div>
          <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Footprints size={18} color="#4A6B8A" />
            <span className="stat-num">{Math.min(currentStop + 1, walkStops.length)}/{walkStops.length}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="outfit-badge">{outfit.name}</div>
          <button 
            onClick={() => { playTick(); onSwitch2D(); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', background: 'white', borderRadius: '8px', border: '2px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
            title="Switch to 2D Map"
          >
            <Layers size={18} color="#4A6B8A" />
          </button>
          <button 
            onClick={() => { playTick(); onOpenSettings(); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', background: 'white', borderRadius: '8px', border: '2px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <Settings size={18} color="#64748B" />
          </button>
        </div>
      </header>

      {/* 3D Canvas viewport */}
      <div 
        style={{
          width: '100%',
          flex: 1,
          position: 'relative',
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #C8E1F0 0%, #BAE6FD 100%)'
        }}
      >
        <Canvas shadows camera={{ position: [0, 5, 8], fov: 50 }}>
          <ambientLight intensity={1.2} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.0} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} />
          
          <Suspense fallback={null}>
            {/* Winding 3D Tube Trail */}
            <CatmullRomLine
              points={stopCoords3D}
              closed={false}
              color="#D4BE8D"
              lineWidth={12}
            />
            {/* Dashed trail overlays */}
            <CatmullRomLine
              points={stopCoords3D}
              closed={false}
              color="#FAF6F0"
              lineWidth={3}
              dashed
              dashScale={4}
            />

            {/* Level Stops Nodes */}
            {stopCoords3D.map((pos, idx) => {
              const stop = walkStops[idx];
              const isCompleted = idx < currentStop;
              const isCurrent = idx === currentStop;

              return (
                <group key={idx} position={[pos.x, pos.y, pos.z]}>
                  {/* Stepping stone cylinder */}
                  <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[0.3, 0.35, 0.15, 16]} />
                    <meshStandardMaterial 
                      color={isCompleted ? '#4A7C59' : isCurrent ? '#D4A843' : '#FAF6F0'} 
                      roughness={0.8}
                    />
                  </mesh>
                  {/* Floating floating emoji above node */}
                  <Billboard position={[0, 0.6, 0]}>
                    <mesh>
                      <planeGeometry args={[0.5, 0.5]} />
                      <meshBasicMaterial 
                        transparent 
                        color="#182A38"
                      />
                    </mesh>
                    {/* Floating label */}
                    <group scale={[0.15, 0.15, 0.15]}>
                      {/* Placeholder or visual cue */}
                    </group>
                  </Billboard>
                </group>
              );
            })}

            {/* Landscape elements */}
            <ParkTerrain />
            <LowPolyTree position={[-6, 0, 1]} />
            <LowPolyTree position={[-4.5, 0, -2]} />
            <LowPolyTree position={[-1, 0, 3]} />
            <LowPolyTree position={[1, 0, -3]} />
            <LowPolyTree position={[3, 0, 4]} />
            <LowPolyTree position={[6.5, 0, -1]} />
            
            {/* Drifting 3D clouds */}
            <Cloud position={[-5, 4, -4]} />
            <Cloud position={[3, 4.5, -5]} />
            <Cloud position={[7, 3.8, 2]} />

            {/* Animated Mila Avatar */}
            <MilaBillboard position={milaPos} isWalking={isWalking} />

            {/* Smooth Camera Director */}
            <CameraController targetPosition={milaPos} />
            
            {/* Orbit Interaction */}
            <OrbitControls 
              enableZoom={true} 
              maxPolarAngle={Math.PI / 2.2} 
              minDistance={3} 
              maxDistance={12}
            />
          </Suspense>
        </Canvas>
        
        {/* Helper instructions overlay */}
        <div style={{ position: 'absolute', bottom: '10px', left: '15px', color: '#64748B', fontSize: '0.65rem', pointerEvents: 'none', background: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: '4px' }}>
          🖱️ Orbit with drag • Scroll to zoom
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
            onClick={() => { playTick(); onContinue(); }}
            disabled={isWalking}
          >
            {isWalking ? 'Mila is walking... 🐾' : 'Let\'s Go! 🐾'}
          </button>
        </div>
      )}
    </div>
  );
}
