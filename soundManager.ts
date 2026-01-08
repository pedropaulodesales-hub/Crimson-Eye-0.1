

export class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicNodes: AudioNode[] = [];
  private currentMusicZone: number = -1;
  private sequencerTimer: number | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.3;
  }

  playMusic(floor: number) {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Define Zones
    // Zone 1: Floors 1-5 (Index 0-4)
    const zone = floor < 5 ? 1 : 2;

    // If music for this zone is already playing, do nothing
    if (this.currentMusicZone === zone) return;

    this.stopMusic();
    this.currentMusicZone = zone;

    if (zone === 1) {
        this.playDungeonTheme();
    }
  }

  playLoreAmbience() {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    if (this.currentMusicZone === 3) return;

    this.stopMusic();
    this.currentMusicZone = 3;

    const t = this.ctx.currentTime;
    const ambGain = this.ctx.createGain();
    ambGain.gain.setValueAtTime(0, t);
    ambGain.gain.linearRampToValueAtTime(0.5, t + 3);
    ambGain.connect(this.masterGain);
    this.musicNodes.push(ambGain);

    // Deep drone - pulsating
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 50; 
    
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 52; // Beat frequency

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(ambGain);

    osc1.start(t);
    osc2.start(t);

    this.musicNodes.push(osc1, osc2, filter, ambGain);
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
    
    // Stop sequencer
    if (this.sequencerTimer) {
        window.clearTimeout(this.sequencerTimer);
        this.sequencerTimer = null;
    }
    
    this.currentMusicZone = -1;
  }

  private playDungeonTheme() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Music Gain Node (Fade In)
    const musicGain = this.ctx.createGain();
    musicGain.gain.value = 0;
    musicGain.gain.linearRampToValueAtTime(0.4, t + 4);
    musicGain.connect(this.masterGain);
    this.musicNodes.push(musicGain);

    // --- Layer 1: Drone (The Foundation) ---
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 55.00; // A1
    
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = 55.50; // Detuned A1

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    filter.Q.value = 2;

    // Filter LFO
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; 
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 40; 

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(musicGain);

    osc1.start(t);
    osc2.start(t);
    lfo.start(t);

    this.musicNodes.push(osc1, osc2, filter, lfo, lfoGain);

    // --- Layer 2: The Melody Sequencer ---
    // A slow, haunting melody in A Minor / Phrygian
    const sequence = [
        { f: 220.00, d: 2 }, // A3
        { f: 261.63, d: 2 }, // C4
        { f: 246.94, d: 2 }, // B3
        { f: 220.00, d: 2 }, // A3
        { f: 174.61, d: 4 }, // F3
        { f: 196.00, d: 2 }, // G3
        { f: 164.81, d: 2 }, // E3 (Phrygian flavor)
    ];

    let noteIndex = 0;
    const noteInterval = 3000; // 3 seconds per beat roughly

    const playNextNote = () => {
        if (!this.ctx || this.currentMusicZone !== 1) return;
        
        const note = sequence[noteIndex % sequence.length];
        const now = this.ctx.currentTime;
        
        // Bell/Pluck sound
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = note.f;
        
        const env = this.ctx.createGain();
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(0.15, now + 0.1); // Attack
        env.gain.exponentialRampToValueAtTime(0.001, now + note.d); // Decay
        
        // Reverb-ish effect via long release and filtering
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'lowpass';
        nFilter.frequency.value = 800;

        osc.connect(nFilter);
        nFilter.connect(env);
        env.connect(musicGain); // Connect to main music bus

        osc.start(now);
        osc.stop(now + note.d + 1);
        
        // Keep track to clean up if stopped abruptly (though stopMusic handles the main bus)
        this.musicNodes.push(osc, env, nFilter);

        noteIndex++;
        this.sequencerTimer = window.setTimeout(playNextNote, noteInterval);
    };

    playNextNote();
  }

  playEffect(type: 'move' | 'turn' | 'attack' | 'magic' | 'hit' | 'loot' | 'stairs' | 'victory' | 'death' | 'crit' | 'miss' | 'heal' | 'skill' | 'encounter' | 'type' | 'secret') {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.connect(g);
    g.connect(this.masterGain);

    switch (type) {
      case 'move':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
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
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.linearRampToValueAtTime(150, t + 0.05);
        g.gain.setValueAtTime(0.1, t);
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

  public playArpeggio(freqs: number[]) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    freqs.forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = 'square';
      o.frequency.value = f;
      o.connect(g);
      g.connect(this.masterGain!);
      g.gain.setValueAtTime(0.1, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.1);
      o.start(t + i * 0.08);
      o.stop(t + i * 0.08 + 0.1);
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