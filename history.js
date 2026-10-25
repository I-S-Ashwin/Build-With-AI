// MediSense — History Bin, Paper-Throw Save Animation, and PDF Export

const HistoryService = {
  activeSessionMessages: [],

  init() {
    this.renderHistory();
    this.setupPaperThrowListener();
  },

  setupPaperThrowListener() {
    // Connect to full-screen response dismiss in main.js
    window.onTriageSessionClosed = (outcomeResult) => {
      this.triggerPaperThrowAnimation(outcomeResult);
    };
  },

  // Gather current conversation messages from the DOM
  collectCurrentSessionMessages() {
    const messageElements = document.querySelectorAll('#chat-messages-container .chat-msg');
    const messages = [];
    messageElements.forEach(el => {
      const isUser = el.classList.contains('user');
      const textP = el.querySelector('.msg-body p');
      if (textP) {
        messages.push({
          role: isUser ? 'user' : 'assistant',
          text: textP.textContent.trim()
        });
      }
    });
    return messages;
  },

  // Generate a concise summary of the session from first user message
  extractSessionSummary(messages) {
    const firstUserMsg = messages.find(m => m.role === 'user');
    if (!firstUserMsg) return 'Routine Health Consultation';
    const clean = firstUserMsg.text.replace(/^[🤒🩹⚠️]\s*/, '').trim();
    return clean.length > 55 ? clean.substring(0, 52) + '...' : clean;
  },

  // The Signature Paper-Throw Animation
  triggerPaperThrowAnimation(outcomeResult) {
    const messages = this.collectCurrentSessionMessages();
    if (!messages.length) return;

    // Create a physical flying "paper sheet" element
    const paper = document.createElement('div');
    paper.className = 'flying-paper-doc';
    paper.innerHTML = `
      <div class="paper-header-strip"></div>
      <div style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase;">MediSense Triage</div>
      <div style="font-size: 0.55rem; color: #555; margin-top: 2px;">${new Date().toLocaleTimeString()}</div>
    `;

    document.body.appendChild(paper);

    // Get coordinates of the history sidebar bin
    const historyBin = document.querySelector('.history-sidebar');
    const binRect = historyBin ? historyBin.getBoundingClientRect() : { left: window.innerWidth - 100, top: 120 };

    // Start near screen center and arc into the bin
    const startX = window.innerWidth / 2 - 40;
    const startY = window.innerHeight / 2 - 40;
    const targetX = binRect.left + 40;
    const targetY = binRect.top + 60;

    paper.style.left = `${startX}px`;
    paper.style.top = `${startY}px`;

    // Force reflow then animate
    paper.getBoundingClientRect();

    paper.style.transform = `translate(${targetX - startX}px, ${targetY - startY}px) scale(0.2) rotate(540deg)`;
    paper.style.opacity = '0';

    setTimeout(() => {
      paper.remove();

      // Save to localStorage
      const newSession = {
        id: 'session-' + Date.now(),
        date: new Date().toISOString(),
        summary: this.extractSessionSummary(messages),
        outcome: (outcomeResult && outcomeResult.outcome) || 'home-remedy',
        outcomeText: (outcomeResult && outcomeResult.text) || '',
        messages: messages
      };

      if (window.Storage) {
        window.Storage.saveSession(newSession);
      }

      this.renderHistory();

      // Show a toast confirmation
      this.showToast('Consultation archived in Chat Bin!');
    }, 650);
  },

  renderHistory() {
    const listEl = document.getElementById('history-sessions-list');
    const countBadge = document.getElementById('session-count-badge');
    if (!listEl) return;

    const sessions = window.Storage ? window.Storage.getSessions() : [];
    if (countBadge) countBadge.textContent = sessions.length;

    if (!sessions || sessions.length === 0) {
      listEl.innerHTML = `
        <div class="history-empty-notice">
          No saved consultations yet. Completed triage sessions will be archived here.
        </div>
      `;
      return;
    }

    listEl.innerHTML = '';
    sessions.forEach(session => {
      const itemCard = document.createElement('div');
      itemCard.className = 'history-item-card';

      const dateObj = new Date(session.date);
      const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' at ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const isDoctor = session.outcome === 'see-doctor';
      const tagClass = isDoctor ? 'tag-doctor' : 'tag-home';
      const tagLabel = isDoctor ? '⚠️ Doctor Advised' : '🌿 Home Care';

      itemCard.innerHTML = `
        <div class="history-card-header">
          <span class="triage-outcome-tag ${tagClass}" style="font-size: 0.65rem; padding: 2px 6px; margin: 0;">${tagLabel}</span>
          <span class="history-card-date">${formattedDate}</span>
        </div>
        <div class="history-card-summary">${this.escapeHtml(session.summary)}</div>
        <div class="history-card-actions">
          <button class="btn btn-secondary btn-card-action" onclick="HistoryService.viewSessionDetails('${session.id}')">View</button>
          <button class="btn btn-primary btn-card-action" onclick="HistoryService.exportPdf('${session.id}')">Export PDF</button>
        </div>
      `;

      listEl.appendChild(itemCard);
    });
  },

  viewSessionDetails(sessionId) {
    const sessions = window.Storage ? window.Storage.getSessions() : [];
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const modal = document.getElementById('modal-session-details');
    const content = document.getElementById('session-details-content');
    if (!modal || !content) return;

    const dateFormatted = new Date(session.date).toLocaleString();
    const isDoctor = session.outcome === 'see-doctor';

    let msgsHtml = '';
    session.messages.forEach(m => {
      const isUser = m.role === 'user';
      msgsHtml += `
        <div style="margin-bottom: 0.75rem; padding: 0.6rem 0.85rem; border: 2px solid var(--mondrian-black); background: ${isUser ? 'var(--mondrian-yellow)' : 'var(--bg-subtle)'};">
          <strong style="text-transform: uppercase; font-size: 0.75rem;">${isUser ? 'Patient' : 'MediSense'}:</strong>
          <p style="margin-top: 0.2rem; font-size: 0.95rem; line-height: 1.4;">${this.escapeHtml(m.text)}</p>
        </div>
      `;
    });

    content.innerHTML = `
      <div style="margin-bottom: 1rem; border-bottom: 2px solid var(--mondrian-black); padding-bottom: 0.5rem;">
        <span class="triage-outcome-tag ${isDoctor ? 'tag-doctor' : 'tag-home'}">
          ${isDoctor ? '⚠️ Clinical Referral Required' : '🌿 Routine Home Care Suggested'}
        </span>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 0.4rem;">${this.escapeHtml(session.summary)}</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted);">${dateFormatted}</p>
      </div>

      <div style="max-height: 280px; overflow-y: auto; margin-bottom: 1.25rem; padding-right: 0.5rem;">
        ${msgsHtml}
      </div>

      <div style="padding: 1rem; border-left: 6px solid ${isDoctor ? 'var(--mondrian-red)' : 'var(--mondrian-accent-yellow)'}; background: var(--bg-surface); margin-bottom: 1rem;">
        <strong style="text-transform: uppercase; font-size: 0.8rem;">Outcome Assessment:</strong>
        <p style="font-size: 0.95rem; margin-top: 0.3rem;">${this.escapeHtml(session.outcomeText || 'Consultation archived.')}</p>
      </div>
    `;

    document.getElementById('btn-details-export-pdf').onclick = () => {
      this.exportPdf(sessionId);
    };

    modal.classList.add('active');
  },

  // Export Session to Formatted Printable PDF
  exportPdf(sessionId) {
    const sessions = window.Storage ? window.Storage.getSessions() : [];
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    if (typeof html2pdf === 'undefined') {
      alert('PDF generation library is loading. Please check your internet connection.');
      return;
    }

    const patientName = (window.Storage && window.Storage.getUser()?.username) || 'Patient';
    const isDoctor = session.outcome === 'see-doctor';
    const dateFormatted = new Date(session.date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Build printable document container
    const pdfContainer = document.createElement('div');
    pdfContainer.style.padding = '35px';
    pdfContainer.style.fontFamily = 'Helvetica, Arial, sans-serif';
    pdfContainer.style.color = '#111111';
    pdfContainer.style.backgroundColor = '#FFFFFF';

    let conversationRows = '';
    session.messages.forEach(m => {
      const isUser = m.role === 'user';
      conversationRows += `
        <div style="margin-bottom: 12px; padding: 10px 14px; border: 2px solid #111; background-color: ${isUser ? '#FFF8E1' : '#F4F6F8'};">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #555;">${isUser ? patientName : 'MediSense Assistant'}</div>
          <div style="font-size: 14px; margin-top: 4px; line-height: 1.4;">${this.escapeHtml(m.text)}</div>
        </div>
      `;
    });

    pdfContainer.innerHTML = `
      <!-- Mondrian Header Strip -->
      <div style="display: flex; height: 10px; margin-bottom: 25px; border: 2px solid #111;">
        <div style="flex: 2; background-color: #D62828;"></div>
        <div style="flex: 1; background-color: #FCBF49;"></div>
        <div style="flex: 3; background-color: #FFFFFF;"></div>
        <div style="flex: 1; background-color: #003049;"></div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 3px solid #111; padding-bottom: 15px; margin-bottom: 20px;">
        <div>
          <h1 style="font-size: 26px; margin: 0; font-weight: 900; letter-spacing: -0.5px;">MediSense</h1>
          <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-top: 2px;">Personal Healthcare Triage Summary</div>
        </div>
        <div style="text-align: right; font-size: 12px;">
          <div><strong>Patient:</strong> ${this.escapeHtml(patientName)}</div>
          <div><strong>Date:</strong> ${dateFormatted}</div>
        </div>
      </div>

      <div style="margin-bottom: 25px; padding: 15px; border: 2px solid #111; background-color: ${isDoctor ? '#FFEBEE' : '#FFFDE7'}; border-left: 8px solid ${isDoctor ? '#D62828' : '#F77F00'};">
        <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: ${isDoctor ? '#B71C1C' : '#E65100'};">
          ${isDoctor ? '⚠️ Clinical Recommendation — Physician Evaluation Advised' : '🌿 Routine Care Protocol — Home Treatment Suggested'}
        </div>
        <div style="font-size: 16px; font-weight: bold; margin-top: 6px;">${this.escapeHtml(session.summary)}</div>
        <p style="font-size: 14px; line-height: 1.5; margin-top: 8px; margin-bottom: 0;">${this.escapeHtml(session.outcomeText)}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; padding-bottom: 6px; margin-bottom: 12px;">Consultation Transcript</h3>
        ${conversationRows}
      </div>

      <div style="margin-top: 35px; border-top: 1px solid #CCC; padding-top: 10px; font-size: 10px; color: #777; text-align: center;">
        Notice: MediSense is a personal health symptom triage guide, not a certified diagnostic device. Always consult licensed medical providers for emergency care.
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `MediSense_Triage_${patientName}_${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(pdfContainer).save();
  },

  showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'medisense-toast';
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('visible');
    }, 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
};

window.HistoryService = HistoryService;

document.addEventListener('DOMContentLoaded', () => {
  HistoryService.init();
});
