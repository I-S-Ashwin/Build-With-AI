// MediSense Storage Utilities (localStorage)
const STORAGE_KEYS = {
  USER: 'medisense_user',
  THEME: 'medisense_theme',
  TUTORIAL: 'medisense_tutorial_seen',
  SESSIONS: 'medisense_sessions',
  PROFILE: 'medisense_profile',
  MEDICATIONS: 'medisense_medications'
};

const Storage = {
  getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to read user from storage', e);
      return null;
    }
  },

  setUser(username) {
    try {
      const user = { username: username.trim(), loggedInAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    } catch (e) {
      console.error('Failed to save user', e);
      return null;
    }
  },

  clearUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  isTutorialSeen() {
    return localStorage.getItem(STORAGE_KEYS.TUTORIAL) === 'true';
  },

  setTutorialSeen() {
    localStorage.setItem(STORAGE_KEYS.TUTORIAL, 'true');
  },

  getSessions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read sessions', e);
      return [];
    }
  },

  saveSession(session) {
    try {
      const sessions = this.getSessions();
      sessions.unshift(session); // Newest first
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      return sessions;
    } catch (e) {
      console.error('Failed to save session', e);
      return [];
    }
  },

  deleteSession(sessionId) {
    try {
      const sessions = this.getSessions().filter(s => s.id !== sessionId);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      return sessions;
    } catch (e) {
      console.error('Failed to delete session', e);
      return [];
    }
  },

  // ─── Health Profile Storage ───
  getProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Failed to read profile', e);
      return null;
    }
  },

  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      return profile;
    } catch (e) {
      console.error('Failed to save profile', e);
      return null;
    }
  },

  clearProfile() {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  },

  // ─── Medication Log Storage ───
  getMedications() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read medications', e);
      return [];
    }
  },

  saveMedications(meds) {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
      return meds;
    } catch (e) {
      console.error('Failed to save medications', e);
      return [];
    }
  },

  addMedication(med) {
    const meds = this.getMedications();
    med.id = 'med_' + Date.now();
    med.createdAt = new Date().toISOString();
    med.takenDates = med.takenDates || []; // Array of 'YYYY-MM-DD'
    meds.unshift(med);
    this.saveMedications(meds);
    return meds;
  },

  toggleMedicationTaken(medId, dateStr) {
    const meds = this.getMedications();
    const target = meds.find(m => m.id === medId);
    if (!target) return meds;
    target.takenDates = target.takenDates || [];
    const idx = target.takenDates.indexOf(dateStr);
    if (idx >= 0) {
      target.takenDates.splice(idx, 1);
    } else {
      target.takenDates.push(dateStr);
    }
    this.saveMedications(meds);
    return meds;
  },

  deleteMedication(medId) {
    const meds = this.getMedications().filter(m => m.id !== medId);
    this.saveMedications(meds);
    return meds;
  }
};

window.Storage = Storage;
