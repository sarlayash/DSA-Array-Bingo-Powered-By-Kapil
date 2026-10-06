// Self-contained, zero-dependency Canvas Confetti Engine
// Colorful arcade fireworks and confetti bursts for winning claims!

class ConfettiLauncher {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animating = false;
    this.initCanvas();
  }

  initCanvas() {
    if (this.canvas) return;
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  randomColor() {
    const colors = [
      '#00f3ff', // Neon Cyan
      '#ff007f', // Neon Pink
      '#ffe600', // Neon Yellow
      '#10b981', // Emerald
      '#8b5cf6', // Violet
      '#f97316', // Orange
      '#ec4899', // Hot Pink
      '#06b6d4', // Sky Blue
      '#ffffff'  // Bright White
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  burst(originX = 0.5, originY = 0.5, count = 120) {
    this.initCanvas();
    const x = originX * this.canvas.width;
    const y = originY * this.canvas.height;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 5,
        color: this.randomColor(),
        alpha: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.28,
        shape: Math.random() > 0.3 ? 'rect' : 'circle',
        decay: Math.random() * 0.015 + 0.012
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  // Multi-blast victory celebration
  celebrateWin() {
    this.burst(0.2, 0.4, 90);
    setTimeout(() => this.burst(0.8, 0.4, 90), 200);
    setTimeout(() => this.burst(0.5, 0.3, 140), 450);
    setTimeout(() => this.burst(0.3, 0.6, 80), 800);
    setTimeout(() => this.burst(0.7, 0.6, 80), 1050);
  }

  loop() {
    if (!this.animating) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

window.confettiLauncher = new ConfettiLauncher();
