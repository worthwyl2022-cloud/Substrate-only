/**
 * Web Audio API synthesizer + Web Speech Narration Engine
 * Engineered for clean, pristine sound with ZERO interference, clicks, buzzing, or clipping.
 * Uses pure harmonic sine waves with soft envelopes and automatic speech ducking.
 */

export interface NarrationScript {
  actId: number;
  spokenText: string;
}

export const ACT_NARRATIONS: Record<number, string> = {
  1: "Every large language model in production today hallucinates, drifts, and contradicts itself under pressure. No foundation model solves this natively.",
  2: "Introducing Cranium Substrate. A deterministic cognitive governance layer sitting above foundation models and below enterprise applications.",
  3: "Watch the engine in real time. Two conflicting enterprise policy statements enter the system. The Contradiction Engine identifies the polarity clash in point three eight milliseconds, locks the protected Canon Lane, purges the conflicting belief, and emits a cryptographic audit receipt.",
  4: "Empirical benchmark results. One hundred percent NLI contradiction accuracy, zero axiom breach rate, zero adversarial jailbreaks passed. This is not a concept. This is running code.",
  5: "Cranium Substrate. Epistemic governance for AI systems. Built by Wyl Mathes. Copyright 2026. All rights reserved."
};

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isNarrationMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private hasUnlocked: boolean = false;

  // Background Synth Drone Nodes (Pure Sine Chord)
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private osc3: OscillatorNode | null = null;

  // Speech synthesis state
  private voice: SpeechSynthesisVoice | null = null;
  private currentSpokenAct: number = 0;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.selectBestVoice();
      };
      this.selectBestVoice();
    }
  }

  private selectBestVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Daniel') ||
            v.name.includes('Guy') ||
            v.name.includes('Samantha') ||
            v.name.includes('Alex'))
      ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

      if (preferred) {
        this.voice = preferred;
      }
    } catch {
      // ignore
    }
  }

  private getAudioContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  public async unlockAudio(): Promise<boolean> {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return false;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      this.hasUnlocked = true;
      this.isMuted = false;

      this.playInitChime();
      this.startAmbient();
      return true;
    } catch {
      return false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.25, now + 0.05);
    }
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public setNarrationMuted(muted: boolean) {
    this.isNarrationMuted = muted;
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    if (muted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsNarrationMuted(): boolean {
    return this.isNarrationMuted;
  }

  public getIsMusicMuted(): boolean {
    return this.isMusicMuted;
  }

  public getHasUnlocked(): boolean {
    return this.hasUnlocked && this.ctx?.state === 'running';
  }

  /**
   * Smooth, crystalline ambient pad (pure warm sine waves with soft attack)
   * Absolutely NO buzzing, sawtooth, or clicking.
   */
  public startAmbient() {
    if (this.isMuted || this.isMusicMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (this.osc1) return; // Already playing

    try {
      const now = ctx.currentTime;

      if (!this.masterGain) {
        this.masterGain = ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.2, now);
        this.masterGain.connect(ctx.destination);
      }

      this.ambientGain = ctx.createGain();
      // Soft gentle initial gain (fade in from 0 to 0.08)
      this.ambientGain.gain.setValueAtTime(0.0001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.06, now + 1.2);
      this.ambientGain.connect(this.masterGain);

      // Warm pure sine chords: C3 (130.81Hz), G3 (196.0Hz), E4 (329.63Hz)
      this.osc1 = ctx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(130.81, now);

      this.osc2 = ctx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(196.0, now);

      this.osc3 = ctx.createOscillator();
      this.osc3.type = 'sine';
      this.osc3.frequency.setValueAtTime(329.63, now);

      this.osc1.connect(this.ambientGain);
      this.osc2.connect(this.ambientGain);
      this.osc3.connect(this.ambientGain);

      this.osc1.start(now);
      this.osc2.start(now);
      this.osc3.start(now);
    } catch {
      // Audio fallback
    }
  }

  public stopAmbient() {
    try {
      if (this.ctx && this.ambientGain) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.cancelScheduledValues(now);
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      }

      setTimeout(() => {
        if (this.osc1) {
          try { this.osc1.stop(); this.osc1.disconnect(); } catch { /* ignore */ }
          this.osc1 = null;
        }
        if (this.osc2) {
          try { this.osc2.stop(); this.osc2.disconnect(); } catch { /* ignore */ }
          this.osc2 = null;
        }
        if (this.osc3) {
          try { this.osc3.stop(); this.osc3.disconnect(); } catch { /* ignore */ }
          this.osc3 = null;
        }
      }, 350);
    } catch {
      // Ignored
    }
  }

  /**
   * Duck background ambient music down while speech is active to guarantee 100% voice clarity
   */
  private duckMusic(duck: boolean) {
    if (!this.ctx || !this.ambientGain || this.isMuted || this.isMusicMuted) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      if (duck) {
        this.ambientGain.gain.linearRampToValueAtTime(0.015, now + 0.2); // Duck very low
      } else {
        this.ambientGain.gain.linearRampToValueAtTime(0.06, now + 0.8); // Restore smoothly
      }
    } catch {
      // ignore
    }
  }

  /**
   * Speak narration for an act using Web Speech API with clean audio ducking
   */
  public speakAct(actId: number) {
    if (this.isMuted || this.isNarrationMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.currentSpokenAct === actId) return;

    const text = ACT_NARRATIONS[actId];
    if (!text) return;

    this.currentSpokenAct = actId;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (!this.voice) {
      this.selectBestVoice();
    }
    if (this.voice) {
      utterance.voice = this.voice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = (this.isMuted || this.isNarrationMuted) ? 0 : 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.duckMusic(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.duckMusic(false);
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.duckMusic(false);
    };

    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        this.duckMusic(false);
      }
    }, 200);
  }

  public resetSpokenAct() {
    this.currentSpokenAct = 0;
    this.isSpeaking = false;
    this.duckMusic(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /* ================== PURE HARMONIC SOUND EFFECTS ================== */
  /* All sounds use gentle sine waves with soft non-clicking envelopes */

  public playInitChime() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25); // C6

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignored
    }
  }

  public playActTransition() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.3); // C5

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // ignored
    }
  }

  public playPulse() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.0, now); // G4

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // ignored
    }
  }

  public playClash() {
    // Pure soft tone for alert (no dissonant distortion)
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.frequency.linearRampToValueAtTime(293.66, now + 0.2); // D4

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // ignored
    }
  }

  public playLockChime() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(987.77, now + 0.08); // B5

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // ignored
    }
  }

  public playReceiptSign() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 880.0]; // D5 -> A5 pure sine
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.0001, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.05, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.26);
      });
    } catch {
      // ignored
    }
  }

  public playVictoryChime() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C Major chord C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.04, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.36);
      });
    } catch {
      // ignored
    }
  }
}

export const soundEngine = new SoundEffectsEngine();
