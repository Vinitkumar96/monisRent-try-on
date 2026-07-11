'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, CloudRain, Waves, Sparkles } from 'lucide-react';

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<'beats' | 'rain' | 'waves'>('beats');
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const synthesizersRef = useRef<{ [key: string]: any }>({});
  
  // Track intervals / schedules
  const musicIntervalId = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio Context on demand (interaction-driven)
  const initAudio = () => {
    if (audioCtxRef.current) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Create procedural sound nodes
      setupRainNode(ctx, masterGain);
      setupWavesNode(ctx, masterGain);
      setupProceduralMusic(ctx, masterGain);
    } catch (e) {
      console.error('Web Audio API not supported in this browser', e);
    }
  };

  // Helper to create Pink Noise for Rain
  const setupRainNode = (ctx: AudioContext, destination: AudioNode) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // rescale
      b6 = white * 0.115926;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(800, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0, ctx.currentTime); // start muted

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(destination);

    rainSource.start(0);

    synthesizersRef.current.rain = { source: rainSource, gain: rainGain, filter: rainFilter };
  };

  // Helper to create LFO-modulated Waves Noise
  const setupWavesNode = (ctx: AudioContext, destination: AudioNode) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const waveSource = ctx.createBufferSource();
    waveSource.buffer = noiseBuffer;
    waveSource.loop = true;

    const waveFilter = ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(350, ctx.currentTime);

    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0, ctx.currentTime); // start muted

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime);

    const lfoGainFilter = ctx.createGain();
    lfoGainFilter.gain.setValueAtTime(150, ctx.currentTime);

    lfo.connect(lfoGainFilter);
    lfoGainFilter.connect(waveFilter.frequency);

    waveSource.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(destination);

    lfo.start(0);
    waveSource.start(0);

    synthesizersRef.current.waves = { source: waveSource, gain: waveGain, filter: waveFilter, lfo };
  };

  // Helper to play chord progressions
  const setupProceduralMusic = (ctx: AudioContext, destination: AudioNode) => {
    const musicGain = ctx.createGain();
    musicGain.gain.setValueAtTime(0, ctx.currentTime); // start muted
    musicGain.connect(destination);

    const lofiFilter = ctx.createBiquadFilter();
    lofiFilter.type = 'lowpass';
    lofiFilter.frequency.setValueAtTime(450, ctx.currentTime);
    lofiFilter.Q.setValueAtTime(1, ctx.currentTime);
    lofiFilter.connect(musicGain);

    synthesizersRef.current.music = { gain: musicGain, filter: lofiFilter };
  };

  const playSynthesizedChord = (ctx: AudioContext, notes: number[], durationSec: number) => {
    if (!synthesizersRef.current.music) return;
    const lofiFilter = synthesizersRef.current.music.filter;

    notes.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const noteGain = ctx.createGain();
      noteGain.connect(lofiFilter);
      
      const now = ctx.currentTime;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.06, now + 1.2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(noteGain);
      osc.start(now);
      osc.stop(now + durationSec);
    });
  };

  useEffect(() => {
    if (isPlaying && track === 'beats' && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const chords = [
        [146.83, 220.00, 277.18, 329.63, 440.00], 
        [138.59, 207.65, 246.94, 311.13, 415.30], 
        [123.47, 185.00, 220.00, 293.66, 369.99], 
        [110.00, 164.81, 220.00, 277.18, 329.63]  
      ];
      
      let chordIndex = 0;
      const playNext = () => {
        if (ctx.state === 'suspended') ctx.resume();
        const currentChord = chords[chordIndex];
        playSynthesizedChord(ctx, currentChord, 5.8);
        chordIndex = (chordIndex + 1) % chords.length;
      };

      playNext();
      const interval = setInterval(playNext, 6000);
      musicIntervalId.current = interval;

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isPlaying, track]);

  useEffect(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    if (isPlaying && ctx.state === 'suspended') {
      ctx.resume();
    }

    const fadeTime = 0.5;
    const now = ctx.currentTime;
    const rain = synthesizersRef.current.rain;
    const waves = synthesizersRef.current.waves;
    const music = synthesizersRef.current.music;

    if (isPlaying && !isMuted) {
      if (track === 'beats') {
        music?.gain.gain.linearRampToValueAtTime(0.7, now + fadeTime);
        rain?.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
        waves?.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
      } else if (track === 'rain') {
        music?.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
        rain?.gain.gain.linearRampToValueAtTime(0.4, now + fadeTime);
        waves?.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
      } else if (track === 'waves') {
        music?.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
        rain?.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
        waves?.gain.gain.linearRampToValueAtTime(0.5, now + fadeTime);
      }
    } else {
      music?.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
      rain?.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
      waves?.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
    }
  }, [isPlaying, track, isMuted]);

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        isMuted ? 0 : volume,
        audioCtxRef.current.currentTime + 0.1
      );
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  const handleTrackChange = (newTrack: 'beats' | 'rain' | 'waves') => {
    initAudio();
    setTrack(newTrack);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 text-zinc-800">
      
      {/* Vinyl Visual Console */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-400 p-0.5 shadow-sm relative flex items-center justify-center ${isPlaying ? 'animate-spin [animation-duration:8s]' : ''}`}>
          <div className="w-full h-full bg-zinc-50 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-zinc-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
            </div>
          </div>
          <div className={`absolute top-0 right-[-3px] w-4 h-6 border-r-2 border-t-2 border-zinc-400 rounded-tr-md origin-top-left transition-transform duration-500 ${isPlaying ? 'rotate-12' : '-rotate-6'}`} />
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-black tracking-wider">
            <Sparkles className="w-3 h-3" />
            Procedural Audio Ambient Room
          </div>
          <h4 className="text-sm font-bold text-zinc-950 mt-0.5">
            {track === 'beats' ? 'Bali Lo-fi Beats' : track === 'rain' ? 'Ubud Rainforest Rain' : 'Canggu Coastal Waves'}
          </h4>
          <p className="text-[10px] text-zinc-400 mt-0.5">Synthesized live via Web Audio API (zero download lag)</p>
        </div>
      </div>

      {/* Control buttons & track selections */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Track selections */}
        <div className="flex bg-zinc-50 p-1 rounded-2xl border border-zinc-200">
          <button
            onClick={() => handleTrackChange('beats')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all duration-300 ${
              track === 'beats'
                ? 'bg-black text-white font-extrabold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Lofi Beats
          </button>
          <button
            onClick={() => handleTrackChange('rain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all duration-300 ${
              track === 'rain'
                ? 'bg-black text-white font-extrabold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Rain
          </button>
          <button
            onClick={() => handleTrackChange('waves')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all duration-300 ${
              track === 'waves'
                ? 'bg-black text-white font-extrabold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            Waves
          </button>
        </div>

        {/* Play/Pause controls */}
        <button
          onClick={togglePlay}
          className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? 'bg-black text-white shadow-md'
              : 'bg-zinc-100 hover:bg-zinc-200 text-black shadow-sm'
          } active:scale-95`}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </button>

        {/* Volume controls */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 h-1 rounded-full appearance-none bg-zinc-200 accent-black cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
}
