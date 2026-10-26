// MediSense — First-Time Animated Cursor Tutorial & Skeleton Previews

const TutorialService = {
  activeStepIndex: 0,
  isPlaying: false,
  timerId: null,

  STEPS: [
    {
      targetId: 'btn-theme-header',
      title: 'Mondrian Theme Toggle',
      desc: 'Switch between High-Contrast Light mode and Deep Dark mode anytime.'
    },
    {
      targetId: 'history-sessions-list',
      title: 'Your Chat Bin Archive',
      desc: 'All completed consultations fly here automatically. Review transcripts or export printable PDFs.'
    },
    {
      targetId: 'btn-mic-record',
      title: 'Voice & Symptoms Input',
      desc: 'Tap the red mic to speak naturally, or use the symptom chips and text box to start.'
    }
  ],

  init() {
    const btnReplay = document.getElementById('btn-tutorial-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.start(true);
      });
    }

    // Dismiss tutorial if overlay backdrop is clicked
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.finish();
      });
    }

    // Dismiss tutorial on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isPlaying) {
        this.finish();
      }
    });

    // Auto-check on login if tutorial hasn't been seen
    const seen = window.Storage && window.Storage.isTutorialSeen();
    if (!seen) {
      // Small pause to let login transition settle
      setTimeout(() => {
        const appScreen = document.getElementById('screen-app');
        if (appScreen && appScreen.classList.contains('active')) {
          this.start(false);
        }
      }, 900);
    }
  },

  start(force = false) {
    if (this.isPlaying) return;
    if (!force && window.Storage && window.Storage.isTutorialSeen()) return;

    this.isPlaying = true;
    this.activeStepIndex = 0;

    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.style.display = 'block';

    this.playCurrentStep();
  },

  playCurrentStep() {
    if (!this.isPlaying) return;

    if (this.activeStepIndex >= this.STEPS.length) {
      this.finish();
      return;
    }

    const step = this.STEPS[this.activeStepIndex];
    let target = document.getElementById(step.targetId);
    if (!target && step.targetId === 'btn-theme-header') {
      target = document.querySelector('.theme-toggle-btn');
    }

    const cursor = document.getElementById('tutorial-cursor');
    const bubble = document.getElementById('tutorial-tooltip');
    const titleEl = document.getElementById('tutorial-step-title');
    const descEl = document.getElementById('tutorial-step-desc');
    const stepBadge = document.getElementById('tutorial-step-badge');

    if (titleEl) titleEl.textContent = step.title;
    if (descEl) descEl.textContent = step.desc;
    if (stepBadge) stepBadge.textContent = `Step ${this.activeStepIndex + 1} of ${this.STEPS.length}`;

    if (target && cursor && bubble) {
      const rect = target.getBoundingClientRect();
      const cursorX = Math.round(rect.left + rect.width / 2);
      const cursorY = Math.round(rect.top + rect.height / 2);

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      // Position tooltip near target without overflowing
      let tooltipX = cursorX - 140;
      let tooltipY = cursorY + 45;

      if (tooltipX + 320 > window.innerWidth) tooltipX = window.innerWidth - 340;
      if (tooltipX < 20) tooltipX = 20;
      if (tooltipY + 180 > window.innerHeight) tooltipY = cursorY - 170;

      bubble.style.transform = `translate(${tooltipX}px, ${tooltipY}px)`;
    }

    // Auto advance every 4 seconds, or user can click Next
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      this.nextStep();
    }, 4200);
  },

  nextStep() {
    this.activeStepIndex++;
    this.playCurrentStep();
  },

  finish() {
    this.isPlaying = false;
    clearTimeout(this.timerId);

    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.style.display = 'none';

    if (window.Storage) {
      window.Storage.setTutorialSeen();
    }
  }
};

window.TutorialService = TutorialService;

document.addEventListener('DOMContentLoaded', () => {
  TutorialService.init();
});
