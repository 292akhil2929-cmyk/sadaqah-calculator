// ============================================================
// Save / load — persistent progression in localStorage.
// ============================================================

const KEY = 'skytaxi-z-save-v1';

const DEFAULTS = {
  money: 1500,
  upgrades: { engine: 0, armor: 0, damage: 0, ammo: 0, boost: 0, handling: 0, cabin: 0, cooldown: 0 },
  missionsCompleted: 0,
  totalKills: 0,
  bestCombo: 0,
  bestRating: 0,
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS, upgrades: { ...DEFAULTS.upgrades } };
    const data = JSON.parse(raw);
    return { ...DEFAULTS, ...data, upgrades: { ...DEFAULTS.upgrades, ...(data.upgrades || {}) } };
  } catch {
    return { ...DEFAULTS, upgrades: { ...DEFAULTS.upgrades } };
  }
}

export function writeSave(save) {
  try { localStorage.setItem(KEY, JSON.stringify(save)); } catch { /* storage unavailable — play session-only */ }
}
