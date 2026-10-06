// Web Audio API Retro Arcade Synthesizer & Speech Synthesizer
// Zero external assets required, 100% offline-ready and instant

class SoundManager {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
    this.volume = 0.5;

    // Load user preferences if available
    try {
      const savedSound = localStorage.getItem('dsa_tambola_sound');
      if (savedSound !== null) this.soundEnabled = savedSound === 'true';
      const savedVoice = localStorage.getItem('dsa_tambola_voice');
      if (savedVoice !== null) this.voiceEnabled = savedVoice === 'true';
    } catch (e) {}
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    try {
      localStorage.setItem('dsa_tambola_sound', this.soundEnabled);
    } catch (e) {}
    return this.soundEnabled;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    try {
      localStorage.setItem('dsa_tambola_voice', this.voiceEnabled);
    } catch (e) {}
    return this.voiceEnabled;
  }

  // Play a simple tone helper
  playTone(freq, type = 'sine', duration = 0.1, delay = 0, gainVal = 0.2) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

    gain.gain.setValueAtTime(gainVal * this.volume, this.ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }

  // UI button click
  playClick() {
    if (!this.soundEnabled) return;
    this.playTone(800, 'sine', 0.04, 0, 0.15);
  }

  // Ticket number daub (satisfying pop)
  playDaub() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Number Drawn / Called sound (Arcade futuristic chime)
  playBallDraw() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    // Double chime: high note + resonant shimmer
    this.playTone(523.25, 'triangle', 0.15, 0, 0.25);   // C5
    this.playTone(659.25, 'triangle', 0.15, 0.08, 0.25); // E5
    this.playTone(783.99, 'sine', 0.25, 0.16, 0.3);      // G5
    this.playTone(1046.50, 'sine', 0.4, 0.24, 0.35);    // C6
  }

  // Prize won victory fanfare (Arcade level up / jackpot!)
  playWinFanfare() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [
      { f: 440.00, d: 0.1, t: 0.0 },    // A4
      { f: 554.37, d: 0.1, t: 0.1 },    // C#5
      { f: 659.25, d: 0.1, t: 0.2 },    // E5
      { f: 880.00, d: 0.2, t: 0.3 },    // A5
      { f: 783.99, d: 0.1, t: 0.5 },    // G5
      { f: 880.00, d: 0.1, t: 0.6 },    // A5
      { f: 1108.73, d: 0.4, t: 0.7 }    // C#6
    ];

    notes.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, n.t, 0.35);
    });
  }

  // Bogey / Invalid claim buzzer
  playBogey() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(130, now + 0.15);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Game Start Sound
  playGameStart() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const chord = [261.63, 329.63, 392.00, 523.25]; // C major
    chord.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.3, idx * 0.06, 0.2);
    });
  }

  // Text-To-Speech Caller
  speakNumber(num, title) {
    if (!this.voiceEnabled) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    let text = `Number ${num}.`;
    if (title) {
      // E.g. "Two Sum" or "Kadane's Algorithm"
      const cleanTitle = title.split('(')[0].replace(/[#\d]/g, '').trim();
      if (cleanTitle) {
        text += ` ${cleanTitle}!`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    utterance.volume = this.volume;

    // Pick English voice if available
    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (engVoice) utterance.voice = engVoice;

    window.speechSynthesis.speak(utterance);
  }

  // Voice Announcement for Winners (Rows, Corners, Early 5, Full House)
  speakWinner(playerName, prizeName, isPlayer = false) {
    if (!this.voiceEnabled) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    let announcement = "";
    if (prizeName.toLowerCase().includes('full house')) {
      announcement = isPlayer
        ? `Incredible! Full House won by you, ${playerName}! You are the Grand Champion of DSA Array Bingo!`
        : `Attention everyone! Grand Full House has been claimed by ${playerName}!`;
    } else {
      announcement = isPlayer
        ? `Congratulations ${playerName}! You have successfully claimed ${prizeName}!`
        : `Winner announcement! ${prizeName} has been claimed by ${playerName}!`;
    }

    const utterance = new SpeechSynthesisUtterance(announcement);
    utterance.rate = 1.0;
    utterance.pitch = 1.15;
    utterance.volume = this.volume;

    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (engVoice) utterance.voice = engVoice;

    window.speechSynthesis.speak(utterance);
  }
}

window.soundManager = new SoundManager();
