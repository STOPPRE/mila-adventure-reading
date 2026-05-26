import { useState, useEffect, useCallback } from 'react';

// Web Audio API Synthesizer Engine
// Generates clean, playful chiptune/retro game sound effects on-the-fly.

export default function useSoundEffects() {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem('MILA_SOUND_MUTED') === 'true';
    } catch {
      return false;
    }
  });

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const newVal = !prev;
      try {
        localStorage.setItem('MILA_SOUND_MUTED', String(newVal));
      } catch {}
      return newVal;
    });
  }, []);

  // Lazy-load audio context only after user interaction to satisfy browser requirements
  const getAudioContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    return new AudioContextClass();
  };

  /**
   * Play bubble pop sound (rapid slide up)
   */
  const playPop = useCallback(() => {
    if (muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    // Rapid frequency modulation upwards
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }, [muted]);

  /**
   * Play wood/stone tick (short transient)
   */
  const playTick = useCallback(() => {
    if (muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, [muted]);

  /**
   * Play puppy bark (synthesized noise + pitch envelope)
   */
  const playBark = useCallback(() => {
    if (muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    // Harmonized barking oscillators
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(220, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(225, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(85, ctx.currentTime + 0.12);

    // Apply a bandpass filter to give it a "woof" body shape
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 350;
    filter.Q.value = 1.2;

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.16);
    osc2.stop(ctx.currentTime + 0.16);
  }, [muted]);

  /**
   * Play success cheer chime (playful chiptune major triad arpeggio)
   */
  const playCheer = useCallback(() => {
    if (muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.35);
    });
  }, [muted]);

  /**
   * Play water splash (noise synthesis)
   */
  const playSplash = useCallback(() => {
    if (muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Synthesize noise by creating an AudioBuffer with random data
    const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to sweep frequencies downward (simulating water splash)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseNode.start();
    noiseNode.stop(ctx.currentTime + 0.5);
  }, [muted]);

  /**
   * Play incorrect error buzzer (dual low dissonance tone)
   */
  const playIncorrect = useCallback(() => {
    if (muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.value = 130; // C3
    
    osc2.type = 'sawtooth';
    osc2.frequency.value = 135; // Dissonant beating

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
  }, [muted]);

  return {
    muted,
    toggleMute,
    playPop,
    playTick,
    playBark,
    playCheer,
    playSplash,
    playIncorrect
  };
}
