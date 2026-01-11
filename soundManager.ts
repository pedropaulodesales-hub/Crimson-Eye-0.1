
export class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicNodes: AudioNode[] = [];
  private currentMusicZone: number = -1;
  private sequencerTimer: number | null = null;
  private sequencerTimerDrip: number | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(e => console.error("AudioContext resume failed", e));
    }
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.3;
  }

  playTownTheme() {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const TOWN_ZONE = 100;
    if (this.currentMusicZone === TOWN_ZONE) return;

    this.stopMusic();
    this.currentMusicZone = TOWN_ZONE;

    const t = this.ctx.currentTime;
    const themeGain = this.ctx.createGain();
    themeGain.gain.setValueAtTime(0, t);
    themeGain.gain.linearRampToValueAtTime(0.5, t + 8); // Very slow fade in
    themeGain.connect(this.masterGain);
    this.musicNodes.push(themeGain);

    // --- Melancholic Pad ---
    const padFreqs = [55.00, 82.41]; // A1, E2
    padFreqs.forEach(f => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f;
        osc.detune.value = (Math.random() - 0.5) * 8;
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 250;
        const gain = this.ctx!.createGain();
        gain.gain.value = 0.15;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(themeGain);
        osc.start(t);
        this.musicNodes.push(osc, filter, gain);
    });

    // --- Arpeggio Sequencer ---
    const scale = [261.63, 392.00, 440.00, 329.63]; // C4, G4, A4, E4
    let noteIndex = 0;

    const playNote = () => {
        if (!this.ctx || this.currentMusicZone !== TOWN_ZONE) return;
        
        const now = this.ctx.currentTime;
        const freq = scale[noteIndex % scale.length];
        noteIndex++;

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const env = this.ctx.createGain();
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(0.2, now + 0.1);
        env.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        const panner = this.ctx.createStereoPanner();
        panner.pan.value = (Math.random() - 0.5) * 1.5;

        osc.connect(env);
        env.connect(panner);
        panner.connect(themeGain);

        osc.start(now);
        osc.stop(now + 2);

        this.musicNodes.push(osc, env, panner);

        this.sequencerTimer = window.setTimeout(playNote, 800 + Math.random() * 400);
    };

    playNote();
  }

  playLoreAmbience() {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    // Zone 0: Haunted Intro (Title/Lore/Creation)
    const LORE_ZONE = 0;
    if (this.currentMusicZone === LORE_ZONE) return;

    this.stopMusic();
    this.currentMusicZone = LORE_ZONE;

    const t = this.ctx.currentTime;
    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0, t);
    mainGain.gain.linearRampToValueAtTime(0.6, t + 4);
    mainGain.connect(this.masterGain);
    this.musicNodes.push(mainGain);

    // --- LAYER 1: GHOSTLY ORGAN (The Presence) ---
    const freqs = [55.00, 61.74, 82.41]; // A1, B1 (flatish), E2 - Dissonant/Dark
    freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f;
        osc.detune.value = (Math.random() - 0.5) * 15; 

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300; 

        // "Breathing" volume effect via filter modulation
        const breathLfo = this.ctx!.createOscillator();
        breathLfo.frequency.value = 0.15 + (i * 0.05); // Polyrhythmic breathing
        const breathGain = this.ctx!.createGain();
        breathGain.gain.value = 50; 
        breathLfo.connect(breathGain);
        breathGain.connect(filter.frequency);

        const oscGain = this.ctx!.createGain();
        oscGain.gain.value = 0.12; // Base volume

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(mainGain);

        osc.start(t);
        breathLfo.start(t);
        this.musicNodes.push(osc, filter, breathLfo, breathGain, oscGain);
    });

    // --- LAYER 2: PULSATING HEART (The Core) ---
    const triggerHeartbeat = () => {
        if (this.currentMusicZone !== LORE_ZONE || !this.ctx) return;
        const now = this.ctx.currentTime;

        const playThump = (startTime: number, volume: number) => {
            // Main deep thump tone - Deeper & Longer
            const thumpOsc = this.ctx!.createOscillator();
            thumpOsc.type = 'sine';
            thumpOsc.frequency.setValueAtTime(70, startTime);
            thumpOsc.frequency.exponentialRampToValueAtTime(25, startTime + 0.35);

            const thumpGain = this.ctx!.createGain();
            thumpGain.gain.setValueAtTime(0, startTime);
            thumpGain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
            thumpGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

            thumpOsc.connect(thumpGain);
            thumpGain.connect(mainGain);
            thumpOsc.start(startTime);
            thumpOsc.stop(startTime + 0.5);

            // Squelch Layer 1 (Main wet sound)
            const noiseBuffer = this.createPinkNoise();
            if (!noiseBuffer) return;
            const noise = this.ctx!.createBufferSource();
            noise.buffer = noiseBuffer;
            
            const filter = this.ctx!.createBiquadFilter();
            filter.type = 'lowpass';
            filter.Q.value = 6;
            filter.frequency.setValueAtTime(500, startTime);
            filter.frequency.exponentialRampToValueAtTime(70, startTime + 0.25);

            const env = this.ctx!.createGain();
            env.gain.setValueAtTime(0, startTime);
            env.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.04);
            env.gain.exponentialRampToValueAtTime(0.01, startTime + 0.45);

            noise.connect(filter);
            filter.connect(env);
            env.connect(mainGain);
            noise.start(startTime);
            noise.stop(startTime + 0.5);
            
            // Squelch Layer 2 (Delayed "echo" for more fluid feel)
            const noise2 = this.ctx!.createBufferSource();
            noise2.buffer = noiseBuffer;
            const filter2 = this.ctx!.createBiquadFilter();
            filter2.type = 'bandpass';
            filter2.Q.value = 3;
            filter2.frequency.setValueAtTime(300, startTime + 0.1);
            filter2.frequency.exponentialRampToValueAtTime(60, startTime + 0.4);

            const env2 = this.ctx!.createGain();
            env2.gain.setValueAtTime(0, startTime + 0.1);
            env2.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.15);
            env2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

            noise2.connect(filter2);
            filter2.connect(env2);
            env2.connect(mainGain);
            noise2.start(startTime + 0.1);
            noise2.stop(startTime + 0.6);
        };

        // Slower "lub-dub" rhythm
        playThump(now, 0.7); // Main beat
        playThump(now + 0.5, 0.45); // Softer second beat with more delay

        // Slower interval between heartbeats
        this.sequencerTimer = window.setTimeout(triggerHeartbeat, 4800 + Math.random() * 2000);
    };
    triggerHeartbeat();
  }

  stopMusic() {
    // Stop oscillators and nodes
    this.musicNodes.forEach(node => {
      try {
        node.disconnect();
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
          node.stop();
        }
      } catch (e) {}
    });
    this.musicNodes = [];
    
    // Stop sequencers
    if (this.sequencerTimer) {
        window.clearTimeout(this.sequencerTimer);
        this.sequencerTimer = null;
    }
    if (this.sequencerTimerDrip) {
        window.clearTimeout(this.sequencerTimerDrip);
        this.sequencerTimerDrip = null;
    }
    
    this.currentMusicZone = -1;
  }

  // Helper to generate Pink Noise for Wind
  private createPinkNoise() {
      if (!this.ctx) return null;
      const bufferSize = this.ctx.sampleRate * 4; // 4 seconds loop
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          data[i] *= 0.11; 
          b6 = white * 0.115926;
      }
      return buffer;
  }

  playDungeonTheme(floor: number) {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Define Zones
    // Zone 1: Floors 1-5 (Index 0-4)
    const zone = floor < 5 ? 1 : 2;

    // If music for this zone is already playing, do nothing
    if (this.currentMusicZone === zone) return;

    this.stopMusic();
    this.currentMusicZone = zone;

    const t = this.ctx.currentTime;

    const musicGain = this.ctx.createGain();
    musicGain.gain.value = 0;
    musicGain.gain.linearRampToValueAtTime(0.8, t + 6); // Slow fade in
    musicGain.connect(this.masterGain);
    this.musicNodes.push(musicGain);

    // --- LAYER 1: THE HOWLING WIND ---
    const windBuffer = this.createPinkNoise();
    if (windBuffer) {
        const windSource = this.ctx.createBufferSource();
        windSource.buffer = windBuffer;
        windSource.loop = true;

        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.Q.value = 7; // Increased Q for more resonance (howl)
        windFilter.frequency.setValueAtTime(300, t);
        
        // Modulate wind frequency for "gusts"
        const windLFO = this.ctx.createOscillator();
        windLFO.type = 'sine';
        windLFO.frequency.value = 0.12; // Slightly faster, more active gusts
        
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 250; // Wider sweep range for more dramatic howls

        windLFO.connect(lfoGain);
        lfoGain.connect(windFilter.frequency);

        windSource.connect(windFilter);
        windFilter.connect(musicGain);
        
        windSource.start(t);
        windLFO.start(t);
        
        this.musicNodes.push(windSource, windFilter, windLFO, lfoGain);
    }

    // --- LAYER 2: ISOLATION DRONE ---
    const droneOsc = this.ctx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.value = 60; // Low hum
    
    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.1;
    
    droneOsc.connect(droneGain);
    droneGain.connect(musicGain);
    droneOsc.start(t);
    this.musicNodes.push(droneOsc, droneGain);

    // --- LAYER 3: TEETH GRINDING ---
    const playGrind = () => {
        if (!this.ctx || this.currentMusicZone !== zone) return;
        const now = this.ctx.currentTime;

        const noise = this.createNoiseSource(); // white noise
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 40; // High Q for a resonant, scraping texture
        filter.frequency.setValueAtTime(1500 + Math.random() * 500, now); // Start at a high frequency
        filter.frequency.exponentialRampToValueAtTime(1000, now + 0.15); // Scrape down slightly

        const env = this.ctx.createGain();
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(0.08, now + 0.01); // Very fast attack
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.2); // Short decay

        const pan = this.ctx.createStereoPanner();
        pan.pan.value = (Math.random() - 0.5) * 1.8; // Random panning

        noise.connect(filter);
        filter.connect(env);
        env.connect(pan);
        pan.connect(musicGain);

        noise.start(now);
        noise.stop(now + 0.2);

        this.musicNodes.push(noise, filter, env, pan);
        
        this.sequencerTimerDrip = window.setTimeout(playGrind, 5000 + Math.random() * 10000);
    };
    playGrind();

    // --- LAYER 4: LONELY CHIMES SEQUENCER ---
    const scale = [ 196.00, 220.00, 246.94, 293.66, 329.63, 392.00 ];

    const playLonelyNote = () => {
        if (!this.ctx || this.currentMusicZone !== zone) return;
        
        const nextTime = 6000 + Math.random() * 8000; 
        const now = this.ctx.currentTime;
        const noteFreq = scale[Math.floor(Math.random() * scale.length)];
        
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = noteFreq;
        const env = this.ctx.createGain();
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(0.08, now + 0.5);
        env.gain.exponentialRampToValueAtTime(0.001, now + 5.0);
        
        const vib = this.ctx.createOscillator();
        vib.frequency.value = 3; 
        const vibGain = this.ctx.createGain();
        vibGain.gain.value = 1.5;
        vib.connect(vibGain);
        vibGain.connect(osc.frequency);
        vib.start(now);
        vib.stop(now + 5);

        osc.connect(env);
        env.connect(musicGain);

        osc.start(now);
        osc.stop(now + 5);
        
        this.musicNodes.push(osc, env, vib, vibGain);

        this.sequencerTimer = window.setTimeout(playLonelyNote, nextTime);
    };

    playLonelyNote();
  }

  playEffect(type: 'move' | 'turn' | 'attack' | 'magic' | 'hit' | 'loot' | 'stairs' | 'victory' | 'death' | 'crit' | 'miss' | 'heal' | 'skill' | 'encounter' | 'type' | 'secret' | 'menu_select' | 'descent' | 'heartbeat_thump' | 'seal' | 'eye_blink' | 'eye_glow' | 'door_open' | 'save_game' | 'teleport') {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.connect(g);
    g.connect(this.masterGain);

    switch (type) {
      case 'save_game':
        this.playArpeggio([261.63, 329.63, 392.00, 523.25], 0.06, 'triangle'); // C4, E4, G4, C5
        setTimeout(() => this.playArpeggio([783.99], 0.2, 'triangle'), 300); // G5
        return;
      case 'teleport':
        const telOsc = this.ctx.createOscillator();
        telOsc.type = 'sawtooth';
        telOsc.frequency.setValueAtTime(50, t);
        telOsc.frequency.exponentialRampToValueAtTime(2000, t + 0.8);

        const telGain = this.ctx.createGain();
        telGain.gain.setValueAtTime(0, t);
        telGain.gain.linearRampToValueAtTime(0.3, t + 0.1);
        telGain.gain.linearRampToValueAtTime(0, t + 0.8);

        telOsc.connect(telGain);
        telGain.connect(this.masterGain);
        telOsc.start(t);
        telOsc.stop(t + 0.8);
        return;
      case 'move':
        // Footstep: deeper, shorter thud
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.1);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      case 'door_open':
        // Whoosh noise for door
        const noise = this.createNoiseSource();
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.Q.value = 3;
        noiseFilter.frequency.setValueAtTime(1500, t);
        noiseFilter.frequency.exponentialRampToValueAtTime(300, t + 0.3);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start(t);
        noise.stop(t + 0.3);
        return;
      case 'secret':
        // A magical shimmering sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.linearRampToValueAtTime(800, t + 0.5);
        osc.frequency.linearRampToValueAtTime(1200, t + 1.0);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.3, t + 0.5);
        g.gain.linearRampToValueAtTime(0, t + 1.5);
        
        // Secondary sparkle
        const sOsc = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        sOsc.type = 'triangle';
        sOsc.frequency.setValueAtTime(1200, t);
        sOsc.frequency.linearRampToValueAtTime(2000, t + 1.5);
        sGain.gain.setValueAtTime(0.1, t);
        sGain.gain.linearRampToValueAtTime(0, t + 1.5);
        
        sOsc.connect(sGain);
        sGain.connect(this.masterGain);
        sOsc.start(t);
        sOsc.stop(t + 1.5);

        osc.start(t);
        osc.stop(t + 1.5);
        break;
      case 'turn':
        // Quieter shuffle
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.linearRampToValueAtTime(150, t + 0.05);
        g.gain.setValueAtTime(0.05, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      case 'encounter':
        // A jarring, dissonant screech
        const encOsc1 = this.ctx.createOscillator();
        const encOsc2 = this.ctx.createOscillator();
        encOsc1.type = 'sawtooth';
        encOsc2.type = 'square';
        encOsc1.frequency.setValueAtTime(100, t);
        encOsc1.frequency.exponentialRampToValueAtTime(800, t + 0.4);
        encOsc2.frequency.setValueAtTime(150, t);
        encOsc2.frequency.exponentialRampToValueAtTime(850, t + 0.4);
        
        const encGain = this.ctx.createGain();
        encGain.gain.setValueAtTime(0.5, t);
        encGain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        
        encOsc1.connect(encGain);
        encOsc2.connect(encGain);
        encGain.connect(this.masterGain);
        
        encOsc1.start(t);
        encOsc1.stop(t + 0.8);
        encOsc2.start(t);
        encOsc2.stop(t + 0.8);
        return; 
      case 'attack':
        this.playNoise(800, 200, 0.2);
        break;
      case 'crit':
        this.playNoise(2000, 100, 0.4);
        this.playArpeggio([200, 400, 800]);
        break;
      case 'miss':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      case 'magic':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1760, t + 0.3);
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      case 'heal':
        this.playArpeggio([440, 660, 880, 1320]);
        break;
      case 'skill':
        this.playArpeggio([200, 300, 500, 800]);
        break;
      case 'hit':
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.linearRampToValueAtTime(40, t + 0.15);
        g.gain.setValueAtTime(0.4, t);
        g.gain.linearRampToValueAtTime(0, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
        break;
      case 'loot':
        this.playArpeggio([523.25, 659.25, 783.99, 1046.50]);
        break;
      case 'victory':
        this.playArpeggio([440, 554.37, 659.25, 880]);
        break;
      case 'death':
        osc.type = 'square';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.linearRampToValueAtTime(20, t + 1);
        g.gain.setValueAtTime(0.4, t);
        g.gain.linearRampToValueAtTime(0, t + 1);
        osc.start(t);
        osc.stop(t + 1);
        break;
      case 'stairs':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.5);
        g.gain.setValueAtTime(0.3, t);
        g.gain.linearRampToValueAtTime(0, t + 0.5);
        osc.start(t);
        osc.stop(t + 0.5);
        break;
      case 'type':
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        g.gain.setValueAtTime(0.03, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      case 'menu_select':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      case 'heartbeat_thump':
        const playThump = (startTime: number, volume: number) => {
            // Main deep thump tone
            const thumpOsc = this.ctx!.createOscillator();
            thumpOsc.type = 'sine';
            thumpOsc.frequency.setValueAtTime(90, startTime); // Deeper start
            thumpOsc.frequency.exponentialRampToValueAtTime(35, startTime + 0.25);
    
            const thumpGain = this.ctx!.createGain();
            thumpGain.gain.setValueAtTime(0, startTime);
            thumpGain.gain.linearRampToValueAtTime(volume * 1.2, startTime + 0.02); // Punchy gain for effect
            thumpGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
    
            thumpOsc.connect(thumpGain);
            thumpGain.connect(this.masterGain!);
            thumpOsc.start(startTime);
            thumpOsc.stop(startTime + 0.4);
    
            // Visceral squelch with pink noise
            const noiseBuffer = this.createPinkNoise();
            if (!noiseBuffer) return;
            const noise = this.ctx!.createBufferSource();
            noise.buffer = noiseBuffer;
    
            const filter = this.ctx!.createBiquadFilter();
            filter.type = 'lowpass';
            filter.Q.value = 7; // Lowered Q value for a wetter, less sharp sound
            filter.frequency.setValueAtTime(700, startTime);
            filter.frequency.exponentialRampToValueAtTime(90, startTime + 0.2);
    
            const env = this.ctx!.createGain();
            env.gain.setValueAtTime(0, startTime);
            env.gain.linearRampToValueAtTime(volume * 0.8, startTime + 0.03);
            env.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);
    
            noise.connect(filter);
            filter.connect(env);
            env.connect(this.masterGain!);
            noise.start(startTime);
            noise.stop(startTime + 0.4);
        };
    
        // Slower, heavier "lub-dub" for the one-shot effect
        playThump(t, 0.7);
        playThump(t + 0.4, 0.5); // Slower second beat
        return;
      case 'seal':
        // Layer 1: Ominous Drone
        const droneOsc = this.ctx.createOscillator();
        droneOsc.type = 'sawtooth';
        droneOsc.frequency.setValueAtTime(80, t);
        droneOsc.frequency.linearRampToValueAtTime(70, t + 1.8);
        const droneGain = this.ctx.createGain();
        droneGain.gain.setValueAtTime(0, t);
        droneGain.gain.linearRampToValueAtTime(0.25, t + 0.5);
        droneGain.gain.linearRampToValueAtTime(0, t + 1.8);
        droneOsc.connect(droneGain);
        droneGain.connect(this.masterGain);
        droneOsc.start(t);
        droneOsc.stop(t + 1.8);

        // Layer 2: Scraping noise
        const scrapeNoise = this.createNoiseSource();
        const scrapeFilter = this.ctx.createBiquadFilter();
        scrapeFilter.type = 'bandpass';
        scrapeFilter.Q.value = 15;
        scrapeFilter.frequency.setValueAtTime(1200, t + 0.2);
        scrapeFilter.frequency.exponentialRampToValueAtTime(400, t + 1.2);
        const scrapeGain = this.ctx.createGain();
        scrapeGain.gain.setValueAtTime(0, t + 0.2);
        scrapeGain.gain.linearRampToValueAtTime(0.1, t + 0.3);
        scrapeGain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        scrapeNoise.connect(scrapeFilter);
        scrapeFilter.connect(scrapeGain);
        scrapeGain.connect(this.masterGain);
        scrapeNoise.start(t + 0.2);
        scrapeNoise.stop(t + 1.2);

        // Layer 3: Final Clunk
        const clunkOsc = this.ctx.createOscillator();
        clunkOsc.type = 'square';
        clunkOsc.frequency.setValueAtTime(150, t + 1.4);
        clunkOsc.frequency.exponentialRampToValueAtTime(40, t + 1.6);
        const clunkGain = this.ctx.createGain();
        clunkGain.gain.setValueAtTime(0, t + 1.4);
        clunkGain.gain.linearRampToValueAtTime(0.4, t + 1.41);
        clunkGain.gain.exponentialRampToValueAtTime(0.01, t + 1.7);
        clunkOsc.connect(clunkGain);
        clunkGain.connect(this.masterGain);
        clunkOsc.start(t + 1.4);
        clunkOsc.stop(t + 1.7);
        return;
      case 'eye_blink':
        // A low-pass filtered noise with a short, sharp envelope
        const noiseBlink = this.createNoiseSource();
        const filterBlink = this.ctx.createBiquadFilter();
        filterBlink.type = 'lowpass';
        filterBlink.frequency.value = 400;
        filterBlink.Q.value = 5;
        
        const envBlink = this.ctx.createGain();
        envBlink.gain.setValueAtTime(0, t);
        envBlink.gain.linearRampToValueAtTime(0.3, t + 0.02);
        envBlink.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        
        noiseBlink.connect(filterBlink);
        filterBlink.connect(envBlink);
        envBlink.connect(this.masterGain);
        
        noiseBlink.start(t);
        noiseBlink.stop(t + 0.15);
        return;
      
      case 'eye_glow':
        // Layer 1: Macabre Drone
        const eyeDroneFreq1 = 80;
        const eyeDroneOsc1 = this.ctx.createOscillator();
        eyeDroneOsc1.type = 'sawtooth';
        eyeDroneOsc1.frequency.value = eyeDroneFreq1;
        eyeDroneOsc1.detune.value = -5; // Detune for thickness

        const eyeDroneOsc2 = this.ctx.createOscillator();
        eyeDroneOsc2.type = 'sawtooth';
        eyeDroneOsc2.frequency.value = eyeDroneFreq1;
        eyeDroneOsc2.detune.value = 5;

        const eyeDroneFilter = this.ctx.createBiquadFilter();
        eyeDroneFilter.type = 'lowpass';
        eyeDroneFilter.frequency.value = 400;

        const eyeDroneGain = this.ctx.createGain();
        eyeDroneGain.gain.setValueAtTime(0, t);
        eyeDroneGain.gain.linearRampToValueAtTime(0.25, t + 0.5); // Slow fade in
        eyeDroneGain.gain.linearRampToValueAtTime(0, t + 1.5); // Fade out

        eyeDroneOsc1.connect(eyeDroneFilter);
        eyeDroneOsc2.connect(eyeDroneFilter);
        eyeDroneFilter.connect(eyeDroneGain);
        eyeDroneGain.connect(this.masterGain);

        eyeDroneOsc1.start(t);
        eyeDroneOsc1.stop(t + 1.5);
        eyeDroneOsc2.start(t);
        eyeDroneOsc2.stop(t + 1.5);

        // Layer 2: Viscous/Humid Squelch
        const eyeNoiseBuffer = this.createPinkNoise();
        if (eyeNoiseBuffer) {
            const noise = this.ctx.createBufferSource();
            noise.buffer = eyeNoiseBuffer;
            noise.loop = true;

            const squelchFilter = this.ctx.createBiquadFilter();
            squelchFilter.type = 'bandpass';
            squelchFilter.frequency.value = 150;
            squelchFilter.Q.value = 15; // High Q for resonant "gloop" sound

            // LFO to modulate the filter frequency for a "gurgling" effect
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 2; // Slow gurgle

            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 100; // Modulation depth

            lfo.connect(lfoGain);
            lfoGain.connect(squelchFilter.frequency);
            
            const squelchGain = this.ctx.createGain();
            squelchGain.gain.setValueAtTime(0, t);
            squelchGain.gain.linearRampToValueAtTime(0.4, t + 0.4);
            squelchGain.gain.linearRampToValueAtTime(0, t + 1.5);

            noise.connect(squelchFilter);
            squelchFilter.connect(squelchGain);
            squelchGain.connect(this.masterGain);

            noise.start(t);
            noise.stop(t + 1.5);
            lfo.start(t);
            lfo.stop(t + 1.5);
        }
        return;
      case 'descent':
        // Deep falling sound
        const fallOsc = this.ctx.createOscillator();
        fallOsc.type = 'sawtooth';
        fallOsc.frequency.setValueAtTime(400, t);
        fallOsc.frequency.exponentialRampToValueAtTime(50, t + 1.5);
        
        const fallGain = this.ctx.createGain();
        fallGain.gain.setValueAtTime(0.4, t);
        fallGain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
        
        fallOsc.connect(fallGain);
        fallGain.connect(this.masterGain);
        fallOsc.start(t);
        fallOsc.stop(t + 1.5);

        // Whoosh noise
        const noiseWhoosh = this.createNoiseSource();
        const noiseFilterWhoosh = this.ctx.createBiquadFilter();
        noiseFilterWhoosh.type = 'bandpass';
        noiseFilterWhoosh.Q.value = 5;
        noiseFilterWhoosh.frequency.setValueAtTime(2000, t);
        noiseFilterWhoosh.frequency.exponentialRampToValueAtTime(100, t + 1);

        const noiseGainWhoosh = this.ctx.createGain();
        noiseGainWhoosh.gain.setValueAtTime(0.2, t);
        noiseGainWhoosh.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        
        noiseWhoosh.connect(noiseFilterWhoosh);
        noiseFilterWhoosh.connect(noiseGainWhoosh);
        noiseGainWhoosh.connect(this.masterGain);
        noiseWhoosh.start(t);
        noiseWhoosh.stop(t + 1.2);

        // Impact
        const impactOsc = this.ctx.createOscillator();
        impactOsc.type = 'square';
        impactOsc.frequency.setValueAtTime(80, t + 1.0);
        impactOsc.frequency.exponentialRampToValueAtTime(20, t + 1.5);
        
        const impactGain = this.ctx.createGain();
        impactGain.gain.setValueAtTime(0, t + 1.0);
        impactGain.gain.linearRampToValueAtTime(0.5, t + 1.05);
        impactGain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
        
        impactOsc.connect(impactGain);
        impactGain.connect(this.masterGain);
        impactOsc.start(t + 1.0);
        impactOsc.stop(t + 1.5);
        return;
    }
  }

  private playNoise(high: number, low: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const noise = this.createNoiseSource();
    const filter = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(high, t);
    filter.frequency.exponentialRampToValueAtTime(low, t + duration);
    noise.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    g.gain.setValueAtTime(0.8, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + duration);
    noise.start(t);
    noise.stop(t + duration);
  }

  public playArpeggio(freqs: number[], duration = 0.08, type: OscillatorType = 'square') {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    freqs.forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = type;
      o.frequency.value = f;
      o.connect(g);
      g.connect(this.masterGain!);
      g.gain.setValueAtTime(0.1, t + i * duration);
      g.gain.exponentialRampToValueAtTime(0.01, t + i * duration + 0.1);
      o.start(t + i * duration);
      o.stop(t + i * duration + 0.1);
    });
  }

  private createNoiseSource() {
    if (!this.ctx) throw new Error("No context");
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    return source;
  }
}

export const sounds = new SoundManager();
