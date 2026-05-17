/**
 * Futuristic Sound System using Web Audio API
 */

class SoundSystem {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playCorrect() {
    // High pitched double beep
    this.playTone(880, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(1320, 'sine', 0.2, 0.08), 100);
  }

  playIncorrect() {
    // Low pitched buzz
    this.playTone(220, 'sawtooth', 0.3, 0.1);
    this.playTone(200, 'sawtooth', 0.3, 0.1);
  }

  playWarning() {
    // Short sharp alert
    this.playTone(440, 'square', 0.05, 0.05);
  }

  playLevelUp() {
    // Rising arpeggio
    [440, 554, 659, 880].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.4, 0.1), i * 100);
    });
  }
}

export const sounds = new SoundSystem();
