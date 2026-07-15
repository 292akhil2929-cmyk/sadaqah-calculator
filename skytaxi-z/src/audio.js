// ============================================================
// Audio — fully synthesized WebAudio: engine drone, per-weapon
// shots, explosions, zombie screeches, alarms, dynamic music
// that layers up with threat intensity. No audio files needed.
// ============================================================

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.engineNodes = null;
    this.musicNodes = null;
    this.intensity = 0;      // 0..1 danger level, drives music
    this._musicTimer = 0;
    this._step = 0;
  }

  // Must be called from a user gesture (button click) to unlock audio.
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
    this._noiseBuf = this._makeNoise();
    this._startEngine();
    this._startMusicBed();
  }

  _makeNoise() {
    const len = this.ctx.sampleRate * 1;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  _noiseSrc() {
    const s = this.ctx.createBufferSource();
    s.buffer = this._noiseBuf; s.loop = true;
    return s;
  }

  // ---------- engine ----------
  _startEngine() {
    const ctx = this.ctx;
    const osc = ctx.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = 55;
    const osc2 = ctx.createOscillator(); osc2.type = 'square'; osc2.frequency.value = 27;
    const noise = this._noiseSrc();
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 900; nf.Q.value = 0.6;
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 320;
    const gain = ctx.createGain(); gain.gain.value = 0;
    const ng = ctx.createGain(); ng.gain.value = 0.05;
    osc.connect(filt); osc2.connect(filt); noise.connect(nf); nf.connect(ng); ng.connect(filt);
    filt.connect(gain); gain.connect(this.master);
    osc.start(); osc2.start(); noise.start();
    this.engineNodes = { osc, osc2, filt, gain };
  }

  // throttle 0..1, boost bool — call every frame during flight
  setEngine(throttle, boost, on = true) {
    if (!this.engineNodes) return;
    const t = this.ctx.currentTime;
    const g = on ? 0.10 + throttle * 0.10 + (boost ? 0.09 : 0) : 0;
    this.engineNodes.gain.gain.setTargetAtTime(g, t, 0.08);
    this.engineNodes.osc.frequency.setTargetAtTime(45 + throttle * 60 + (boost ? 50 : 0), t, 0.1);
    this.engineNodes.osc2.frequency.setTargetAtTime(22 + throttle * 30, t, 0.1);
    this.engineNodes.filt.frequency.setTargetAtTime(250 + throttle * 500 + (boost ? 700 : 0), t, 0.1);
  }

  // ---------- one-shots ----------
  _env(gainVal, attack, decay, dest = this.master) {
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gainVal, t + attack);
    g.gain.exponentialRampToValueAtTime(0.001, t + attack + decay);
    g.connect(dest);
    return g;
  }

  shoot(kind) {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    if (kind === 'mg') {
      const n = this._noiseSrc();
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1400;
      n.connect(f); f.connect(this._env(0.16, 0.002, 0.06));
      n.start(t); n.stop(t + 0.08);
    } else if (kind === 'cannon') {
      const o = ctx.createOscillator(); o.type = 'square';
      o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.25);
      o.connect(this._env(0.5, 0.004, 0.3)); o.start(t); o.stop(t + 0.32);
      const n = this._noiseSrc(); n.connect(this._env(0.3, 0.002, 0.12)); n.start(t); n.stop(t + 0.15);
    } else if (kind === 'rocket') {
      const n = this._noiseSrc();
      const f = ctx.createBiquadFilter(); f.type = 'bandpass';
      f.frequency.setValueAtTime(500, t); f.frequency.exponentialRampToValueAtTime(2200, t + 0.3);
      n.connect(f); f.connect(this._env(0.35, 0.01, 0.4));
      n.start(t); n.stop(t + 0.45);
    } else if (kind === 'missile') {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(700, t); o.frequency.exponentialRampToValueAtTime(180, t + 0.4);
      o.connect(this._env(0.25, 0.01, 0.4)); o.start(t); o.stop(t + 0.45);
      const n = this._noiseSrc(); n.connect(this._env(0.2, 0.01, 0.3)); n.start(t); n.stop(t + 0.35);
    }
  }

  explosion(big = false) {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const n = this._noiseSrc();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(big ? 2500 : 1600, t);
    f.frequency.exponentialRampToValueAtTime(60, t + (big ? 1.0 : 0.5));
    n.connect(f); f.connect(this._env(big ? 0.7 : 0.4, 0.005, big ? 1.0 : 0.5));
    n.start(t); n.stop(t + (big ? 1.1 : 0.6));
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(big ? 90 : 120, t); o.frequency.exponentialRampToValueAtTime(28, t + 0.6);
    o.connect(this._env(big ? 0.55 : 0.3, 0.005, 0.6)); o.start(t); o.stop(t + 0.65);
  }

  screech() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    const base = 500 + Math.random() * 700;
    o.frequency.setValueAtTime(base, t);
    o.frequency.exponentialRampToValueAtTime(base * (0.4 + Math.random() * 0.4), t + 0.35);
    const v = ctx.createOscillator(); v.frequency.value = 28; // vibrato = "undead" wobble
    const vg = ctx.createGain(); vg.gain.value = 90;
    v.connect(vg); vg.connect(o.frequency);
    o.connect(this._env(0.14, 0.02, 0.35));
    o.start(t); o.stop(t + 0.4); v.start(t); v.stop(t + 0.4);
  }

  alarm() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 880;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + i * 0.22);
      g.gain.linearRampToValueAtTime(0.12, t + i * 0.22 + 0.02);
      g.gain.linearRampToValueAtTime(0, t + i * 0.22 + 0.16);
      o.connect(g); g.connect(this.master);
      o.start(t + i * 0.22); o.stop(t + i * 0.22 + 0.2);
    }
  }

  cash() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + i * 0.07);
      g.gain.linearRampToValueAtTime(0.14, t + i * 0.07 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.3);
      o.connect(g); g.connect(this.master);
      o.start(t + i * 0.07); o.stop(t + i * 0.07 + 0.32);
    });
  }

  // ---------- dynamic music ----------
  _startMusicBed() {
    const ctx = this.ctx;
    const g = ctx.createGain(); g.gain.value = 0.0; g.connect(this.master);
    this.musicNodes = { bed: g };
  }

  // Simple generative pulse: minor-key bass steps, hats when intense.
  updateMusic(dt, inFlight) {
    if (!this.ctx) return;
    this._musicTimer -= dt;
    if (this._musicTimer > 0) return;
    const bpm = 92 + this.intensity * 60;
    this._musicTimer = 60 / bpm / 2; // 8th notes
    this._step = (this._step + 1) % 16;
    if (!inFlight) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const scale = [0, 3, 5, 7, 10]; // minor pentatonic
    // bass on quarter notes
    if (this._step % 2 === 0) {
      const semis = scale[[0, 0, 3, 2, 0, 0, 4, 1][(this._step / 2) | 0]];
      const o = ctx.createOscillator(); o.type = 'triangle';
      o.frequency.value = 55 * Math.pow(2, semis / 12);
      o.connect(this._env(0.10 + this.intensity * 0.08, 0.01, 0.26));
      o.start(t); o.stop(t + 0.3);
    }
    // hats scale with danger
    if (this.intensity > 0.25) {
      const n = this._noiseSrc();
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6000;
      n.connect(f); f.connect(this._env(0.03 + this.intensity * 0.05, 0.001, 0.04));
      n.start(t); n.stop(t + 0.05);
    }
    // stab every bar at high intensity
    if (this.intensity > 0.6 && this._step === 0) {
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      o.frequency.value = 220 * Math.pow(2, scale[(Math.random() * 5) | 0] / 12);
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1200;
      o.connect(f); f.connect(this._env(0.07, 0.01, 0.5));
      o.start(t); o.stop(t + 0.55);
    }
  }
}
