// wheel.js — Canvas Wheel Drawing & Animation Engine

const THEMES = {
  vivid:  ['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#1dd1a1','#ff9f43','#ee5a24','#0abde3','#10ac84','#341f97'],
  candy:  ['#fd79a8','#e84393','#e17055','#fdcb6e','#fab1a0','#fd6b6b','#f9ca24','#f0932b','#d63031','#6c5ce7'],
  ocean:  ['#0984e3','#00b894','#74b9ff','#55efc4','#00cec9','#6c5ce7','#00b8d9','#079992','#1289A7','#0652DD'],
  sunset: ['#e17055','#fdcb6e','#fd79a8','#a29bfe','#ffeaa7','#e84393','#f9ca24','#f0932b','#d63031','#e55039'],
  forest: ['#00b894','#55efc4','#26de81','#20bf6b','#0fb9b1','#2bcbba','#43e97b','#38f9d7','#11998e','#009432'],
  mono:   ['#636e72','#2d3436','#b2bec3','#74b9ff','#dfe6e9','#4a4a4a','#888','#aaa','#ccc','#555']
};

let wheelCtx, wheelCanvas, heroCtx, heroCanvas;
let currentEntries = ['Alice','Bob','Charlie','Diana','Edward'];
let currentTheme = 'vivid';
let wheelRotation = 0;
let isSpinning = false;
let spinAnim = null;
let targetAngle = 0;
let spinCount = 0;

function initWheelCanvases() {
  wheelCanvas = document.getElementById('wheelCanvas');
  wheelCtx = wheelCanvas.getContext('2d');
  heroCanvas = document.getElementById('heroCanvas');
  heroCtx = heroCanvas.getContext('2d');
  drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);
  drawWheel(heroCtx, heroCanvas.width, ['Alice','Bob','Charlie','Diana','Edward','Frank'], 'vivid', 0, true);
  // Slowly spin hero wheel
  let heroRot = 0;
  setInterval(() => {
    heroRot += 0.005;
    drawWheel(heroCtx, heroCanvas.width, ['Alice','Bob','Charlie','Diana','Edward','Frank'], 'vivid', heroRot, true);
  }, 16);
}

function drawWheel(ctx, size, entries, theme, rotation, isHero = false) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  const n = entries.length;
  if (!n) return;
  const colors = THEMES[theme] || THEMES.vivid;
  const arc = (Math.PI * 2) / n;

  ctx.clearRect(0, 0, size, size);

  // Outer glow ring
  const grd = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r + 4);
  grd.addColorStop(0, 'rgba(255,107,107,0)');
  grd.addColorStop(1, 'rgba(255,107,107,0.15)');
  ctx.beginPath();
  ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  for (let i = 0; i < n; i++) {
    const startAngle = rotation + i * arc - Math.PI / 2;
    const endAngle = startAngle + arc;
    const color = colors[i % colors.length];

    // Segment
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Subtle inner highlight
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.95, startAngle, startAngle + arc * 0.5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();

    // Divider lines
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle));
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'white';
    const maxLen = r * 0.78;
    let fontSize = isHero ? Math.min(13, r * 0.14) : Math.min(16, r * 0.11);
    if (n > 20) fontSize = Math.max(8, fontSize * 0.7);
    if (n > 40) fontSize = Math.max(6, fontSize * 0.6);
    ctx.font = `bold ${fontSize}px 'Nunito', sans-serif`;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 4;
    let label = entries[i];
    // Truncate if needed
    while (ctx.measureText(label).width > maxLen - 12 && label.length > 1) {
      label = label.slice(0, -1);
    }
    if (label !== entries[i]) label += '…';
    ctx.fillText(label, maxLen, fontSize / 3);
    ctx.restore();
  }

  // Center circle
  const centerR = isHero ? size * 0.1 : size * 0.085;
  const cGrad = ctx.createRadialGradient(cx - centerR * 0.3, cy - centerR * 0.3, 0, cx, cy, centerR);
  cGrad.addColorStop(0, '#ffffff');
  cGrad.addColorStop(1, '#ffe0e0');
  ctx.beginPath();
  ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
  ctx.fillStyle = cGrad;
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Outer border
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 4);
}

// ---- FIXED WINNER INDEX ---- 
function getWinnerIndex(rotation, n) {
  const arc = (Math.PI * 2) / n;
  // The pointer is at top (12 o'clock) = -PI/2 in our coordinate system.
  // We need to find which segment is centered at that angle.
  // The center of segment i is at angle: rotation + i*arc - PI/2 + arc/2
  // We want that to equal -PI/2 (top) => rotation + i*arc + arc/2 = 0 => i = -rotation/arc - 0.5
  // Using floor and modulo.
  let idx = Math.floor((-rotation - arc / 2) / arc);
  idx = ((idx % n) + n) % n;
  return idx;
}

function spinWheel() {
  if (isSpinning || currentEntries.length === 0) return;
  isSpinning = true;
  spinCount++;

  // Disable buttons
  document.getElementById('spinBtn').disabled = true;
  document.getElementById('spinBtnText').textContent = '⏳';

  // Random extra rotations (5-10 full rounds) + random target segment
  const winnerIdx = Math.floor(Math.random() * currentEntries.length);
  const arc = (Math.PI * 2) / currentEntries.length;
  const extraSpins = (5 + Math.random() * 5) * Math.PI * 2;
  // We want the winner segment's center to align with the pointer (top = -PI/2)
  // The center of segment i is at rotation + i*arc - PI/2 + arc/2
  // We want: rotation + winnerIdx*arc - PI/2 + arc/2 = -PI/2 (mod 2PI)
  // => rotation = -winnerIdx*arc - arc/2 (mod 2PI)
  // We'll spin extraSpins and then settle at that rotation.
  const finalRotation = extraSpins - winnerIdx * arc - arc / 2;
  // Ensure positive
  const targetRotFinal = finalRotation + Math.ceil(Math.abs(finalRotation) / (Math.PI * 2)) * (Math.PI * 2);
  
  const startRot = wheelRotation;
  const totalDelta = targetRotFinal - startRot;
  const duration = 4000 + Math.random() * 1000;
  const startTime = performance.now();

  // Tick sound setup
  let lastTickIdx = -1;

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const easedT = easeOut(t);
    wheelRotation = startRot + totalDelta * easedT;

    drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);

    // Tick sound (simulated by updating a visual)
    const currentIdx = getWinnerIndex(wheelRotation, currentEntries.length);
    if (currentIdx !== lastTickIdx) {
      lastTickIdx = currentIdx;
      if (document.getElementById('soundOpt').checked) playTick();
    }

    if (t < 1) {
      spinAnim = requestAnimationFrame(animate);
    } else {
      wheelRotation = targetRotFinal;
      isSpinning = false;
      document.getElementById('spinBtn').disabled = false;
      document.getElementById('spinBtnText').textContent = 'SPIN';
      drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);
      onSpinComplete(winnerIdx);
    }
  }

  spinAnim = requestAnimationFrame(animate);
}

// Simple Web Audio tick
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTick() {
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.05, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.05);
  } catch(e) {}
}
function playWin() {
  try {
    const ac = getAudioCtx();
    const freqs = [523, 659, 784, 1047];
    freqs.forEach((f, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.frequency.value = f;
      const t = ac.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
    });
  } catch(e) {}
}
