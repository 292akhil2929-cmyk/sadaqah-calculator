// ============================================================
// Passenger — the VIP in the back. Mood reacts to flying style,
// combat, and damage; mood drives the payout multiplier and a
// constant stream of personality dialogue.
// ============================================================

import { PASSENGERS } from './config.js';

export class Passenger {
  constructor(def, name, cabinLevel = 0) {
    this.def = def;
    this.name = name;
    this.mood = 78;          // 0..100
    this.health = 100;
    this.cabinScale = 1 - 0.12 * cabinLevel; // luxury cabin softens mood loss
    this._lineTimer = 0;
    this._lineCooldown = 0;
    this._saidNear = false;
    this.pendingLine = null;   // {name, text} consumed by HUD
    this._idleTimer = 8 + Math.random() * 6;
  }

  get moodFace() {
    if (this.health <= 0) return '💀';
    if (this.mood > 75) return '😀';
    if (this.mood > 50) return '🙂';
    if (this.mood > 30) return '😟';
    return '😡';
  }

  _say(category) {
    if (this._lineCooldown > 0) return;
    const lines = this.def.lines[category];
    if (!lines) return;
    this.pendingLine = { name: this.name, text: lines[(Math.random() * lines.length) | 0] };
    this._lineCooldown = 4.5;
  }

  moodDelta(amount) {
    const scale = amount < 0 ? this.def.moodSensitivity * this.cabinScale : 1;
    this.mood = Math.max(0, Math.min(100, this.mood + amount * scale));
  }

  // ---- event hooks called by mission/main ----
  onTurbulence() { this.moodDelta(-4); this._say('turbulence'); }
  onEnemySighted() { this._say('enemy'); }
  onKillNearby() { this.moodDelta(+2.5); this._say('kill'); }
  onPlaneDamaged(amount) {
    this.moodDelta(-amount * 0.35);
    this.health = Math.max(0, this.health - amount * 0.12); // cabin isn't armored forever
    this._say('damage');
  }
  onBoard() { this._say('board'); }
  onNearDestination() { if (!this._saidNear) { this._saidNear = true; this._say('near'); } }

  update(dt, plane, threat) {
    this._lineCooldown = Math.max(0, this._lineCooldown - dt);

    // smooth calm flying slowly restores mood
    const gentle = Math.abs(plane.bank) < 0.35 && !plane.boosting;
    if (gentle && threat < 0.1) this.moodDelta(dt * 1.2);

    // sharp maneuvers at high bank rattle the VIP
    if (Math.abs(plane.bank) > 1.3 && Math.random() < dt * 0.8) this.onTurbulence();

    // fire in the cabin is very bad for reviews
    if (plane.onFire) { this.moodDelta(-dt * 2.5); this.health = Math.max(0, this.health - dt * 1.2); }

    // idle grumbling when mood is low
    this._idleTimer -= dt;
    if (this._idleTimer <= 0) {
      this._idleTimer = 9 + Math.random() * 8;
      if (this.mood < 35) this._say('lowMood');
    }
  }
}

export function rollPassenger(cabinLevel) {
  const def = PASSENGERS[(Math.random() * PASSENGERS.length) | 0];
  const name = def.names[(Math.random() * def.names.length) | 0];
  return new Passenger(def, name, cabinLevel);
}
