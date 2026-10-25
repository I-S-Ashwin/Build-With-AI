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

  // 2. Web Audio Sound Engine (Chime, Tactile Clicks, & Whoosh)
  const AudioEngine = {
    ctx: null,
    getCtx() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    },

    playClick() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      } catch (e) {}
    },

    playWhoosh() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.55);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.56);
      } catch (e) {}
    },

    playChime() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
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
      } catch (e) {}
    }
  };

  window.AudioEngine = AudioEngine;

  // Attach tactile sound to interactive elements
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn, .symptom-chip, .btn-energy-tag, .btn-mic')) {
      AudioEngine.playClick();
    }
  });

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
  AudioEngine.playChime();
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

  // Handle direct microphone audio stream submissions
  async function handleAudioTriageSubmission(base64Audio, mimeType) {
    const userMsgEl = appendMessageBubble('user', '🎙️ Spoken Consultation Recording...');
    showTypingIndicator();

    try {
      const res = await window.GeminiService.sendAudioRecording(base64Audio, mimeType);
      removeTypingIndicator();

      // Update user bubble with the exact transcribed words Gemini heard!
      if (userMsgEl && res.userSpokenText) {
        const p = userMsgEl.querySelector('.msg-body p');
        if (p) p.textContent = `🎙️ "${res.userSpokenText}"`;
      }

      appendMessageBubble('assistant', res.reply.text, res.reply.outcome);

      window.currentTriageOutcome = res.reply;
      if (window.onTriageResultReady) {
        window.onTriageResultReady(res.reply);
      }
    } catch (err) {
      removeTypingIndicator();
      appendMessageBubble('assistant', 'Could not process audio recording. Please verify your Gemini API key in the top right, or type symptoms below.');
      console.error('Audio triage error:', err);
    }
  }

  window.handleAudioTriageSubmission = handleAudioTriageSubmission;

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

  // 8. Voice Recognition Setup (Slice 3)
  const btnMic = document.getElementById('btn-mic-record');
  const micStatusText = document.getElementById('mic-status-text');
  const liveVoicePreview = document.getElementById('live-voice-preview');
  const liveVoiceText = document.getElementById('live-voice-text');

  if (window.VoiceService && btnMic) {
    window.VoiceService.onRecordingStateChange = (isRec) => {
      if (isRec) {
        btnMic.classList.add('recording');
        if (micStatusText) micStatusText.textContent = 'Listening... Speak symptoms (Tap red mic again when done)';
        if (liveVoicePreview) liveVoicePreview.style.display = 'flex';
      } else {
        btnMic.classList.remove('recording');
        if (micStatusText) micStatusText.textContent = 'Tap microphone to speak symptoms';
        if (liveVoicePreview) liveVoicePreview.style.display = 'none';
      }
    };

    window.VoiceService.onTranscriptChange = (words) => {
      if (liveVoiceText) liveVoiceText.textContent = words || 'Listening...';
      if (inputSymptoms) inputSymptoms.value = words || '';
    };

    window.VoiceService.onError = (errMessage) => {
      if (micStatusText) micStatusText.textContent = errMessage;
    };

    btnMic.addEventListener('click', () => {
      window.VoiceService.toggle();
    });
  }

  // 9. Full-Screen Cinematic Response Display (Slice 3)
  const screenFullscreen = document.getElementById('screen-fullscreen-response');
  const fullscreenOutcomePill = document.getElementById('fullscreen-outcome-pill');
  const fullscreenHeadline = document.getElementById('fullscreen-headline');
  const fullscreenAdviceText = document.getElementById('fullscreen-advice-text');
  const fullscreenBodyScroll = document.querySelector('.fullscreen-body-scroll');
  const btnFullscreenDismiss = document.getElementById('btn-fullscreen-dismiss');

  function openFullscreenResponse(result) {
    if (!screenFullscreen) return;

    const isDoctor = result.outcome === 'see-doctor';
    if (isDoctor) {
      fullscreenOutcomePill.className = 'triage-outcome-tag tag-doctor';
      fullscreenOutcomePill.innerHTML = '⚠️ Professional Evaluation Recommended';
      fullscreenHeadline.textContent = 'Clinical Physician Referral';
      if (fullscreenBodyScroll) fullscreenBodyScroll.classList.remove('home-remedy');
    } else {
      fullscreenOutcomePill.className = 'triage-outcome-tag tag-home';
      fullscreenOutcomePill.innerHTML = '🌿 Self-Care Protocol';
      fullscreenHeadline.textContent = 'Routine At-Home Recovery Care';
      if (fullscreenBodyScroll) fullscreenBodyScroll.classList.add('home-remedy');
    }

    fullscreenAdviceText.textContent = result.text;
    screenFullscreen.style.display = 'flex';
  }

  function closeFullscreenResponse() {
    if (screenFullscreen) {
      screenFullscreen.style.display = 'none';
    }
    // Triggers paper-throw save in Slice 4
    if (window.onTriageSessionClosed && window.currentTriageOutcome) {
      window.onTriageSessionClosed(window.currentTriageOutcome);
    }
  }

  if (btnFullscreenDismiss) {
    btnFullscreenDismiss.addEventListener('click', closeFullscreenResponse);
  }

  // Hook triage completion to trigger full-screen presentation
  window.onTriageResultReady = (result) => {
    if (result && result.isFinal) {
      setTimeout(() => {
        openFullscreenResponse(result);
      }, 700); // Short dramatic beat after message arrives
    }
  };

  // 10. Weekly Heatmap & Energy Selector Engine
  const heatmapRow = document.getElementById('wellness-heatmap-row');
  const energyButtons = document.querySelectorAll('.btn-energy-tag');

  function renderWeeklyHeatmap() {
    if (!heatmapRow) return;
    heatmapRow.innerHTML = '';

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = (new Date().getDay() + 6) % 7; // Convert Sun=0 to Mon=0
    const sessions = window.Storage ? window.Storage.getSessions() : [];

    dayNames.forEach((name, idx) => {
      const cell = document.createElement('div');
      cell.className = 'heatmap-day-cell';

      const label = document.createElement('span');
      label.className = 'heatmap-day-label';
      label.textContent = name;

      const tile = document.createElement('div');
      tile.className = 'heatmap-tile';
      if (idx === todayIndex) {
        tile.classList.add('today');
      }

      // Check if session exists on this day of current week
      if (idx === todayIndex && sessions.length > 0) {
        const latest = sessions[0];
        if (latest.outcome === 'see-doctor') {
          tile.classList.add('doctor');
          tile.title = `Today: ${latest.summary} (Doctor Advised)`;
        } else {
          tile.classList.add('home');
          tile.title = `Today: ${latest.summary} (Home Care)`;
        }
      } else if (idx < todayIndex) {
        tile.classList.add('clear');
        tile.title = `${name}: Symptom Free`;
      } else {
        tile.title = `${name}: Upcoming`;
      }

      cell.appendChild(label);
      cell.appendChild(tile);
      heatmapRow.appendChild(cell);
    });
  }

  // Energy Level selection
  energyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      energyButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const level = btn.getAttribute('data-energy');
      localStorage.setItem('medisense_energy', level);
    });
  });

  // Restore saved energy
  const savedEnergy = localStorage.getItem('medisense_energy');
  if (savedEnergy) {
    energyButtons.forEach(btn => {
      if (btn.getAttribute('data-energy') === savedEnergy) {
        energyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  }

  renderWeeklyHeatmap();
  window.renderWeeklyHeatmap = renderWeeklyHeatmap;

  // Global helper for subsequent slices to jump to app view
  window.MediSenseApp = {
    showScreen,
    applyTheme,
    appendMessageBubble,
    openFullscreenResponse,
    closeFullscreenResponse
  };
});
