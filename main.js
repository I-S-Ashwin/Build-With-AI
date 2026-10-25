// MediSense — Main Application Controller

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const screenOpening = document.getElementById('screen-opening');
  const screenPreview = document.getElementById('screen-preview');
  const screenLogin = document.getElementById('screen-login');
  const screenApp = document.getElementById('screen-app');

  const btnPreviewLogin = document.getElementById('btn-preview-login');
  const btnLoginBack = document.getElementById('btn-login-back');
  const formLogin = document.getElementById('form-login');
  const inputUsername = document.getElementById('input-username');

  const btnThemeToggle = document.querySelectorAll('.theme-toggle-btn');
  const btnLogout = document.getElementById('btn-logout');
  const userDisplayBadge = document.getElementById('user-display-name');

  // 1. Initialize Theme from Storage
  const savedTheme = window.Storage ? window.Storage.getTheme() : 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (window.Storage) window.Storage.setTheme(theme);
    btnThemeToggle.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    });
  }

  btnThemeToggle.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // 2. Web Audio Harmonic Chime for Cinematic Opening
  function playCinematicChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Triad Chime: C5 (523Hz), E5 (659Hz), G5 (784Hz) with warm decay
      const freqs = [523.25, 659.25, 783.99];
      const now = ctx.currentTime;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch (e) {
      console.warn('Audio chime autoplay restricted by browser policy; user interaction will enable sound.');
    }
  }

  // 3. Screen Router
  function showScreen(targetScreen) {
    [screenOpening, screenPreview, screenLogin, screenApp].forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (targetScreen) {
      targetScreen.classList.add('active');
    }
  }

  // 4. Opening Drop Intro Timing (2 Seconds)
  playCinematicChime();
  setTimeout(() => {
    // If user already exists in storage, we can still show preview or route
    const user = window.Storage ? window.Storage.getUser() : null;
    if (user && user.username) {
      userDisplayBadge.textContent = user.username;
    }
    showScreen(screenPreview);
  }, 2000);

  // 5. Navigation Events
  if (btnPreviewLogin) {
    btnPreviewLogin.addEventListener('click', () => {
      const user = window.Storage ? window.Storage.getUser() : null;
      if (user && user.username) {
        // Already logged in before
        userDisplayBadge.textContent = user.username;
        showScreen(screenApp);
      } else {
        showScreen(screenLogin);
        if (inputUsername) inputUsername.focus();
      }
    });
  }

  if (btnLoginBack) {
    btnLoginBack.addEventListener('click', () => {
      showScreen(screenPreview);
    });
  }

  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = inputUsername.value.trim();
      if (!val) return;

      const user = window.Storage ? window.Storage.setUser(val) : { username: val };
      if (userDisplayBadge) userDisplayBadge.textContent = user.username;
      showScreen(screenApp);
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (window.Storage) window.Storage.clearUser();
      if (inputUsername) inputUsername.value = '';
      showScreen(screenPreview);
    });
  }

  // Global helper for subsequent slices to jump to app view
  window.MediSenseApp = {
    showScreen,
    applyTheme
  };
});
