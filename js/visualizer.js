/**
 * AUDIOCLEAN PRO — HERO AUDIO WAVE VISUALIZER
 * Interactive Canvas wave simulation with neon gradients & mouse reaction
 */

(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let mouse = { x: null, y: null, active: false };
  let time = 0;

  function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight || 240;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resize);
  resize();

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Layer configurations for 4 overlaid acoustic waves
  const layers = [
    { color: 'rgba(0, 229, 255, 0.4)', speed: 0.025, freq: 0.012, amp: 40, offset: 0 },
    { color: 'rgba(139, 92, 246, 0.3)', speed: 0.018, freq: 0.008, amp: 55, offset: 2 },
    { color: 'rgba(0, 180, 216, 0.2)', speed: 0.032, freq: 0.018, amp: 30, offset: 4 },
    { color: 'rgba(16, 185, 129, 0.25)', speed: 0.015, freq: 0.006, amp: 45, offset: 1.5 }
  ];

  function drawWave(layer) {
    ctx.beginPath();
    ctx.moveTo(0, height);

    const centerY = height * 0.55;

    for (let x = 0; x <= width; x += 3) {
      let mouseBoost = 1;
      if (mouse.active && mouse.x !== null) {
        const dist = Math.abs(x - mouse.x);
        if (dist < 180) {
          mouseBoost = 1 + (1 - dist / 180) * 0.8;
        }
      }

      // Harmonic synthesis combining fundamental & second harmonic
      const y = centerY + 
        Math.sin(x * layer.freq + time * layer.speed + layer.offset) * (layer.amp * mouseBoost) +
        Math.cos(x * layer.freq * 1.6 - time * layer.speed * 0.7) * (layer.amp * 0.35 * mouseBoost);

      if (x === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.lineTo(width, height);
    ctx.closePath();

    ctx.fillStyle = layer.color;
    ctx.fill();
  }

  // Draw frequency bars at bottom of canvas
  function drawBands() {
    const bars = 48;
    const barWidth = width / bars;
    const centerY = height - 10;

    for (let i = 0; i < bars; i++) {
      const x = i * barWidth;
      const barAmp = Math.sin(i * 0.2 + time * 0.05) * 0.5 + 0.5;
      const barHeight = 8 + barAmp * 24;

      const grad = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY);
      grad.addColorStop(0, 'rgba(0, 229, 255, 0.6)');
      grad.addColorStop(1, 'rgba(139, 92, 246, 0.1)');

      ctx.fillStyle = grad;
      ctx.fillRect(x + 2, centerY - barHeight, barWidth - 4, barHeight);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Render waves
    layers.forEach(drawWave);

    // Render bottom spectrum bands
    drawBands();

    time += 1;
    requestAnimationFrame(animate);
  }

  animate();
})();
