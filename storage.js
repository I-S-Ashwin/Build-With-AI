// MediSense Storage Utilities (localStorage)
const STORAGE_KEYS = {
  USER: 'medisense_user',
  THEME: 'medisense_theme',
  TUTORIAL: 'medisense_tutorial_seen',
  SESSIONS: 'medisense_sessions'
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
  }
};

window.Storage = Storage;
