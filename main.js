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
      btn.innerHTML = theme === 'dark' 
        ? '<span class="theme-pill-track"><span class="theme-cube sun">☀️</span></span><span class="theme-pill-text">Broadway Day</span>'
        : '<span class="theme-pill-track"><span class="theme-cube moon">🌙</span></span><span class="theme-pill-text">Broadway Night</span>';
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

  // Demo mode: bypass login entirely — enters as "Demo Patient"
  function enterDemoMode() {
    const user = window.Storage ? window.Storage.setUser('Demo Patient') : { username: 'Demo Patient' };
    if (userDisplayBadge) userDisplayBadge.textContent = user.username;
    showScreen(screenApp);
  }

  const btnDemoLogin = document.getElementById('btn-demo-login');
  if (btnDemoLogin) btnDemoLogin.addEventListener('click', enterDemoMode);

  const btnDemoHeader = document.getElementById('btn-demo-header');
  if (btnDemoHeader) btnDemoHeader.addEventListener('click', enterDemoMode);

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
      if (window.showMediSenseToast) window.showMediSenseToast(val ? 'Gemini API key saved locally!' : 'API key cleared. Using offline triage.');
    });
  }

  // 7. Chat Conversation Handling
  const formChatText = document.getElementById('form-chat-text');
  const inputSymptoms = document.getElementById('input-symptoms-text');
  const messagesContainer = document.getElementById('chat-messages-container');
  const emptyNotice = document.getElementById('chat-empty-notice');

  // Markdown formatting helper (converts **bold**, lists, and headers to styled HTML)
  function renderFormattedMarkdown(text) {
    if (!text) return '';

    // 1. Escape HTML
    let safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // 2. Bold: **text** or __text__
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // 3. Italics: *text* or _text_
    safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    safe = safe.replace(/_([^_]+)_/g, '<em>$1</em>');

    // 4. Line by line parsing for paragraphs and bullet lists
    const lines = safe.split('\n');
    const processed = [];
    let inList = false;

    lines.forEach(rawLine => {
      const line = rawLine.trim();
      if (!line) {
        if (inList) {
          processed.push('</ul>');
          inList = false;
        }
        return;
      }

      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.replace(/^[•\-\*]\s*/, '');
        if (!inList) {
          processed.push('<ul class="formatted-list">');
          inList = true;
        }
        processed.push(`<li>${itemText}</li>`);
      } else {
        if (inList) {
          processed.push('</ul>');
          inList = false;
        }
        if (line.startsWith('### ')) {
          processed.push(`<h4 class="formatted-h4">${line.slice(4)}</h4>`);
        } else if (line.startsWith('## ')) {
          processed.push(`<h3 class="formatted-h3">${line.slice(3)}</h3>`);
        } else {
          processed.push(`<p class="formatted-p">${line}</p>`);
        }
      }
    });

    if (inList) {
      processed.push('</ul>');
    }

    return processed.join('');
  }
  window.renderFormattedMarkdown = renderFormattedMarkdown;

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

    if (role === 'user') {
      const textP = document.createElement('p');
      textP.textContent = text;
      bodyDiv.appendChild(textP);
    } else {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'msg-formatted-content';
      contentDiv.innerHTML = renderFormattedMarkdown(text);
      bodyDiv.appendChild(contentDiv);

      if (outcome) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'triage-chat-actions';
        actionsDiv.innerHTML = `
          <button type="button" class="btn btn-primary btn-save-bubble">💾 Save Consultation</button>
          <button type="button" class="btn btn-secondary btn-expand-bubble">🔍 Fullscreen View</button>
        `;
        const btnSave = actionsDiv.querySelector('.btn-save-bubble');
        const btnExpand = actionsDiv.querySelector('.btn-expand-bubble');

        btnSave.onclick = () => {
          if (window.onTriageSessionClosed && window.currentTriageOutcome) {
            window.onTriageSessionClosed(window.currentTriageOutcome);
            window.isCurrentSessionSaved = true;
            btnSave.disabled = true;
            btnSave.innerHTML = '✓ Saved to Bin';
          }
        };

        btnExpand.onclick = () => {
          if (window.currentTriageOutcome) {
            openFullscreenResponse(window.currentTriageOutcome);
          }
        };

        bodyDiv.appendChild(actionsDiv);
      }
    }

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

  function askSaveBeforeProceeding(text, onProceed) {
    const banner = document.createElement('div');
    banner.className = 'reask-save-banner';
    banner.id = 'reask-save-prompt';
    banner.innerHTML = `
      <div>
        <strong style="text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.04em;">📋 Active Assessment Unsaved:</strong>
        <p style="margin: 0.2rem 0 0; font-size: 0.88rem;">Would you like to save your previous consultation before analyzing new symptoms?</p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" class="btn btn-primary" id="btn-reask-save" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">💾 Save & Continue</button>
        <button type="button" class="btn btn-secondary" id="btn-reask-skip" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">Continue without Saving</button>
      </div>
    `;
    messagesContainer.appendChild(banner);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const btnSave = banner.querySelector('#btn-reask-save');
    const btnSkip = banner.querySelector('#btn-reask-skip');

    btnSave.onclick = () => {
      banner.remove();
      if (window.onTriageSessionClosed && window.currentTriageOutcome) {
        window.onTriageSessionClosed(window.currentTriageOutcome);
      }
      window.isCurrentSessionSaved = true;
      onProceed();
    };

    btnSkip.onclick = () => {
      banner.remove();
      window.isCurrentSessionSaved = true;
      onProceed();
    };
  }

  async function executeTriageSubmission(text) {
    appendMessageBubble('user', text);
    showTypingIndicator();

    try {
      const result = await window.GeminiService.sendMessage(text);
      removeTypingIndicator();
      appendMessageBubble('assistant', result.text, result.outcome);

      // Store in active session context
      window.currentTriageOutcome = result;
      window.isCurrentSessionSaved = false;
      if (window.onTriageResultReady) {
        window.onTriageResultReady(result);
      }
    } catch (err) {
      removeTypingIndicator();
      appendMessageBubble('assistant', 'I encountered an error analyzing those symptoms. Please try typing them again.');
      console.error('Triage submission error:', err);
    }
  }

  async function handleUserTriageSubmission(userText) {
    const text = userText.trim();
    if (!text) return;

    if (window.currentTriageOutcome && !window.isCurrentSessionSaved) {
      document.getElementById('reask-save-prompt')?.remove();
      askSaveBeforeProceeding(text, () => executeTriageSubmission(text));
      return;
    }

    executeTriageSubmission(text);
  }

  // Handle direct microphone audio stream submissions
  async function handleAudioTriageSubmission(base64Audio, mimeType, audioUrl = null, audioBlob = null) {
    const userMsgEl = appendMessageBubble('user', '🎙️ Spoken Audio Consultation');
    
    // Attach playable audio player if available
    if (userMsgEl && audioUrl) {
      const bodyDiv = userMsgEl.querySelector('.msg-body');
      if (bodyDiv) {
        const audioPlayer = document.createElement('audio');
        audioPlayer.controls = true;
        audioPlayer.src = audioUrl;
        audioPlayer.style.width = '100%';
        audioPlayer.style.marginTop = '8px';
        audioPlayer.style.borderRadius = '4px';
        bodyDiv.appendChild(audioPlayer);
      }
    }

    showTypingIndicator();

    const apiKey = window.GeminiService ? window.GeminiService.getApiKey() : '';

    if (apiKey) {
      // Live Gemini Multimodal Audio Transcription
      try {
        const res = await window.GeminiService.sendAudioRecording(base64Audio, mimeType);
        removeTypingIndicator();

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
        appendMessageBubble('assistant', 'Could not process audio with Gemini API. Please check your key or type below.');
      }
    } else {
      // 100% Offline Mode: On-Device OpenAI Whisper (via Transformers.js WebAssembly)
      const statusLabel = document.createElement('div');
      statusLabel.style.fontSize = '0.75rem';
      statusLabel.style.fontWeight = '700';
      statusLabel.style.color = 'var(--text-muted)';
      statusLabel.style.marginTop = '4px';
      statusLabel.textContent = 'Transcribing voice on-device with OpenAI Whisper...';
      if (userMsgEl) userMsgEl.querySelector('.msg-body').appendChild(statusLabel);

      if (window.LocalWhisperService && audioBlob) {
        try {
          const transcribedText = await window.LocalWhisperService.transcribeAudioBlob(audioBlob, (statusText) => {
            statusLabel.textContent = statusText;
          });

          removeTypingIndicator();
          statusLabel.remove();

          if (transcribedText && transcribedText.trim()) {
            // Update user message bubble with the exact words Whisper transcribed!
            const p = userMsgEl.querySelector('.msg-body p');
            if (p) p.textContent = `🎙️ "${transcribedText}"`;

            // Now analyze the transcribed words through our medical triage engine!
            showTypingIndicator();
            const result = await window.GeminiService.sendMessage(transcribedText);
            removeTypingIndicator();

            appendMessageBubble('assistant', result.text, result.outcome);

            window.currentTriageOutcome = result;
            if (window.onTriageResultReady) {
              window.onTriageResultReady(result);
            }
            return;
          }
        } catch (err) {
          console.warn('Local Whisper on-device transcription error, falling back:', err);
          statusLabel.remove();
        }
      }

      // Safe Fallback if WebAssembly transcription is unready
      removeTypingIndicator();
      let followUp = "I have received your recorded voice consultation. Could you tell me more about how many days you've felt this way?";
      appendMessageBubble('assistant', followUp, 'ongoing');
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

    if (fullscreenAdviceText) {
      fullscreenAdviceText.innerHTML = renderFormattedMarkdown(result.text);
    }
    screenFullscreen.style.display = 'flex';
  }

  function closeFullscreenResponse(saveSession = false) {
    if (screenFullscreen) {
      screenFullscreen.style.display = 'none';
    }
    // Only trigger the paper-throw save if explicitly saving
    if (saveSession && window.onTriageSessionClosed && window.currentTriageOutcome) {
      window.onTriageSessionClosed(window.currentTriageOutcome);
    }
  }

  if (btnFullscreenDismiss) {
    // "Save Consultation" button
    btnFullscreenDismiss.addEventListener('click', () => closeFullscreenResponse(true));
  }

  // "✕ Close" button — closes fullscreen without auto-saving
  const btnFullscreenCloseNoSave = document.getElementById('btn-fullscreen-close-nosave');
  if (btnFullscreenCloseNoSave) {
    btnFullscreenCloseNoSave.addEventListener('click', () => closeFullscreenResponse(false));
  }

  // ── Close Consultation button in chat bar ──────────────────────────
  function clearChatMessages() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      const children = Array.from(container.children);
      children.forEach((c, i) => { if (i > 0) c.remove(); });
    }
    window.currentTriageOutcome = null;
    window.isCurrentSessionSaved = false;
    window.activeConversationHistory = [];
    const badge = document.getElementById('session-status-badge');
    if (badge) {
      badge.textContent = 'In Progress';
      badge.style.background = 'var(--mondrian-accent-yellow)';
      badge.style.color = 'var(--mondrian-black)';
    }
    if (window.showMediSenseToast) window.showMediSenseToast('Consultation reset. Ready for new symptoms.');
  }

  const modalCloseConsult = document.getElementById('modal-close-consultation');
  const btnCloseConsultCancel = document.getElementById('modal-close-consult-cancel');
  const btnCloseConsultNoSave = document.getElementById('modal-close-consult-nosave');
  const btnCloseConsultSave = document.getElementById('modal-close-consult-save');

  function openCloseConsultModal() {
    if (modalCloseConsult) modalCloseConsult.style.display = 'flex';
  }
  function closeCloseConsultModal() {
    if (modalCloseConsult) modalCloseConsult.style.display = 'none';
  }

  const btnCloseConsultation = document.getElementById('btn-close-consultation');
  if (btnCloseConsultation) {
    btnCloseConsultation.addEventListener('click', () => {
      // Check if there are any messages to save
      const msgs = document.querySelectorAll('#chat-messages-container .chat-msg');
      if (msgs.length > 1) {
        openCloseConsultModal();
      } else {
        clearChatMessages();
      }
    });
  }

  if (btnCloseConsultCancel) btnCloseConsultCancel.addEventListener('click', closeCloseConsultModal);

  if (btnCloseConsultNoSave) {
    btnCloseConsultNoSave.addEventListener('click', () => {
      closeCloseConsultModal();
      clearChatMessages();
    });
  }

  if (btnCloseConsultSave) {
    btnCloseConsultSave.addEventListener('click', () => {
      closeCloseConsultModal();
      // Save then clear
      if (window.onTriageSessionClosed && window.currentTriageOutcome) {
        window.onTriageSessionClosed(window.currentTriageOutcome);
      } else if (window.HistoryService) {
        // No fullscreen outcome yet — save raw chat
        window.HistoryService.triggerPaperThrowAnimation({ outcome: 'home-remedy', text: 'Consultation closed and archived.' });
      }
      setTimeout(() => clearChatMessages(), 700);
    });
  }

  // ── Global custom confirm dialog (replaces browser confirm()) ──────
  window.showCustomConfirm = function(title, message, onConfirm) {
    const modal = document.getElementById('modal-custom-confirm');
    const titleEl = document.getElementById('modal-confirm-title');
    const msgEl = document.getElementById('modal-confirm-message');
    const btnOk = document.getElementById('modal-confirm-ok');
    const btnCancel = document.getElementById('modal-confirm-cancel');
    if (!modal) { if (confirm(message)) onConfirm(); return; }

    titleEl.textContent = title;
    msgEl.textContent = message;
    modal.style.display = 'flex';

    const cleanup = () => { modal.style.display = 'none'; btnOk.onclick = null; btnCancel.onclick = null; };
    btnOk.onclick = () => { cleanup(); onConfirm(); };
    btnCancel.onclick = () => cleanup();
  };

  // Triage completion updates session status without hijacking user screen
  window.onTriageResultReady = (result) => {
    window.currentTriageOutcome = result;
    window.isCurrentSessionSaved = false;
    const badge = document.getElementById('session-status-badge');
    if (badge) {
      badge.textContent = result.outcome === 'see-doctor' ? 'Clinical Referral' : 'Home Care Ready';
      badge.style.background = result.outcome === 'see-doctor' ? 'var(--mondrian-red)' : 'var(--mondrian-blue)';
      badge.style.color = '#fff';
    }
  };

  // Wire top consultation bar and sidebar buttons
  const btnTopCloseConsult = document.getElementById('btn-top-close-consult');
  if (btnTopCloseConsult) {
    btnTopCloseConsult.addEventListener('click', () => {
      const msgs = document.querySelectorAll('#chat-messages-container .chat-msg');
      if (msgs.length > 0) {
        openCloseConsultModal();
      } else {
        clearChatMessages();
      }
    });
  }

  const btnTopSaveConsult = document.getElementById('btn-top-save-consult');
  if (btnTopSaveConsult) {
    btnTopSaveConsult.addEventListener('click', () => {
      if (window.onTriageSessionClosed && window.currentTriageOutcome) {
        window.onTriageSessionClosed(window.currentTriageOutcome);
        window.isCurrentSessionSaved = true;
      } else if (window.HistoryService) {
        window.HistoryService.triggerPaperThrowAnimation({ outcome: 'home-remedy', text: 'Consultation archived.' });
        window.isCurrentSessionSaved = true;
      }
    });
  }

  const btnSidebarNewConsult = document.getElementById('btn-sidebar-new-consult');
  if (btnSidebarNewConsult) {
    btnSidebarNewConsult.addEventListener('click', () => {
      const msgs = document.querySelectorAll('#chat-messages-container .chat-msg');
      if (msgs.length > 0 && !window.isCurrentSessionSaved) {
        openCloseConsultModal();
      } else {
        clearChatMessages();
      }
    });
  }

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

  // Initialize Multi-Page Application Router
  if (window.PageRouter) {
    window.PageRouter.init();
  }

  // Global helper for subsequent slices to jump to app view
  window.MediSenseApp = {
    showScreen,
    applyTheme,
    appendMessageBubble,
    openFullscreenResponse,
    closeFullscreenResponse
  };
});
