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

  // 6. API Key Modal Handler
  const btnApiKey = document.getElementById('btn-api-key');
  const modalApiKey = document.getElementById('modal-api-key');
  const btnCloseApiKey = document.getElementById('btn-close-api-key');
  const btnSaveApiKey = document.getElementById('btn-save-api-key');
  const inputGeminiKey = document.getElementById('input-gemini-key');

  if (btnApiKey && modalApiKey) {
    btnApiKey.addEventListener('click', () => {
      if (inputGeminiKey && window.GeminiService) {
        inputGeminiKey.value = window.GeminiService.getApiKey() || '';
      }
      modalApiKey.classList.add('active');
    });

    btnCloseApiKey.addEventListener('click', () => {
      modalApiKey.classList.remove('active');
    });

    btnSaveApiKey.addEventListener('click', () => {
      const val = inputGeminiKey.value.trim();
      if (window.GeminiService) {
        window.GeminiService.setApiKey(val);
      }
      modalApiKey.classList.remove('active');
      alert(val ? 'Gemini API key saved locally!' : 'API key cleared. MediSense will use local triage heuristics.');
    });
  }

  // 7. Chat Conversation Handling
  const formChatText = document.getElementById('form-chat-text');
  const inputSymptoms = document.getElementById('input-symptoms-text');
  const messagesContainer = document.getElementById('chat-messages-container');
  const emptyNotice = document.getElementById('chat-empty-notice');

  function appendMessageBubble(role, text, outcome = null) {
    if (emptyNotice) {
      emptyNotice.style.display = 'none';
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${role}`;

    const authorDiv = document.createElement('div');
    authorDiv.className = 'msg-author';
    if (role === 'user') {
      authorDiv.textContent = 'You';
    } else {
      authorDiv.innerHTML = '<span style="color:var(--mondrian-red);">■</span> MediSense';
    }

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'msg-body';

    if (outcome === 'see-doctor') {
      const tag = document.createElement('div');
      tag.className = 'triage-outcome-tag tag-doctor';
      tag.innerHTML = '⚠️ Clinical Referral Required';
      bodyDiv.appendChild(tag);
    } else if (outcome === 'home-remedy') {
      const tag = document.createElement('div');
      tag.className = 'triage-outcome-tag tag-home';
      tag.innerHTML = '🌿 Routine Home Care Suggested';
      bodyDiv.appendChild(tag);
    }

    const textP = document.createElement('p');
    textP.textContent = text;
    bodyDiv.appendChild(textP);

    msgDiv.appendChild(authorDiv);
    msgDiv.appendChild(bodyDiv);
    messagesContainer.appendChild(msgDiv);

    // Auto-scroll
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'active-typing-indicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <span style="font-size:0.8rem; font-weight:700; margin-left:0.3rem; color:var(--text-muted);">Consulting medical knowledge...</span>
    `;
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('active-typing-indicator');
    if (indicator) indicator.remove();
  }

  async function handleUserTriageSubmission(userText) {
    const text = userText.trim();
    if (!text) return;

    appendMessageBubble('user', text);
    showTypingIndicator();

    try {
      const result = await window.GeminiService.sendMessage(text);
      removeTypingIndicator();
      appendMessageBubble('assistant', result.text, result.outcome);

      // Store in active session context for full screen & save in Slices 3 & 4
      window.currentTriageOutcome = result;
      if (window.onTriageResultReady) {
        window.onTriageResultReady(result);
      }
    } catch (err) {
      removeTypingIndicator();
      appendMessageBubble('assistant', 'I encountered an error analyzing those symptoms. Please try typing them again.');
      console.error('Triage submission error:', err);
    }
  }

  if (formChatText) {
    formChatText.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = inputSymptoms.value;
      if (!val.trim()) return;
      inputSymptoms.value = '';
      handleUserTriageSubmission(val);
    });
  }

  // Expose submission handler for voice integration in Slice 3
  window.handleUserTriageSubmission = handleUserTriageSubmission;

  // Global helper for subsequent slices to jump to app view
  window.MediSenseApp = {
    showScreen,
    applyTheme,
    appendMessageBubble
  };
});
