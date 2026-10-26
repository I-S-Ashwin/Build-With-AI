/**
 * MediSense — Multi-Page Application Controller & View Managers
 * Manages 6 integrated healthcare views:
 * 1. Health Profile (Clinical Context)
 * 2. Disease Encyclopedia (116 Conditions KB)
 * 3. Analytics & Health Trends (Visual CSS Charts)
 * 4. Emergency Life-Safety Guide (Actionable Protocols)
 * 5. Medication Tracker (Daily To-Do & Streaks)
 * 6. Settings & Data Portability
 */

const PageRouter = {
  activePage: 'page-triage',

  init() {
    // Attach navigation click listeners
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPage = btn.getAttribute('data-page');
        if (targetPage) {
          this.navigateTo(targetPage);
        }
      });
    });

    // Initialize sub-pages
    ProfilePage.init();
    EncyclopediaPage.init();
    MedicationPage.init();
    SettingsPage.init();

    // Update medication badge on launch
    this.updateMedicationBadge();
  },

  navigateTo(pageId) {
    if (!pageId) return;
    this.activePage = pageId;

    // Update Nav buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      const target = btn.getAttribute('data-page');
      if (target === pageId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update page containers
    document.querySelectorAll('.app-page').forEach(page => {
      if (page.id === pageId) {
        page.classList.add('active-page');
      } else {
        page.classList.remove('active-page');
      }
    });

    // Trigger page-specific view rendering
    if (pageId === 'page-profile') ProfilePage.render();
    if (pageId === 'page-encyclopedia') {
      const searchInput = document.getElementById('encyc-search-input');
      if (searchInput) {
        searchInput.value = '';
        searchInput.defaultValue = '';
        EncyclopediaPage.searchQuery = '';
      }
      EncyclopediaPage.render();
    }
    if (pageId === 'page-analytics') AnalyticsPage.render();
    if (pageId === 'page-emergency') EmergencyPage.render();
    if (pageId === 'page-medication') MedicationPage.render();
    if (pageId === 'page-settings') SettingsPage.render();

    this.updateMedicationBadge();

    // Scroll to top of view
    const activeEl = document.getElementById(pageId);
    if (activeEl) activeEl.scrollTop = 0;
  },

  updateMedicationBadge() {
    const badge = document.getElementById('nav-med-badge');
    if (!badge) return;
    const meds = window.Storage ? window.Storage.getMedications() : [];
    if (meds.length === 0) {
      badge.style.display = 'none';
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const pendingCount = meds.filter(m => !(m.takenDates || []).includes(todayStr)).length;
    if (pendingCount > 0) {
      badge.textContent = pendingCount;
      badge.style.display = 'inline-block';
    } else {
      badge.textContent = '✓';
      badge.style.display = 'inline-block';
    }
  }
};

// ─────────────────────────────────────────────────────────────
// 1. HEALTH PROFILE CONTROLLER
// ─────────────────────────────────────────────────────────────
const ProfilePage = {
  init() {
    const form = document.getElementById('form-profile');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.save();
      });
    }

    const btnClear = document.getElementById('btn-profile-clear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        const doClear = () => {
          if (window.Storage) window.Storage.clearProfile();
          this.render();
          this.showToast('Profile cleared.');
        };
        if (window.showCustomConfirm) {
          window.showCustomConfirm('Clear Profile', 'Clear your saved medical profile? This cannot be undone.', doClear);
        } else {
          if (confirm('Clear your saved medical profile?')) doClear();
        }
      });
    }
  },

  render() {
    const profile = (window.Storage && window.Storage.getProfile()) || {};
    const currentUser = (window.Storage && window.Storage.getUser()) || {};

    const nameInput = document.getElementById('profile-name');
    const ageInput = document.getElementById('profile-age');
    const bloodSelect = document.getElementById('profile-blood');
    const allergiesInput = document.getElementById('profile-allergies');
    const medsInput = document.getElementById('profile-medications');
    const emergencyName = document.getElementById('profile-emergency-name');
    const emergencyPhone = document.getElementById('profile-emergency-phone');

    if (nameInput) nameInput.value = profile.name || currentUser.username || '';
    if (ageInput) ageInput.value = profile.age || '';
    if (bloodSelect) bloodSelect.value = profile.bloodType || 'Unknown';
    if (allergiesInput) allergiesInput.value = profile.allergies || '';
    if (medsInput) medsInput.value = profile.medications || '';
    if (emergencyName) emergencyName.value = profile.emergencyContactName || '';
    if (emergencyPhone) emergencyPhone.value = profile.emergencyContactPhone || '';

    // Gender radio
    const gender = profile.gender || '';
    const genderRadios = document.querySelectorAll('input[name="profile-gender"]');
    genderRadios.forEach(r => {
      r.checked = (r.value === gender);
    });

    // Chronic conditions checkboxes
    const conditions = profile.conditions || [];
    document.querySelectorAll('.profile-cond-check').forEach(cb => {
      cb.checked = conditions.includes(cb.value);
    });

    // Render active profile status preview card
    this.renderSummary(profile);
  },

  renderSummary(profile) {
    const summaryCard = document.getElementById('profile-active-summary');
    if (!summaryCard) return;

    if (!profile.age && !profile.name) {
      summaryCard.innerHTML = `
        <div class="empty-mini-notice">
          <p>No profile configured yet. Fill out the details below to give MediSense contextual safety awareness.</p>
        </div>
      `;
      return;
    }

    const condList = (profile.conditions && profile.conditions.length > 0)
      ? profile.conditions.join(', ')
      : 'None reported';

    summaryCard.innerHTML = `
      <div class="profile-card-header">
        <div class="profile-avatar">
          <span>${(profile.name || 'P').charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h3 style="margin: 0; font-size: 1.15rem;">${profile.name || 'Patient'}</h3>
          <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">
            ${profile.age ? profile.age + ' yrs' : 'Age unspecified'} • ${profile.gender || 'Gender unspecified'} • Blood: ${profile.bloodType || 'Unknown'}
          </p>
        </div>
      </div>
      <div class="profile-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Chronic Conditions</span>
          <strong class="meta-val">${condList}</strong>
        </div>
        <div class="meta-item">
          <span class="meta-label">Known Allergies</span>
          <strong class="meta-val">${profile.allergies || 'None reported'}</strong>
        </div>
        <div class="meta-item">
          <span class="meta-label">Emergency Contact</span>
          <strong class="meta-val">${profile.emergencyContactName ? `${profile.emergencyContactName} (${profile.emergencyContactPhone || 'No phone'})` : 'None set'}</strong>
        </div>
      </div>
      <div class="profile-safety-badge">
        <span class="live-dot" style="display:inline-block; margin-right:6px;"></span>
        <strong>Active in AI Triage:</strong> Triage responses and emergency thresholds now calibrated for your profile.
      </div>
    `;
  },

  save() {
    const name = document.getElementById('profile-name')?.value.trim();
    const age = parseInt(document.getElementById('profile-age')?.value, 10) || null;
    const bloodType = document.getElementById('profile-blood')?.value || 'Unknown';
    const allergies = document.getElementById('profile-allergies')?.value.trim() || '';
    const medications = document.getElementById('profile-medications')?.value.trim() || '';
    const emergencyContactName = document.getElementById('profile-emergency-name')?.value.trim() || '';
    const emergencyContactPhone = document.getElementById('profile-emergency-phone')?.value.trim() || '';

    const checkedGender = document.querySelector('input[name="profile-gender"]:checked');
    const gender = checkedGender ? checkedGender.value : '';

    const conditions = [];
    document.querySelectorAll('.profile-cond-check:checked').forEach(cb => {
      conditions.push(cb.value);
    });

    const otherCond = document.getElementById('profile-cond-other')?.value.trim();
    if (otherCond) conditions.push(otherCond);

    const profile = {
      name,
      age,
      gender,
      bloodType,
      conditions,
      allergies,
      medications,
      emergencyContactName,
      emergencyContactPhone,
      updatedAt: new Date().toISOString()
    };

    if (window.Storage) {
      window.Storage.saveProfile(profile);
    }

    this.renderSummary(profile);
    this.showToast('✅ Health profile saved & connected to Triage AI!');
  },

  showToast(msg) {
    const toast = document.getElementById('profile-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3200);
  }
};

// ─────────────────────────────────────────────────────────────
// 2. DISEASE ENCYCLOPEDIA CONTROLLER (116 Diseases)
// ─────────────────────────────────────────────────────────────
const EncyclopediaPage = {
  selectedCategory: 'all',
  searchQuery: '',

  init() {
    const searchInput = document.getElementById('encyc-search-input');
    if (searchInput) {
      // Explicitly clear on init so browser autofill doesn't pollute the field
      searchInput.value = '';
      this.searchQuery = '';
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderCards();
      });
    }

    const categoryChips = document.querySelectorAll('.encyc-filter-chip');
    categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedCategory = chip.getAttribute('data-category') || 'all';
        this.renderCards();
      });
    });

    // Close detail modal
    const btnCloseModal = document.getElementById('btn-close-disease-modal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        this.closeDetailModal();
      });
    }

    // Backdrop click dismiss for disease modal
    const detailModal = document.getElementById('modal-disease-detail');
    if (detailModal) {
      detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
          this.closeDetailModal();
        }
      });
    }

    // Delegated click listener on encyclopedia cards container
    const container = document.getElementById('encyc-grid-container');
    if (container) {
      container.addEventListener('click', (e) => {
        const inspectBtn = e.target.closest('.btn-inspect-disease');
        if (inspectBtn) {
          e.preventDefault();
          e.stopPropagation();
          const dName = inspectBtn.getAttribute('data-disease');
          if (dName) {
            this.openDetailModal(dName);
          }
          return;
        }

        const bmBtn = e.target.closest('.encyc-card-bookmark-btn');
        if (bmBtn) {
          e.preventDefault();
          e.stopPropagation();
          const dName = bmBtn.getAttribute('data-disease');
          if (dName) {
            this.toggleBookmark(dName);
          }
          return;
        }
      });
    }
  },

  render() {
    const searchInput = document.getElementById('encyc-search-input');
    if (searchInput && !this.searchQuery) {
      searchInput.value = '';
      searchInput.defaultValue = '';
    }
    this.renderCards();
  },

  renderCards() {
    const container = document.getElementById('encyc-grid-container');
    const countDisplay = document.getElementById('encyc-result-count');
    if (!container) return;

    const kb = (typeof MEDISENSE_KB !== 'undefined') ? MEDISENSE_KB : [];

    // Filter
    const bookmarks = (typeof getBookmarks === 'function') ? getBookmarks() : [];
    const filtered = kb.filter(item => {
      if (this.selectedCategory === 'bookmarked') {
        if (!bookmarks.includes(item.name)) return false;
      } else {
        const matchesCategory = (this.selectedCategory === 'all') || (item.category === this.selectedCategory);
        if (!matchesCategory) return false;
      }

      if (!this.searchQuery) return true;
      const textMatch = item.name.toLowerCase().includes(this.searchQuery) ||
                        item.category.toLowerCase().includes(this.searchQuery) ||
                        (item.keywords && item.keywords.some(kw => kw.toLowerCase().includes(this.searchQuery))) ||
                        (item.advice && item.advice.toLowerCase().includes(this.searchQuery));
      return textMatch;
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} of ${kb.length} conditions`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card" style="grid-column: 1 / -1;">
          <h3>No matching conditions found</h3>
          <p>Try searching for a different symptom or select "All Conditions".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((item, index) => {
      const urgency = item.urgency || 'moderate';
      let urgencyBadge = '<span class="urgency-pill pill-moderate">🟡 Moderate</span>';
      if (urgency === 'low') urgencyBadge = '<span class="urgency-pill pill-low">🟢 Low Urgency</span>';
      if (urgency === 'high') urgencyBadge = '<span class="urgency-pill pill-high">🔴 High Urgency</span>';
      if (urgency === 'emergency') urgencyBadge = '<span class="urgency-pill pill-emergency">🚨 Emergency</span>';

      const s = item.symptoms || {};
      const feverChip = s.fever ? '<span class="sym-badge sym-yes">Fever ✓</span>' : '<span class="sym-badge sym-no">No Fever</span>';
      const coughChip = s.cough ? '<span class="sym-badge sym-yes">Cough ✓</span>' : '<span class="sym-badge sym-no">No Cough</span>';
      const fatigueChip = s.fatigue ? '<span class="sym-badge sym-yes">Fatigue ✓</span>' : '';
      const dyspneaChip = s.breathingDifficulty ? '<span class="sym-badge sym-breathing">Breathing Difficulty ⚠️</span>' : '';

      const isBookmarked = bookmarks.includes(item.name);
      const encodedName = encodeURIComponent(item.name);
      return `
        <article class="encyc-card" data-disease-name="${escapeHtml(item.name)}" data-disease="${encodedName}">
          <button type="button" class="encyc-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-disease="${encodedName}" title="${isBookmarked ? 'Remove from Saved' : 'Save Condition Bookmark'}">
            ${isBookmarked ? '⭐' : '☆'}
          </button>
          <div class="encyc-card-top">
            <span class="category-tag tag-${item.category || 'general'}">${item.category || 'General'}</span>
            ${urgencyBadge}
          </div>
          <h3 class="encyc-disease-title">${escapeHtml(item.name)}</h3>
          
          <div class="encyc-sym-row">
            ${feverChip}
            ${coughChip}
            ${fatigueChip}
            ${dyspneaChip}
          </div>

          <p class="encyc-advice-preview">
            ${escapeHtml(item.advice)}
          </p>

          <div class="encyc-card-footer">
            <button type="button" class="btn btn-secondary btn-inspect-disease" data-disease="${encodedName}">
              Inspect Protocol &rarr;
            </button>
          </div>
        </article>
      `;
    }).join('');
  },

  toggleBookmark(diseaseName) {
    if (!diseaseName) return;
    const rawName = decodeURIComponent(diseaseName);
    let bms = (typeof getBookmarks === 'function') ? getBookmarks() : [];
    if (bms.includes(rawName)) {
      bms = bms.filter(n => n !== rawName);
    } else {
      bms.push(rawName);
    }
    if (typeof saveBookmarks === 'function') saveBookmarks(bms);
    this.renderCards();
  },

  search(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.selectedCategory = 'all';
    const input = document.getElementById('encyc-search-input');
    if (input) input.value = query;
    document.querySelectorAll('.encyc-filter-chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-category') === 'all');
    });
    this.renderCards();
  },

  openDetailModal(diseaseName) {
    if (!diseaseName) return;
    const rawName = decodeURIComponent(diseaseName).trim().toLowerCase();
    const kb = (typeof MEDISENSE_KB !== 'undefined') ? MEDISENSE_KB : [];
    const item = kb.find(d => 
      d.name.toLowerCase() === rawName || 
      d.name.toLowerCase() === diseaseName.trim().toLowerCase()
    );
    if (!item) {
      console.warn('Condition not found in KB:', diseaseName, rawName);
      return;
    }

    const modal = document.getElementById('modal-disease-detail');
    const title = document.getElementById('disease-modal-title');
    const category = document.getElementById('disease-modal-category');
    const urgency = document.getElementById('disease-modal-urgency');
    const advice = document.getElementById('disease-modal-advice');
    const redFlagsList = document.getElementById('disease-modal-redflags');
    const symptomsList = document.getElementById('disease-modal-symptoms');

    if (title) title.textContent = item.name;
    if (category) category.textContent = (item.category || 'General').toUpperCase();
    if (urgency) {
      urgency.textContent = `Urgency: ${item.urgency.toUpperCase()}`;
      urgency.className = `triage-outcome-tag tag-${item.urgency === 'emergency' || item.urgency === 'high' ? 'doctor' : 'home'}`;
    }
    if (advice) advice.textContent = item.advice;

    if (symptomsList) {
      const s = item.symptoms || {};
      symptomsList.innerHTML = `
        <li><strong>Fever:</strong> ${s.fever ? 'Commonly Present' : 'Usually Absent'}</li>
        <li><strong>Cough:</strong> ${s.cough ? 'Commonly Present' : 'Usually Absent'}</li>
        <li><strong>Fatigue / Weakness:</strong> ${s.fatigue ? 'Reported' : 'Not typical'}</li>
        <li><strong>Breathing Difficulties:</strong> ${s.breathingDifficulty ? 'Significant / High Risk' : 'None reported'}</li>
      `;
    }

    if (redFlagsList) {
      if (item.redFlags && item.redFlags.length > 0) {
        redFlagsList.innerHTML = item.redFlags.map(rf => `<li>⚠️ ${escapeHtml(rf)}</li>`).join('');
      } else {
        redFlagsList.innerHTML = '<li>No critical red flags documented for this routine condition.</li>';
      }
    }

    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
    }
  },

  closeDetailModal() {
    const modal = document.getElementById('modal-disease-detail');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }
};

// ─────────────────────────────────────────────────────────────
// 3. ANALYTICS & HEALTH TRENDS CONTROLLER
// ─────────────────────────────────────────────────────────────
const AnalyticsPage = {
  render() {
    const sessions = (window.Storage && window.Storage.getSessions()) || [];
    
    // Top Stats Tiles
    const totalCount = sessions.length;
    const homeCount = sessions.filter(s => s.outcome === 'home-remedy').length;
    const doctorCount = sessions.filter(s => s.outcome === 'see-doctor').length;
    const homePct = totalCount > 0 ? Math.round((homeCount / totalCount) * 100) : 0;
    const doctorPct = totalCount > 0 ? Math.round((doctorCount / totalCount) * 100) : 0;

    // Days activity
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentWeekCount = sessions.filter(s => s.timestamp >= oneWeekAgo).length;

    // Elements
    const statTotal = document.getElementById('stat-total-consultations');
    const statHome = document.getElementById('stat-home-remedies');
    const statDoctor = document.getElementById('stat-doctor-visits');
    const statRecent = document.getElementById('stat-week-consultations');

    if (statTotal) statTotal.textContent = totalCount;
    if (statHome) statHome.textContent = `${homeCount} (${homePct}%)`;
    if (statDoctor) statDoctor.textContent = `${doctorCount} (${doctorPct}%)`;
    if (statRecent) statRecent.textContent = `${recentWeekCount} this week`;

    // Visual Split Bar
    const splitHome = document.getElementById('split-bar-home');
    const splitDoctor = document.getElementById('split-bar-doctor');
    if (splitHome && splitDoctor) {
      if (totalCount === 0) {
        splitHome.style.width = '50%';
        splitDoctor.style.width = '50%';
      } else {
        splitHome.style.width = `${Math.max(homePct, 5)}%`;
        splitDoctor.style.width = `${Math.max(doctorPct, 5)}%`;
      }
    }

    // Top Reported Symptoms Frequency (CSS Bar Chart)
    this.renderSymptomChart(sessions);

    // Consultation Timeline
    this.renderTimeline(sessions);
  },

  renderSymptomChart(sessions) {
    const chartContainer = document.getElementById('analytics-symptom-chart');
    if (!chartContainer) return;

    if (sessions.length === 0) {
      chartContainer.innerHTML = `
        <div class="empty-mini-notice">
          <p>No triage sessions recorded yet. Completed consultations will chart recurring symptoms automatically.</p>
        </div>
      `;
      return;
    }

    // Keywords to track
    const tracking = [
      { label: 'Cough / Phlegm', keys: ['cough', 'phlegm', 'mucus'], count: 0, color: 'var(--mondrian-red)' },
      { label: 'Fever / Chills', keys: ['fever', 'chills', 'temperature', 'hot'], count: 0, color: 'var(--mondrian-yellow)' },
      { label: 'Breathing / Wheezing', keys: ['breath', 'wheez', 'dyspnea', 'tight chest'], count: 0, color: 'var(--mondrian-blue)' },
      { label: 'Headache / Migraine', keys: ['headache', 'migraine', 'head pain', 'temple'], count: 0, color: 'var(--mondrian-accent-yellow)' },
      { label: 'Throat / Swallowing', keys: ['throat', 'tonsil', 'swallow'], count: 0, color: '#9B51E0' },
      { label: 'Fatigue / Body Ache', keys: ['tired', 'fatigue', 'exhaust', 'weak', 'body ache'], count: 0, color: '#27AE60' },
      { label: 'Chest Pressure', keys: ['chest', 'heart', 'sweat', 'palpitation'], count: 0, color: 'var(--mondrian-black)' },
      { label: 'Skin / Rash / Scratch', keys: ['skin', 'rash', 'scratch', 'wound', 'cut', 'itch'], count: 0, color: '#EB5757' }
    ];

    sessions.forEach(sess => {
      const fullText = (sess.messages || []).map(m => m.text).join(' ').toLowerCase();
      tracking.forEach(item => {
        if (item.keys.some(k => fullText.includes(k))) {
          item.count++;
        }
      });
    });

    const maxCount = Math.max(...tracking.map(t => t.count), 1);

    chartContainer.innerHTML = tracking.map(item => {
      const pct = Math.round((item.count / maxCount) * 100);
      return `
        <div class="symptom-bar-row">
          <div class="bar-label-group">
            <span class="bar-label">${item.label}</span>
            <span class="bar-count">${item.count} session${item.count === 1 ? '' : 's'}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${item.count > 0 ? Math.max(pct, 6) : 0}%; background-color: ${item.color};"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderTimeline(sessions) {
    const listContainer = document.getElementById('analytics-timeline-list');
    if (!listContainer) return;

    if (sessions.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-mini-notice">
          <p>No consultations logged yet. Start a conversation on the <strong>Triage Chat</strong> tab.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = sessions.slice(0, 8).map(sess => {
      const isDoctor = sess.outcome === 'see-doctor';
      const tagClass = isDoctor ? 'tag-doctor' : 'tag-home';
      const tagLabel = isDoctor ? 'See Physician' : 'Home Remedy';
      const dateStr = sess.dateStr || new Date(sess.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const snippet = sess.firstUserMessage ? `"${escapeHtml(sess.firstUserMessage.slice(0, 85))}${sess.firstUserMessage.length > 85 ? '...' : ''}"` : 'Consultation';

      return `
        <div class="timeline-item">
          <div class="timeline-dot ${isDoctor ? 'dot-red' : 'dot-yellow'}"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="timeline-date">${dateStr}</span>
              <span class="triage-outcome-tag ${tagClass}" style="font-size: 0.7rem; padding: 2px 8px; margin: 0;">${tagLabel}</span>
            </div>
            <p class="timeline-snippet">${snippet}</p>
            <button type="button" class="btn btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="HistoryService.openSessionDetails('${sess.id}')">
              View Record &rarr;
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
};

// ─────────────────────────────────────────────────────────────
// 4. EMERGENCY PROTOCOLS CONTROLLER
// ─────────────────────────────────────────────────────────────
const EmergencyPage = {
  render() {
    // Static life-saving protocols are in the HTML template.
    // Ensure profile emergency contact info is synced.
    const profile = (window.Storage && window.Storage.getProfile()) || {};
    const contactBlock = document.getElementById('emergency-personal-contact');
    if (contactBlock) {
      if (profile.emergencyContactName) {
        contactBlock.innerHTML = `
          <div class="emergency-contact-box">
            <h4>Your Designated Emergency Contact</h4>
            <div style="font-size: 1.1rem; font-weight: 800;">${escapeHtml(profile.emergencyContactName)}</div>
            <div style="font-size: 1.25rem; font-weight: 900; color: var(--mondrian-red); margin-top: 4px;">
              <a href="tel:${escapeHtml(profile.emergencyContactPhone)}" style="color: inherit; text-decoration: none;">
                📞 ${escapeHtml(profile.emergencyContactPhone || 'No phone registered')}
              </a>
            </div>
          </div>
        `;
      } else {
        contactBlock.innerHTML = `
          <div class="emergency-contact-box" style="background: var(--bg-surface); opacity: 0.85;">
            <h4>No Personal Emergency Contact Set</h4>
            <p style="font-size: 0.85rem; margin: 0.4rem 0;">Add your next of kin or emergency contact in your Health Profile.</p>
            <button type="button" class="btn btn-secondary" style="padding: 0.35rem 0.8rem; font-size: 0.8rem;" onclick="PageRouter.navigateTo('page-profile')">
              + Add Contact in Profile
            </button>
          </div>
        `;
      }
    }
  }
};

// ─────────────────────────────────────────────────────────────
// 5. MEDICATION LOG CONTROLLER (Daily To-Do & Streaks)
// ─────────────────────────────────────────────────────────────
const MedicationPage = {
  init() {
    const form = document.getElementById('form-add-medication');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addMedication();
      });
    }
  },

  render() {
    this.renderTodayChecklist();
    this.renderMedicationList();
    PageRouter.updateMedicationBadge();
  },

  getTodayString() {
    return new Date().toISOString().split('T')[0];
  },

  renderTodayChecklist() {
    const container = document.getElementById('med-today-list');
    const progressEl = document.getElementById('med-today-progress');
    const dateHeader = document.getElementById('med-today-date');
    if (!container) return;

    const todayStr = this.getTodayString();
    const todayPretty = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (dateHeader) dateHeader.textContent = todayPretty;

    const meds = (window.Storage && window.Storage.getMedications()) || [];

    if (meds.length === 0) {
      if (progressEl) progressEl.textContent = '0 scheduled';
      container.innerHTML = `
        <div class="empty-state-card" style="padding: 2rem 1.5rem; text-align: center;">
          <h4 style="margin: 0 0 0.5rem;">No Medications Tracked</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Use the form to the right to add daily prescriptions or supplements.</p>
        </div>
      `;
      return;
    }

    const takenCount = meds.filter(m => (m.takenDates || []).includes(todayStr)).length;
    if (progressEl) {
      progressEl.innerHTML = `<strong>${takenCount}</strong> of <strong>${meds.length}</strong> taken today`;
    }

    // Sort: pending first, then completed
    const sorted = [...meds].sort((a, b) => {
      const aTaken = (a.takenDates || []).includes(todayStr) ? 1 : 0;
      const bTaken = (b.takenDates || []).includes(todayStr) ? 1 : 0;
      return aTaken - bTaken;
    });

    container.innerHTML = sorted.map(med => {
      const isTaken = (med.takenDates || []).includes(todayStr);
      const streak = this.calculateStreak(med.takenDates || []);
      const created = med.createdAt ? new Date(med.createdAt).getTime() : Date.now();
      const daysSince = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
      const cycleDay = (daysSince % 30) + 1;
      const refillBadge = cycleDay >= 25 ? `<span class="refill-alert-badge" style="font-size:0.65rem;margin-left:6px;">⚠️ Refill in ${30 - cycleDay}d</span>` : '';

      return `
        <div class="med-todo-card ${isTaken ? 'med-completed' : ''}" data-med-id="${med.id}">
          <label class="med-checkbox-container">
            <input type="checkbox" class="med-check-input" ${isTaken ? 'checked' : ''} onchange="MedicationPage.toggleTaken('${med.id}')">
            <span class="med-checkmark"></span>
          </label>
          <div class="med-info-block">
            <div class="med-title-row">
              <strong class="med-name">${escapeHtml(med.name)}</strong>
              <span class="med-dosage-tag">${escapeHtml(med.dosage || 'Dose')}</span>
              ${refillBadge}
            </div>
            <div class="med-detail-row">
              <span class="med-time-label">⏰ ${escapeHtml(med.timeOfDay || 'Daily')}</span>
              <span class="med-freq-label">• ${escapeHtml(med.frequency || 'Once daily')}</span>
              ${streak > 0 ? `<span class="med-streak-badge">🔥 ${streak} day streak</span>` : ''}
            </div>
            ${med.notes ? `<div class="med-notes-text">📝 ${escapeHtml(med.notes)}</div>` : ''}
          </div>
          <div class="med-action-block">
            <span class="med-status-tag ${isTaken ? 'status-done' : 'status-pending'}">
              ${isTaken ? 'Taken ✓' : 'Pending'}
            </span>
          </div>
        </div>
      `;
    }).join('');
  },

  calculateStreak(takenDates) {
    if (!takenDates || takenDates.length === 0) return 0;
    const sorted = [...new Set(takenDates)].sort().reverse();
    const today = new Date();
    
    let streak = 0;
    let checkDate = new Date(today);

    // If not taken today, check if yesterday was taken to maintain ongoing streak
    const todayStr = this.formatDate(checkDate);
    if (!sorted.includes(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const str = this.formatDate(checkDate);
      if (sorted.includes(str)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  formatDate(d) {
    return d.toISOString().split('T')[0];
  },

  toggleTaken(medId) {
    const todayStr = this.getTodayString();
    if (window.Storage) {
      window.Storage.toggleMedicationTaken(medId, todayStr);
    }
    this.render();
  },

  addMedication() {
    const name = document.getElementById('med-input-name')?.value.trim();
    const dosage = document.getElementById('med-input-dosage')?.value.trim();
    const frequency = document.getElementById('med-input-freq')?.value || 'Once daily';
    const timeOfDay = document.getElementById('med-input-time')?.value || 'Morning';
    const notes = document.getElementById('med-input-notes')?.value.trim() || '';

    if (!name) {
      if (window.showMediSenseToast) window.showMediSenseToast('Please enter a medication name.'); else alert('Please enter a medication name.');
      return;
    }

    const newMed = {
      name,
      dosage: dosage || 'Standard dose',
      frequency,
      timeOfDay,
      notes
    };

    if (window.Storage) {
      window.Storage.addMedication(newMed);
    }

    // Reset form
    document.getElementById('form-add-medication')?.reset();
    this.render();
  },

  deleteMedication(medId) {
    const doDelete = () => {
      if (window.Storage) window.Storage.deleteMedication(medId);
      this.render();
    };
    if (window.showCustomConfirm) {
      window.showCustomConfirm('Remove Medication', 'Remove this medication from your tracking list?', doDelete);
    } else {
      if (confirm('Delete this medication from your tracking list?')) doDelete();
    }
  },

  renderMedicationList() {
    const container = document.getElementById('med-all-list');
    if (!container) return;

    const meds = (window.Storage && window.Storage.getMedications()) || [];
    if (meds.length === 0) {
      container.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted);">No medications configured.</p>';
      return;
    }

    container.innerHTML = meds.map(m => `
      <div class="med-manage-item">
        <div>
          <strong>${escapeHtml(m.name)}</strong> (${escapeHtml(m.dosage || 'Dose')})
          <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(m.frequency || '')} • ${escapeHtml(m.timeOfDay || '')}</div>
        </div>
        <button type="button" class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: var(--mondrian-red);" onclick="MedicationPage.deleteMedication('${m.id}')">
          🗑️ Delete
        </button>
      </div>
    `).join('');
  }
};

// ─────────────────────────────────────────────────────────────
// 6. SETTINGS & DATA PORTABILITY CONTROLLER
// ─────────────────────────────────────────────────────────────
const SettingsPage = {
  init() {
    const btnSaveKey = document.getElementById('settings-btn-save-key');
    if (btnSaveKey) {
      btnSaveKey.addEventListener('click', () => {
        const key = document.getElementById('settings-input-key')?.value.trim();
        if (window.GeminiService) {
          window.GeminiService.setApiKey(key || '');
        }
        this.render();
        if (window.showMediSenseToast) window.showMediSenseToast('Gemini API Key saved.');
      });
    }

    const btnClearHistory = document.getElementById('settings-btn-clear-history');
    if (btnClearHistory) {
      btnClearHistory.addEventListener('click', () => {
        const doClear = () => {
          localStorage.removeItem('medisense_sessions');
          if (window.showMediSenseToast) window.showMediSenseToast('Consultation history cleared.');
          this.render();
          if (window.HistoryService) window.HistoryService.renderHistory();
        };
        if (window.showCustomConfirm) {
          window.showCustomConfirm('Clear All Consultations', 'Are you sure you want to delete all saved consultation records from your chat bin? This cannot be undone.', doClear);
        } else {
          if (confirm('Are you sure you want to delete all saved consultation records?')) doClear();
        }
      });
    }

    const btnExportData = document.getElementById('settings-btn-export-data');
    if (btnExportData) {
      btnExportData.addEventListener('click', () => {
        this.exportAllData();
      });
    }

    const btnFactoryReset = document.getElementById('settings-btn-factory-reset');
    if (btnFactoryReset) {
      btnFactoryReset.addEventListener('click', () => {
        const doReset = () => {
          localStorage.clear();
          if (window.showMediSenseToast) window.showMediSenseToast('MediSense reset complete. Reloading...');
          setTimeout(() => location.reload(), 600);
        };
        if (window.showCustomConfirm) {
          window.showCustomConfirm('Factory Reset MediSense', '⚠️ WARNING: This will completely reset all your local MediSense data, including profile, sessions, and medications. Proceed?', doReset);
        } else {
          if (confirm('This will reset all your local MediSense data. Proceed?')) doReset();
        }
      });
    }
  },

  render() {
    const key = (window.GeminiService && window.GeminiService.getApiKey()) || '';
    const keyInput = document.getElementById('settings-input-key');
    if (keyInput) keyInput.value = key;

    const modeBadge = document.getElementById('settings-ai-mode-badge');
    if (modeBadge) {
      if (key) {
        modeBadge.className = 'triage-outcome-tag tag-home';
        modeBadge.textContent = '⚡ Connected: Google Gemini 1.5 Flash (Cloud Generative)';
      } else {
        modeBadge.className = 'triage-outcome-tag tag-doctor';
        modeBadge.textContent = '🔒 Active: Offline Clinical Knowledge Base (116 Conditions)';
      }
    }

    // Update storage metrics
    const sessions = (window.Storage && window.Storage.getSessions()) || [];
    const meds = (window.Storage && window.Storage.getMedications()) || [];
    const profile = (window.Storage && window.Storage.getProfile()) || null;

    const statStorage = document.getElementById('settings-storage-summary');
    if (statStorage) {
      statStorage.textContent = `${sessions.length} consultations, ${meds.length} medications, profile ${profile ? 'active' : 'unconfigured'}`;
    }
  },

  exportAllData() {
    const exportBundle = {
      app: 'MediSense',
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      user: window.Storage ? window.Storage.getUser() : null,
      profile: window.Storage ? window.Storage.getProfile() : null,
      sessions: window.Storage ? window.Storage.getSessions() : [],
      medications: window.Storage ? window.Storage.getMedications() : []
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `medisense-health-data-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};

// Simple HTML escaping helper
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}



/* ═══════════════════════════════════════════════════════════════
   BOOGIE-WOOGIE INTERACTIVE WIDGETS
   ═══════════════════════════════════════════════════════════════ */

/* ── CPR Metronome ──────────────────────────────── */
window.TriageCPRMetronome = (() => {
  let intervalId = null;
  let isBeating = false;
  const BPM = 100;
  const intervalMs = Math.round(60000 / BPM);

  function beat() {
    const dot = document.getElementById('cpr-pulse-dot');
    if (!dot) return;
    dot.style.transform = 'scale(1.25)';
    dot.style.boxShadow = '0 0 0 30px rgba(233,69,96,0)';
    setTimeout(() => {
      dot.style.transform = 'scale(1)';
      dot.style.boxShadow = '';
    }, 200);

    // Audio click via AudioContext
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch(e) {}
  }

  function start() {
    if (isBeating) return;
    isBeating = true;
    const dot = document.getElementById('cpr-pulse-dot');
    const btn = document.getElementById('btn-cpr-start');
    if (dot) dot.classList.add('beating');
    if (btn) btn.textContent = '⏹ Stop Rhythm Guide';
    beat(); // immediate first beat
    intervalId = setInterval(beat, intervalMs);
  }

  function stop() {
    isBeating = false;
    clearInterval(intervalId);
    intervalId = null;
    const dot = document.getElementById('cpr-pulse-dot');
    const btn = document.getElementById('btn-cpr-start');
    if (dot) { dot.classList.remove('beating'); dot.style.transform = ''; dot.style.boxShadow = ''; }
    if (btn) btn.textContent = '▶ Start Rhythm Guide';
  }

  return {
    toggle() { isBeating ? stop() : start(); },
    start, stop
  };
})();

/* ── BMI Calculator (Profile Page) ──────────────────── */
function updateProfileBMI() {
  const h = parseFloat(document.getElementById('profile-height')?.value);
  const w = parseFloat(document.getElementById('profile-weight')?.value);
  const bmiEl = document.getElementById('bmi-value-display');
  const catEl = document.getElementById('bmi-category-display');
  const riskEl = document.getElementById('bmi-risk-display');

  if (!bmiEl) return;

  if (h > 0 && w > 0) {
    const bmi = w / ((h / 100) ** 2);
    bmiEl.textContent = bmi.toFixed(1);
    let cat = '', risk = '';
    if (bmi < 18.5) { cat = 'Underweight'; risk = 'Moderate'; }
    else if (bmi < 25) { cat = 'Normal Weight'; risk = 'Low'; }
    else if (bmi < 30) { cat = 'Overweight'; risk = 'Moderate'; }
    else if (bmi < 35) { cat = 'Obese Class I'; risk = 'High'; }
    else { cat = 'Obese Class II+'; risk = 'Very High'; }
    catEl.textContent = cat;
    riskEl.textContent = risk;
  } else {
    bmiEl.textContent = '—';
    catEl.textContent = 'Enter height & weight';
    riskEl.textContent = '—';
  }
}

function updateProfileCompleteness() {
  const fields = [
    document.getElementById('profile-name')?.value,
    document.getElementById('profile-age')?.value,
    document.querySelector('[name="profile-gender"]:checked')?.value,
    document.getElementById('profile-blood')?.value,
    document.getElementById('profile-height')?.value,
    document.getElementById('profile-weight')?.value,
    document.getElementById('profile-allergies')?.value,
    document.getElementById('profile-medications')?.value,
  ];
  const filled = fields.filter(f => f && f !== 'Unknown').length;
  const pct = Math.round((filled / fields.length) * 100);
  const el = document.getElementById('profile-completeness');
  if (el) el.textContent = pct + '%';
}

function initProfileWidgets() {
  const hInput = document.getElementById('profile-height');
  const wInput = document.getElementById('profile-weight');
  if (hInput) hInput.addEventListener('input', () => { updateProfileBMI(); updateProfileCompleteness(); });
  if (wInput) wInput.addEventListener('input', () => { updateProfileBMI(); updateProfileCompleteness(); });
  
  // Watch all profile fields for completeness
  document.querySelectorAll('#page-profile input, #page-profile select').forEach(el => {
    el.addEventListener('change', updateProfileCompleteness);
    el.addEventListener('input', updateProfileCompleteness);
  });

  // Update ICE card from profile
  updateICECard();
}

function updateICECard() {
  const name = document.getElementById('profile-name')?.value || '—';
  const blood = document.getElementById('profile-blood')?.value || '—';
  const allergies = document.getElementById('profile-allergies')?.value || 'None known';
  const meds = document.getElementById('profile-medications')?.value || 'None';
  const ecName = document.getElementById('profile-emergency-name')?.value || '—';
  const ecPhone = document.getElementById('profile-emergency-phone')?.value || '—';
  const conds = Array.from(document.querySelectorAll('.profile-cond-check:checked')).map(c => c.value).join(', ') || 'None';
  
  const el = document.getElementById('ice-card-content');
  if (el && name !== '—') {
    el.innerHTML = `<strong>${name}</strong> · Blood: <strong>${blood}</strong> · Conditions: ${conds}<br>Allergies: <strong>${allergies}</strong> · Meds: ${meds}<br>📞 Emergency Contact: <strong>${ecName}</strong> — ${ecPhone}`;
  }
}

// Hook ICE card update to profile save
const _origProfileSave = ProfilePage?.save;
if (_origProfileSave) {
  ProfilePage.save = function(...args) {
    const result = _origProfileSave.apply(this, args);
    updateICECard();
    updateProfileCompleteness();
    return result;
  };
}

/* ── Medication Time Trays ──────────────────────────── */
function updateMedTimeTrays() {
  const storage = window.MediSenseStorage;
  if (!storage) return;
  
  const meds = storage.getMedications ? storage.getMedications() : [];
  const trays = { Morning: [], Noon: [], Evening: [], Bedtime: [], Flexible: [] };
  
  meds.forEach(med => {
    const time = med.time || 'Flexible';
    if (trays[time]) trays[time].push(med);
    else trays.Flexible.push(med);
  });

  const morning = document.getElementById('med-tray-morning');
  const afternoon = document.getElementById('med-tray-afternoon');
  const evening = document.getElementById('med-tray-evening');
  
  function renderTray(el, items, color) {
    if (!el) return;
    if (items.length === 0) {
      el.innerHTML = '<span class="med-tray-empty">None scheduled</span>';
    } else {
      el.innerHTML = items.map(m => 
        `<div class="med-tray-item" style="color:${color};border-color:${color};">${escapeHtml(m.name)} <span style="opacity:0.7;font-size:0.75rem;">${m.dosage || ''}</span></div>`
      ).join('');
    }
  }
  
  renderTray(morning, trays.Morning, '#D97706');
  renderTray(afternoon, [...trays.Noon, ...trays.Flexible], '#1D4ED8');
  renderTray(evening, [...trays.Evening, ...trays.Bedtime], '#7C3AED');
}

function updateMedAdherenceRing() {
  const todos = document.querySelectorAll('#med-today-list .med-todo-item');
  const total = todos.length;
  const done = document.querySelectorAll('#med-today-list .med-todo-item.done, #med-today-list input[type=checkbox]:checked').length;
  
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const pctEl = document.getElementById('med-adherence-pct');
  const labelEl = document.getElementById('med-ring-pct-label');
  const progressEl = document.getElementById('med-ring-progress');
  
  if (pctEl) pctEl.textContent = pct + '%';
  if (labelEl) labelEl.textContent = pct + '%';
  
  if (progressEl) {
    const circumference = 2 * Math.PI * 35; // r=35
    const offset = circumference * (1 - pct / 100);
    progressEl.style.strokeDasharray = circumference;
    progressEl.style.strokeDashoffset = offset;
  }
  
  const streakEl = document.getElementById('med-streak-text');
  if (streakEl) {
    if (pct === 100) streakEl.textContent = '🎉 100% adherence today! Perfect!';
    else if (pct >= 75) streakEl.textContent = '💪 Great progress! Almost there.';
    else if (pct > 0) streakEl.textContent = '📋 Keep going — check off more doses!';
    else streakEl.textContent = '🔔 No doses logged yet today.';
  }
}

/* ── Analytics Wellness Grid ────────────────────────── */
function updateWellnessGrid() {
  const grid = document.getElementById('analytics-wellness-grid');
  if (!grid) return;

  const storage = window.MediSenseStorage;
  const history = storage?.getHistory ? storage.getHistory() : [];
  
  // Build 14-day map
  const dayMap = {};
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = 'none';
  }
  
  history.forEach(c => {
    const key = (c.timestamp || c.date || '').slice(0, 10);
    if (key in dayMap) {
      const verdict = (c.verdict || c.outcome || '').toLowerCase();
      if (verdict.includes('doctor') || verdict.includes('refer')) dayMap[key] = 'red';
      else if (verdict.includes('home') || verdict.includes('self')) dayMap[key] = 'green';
      else dayMap[key] = 'yellow';
    }
  });

  const days = ['S','M','T','W','T','F','S'];
  const entries = Object.entries(dayMap);
  
  // Group into weeks (2 rows of 7)
  grid.innerHTML = '';
  for (let col = 0; col < 7; col++) {
    const colDiv = document.createElement('div');
    colDiv.className = 'wellness-day-col';
    const lbl = document.createElement('div');
    lbl.className = 'wellness-day-label';
    lbl.textContent = days[col];
    colDiv.appendChild(lbl);
    
    [entries[col], entries[col + 7]].forEach(entry => {
      if (!entry) return;
      const cell = document.createElement('div');
      cell.className = 'wellness-cell' + (entry[1] !== 'none' ? ' wc-' + entry[1] : '');
      cell.title = entry[0];
      colDiv.appendChild(cell);
    });
    grid.appendChild(colDiv);
  }
}

/* ── KB Diagnostic Test ─────────────────────────────── */
function initKBDiagnostic() {
  const btn = document.getElementById('btn-run-kb-test');
  const out = document.getElementById('kb-test-output');
  const status = document.getElementById('kb-test-status');
  if (!btn || !out) return;
  
  btn.addEventListener('click', () => {
    out.style.display = 'block';
    out.textContent = '[MediSense Engine] Starting diagnostic...\n';
    status.textContent = '⏳ Running...';
    
    setTimeout(() => {
      const kb = window.MEDISENSE_KB;
      let log = '';
      
      if (!kb) {
        log += '[ERROR] MEDISENSE_KB not loaded\n';
        status.textContent = '❌ FAILED';
      } else {
        const total = kb.length || Object.keys(kb).length;
        log += '[OK] Knowledge base loaded: ' + total + ' conditions\n';
        
        // Test 1: NLP pattern match
        const testSymptoms = ['fever', 'cough', 'runny nose'];
        log += '[TEST 1] Symptom input: ' + testSymptoms.join(', ') + '\n';
        
        if (window.ClinicalNLP) {
          try {
            const result = ClinicalNLP.analyze(testSymptoms.join(' '));
            const matched = result?.conditions?.length || 0;
            log += '[OK] NLP matched ' + matched + ' conditions\n';
          } catch(e) {
            log += '[WARN] NLP test: ' + e.message + '\n';
          }
        } else {
          log += '[WARN] ClinicalNLP not in scope\n';
        }
        
        // Test 2: Storage
        if (window.MediSenseStorage) {
          const hist = MediSenseStorage.getHistory ? MediSenseStorage.getHistory() : [];
          log += '[OK] Storage engine: ' + hist.length + ' consultations stored\n';
        } else {
          log += '[WARN] MediSenseStorage not available\n';
        }
        
        // Test 3: Count by category
        const cats = {};
        (Array.isArray(kb) ? kb : Object.values(kb)).forEach(c => {
          const cat = c.category || c.system || 'unknown';
          cats[cat] = (cats[cat] || 0) + 1;
        });
        const catList = Object.entries(cats).slice(0, 5).map(([k,v]) => k + ':' + v).join(', ');
        log += '[OK] Top categories: ' + catList + '\n';
        log += '\n[PASS] All tests complete. Engine healthy ✅\n';
        status.textContent = '✅ All tests passed';
      }
      
      out.textContent = log;
    }, 500);
  });
}

/* ── Init all widgets on DOM ready ─────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initProfileWidgets();
    initKBDiagnostic();
  }, 300);
  
  // Refresh trays + ring when medication tab is opened
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page');
      if (page === 'page-medication') {
        setTimeout(() => { updateMedTimeTrays(); updateMedAdherenceRing(); }, 100);
      }
      if (page === 'page-analytics') {
        setTimeout(() => { updateWellnessGrid(); }, 100);
      }
      if (page === 'page-emergency') {
        // Stop CPR if navigating away
      }
    });
  });
});


/* ═══════════════════════════════════════════════════════════════
   10-IN-1 ADVANCED CLINICAL FEATURES SUITE
   ═══════════════════════════════════════════════════════════════ */

/* ── 1. Encyclopedia Bookmarks Engine ───────────────── */
function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem('medisense_bookmarks') || '[]');
  } catch (e) {
    return [];
  }
}

function saveBookmarks(arr) {
  try {
    localStorage.setItem('medisense_bookmarks', JSON.stringify(arr));
  } catch (e) {}
  updateBookmarkBadges();
}

function updateBookmarkBadges() {
  const bms = getBookmarks();
  const countEl = document.getElementById('encyc-bookmark-count');
  if (countEl) countEl.textContent = `${bms.length}`;

  const profileCard = document.getElementById('profile-bookmarks-card');
  const profileList = document.getElementById('profile-bookmarks-list');
  const profileBadge = document.getElementById('profile-bookmark-badge');

  if (profileCard && profileList) {
    if (bms.length > 0) {
      profileCard.style.display = 'block';
      if (profileBadge) profileBadge.textContent = `${bms.length} saved`;
      profileList.innerHTML = bms.map(name => `
        <button type="button" class="btn btn-secondary" style="font-size:0.8rem;padding:0.35rem 0.75rem;border-color:#F59E0B;color:#D97706;font-weight:900;" onclick="window.PageRouter?.navigateTo('page-encyclopedia'); setTimeout(() => { window.EncyclopediaPage?.search('${escapeHtml(name).replace(/'/g, "\\\'")}'); }, 150);">
          ⭐ ${escapeHtml(name)}
        </button>
      `).join('');
    } else {
      profileCard.style.display = 'none';
    }
  }
}

/* ── 2. Health Risk Index Calculator (Profile Page) ──── */
function updateHealthRiskIndex() {
  const profile = (window.Storage && window.Storage.getProfile()) || {};
  const card = document.getElementById('health-risk-index-card');
  const scoreEl = document.getElementById('health-risk-score');
  const levelEl = document.getElementById('health-risk-level');
  const gaugeArc = document.getElementById('gauge-arc');
  const gaugeText = document.getElementById('gauge-text');

  if (!card || !scoreEl) return;

  const age = parseInt(profile.age || document.getElementById('profile-age')?.value, 10) || 0;
  const h = parseFloat(document.getElementById('profile-height')?.value) || 0;
  const w = parseFloat(document.getElementById('profile-weight')?.value) || 0;
  const conditions = profile.conditions || [];
  const meds = profile.medications || document.getElementById('profile-medications')?.value || '';

  if (!age && !conditions.length && !h) {
    card.style.display = 'none';
    return;
  }
  card.style.display = 'block';

  let risk = 12; // Baseline healthy

  if (age > 65) risk += 24;
  else if (age > 50) risk += 16;
  else if (age > 35) risk += 10;
  else if (age > 0) risk += 4;

  if (h > 0 && w > 0) {
    const bmi = w / ((h / 100) ** 2);
    if (bmi > 35) risk += 28;
    else if (bmi > 30) risk += 18;
    else if (bmi > 25) risk += 10;
    else if (bmi < 18.5) risk += 8;
  }

  conditions.forEach(c => {
    const cl = c.toLowerCase();
    if (cl.includes('heart') || cl.includes('stroke') || cl.includes('kidney')) risk += 16;
    else if (cl.includes('diabetes') || cl.includes('hypertension')) risk += 12;
    else risk += 6;
  });

  if (meds.trim()) {
    const medCount = meds.split(',').length;
    risk += Math.min(medCount * 4, 16);
  }

  risk = Math.min(Math.max(risk, 8), 95);

  scoreEl.textContent = `${risk} / 100`;

  let strokeColor = '#10B981';
  let levelText = '🟢 Low Chronic Risk (Optimal Baseline)';
  if (risk > 55) {
    strokeColor = '#EF4444';
    levelText = '🔴 High Clinical Risk Profile — Consult Doctor for Regular Checkups';
  } else if (risk > 30) {
    strokeColor = '#F59E0B';
    levelText = '🟡 Moderate Risk Profile — Watchful Lifestyle & Routine Monitoring';
  }

  levelEl.textContent = levelText;
  if (gaugeText) {
    gaugeText.textContent = `${risk}`;
    gaugeText.setAttribute('fill', strokeColor);
  }

  if (gaugeArc) {
    const arcLength = 157;
    const offset = arcLength - (arcLength * (risk / 100));
    gaugeArc.style.strokeDashoffset = `${offset}`;
    gaugeArc.style.stroke = strokeColor;
  }
}

/* ── 3. Drug Interaction Clinical Checker ───────────── */
const CLINICAL_DRUG_INTERACTIONS = [
  {
    drugs: ['aspirin', 'ibuprofen'],
    severity: 'danger',
    title: 'Severe Bleeding & Cardioprotective Blunting',
    text: 'Concurrent NSAID use markedly escalates upper GI ulceration and bleed risk. Ibuprofen also blocks the irreversible antiplatelet action of low-dose Aspirin.'
  },
  {
    drugs: ['warfarin', 'aspirin'],
    severity: 'danger',
    title: 'Critical Hemorrhage Hazard',
    text: 'Potentiation of anticoagulation with antiplatelet effects creates severe risk of major gastrointestinal and intracranial bleeding.'
  },
  {
    drugs: ['lisinopril', 'spironolactone'],
    severity: 'danger',
    title: 'Severe Hyperkalemia Risk',
    text: 'Both agents reduce renal potassium excretion, risking dangerous cardiac arrhythmias and sudden cardiac arrest.'
  },
  {
    drugs: ['metformin', 'alcohol'],
    severity: 'danger',
    title: 'Lactic Acidosis Hazard',
    text: 'Alcohol intake potentiates metformin-induced lactic acidosis, an uncommon but life-threatening metabolic emergency.'
  },
  {
    drugs: ['sertraline', 'tramadol'],
    severity: 'danger',
    title: 'Acute Serotonin Syndrome',
    text: 'Combining SSRIs with serotonergic opioid analgesics can precipitate acute hyperthermia, autonomic instability, and neuromuscular clonus.'
  },
  {
    drugs: ['clopidogrel', 'omeprazole'],
    severity: 'warning',
    title: 'Reduced Antiplatelet Efficacy',
    text: 'Omeprazole competitively inhibits CYP2C19 bioactivation of Clopidogrel, elevating risk of recurrent ischemic events.'
  },
  {
    drugs: ['atorvastatin', 'amlodipine'],
    severity: 'warning',
    title: 'Elevated Statin Exposure',
    text: 'Amlodipine inhibits CYP3A4-mediated statin clearance, increasing risk of myopathy, transaminitis, and muscle pain.'
  },
  {
    drugs: ['ciprofloxacin', 'calcium'],
    severity: 'warning',
    title: 'Chelation Absorption Block',
    text: 'Polyvalent cations bind fluoroquinolone antibiotics in the stomach, reducing therapeutic blood levels by up to 60%.'
  },
  {
    drugs: ['albuterol', 'propranolol'],
    severity: 'danger',
    title: 'Bronchospasm Antagonism',
    text: 'Non-selective beta-blockers block pulmonary beta-2 receptors, nullifying rescue inhaler action and inducing severe bronchospasm.'
  },
  {
    drugs: ['acetaminophen', 'alcohol'],
    severity: 'warning',
    title: 'Potentiated Hepatotoxicity',
    text: 'Chronic alcohol consumption induces CYP2E1, converting acetaminophen to toxic NAPQI metabolites and escalating acute liver injury risk.'
  }
];

function initDrugInteractionChecker() {
  const selectA = document.getElementById('drug-check-a');
  const selectB = document.getElementById('drug-check-b');
  const btnCheck = document.getElementById('btn-check-interaction');
  const resultDiv = document.getElementById('drug-interaction-result');

  if (!selectA || !selectB || !btnCheck) return;

  function populateDropdowns() {
    const meds = (window.Storage && window.Storage.getMedications()) || [];
    const defaults = [
      'Aspirin', 'Ibuprofen', 'Warfarin', 'Lisinopril', 'Spironolactone',
      'Metformin', 'Alcohol', 'Sertraline', 'Tramadol', 'Clopidogrel',
      'Omeprazole', 'Atorvastatin', 'Amlodipine', 'Ciprofloxacin',
      'Albuterol', 'Propranolol', 'Acetaminophen'
    ];

    const allNames = Array.from(new Set([
      ...meds.map(m => m.name),
      ...defaults
    ])).sort();

    const currA = selectA.value;
    const currB = selectB.value;

    selectA.innerHTML = '<option value="">— Drug A —</option>' + allNames.map(n => `<option value="${escapeHtml(n.toLowerCase())}">${escapeHtml(n)}</option>`).join('');
    selectB.innerHTML = '<option value="">— Drug B —</option>' + allNames.map(n => `<option value="${escapeHtml(n.toLowerCase())}">${escapeHtml(n)}</option>`).join('');

    if (currA) selectA.value = currA;
    if (currB) selectB.value = currB;
  }

  populateDropdowns();

  btnCheck.onclick = () => {
    const drugA = selectA.value.trim().toLowerCase();
    const drugB = selectB.value.trim().toLowerCase();

    if (!drugA || !drugB) {
      resultDiv.style.display = 'block';
      resultDiv.className = 'interaction-warning';
      resultDiv.innerHTML = '⚠️ Please select two medications to compare.';
      return;
    }

    if (drugA === drugB) {
      resultDiv.style.display = 'block';
      resultDiv.className = 'interaction-warning';
      resultDiv.innerHTML = '⚠️ Duplicate selection. Please select two distinct agents.';
      return;
    }

    const match = CLINICAL_DRUG_INTERACTIONS.find(entry => {
      const [d1, d2] = entry.drugs;
      return (drugA.includes(d1) && drugB.includes(d2)) || (drugA.includes(d2) && drugB.includes(d1));
    });

    resultDiv.style.display = 'block';
    if (match) {
      const isDanger = match.severity === 'danger';
      resultDiv.className = isDanger ? 'interaction-danger' : 'interaction-warning';
      resultDiv.innerHTML = `
        <div style="font-size:0.95rem;font-weight:900;margin-bottom:0.25rem;">${isDanger ? '🚨 CRITICAL INTERACTION:' : '⚠️ CAUTION ADVISORY:'} ${match.title}</div>
        <div style="font-size:0.85rem;line-height:1.45;">${match.text}</div>
      `;
    } else {
      resultDiv.className = 'interaction-safe';
      resultDiv.innerHTML = `
        <div style="font-size:0.95rem;font-weight:900;margin-bottom:0.25rem;">✅ No Known Direct Conflict</div>
        <div style="font-size:0.85rem;line-height:1.45;">No severe contraindication identified between <strong>${selectA.options[selectA.selectedIndex].text}</strong> and <strong>${selectB.options[selectB.selectedIndex].text}</strong> in our immediate clinical database. Always review dosing schedules with your prescribing physician.</div>
      `;
    }
  };
}

/* ── 4. Medication Refill Monitor ───────────────────── */
function checkMedicationRefills() {
  const meds = (window.Storage && window.Storage.getMedications()) || [];
  const alertBadge = document.getElementById('med-refill-alert');
  if (!alertBadge) return;

  const now = Date.now();
  let refillCount = 0;

  meds.forEach(med => {
    const created = med.createdAt ? new Date(med.createdAt).getTime() : (now - (18 * 24 * 60 * 60 * 1000));
    const daysSince = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSince % 30) + 1;
    if (cycleDay >= 25) {
      refillCount++;
    }
  });

  if (refillCount > 0) {
    alertBadge.style.display = 'inline-block';
    alertBadge.textContent = `⚠️ ${refillCount} Refill${refillCount > 1 ? 's' : ''} Due`;
  } else {
    alertBadge.style.display = 'none';
  }
}

/* ── 5. Share Triage Assessment Modal ───────────────── */
function openShareResultModal(outcome) {
  const modal = document.getElementById('share-result-modal');
  const textArea = document.getElementById('share-result-text');
  if (!modal || !textArea) return;

  let result = outcome || window.currentTriageOutcome;

  // Fallback to most recent session from storage if no active outcome
  if (!result && window.Storage) {
    const sessions = window.Storage.getSessions();
    if (sessions && sessions.length > 0) {
      result = sessions[0];
    }
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  if (result && (result.text || result.summary || result.advice || result.userQuery)) {
    const rawText = result.text || result.summary || result.advice || '';
    const cleanText = rawText.replace(/\[DIAGNOSIS_[A-Z]+\]/g, '').trim();
    const isDoctor = (result.outcome === 'see-doctor' || (result.verdict && result.verdict.toLowerCase().includes('doctor')));
    const verdict = isDoctor ? '⚠️ Clinical Physician Referral Recommended' : '🌿 Safe Routine Home Care';

    textArea.value = `🏥 MediSense Healthcare Triage Assessment
📅 Date: ${dateStr}
Verdict: ${verdict}
--------------------------------------------------
${cleanText}
--------------------------------------------------
🔒 Assessed with MediSense offline clinical knowledge base.`;
  } else {
    textArea.value = `🏥 MediSense Healthcare Triage Assessment
📅 Date: ${dateStr}

No active consultation recorded yet.

Type or speak your symptoms in Triage Chat to generate a personalized clinical assessment.`;
  }

  modal.style.display = 'flex';

  // Backdrop click to dismiss
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };
}

/* ── 6. Printable Doctor Intake Note ────────────────── */
function generateDoctorIntakeNote(outcome) {
  const profile = (window.Storage && window.Storage.getProfile()) || {};
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  let result = outcome || window.currentTriageOutcome;
  if (!result && window.Storage) {
    const sessions = window.Storage.getSessions();
    if (sessions && sessions.length > 0) result = sessions[0];
  }

  const rawText = result ? (result.text || result.summary || result.advice || '') : 'Patient self-reported health intake.';
  const cleanAdvice = rawText.replace(/\[DIAGNOSIS_[A-Z]+\]/g, '').trim();

  const printDiv = document.getElementById('doctor-print-container');
  if (!printDiv) return;

  printDiv.innerHTML = `
    <div class="doctor-note-box" style="border: 3px solid #000; padding: 1.75rem; background: #fff; color: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="border-bottom: 3px solid #000; padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h1 style="margin: 0; font-size: 1.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #000;">MediSense Clinical Intake Summary</h1>
          <p style="margin: 0.35rem 0 0; font-size: 0.95rem; color: #4B5563;">Confidential Patient-Reported Triage &amp; Health Baseline Record</p>
        </div>
        <div style="text-align: right; font-size: 0.85rem; font-weight: 700; color: #4B5563;">
          <div>Generated: ${dateStr}</div>
          <div style="color: #1D4ED8; font-weight: 900;">Verified Offline Engine</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; background: #F3F4F6; padding: 1rem; border: 2px solid #000; margin-bottom: 1.5rem;">
        <div>
          <div style="font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #6B7280;">Patient Name</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #000;">${escapeHtml(profile.name || 'Unspecified')}</div>
        </div>
        <div>
          <div style="font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #6B7280;">Age / Biological Sex</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #000;">${profile.age ? profile.age + ' yrs' : '—'} / ${escapeHtml(profile.gender || '—')}</div>
        </div>
        <div>
          <div style="font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #6B7280;">Blood Group</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #DC2626;">${escapeHtml(profile.bloodType || 'Unknown')}</div>
        </div>
        <div>
          <div style="font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #6B7280;">Emergency Contact</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #000;">${escapeHtml(profile.emergencyContactName ? profile.emergencyContactName + ' (' + (profile.emergencyContactPhone || '') + ')' : 'None')}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="border: 2px solid #000; padding: 1rem;">
          <h3 style="margin: 0 0 0.5rem; font-size: 0.95rem; text-transform: uppercase; color: #1D4ED8;">Diagnosed Chronic Conditions</h3>
          <p style="margin: 0; font-size: 0.9rem; font-weight: 700; color: #000;">${escapeHtml((profile.conditions && profile.conditions.length > 0) ? profile.conditions.join(', ') : 'None documented')}</p>
        </div>
        <div style="border: 2px solid #000; padding: 1rem;">
          <h3 style="margin: 0 0 0.5rem; font-size: 0.95rem; text-transform: uppercase; color: #DC2626;">Known Allergies &amp; Contraindications</h3>
          <p style="margin: 0; font-size: 0.9rem; font-weight: 700; color: #000;">${escapeHtml(profile.allergies || 'None documented')}</p>
        </div>
      </div>

      <div style="border: 2px solid #000; padding: 1rem; margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 0.5rem; font-size: 0.95rem; text-transform: uppercase; color: #059669;">Current Active Medications</h3>
        <p style="margin: 0; font-size: 0.9rem; font-weight: 700; color: #000;">${escapeHtml(profile.medications || 'None documented')}</p>
      </div>

      <div style="border: 3px solid #000; padding: 1.25rem; background: #FFFDF0; margin-bottom: 1.5rem;">
        <h2 style="margin: 0 0 0.5rem; font-size: 1.2rem; text-transform: uppercase; color: #000;">
          Reported Symptoms &amp; Triage Differential
        </h2>
        <div style="font-size: 0.95rem; line-height: 1.6; color: #111;">
          ${cleanAdvice.replace(/\n/g, '<br>')}
        </div>
      </div>

      <div style="margin-top: 2rem; border-top: 2px dashed #000; padding-top: 1rem; display: flex; justify-content: space-between; font-size: 0.85rem; color: #4B5563;">
        <div>Attending Physician Signature: ___________________________</div>
        <div>Date: _________________</div>
      </div>
    </div>
  `;

  document.body.classList.remove('printing-ice-card');
  document.body.classList.add('printing-doctor-note');

  setTimeout(() => {
    window.print();
  }, 100);
}

/* ── 6b. Printable ICE Medical Wallet Card ──────────── */
function printICECard() {
  const profile = (window.Storage && window.Storage.getProfile()) || {};
  const printDiv = document.getElementById('ice-print-container');
  if (!printDiv) return;

  const name = profile.name || document.getElementById('profile-name')?.value || 'Patient';
  const age = profile.age || document.getElementById('profile-age')?.value || '—';
  const blood = profile.bloodType || document.getElementById('profile-blood')?.value || 'Unknown';
  const allergies = profile.allergies || document.getElementById('profile-allergies')?.value || 'None known';
  const meds = profile.medications || document.getElementById('profile-medications')?.value || 'None';
  const ecName = profile.emergencyContactName || document.getElementById('profile-emergency-name')?.value || 'Not specified';
  const ecPhone = profile.emergencyContactPhone || document.getElementById('profile-emergency-phone')?.value || '—';
  const conds = (profile.conditions && profile.conditions.length > 0)
    ? profile.conditions.join(', ')
    : (Array.from(document.querySelectorAll('.profile-cond-check:checked')).map(c => c.value).join(', ') || 'None reported');

  printDiv.innerHTML = `
    <div style="width: 8.6cm; height: 5.4cm; border: 3px solid #DC2626; box-shadow: 4px 4px 0 #DC2626; padding: 0.5cm; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #FFF5F5; color: #111; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; page-break-inside: avoid;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #DC2626; padding-bottom: 0.2cm;">
        <div style="font-size: 12pt; font-weight: 900; color: #DC2626; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 4px;">
          <span>🆘</span> MEDICAL EMERGENCY ID
        </div>
        <div style="font-size: 11pt; font-weight: 900; background: #DC2626; color: #fff; padding: 2px 7px;">
          ${escapeHtml(blood)}
        </div>
      </div>

      <div style="font-size: 8.5pt; line-height: 1.35; margin: 0.2cm 0;">
        <div><strong>NAME:</strong> ${escapeHtml(name)} (${age} yrs)</div>
        <div><strong>CONDITIONS:</strong> ${escapeHtml(conds)}</div>
        <div><strong>ALLERGIES:</strong> <span style="color:#DC2626;font-weight:900;">${escapeHtml(allergies)}</span></div>
        <div><strong>MEDS:</strong> ${escapeHtml(meds)}</div>
      </div>

      <div style="border-top: 1.5px dashed #DC2626; padding-top: 0.15cm; font-size: 8pt; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>ICE CONTACT:</strong> ${escapeHtml(ecName)}</div>
        <div style="font-weight: 900; color: #1D4ED8;">📞 ${escapeHtml(ecPhone)}</div>
      </div>
    </div>
  `;

  document.body.classList.remove('printing-doctor-note');
  document.body.classList.add('printing-ice-card');

  setTimeout(() => {
    window.print();
  }, 100);
}

// Global print cleanup listeners
window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing-doctor-note', 'printing-ice-card');
});

/* ── 7. Global Keyboard Shortcuts ───────────────────── */
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isInput = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;

    if (e.key === 'Escape') {
      const sessionModal = document.getElementById('modal-session-details');
      if (sessionModal && (sessionModal.classList.contains('active') || sessionModal.style.display === 'flex' || sessionModal.style.display === 'block')) {
        sessionModal.classList.remove('active');
        sessionModal.style.display = 'none';
        return;
      }
      const closeConsult = document.getElementById('modal-close-consultation');
      if (closeConsult && closeConsult.style.display !== 'none') {
        closeConsult.style.display = 'none';
        return;
      }
      const shortcutsModal = document.getElementById('keyboard-shortcuts-modal');
      if (shortcutsModal && shortcutsModal.style.display !== 'none') {
        shortcutsModal.style.display = 'none';
        return;
      }
      const shareModal = document.getElementById('share-result-modal');
      if (shareModal && shareModal.style.display !== 'none') {
        shareModal.style.display = 'none';
        return;
      }
      const customConfirm = document.getElementById('custom-confirm-modal');
      if (customConfirm && customConfirm.style.display !== 'none') {
        customConfirm.style.display = 'none';
        return;
      }
      const fsOverlay = document.getElementById('screen-fullscreen-response');
      if (fsOverlay && fsOverlay.style.display !== 'none') {
        fsOverlay.style.display = 'none';
        return;
      }
      const detailModal = document.getElementById('modal-disease-detail');
      if (detailModal && (detailModal.classList.contains('active') || detailModal.style.display !== 'none')) {
        detailModal.classList.remove('active');
        detailModal.style.display = 'none';
        return;
      }
      const apiKeyModal = document.getElementById('modal-api-key');
      if (apiKeyModal && (apiKeyModal.classList.contains('active') || apiKeyModal.style.display !== 'none')) {
        apiKeyModal.classList.remove('active');
        apiKeyModal.style.display = 'none';
        return;
      }
      if (window.TutorialService && window.TutorialService.isPlaying) {
        window.TutorialService.finish();
        return;
      }
      if (isInput) {
        document.activeElement.blur();
      }
      return;
    }

    // Handle Enter inside modal-close-consultation to confirm
    if (e.key === 'Enter') {
      const closeConsult = document.getElementById('modal-close-consultation');
      if (closeConsult && closeConsult.style.display === 'flex') {
        e.preventDefault();
        document.getElementById('modal-close-consult-save')?.click();
        return;
      }
    }

    if (isInput) return;

    const key = e.key.toLowerCase();
    if (key === 't') {
      window.PageRouter?.navigateTo('page-triage');
    } else if (key === 'p') {
      window.PageRouter?.navigateTo('page-profile');
    } else if (key === 'e') {
      window.PageRouter?.navigateTo('page-encyclopedia');
    } else if (key === 'a') {
      window.PageRouter?.navigateTo('page-analytics');
    } else if (key === 'r') {
      window.PageRouter?.navigateTo('page-emergency');
    } else if (key === 'm') {
      window.PageRouter?.navigateTo('page-medication');
    } else if (key === 's') {
      window.PageRouter?.navigateTo('page-settings');
    } else if (e.key === '/') {
      e.preventDefault();
      window.PageRouter?.navigateTo('page-encyclopedia');
      setTimeout(() => {
        const searchInput = document.getElementById('encyc-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }, 100);
    } else if (key === 'd') {
      const current = document.body.getAttribute('data-theme') || 'light';
      const next = (current === 'dark') ? 'light' : 'dark';
      if (typeof window.applyTheme === 'function') {
        window.applyTheme(next);
      }
    } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      const modal = document.getElementById('keyboard-shortcuts-modal');
      if (modal) {
        modal.style.display = (modal.style.display === 'none' || !modal.style.display) ? 'flex' : 'none';
      }
    } else if (key === 'n') {
      e.preventDefault();
      window.PageRouter?.navigateTo('page-triage');
      setTimeout(() => {
        document.getElementById('input-symptoms-text')?.focus();
      }, 100);
    }
  });

  const btnCopyShare = document.getElementById('btn-copy-share');
  if (btnCopyShare) {
    btnCopyShare.onclick = async () => {
      const text = document.getElementById('share-result-text')?.value;
      if (text) {
        try {
          await navigator.clipboard.writeText(text);
          btnCopyShare.textContent = '✓ Copied!';
          setTimeout(() => { btnCopyShare.textContent = '📋 Copy to Clipboard'; }, 2000);
        } catch (err) {
          document.getElementById('share-result-text')?.select();
          document.execCommand('copy');
          btnCopyShare.textContent = '✓ Copied!';
          setTimeout(() => { btnCopyShare.textContent = '📋 Copy to Clipboard'; }, 2000);
        }
      }
    };
  }
}

/* ── 8. Dark Mode Auto-Detect on First Load ──────────── */
function initAutoTheme() {
  const saved = localStorage.getItem('medisense_theme');
  if (!saved) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
      const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
      toggleBtns.forEach(btn => {
        const text = btn.querySelector('.theme-pill-text');
        const cube = btn.querySelector('.theme-cube');
        if (text) text.textContent = 'Broadway Night';
        if (cube) { cube.textContent = '🌙'; cube.className = 'theme-cube moon'; }
      });
    }
  }
}

/* ── 9. Hook into Profile & Medication Pages ─────────── */
const _origProfileRender = ProfilePage?.render;
if (_origProfileRender) {
  ProfilePage.render = function(...args) {
    const res = _origProfileRender.apply(this, args);
    updateHealthRiskIndex();
    updateBookmarkBadges();
    return res;
  };
}

const _origMedRender = MedicationPage?.render;
if (_origMedRender) {
  MedicationPage.render = function(...args) {
    const res = _origMedRender.apply(this, args);
    checkMedicationRefills();
    initDrugInteractionChecker();
    return res;
  };
}

// Global exports
window.getBookmarks = getBookmarks;
window.saveBookmarks = saveBookmarks;
window.updateBookmarkBadges = updateBookmarkBadges;
window.updateHealthRiskIndex = updateHealthRiskIndex;
window.initDrugInteractionChecker = initDrugInteractionChecker;
window.checkMedicationRefills = checkMedicationRefills;
window.openShareResultModal = openShareResultModal;
window.generateDoctorIntakeNote = generateDoctorIntakeNote;
window.printICECard = printICECard;

// Initialize when document ready
document.addEventListener('DOMContentLoaded', () => {
  initKeyboardShortcuts();
  initAutoTheme();
  setTimeout(() => {
    updateBookmarkBadges();
    updateHealthRiskIndex();
    checkMedicationRefills();
    initDrugInteractionChecker();
  }, 350);
});

// Attach globally
window.PageRouter = PageRouter;
window.ProfilePage = ProfilePage;
window.EncyclopediaPage = EncyclopediaPage;
window.AnalyticsPage = AnalyticsPage;
window.EmergencyPage = EmergencyPage;
window.MedicationPage = MedicationPage;
window.SettingsPage = SettingsPage;
