/**
 * AUDIOCLEAN PRO — INTERACTIVE A/B AUDIO & SPECTRAL FFT SIMULATOR
 * Demonstrates synchronized A/B switching and real-time fake lossless detection
 */

(function() {
  // Elements
  const btnTrackA = document.getElementById('btnTrackA');
  const btnTrackB = document.getElementById('btnTrackB');
  const panelTrackA = document.getElementById('panelTrackA');
  const panelTrackB = document.getElementById('panelTrackB');
  const playToggleBtn = document.getElementById('playToggleBtn');
  const abTimeDisplay = document.getElementById('abTimeDisplay');
  const spectrumCanvas = document.getElementById('spectrumCanvas');
  const warningText = document.getElementById('spectrumWarning');

  if (!btnTrackA || !btnTrackB || !spectrumCanvas) return;

  const ctx = spectrumCanvas.getContext('2d');

  // State
  let currentTrack = 'A'; // 'A' or 'B'
  let isPlaying = false;
  let currentTime = 14.5;
  const totalDuration = 222; // 3:42
  let playInterval = null;

  // Web Audio Synth
  let audioCtx = null;
  let oscNodes = [];
  let filterNode = null;
  let masterGain = null;

  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Master Gain
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // Lowpass Filter for simulating Fake Lossless Rolloff
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(20000, audioCtx.currentTime); // Full spectrum by default
      filterNode.Q.setValueAtTime(0.7, audioCtx.currentTime);
      filterNode.connect(masterGain);

      // Create rich chord (F minor 9 ambient pad for warm hi-fi testing)
      const freqs = [174.61, 261.63, 311.13, 392.00, 523.25, 698.46, 1046.50];
      freqs.forEach(f => {
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, audioCtx.currentTime);

        const oscGain = audioCtx.createGain();
        oscGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(filterNode);
        osc.start();
        oscNodes.push(osc);
      });
    } catch (e) {
      console.warn('Web Audio API not supported or user blocked audio.', e);
    }
  }

  function startPlayback() {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (masterGain) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.3);
    }

    applyTrackFilter(currentTrack);

    isPlaying = true;
    playToggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1"/>
        <rect x="14" y="4" width="4" height="16" rx="1"/>
      </svg>`;

    playInterval = setInterval(() => {
      currentTime += 0.25;
      if (currentTime >= totalDuration) currentTime = 0;
      updateTimeDisplay();
    }, 250);
  }

  function stopPlayback() {
    if (masterGain && audioCtx) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    }

    isPlaying = false;
    playToggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>`;

    clearInterval(playInterval);
  }

  function applyTrackFilter(track) {
    if (!filterNode || !audioCtx) return;
    const now = audioCtx.currentTime;
    filterNode.frequency.cancelScheduledValues(now);
    filterNode.frequency.setValueAtTime(filterNode.frequency.value, now);

    if (track === 'A') {
      // Full Lossless spectrum: wide open to 22kHz
      filterNode.frequency.exponentialRampToValueAtTime(20000, now + 0.15);
    } else {
      // Fake FLAC / Transcode: steep cutoff at 15.5 kHz
      filterNode.frequency.exponentialRampToValueAtTime(15500, now + 0.15);
    }
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateTimeDisplay() {
    abTimeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(totalDuration)}`;
  }

  function switchTrack(track) {
    currentTrack = track;

    if (track === 'A') {
      btnTrackA.classList.add('active', 'track-a');
      btnTrackB.classList.remove('active', 'track-b');
      panelTrackA.classList.add('is-active');
      panelTrackB.classList.remove('is-active');
      warningText.style.display = 'none';
    } else {
      btnTrackB.classList.add('active', 'track-b');
      btnTrackA.classList.remove('active', 'track-a');
      panelTrackB.classList.add('is-active');
      panelTrackA.classList.remove('is-active');
      warningText.style.display = 'block';
    }

    if (isPlaying) {
      applyTrackFilter(track);
    }
  }

  // Event Listeners
  btnTrackA.addEventListener('click', () => switchTrack('A'));
  btnTrackB.addEventListener('click', () => switchTrack('B'));

  playToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });

  // Canvas FFT Spectrum Rendering
  let spectrumWidth, spectrumHeight;

  function resizeSpectrum() {
    spectrumWidth = spectrumCanvas.parentElement.clientWidth - 32;
    spectrumHeight = 140;
    spectrumCanvas.width = spectrumWidth * window.devicePixelRatio;
    spectrumCanvas.height = spectrumHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resizeSpectrum);
  resizeSpectrum();

  const numBars = 36;
  let barHeights = new Array(numBars).fill(10);
  let animFrame = 0;

  function renderSpectrum() {
    ctx.clearRect(0, 0, spectrumWidth, spectrumHeight);

    const barW = (spectrumWidth - 40) / numBars;
    const isLossless = currentTrack === 'A';
    const cutoffIndex = Math.floor(numBars * 0.72); // ~16kHz threshold mark

    // Background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let y = 20; y < spectrumHeight; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(spectrumWidth, y);
      ctx.stroke();
    }

    // Frequency cutoff dashed line for Track B
    if (!isLossless) {
      const cutX = cutoffIndex * barW + 10;
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.moveTo(cutX, 10);
      ctx.lineTo(cutX, spectrumHeight - 10);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cutoff label
      ctx.fillStyle = '#F59E0B';
      ctx.font = '10px monospace';
      ctx.fillText('CORTE 16 kHz (FAKE)', cutX + 6, 24);
    }

    // Render FFT Frequency bars
    for (let i = 0; i < numBars; i++) {
      const x = i * barW + 10;

      // Target amplitude calculation
      let targetH;
      if (isPlaying) {
        if (!isLossless && i >= cutoffIndex) {
          // Sharp rolloff: virtually zero energy above 16kHz
          targetH = Math.max(2, Math.random() * 4);
        } else {
          // Dynamic energy spectrum
          const freqFactor = 1 - (i / numBars) * 0.35;
          const osc = Math.sin(i * 0.3 + animFrame * 0.1) * 0.5 + 0.5;
          targetH = (15 + osc * 80 * freqFactor) * (0.8 + Math.random() * 0.4);
        }
      } else {
        // Idle breathing bars
        if (!isLossless && i >= cutoffIndex) {
          targetH = 2;
        } else {
          targetH = 12 + Math.sin(i * 0.2 + animFrame * 0.03) * 8;
        }
      }

      // Smooth bar lerping
      barHeights[i] += (targetH - barHeights[i]) * 0.25;
      const h = Math.min(spectrumHeight - 20, Math.max(3, barHeights[i]));
      const y = spectrumHeight - 10 - h;

      // Gradient color based on fidelity
      const grad = ctx.createLinearGradient(0, y, 0, spectrumHeight - 10);
      if (isLossless) {
        grad.addColorStop(0, '#00E5FF');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
      } else {
        if (i >= cutoffIndex) {
          grad.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
          grad.addColorStop(1, 'rgba(244, 63, 94, 0.05)');
        } else {
          grad.addColorStop(0, '#F59E0B');
          grad.addColorStop(1, 'rgba(245, 158, 11, 0.2)');
        }
      }

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barW - 3, h);
    }

    animFrame++;
    requestAnimationFrame(renderSpectrum);
  }

  renderSpectrum();
})();
