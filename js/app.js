// app.js — Main Application Logic

const PRESET_WHEELS = {
  names: {
    title: '👥 Names Wheel',
    placeholder: 'Enter names (one per line)\n\nAlice\nBob\nCharlie\nDiana\nEdward',
    entries: ['Alice','Bob','Charlie','Diana','Edward']
  },
  yesno: {
    title: '🤔 Yes / No Wheel',
    placeholder: '',
    entries: ['Yes ✅','No ❌','Maybe 🤔','Definitely!','Absolutely Not','Ask Again']
  },
  numbers: {
    title: '🔢 Number Wheel',
    placeholder: '',
    entries: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']
  },
  colors: {
    title: '🎨 Color Wheel',
    placeholder: '',
    entries: ['🔴 Red','🟠 Orange','🟡 Yellow','🟢 Green','🔵 Blue','🟣 Purple','🩷 Pink','🤎 Brown','⬛ Black','⬜ White']
  },
  truth: {
    title: '🎯 Truth or Dare',
    placeholder: '',
    entries: ['Truth 🫢','Dare 😈','Double Dare 🔥','Truth x2 😮','Skip ⏭️','Wild Card 🃏']
  },
  custom: {
    title: '⚙️ Custom Wheel',
    placeholder: 'Enter your custom options\n(one per line)',
    entries: ['Option 1','Option 2','Option 3','Option 4']
  }
};

let spinHistory = [];
let lastWinner = null;
let currentWheelType = 'names';

window.addEventListener('DOMContentLoaded', () => {
  initWheelCanvases();
  loadPreset('names');
  renderEntriesList();
  setupScrollAnimations();
});

// ---- WHEEL TYPE SWITCHING ---- //
function switchWheel(type) {
  currentWheelType = type;
  document.querySelectorAll('.wt-card').forEach(c => {
    c.classList.toggle('active', c.dataset.wheel === type);
  });
  loadPreset(type);
  document.getElementById('spinner').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function loadPreset(type) {
  const preset = PRESET_WHEELS[type];
  if (!preset) return;
  document.getElementById('wheelTitle').textContent = preset.title;
  if (preset.placeholder) document.getElementById('entriesInput').placeholder = preset.placeholder;
  currentEntries = [...preset.entries];
  document.getElementById('entriesInput').value = preset.entries.join('\n');
  renderEntriesList();
  drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);
}

// ---- ENTRIES MANAGEMENT ---- //
function updateWheelFromInput() {
  const lines = document.getElementById('entriesInput').value
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
  if (lines.length === 0) { showToast('⚠️ Please add at least one entry!'); return; }
  if (lines.length > 100) { showToast('⚠️ Max 100 entries allowed!'); return; }
  currentEntries = lines;
  renderEntriesList();
  drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);
  showToast(`✅ Wheel updated with ${lines.length} entries!`);
}

function renderEntriesList() {
  const ul = document.getElementById('entriesList');
  const colors = THEMES[currentTheme];
  ul.innerHTML = '';
  currentEntries.forEach((name, i) => {
    const li = document.createElement('li');
    li.className = 'entry-item';
    li.innerHTML = `
      <span class="entry-dot" style="background:${colors[i % colors.length]}"></span>
      <span class="entry-name" title="${escHtml(name)}">${escHtml(name)}</span>
      <button class="entry-del" onclick="removeEntry(${i})" title="Remove">✕</button>`;
    ul.appendChild(li);
  });
  document.getElementById('entryCount').textContent = `${currentEntries.length} entr${currentEntries.length === 1 ? 'y' : 'ies'}`;
}

function removeEntry(idx) {
  currentEntries.splice(idx, 1);
  document.getElementById('entriesInput').value = currentEntries.join('\n');
  renderEntriesList();
  drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);
}

function shuffleEntries() {
  for (let i = currentEntries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentEntries[i], currentEntries[j]] = [currentEntries[j], currentEntries[i]];
  }
  document.getElementById('entriesInput').value = currentEntries.join('\n');
  renderEntriesList();
  drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);
  showToast('🔀 Entries shuffled!');
}

function sortEntries() {
  currentEntries.sort((a, b) => a.localeCompare(b));
  document.getElementById('entriesInput').value = currentEntries.join('\n');
  renderEntriesList();
  drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);
  showToast('🔤 Entries sorted A–Z!');
}

function clearAll() {
  if (!confirm('Clear all entries?')) return;
  currentEntries = [];
  document.getElementById('entriesInput').value = '';
  renderEntriesList();
  drawWheel(wheelCtx, wheelCanvas.width, [], currentTheme, 0);
  showToast('🗑️ All entries cleared!');
}

function removeLastWinner() {
  if (!lastWinner) { showToast('No winner to remove yet!'); return; }
  const idx = currentEntries.indexOf(lastWinner);
  if (idx !== -1) {
    currentEntries.splice(idx, 1);
    document.getElementById('entriesInput').value = currentEntries.join('\n');
    renderEntriesList();
    drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);
    showToast(`🗑️ "${lastWinner}" removed!`);
    lastWinner = null;
  } else {
    showToast('Winner not found in list!');
  }
}

// ---- THEME ---- //
function setTheme(theme) {
  currentTheme = theme;
  document.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s.dataset.theme === theme));
  renderEntriesList();
  drawWheel(wheelCtx, wheelCanvas.width, currentEntries, currentTheme, wheelRotation);
  showToast('🎨 Theme changed!');
}

// ---- SPIN COMPLETE ---- //
function onSpinComplete(winnerIdx) {
  const winner = currentEntries[winnerIdx];
  lastWinner = winner;

  if (document.getElementById('soundOpt').checked) playWin();

  // Update results panel
  const n = spinCount;
  document.getElementById('winnerDisplay').innerHTML = `
    <div class="winner-card">
      <div class="w-emoji">🏆</div>
      <div class="w-label">Winner!</div>
      <div class="w-name">${escHtml(winner)}</div>
      <div class="w-spin-num">Spin #${n}</div>
    </div>`;

  // Show share buttons
  document.getElementById('shareResult').style.display = 'flex';

  // Add to history
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  spinHistory.unshift({ name: winner, time: timeStr });
  renderHistory();

  // Confetti
  if (document.getElementById('confettiOpt').checked) launchConfetti();

  // Remove winner option
  if (document.getElementById('removeWinner').checked) {
    setTimeout(() => {
      removeEntry(winnerIdx);
      showToast(`🗑️ "${winner}" removed from wheel!`);
    }, 600);
  }

  // Show modal after brief delay
  setTimeout(() => showWinnerModal(winner), 700);
}

function renderHistory() {
  const ul = document.getElementById('historyList');
  if (!spinHistory.length) { ul.innerHTML = '<li class="history-empty">No spins yet</li>'; return; }
  ul.innerHTML = spinHistory.slice(0, 20).map((h, i) =>
    `<li class="history-item">
      <span class="hi-name">${i === 0 ? '🏆 ' : ''}${escHtml(h.name)}</span>
      <span class="hi-time">${h.time}</span>
    </li>`
  ).join('');
}

function clearHistory() {
  spinHistory = [];
  renderHistory();
  showToast('🗑️ History cleared!');
}

// ---- MODAL ---- //
function showWinnerModal(name) {
  document.getElementById('modalWinnerName').textContent = name;
  document.getElementById('winnerModal').classList.add('active');
}
function closeModal() {
  document.getElementById('winnerModal').classList.remove('active');
}

// ---- SHARE ---- //
function shareResult() {
  if (!lastWinner) return;
  const text = `🎡 The spin wheel picked: "${lastWinner}"! Try it at nameswheel.github.io`;
  if (navigator.share) {
    navigator.share({ title: 'Names On Wheel Result', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('✅ Result copied for sharing!'));
  }
}
function copyResult() {
  if (!lastWinner) return;
  navigator.clipboard.writeText(`Winner: ${lastWinner}`).then(() => showToast('📋 Copied to clipboard!'));
}

// ---- CONFETTI ---- //
function launchConfetti() {
  const colors = ['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#a29bfe','#1dd1a1','#54a0ff'];
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -20px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${2 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 15);
  }
}

// ---- FAQ ---- //
function toggleFaq(btn) {
  const item = btn.parentElement;
  item.classList.toggle('open');
}

// ---- TOAST ---- //
let toastTimeout;
function showToast(msg) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'globalToast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ---- SCROLL ANIMATIONS ---- //
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeInUp 0.6s ease forwards';
        e.target.style.animationDelay = e.target.dataset.delay || '0s';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.step-card, .feat-card, .use-card, .wt-card, .faq-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.dataset.delay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
}

// ---- UTILS ---- //
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.id === 'winnerModal') closeModal();
});

// Keyboard shortcut: Space = Spin
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
    e.preventDefault();
    spinWheel();
  }
});
