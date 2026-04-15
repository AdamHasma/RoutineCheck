import Cookies from 'js-cookie';

const COOKIE_OPTIONS = { expires: 365, sameSite: 'Lax' };

export function getCookie(key) {
  const val = Cookies.get(key);
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

export function setCookie(key, value) {
  Cookies.set(key, JSON.stringify(value), COOKIE_OPTIONS);
}

export function removeCookie(key) {
  Cookies.remove(key);
}

// --- Routine Tasks ---
export function getRoutineTasks(type) {
  return getCookie(`routine_${type}`) || [];
}

export function setRoutineTasks(type, tasks) {
  setCookie(`routine_${type}`, tasks);
}

// --- Daily Progress ---
export function getDailyProgress() {
  const today = getTodayKey();
  const stored = getCookie('daily_progress') || {};
  if (stored.date !== today) {
    // New day: reset completion but keep tasks
    return { date: today, morning: [], evening: [] };
  }
  return stored;
}

export function setDailyProgress(progress) {
  setCookie('daily_progress', { ...progress, date: getTodayKey() });
}

// --- History (last 30 days) ---
export function getHistory() {
  return getCookie('routine_history') || [];
}

export function saveHistoryEntry(entry) {
  const history = getHistory();
  const today = getTodayKey();
  const idx = history.findIndex((h) => h.date === today);
  if (idx >= 0) {
    history[idx] = { ...history[idx], ...entry };
  } else {
    history.push({ date: today, ...entry });
  }
  // Keep only last 30 days
  const sorted = history.sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  setCookie('routine_history', sorted);
}

// --- Settings ---
export function getSettings() {
  return getCookie('routine_settings') || {
    theme: 'light',
  };
}

export function saveSettings(settings) {
  setCookie('routine_settings', settings);
}

// --- Helpers ---
export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}
