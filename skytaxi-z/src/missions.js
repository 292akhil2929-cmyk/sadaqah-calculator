// ============================================================
// Missions — random charter generator + in-flight director.
// The director paces enemy waves along the route so there is
// never a dull 20 seconds, and escalates near the destination.
// ============================================================

import * as THREE from 'three';
import { MISSION_TYPES, ECON } from './config.js';
import { rollPassenger } from './passenger.js';

const DESTINATIONS = [
  'Fortress Marina', 'The Glass Bunker', 'New Ararat Spire', 'Haven-7 Rooftop',
  'The Last Resort Hotel', 'Sanctuary Ridge', 'Platform Echo', 'Golden Gate Refuge',
];

export function generateMission(save) {
  const level = save.missionsCompleted;
  const type = level >= 3 && Math.random() < 0.25
    ? MISSION_TYPES.find(t => t.id === 'bosshunt')
    : MISSION_TYPES[(Math.random() * 4) | 0]; // first 4 are non-boss

  let weather = 'clear';
  if (type.id === 'stormrun') weather = 'storm';
  else if (type.id === 'nightrun') weather = 'night';
  else weather = Math.random() < 0.3 ? 'fog' : 'clear';

  const distanceKm = 3.5 + Math.random() * 3 + Math.min(4, level * 0.4);
  const passenger = rollPassenger(save.upgrades.cabin);
  const heading = Math.random() * Math.PI * 2;
  const baseFee = Math.round(ECON.baseFee * distanceKm * passenger.def.fee * (type.id === 'bosshunt' ? 1.6 : 1) / 10) * 10;

  return {
    type, weather, distanceKm, passenger, heading,
    destName: DESTINATIONS[(Math.random() * DESTINATIONS.length) | 0],
    baseFee,
    hpScale: 1 + Math.min(1.5, level * 0.09), // enemies scale with career
    hasBoss: type.id === 'bosshunt',
  };
}

export class MissionDirector {
  constructor(mission, enemyMgr, plane) {
    this.mission = mission;
    this.enemyMgr = enemyMgr;
    this.plane = plane;

    // destination point in world space
    const dist = mission.distanceKm * 1000;
    this.destination = new THREE.Vector3(Math.sin(mission.heading) * dist, 140, Math.cos(mission.heading) * dist);
    this.totalDist = dist;

    this.elapsed = 0;
    this.waveTimer = 7;        // moment to settle in before first contact
    this.bossSpawned = false;
    this.kills = 0;
    this.killEarnings = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.bestCombo = 0;
    this.complete = false;
    this.failed = false;
    this.failReason = '';
    this._firstContact = false;
  }

  get distanceLeft() {
    return Math.max(0, this.plane.position.distanceTo(this.destination));
  }
  get progress() {
    return 1 - Math.min(1, this.distanceLeft / this.totalDist);
  }

  registerKill(enemy) {
    this.kills++;
    this.combo = Math.min(ECON.comboMax, this.combo + 1);
    this.comboTimer = ECON.comboWindow;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.killEarnings += Math.round(enemy.def.score * ECON.killBonus * Math.max(1, this.combo));
    if (enemy.pos.distanceTo(this.plane.position) < 120) this.mission.passenger.onKillNearby();
  }

  update(dt) {
    if (this.complete || this.failed) return;
    this.elapsed += dt;

    // combo decay
    this.comboTimer -= dt;
    if (this.comboTimer <= 0) this.combo = 0;

    // ---- wave pacing: something interesting every 12–20s ----
    this.waveTimer -= dt;
    if (this.waveTimer <= 0) {
      const p = this.progress;
      const intensity = 1 + p * 1.6 + this.mission.hpScale * 0.4;
      const roll = Math.random();
      const wave = [];
      if (roll < 0.34) {
        for (let i = 0; i < 2 + intensity | 0; i++) wave.push('winged');
        if (Math.random() < 0.5) wave.push('exploder');
      } else if (roll < 0.62) {
        for (let i = 0; i < 4 + intensity * 1.5 | 0; i++) wave.push('bat');
      } else if (roll < 0.82) {
        wave.push('latcher', 'latcher');
        for (let i = 0; i < intensity | 0; i++) wave.push('winged');
      } else {
        wave.push('exploder', 'exploder', 'bat', 'bat', 'winged');
      }
      this.enemyMgr.spawnWave(wave, this.mission.hpScale);
      this.waveTimer = 12 + Math.random() * 8 - Math.min(6, this.progress * 6);
      if (!this._firstContact) { this._firstContact = true; this.mission.passenger.onEnemySighted(); }
    }

    // boss at 55% on boss routes
    if (this.mission.hasBoss && !this.bossSpawned && this.progress > 0.55) {
      this.bossSpawned = true;
      this.enemyMgr.spawnWave(['boss'], this.mission.hpScale);
    }

    // near-destination chatter + final swarm
    if (this.progress > 0.85) this.mission.passenger.onNearDestination();

    // ---- win/lose ----
    if (this.distanceLeft < 60) this.complete = true;
    if (this.plane.dead) { this.failed = true; this.failReason = 'AIRCRAFT DESTROYED'; }
    else if (this.mission.passenger.health <= 0) { this.failed = true; this.failReason = 'YOUR VIP DID NOT SURVIVE'; }
    else if (this.plane.fuel <= 0) { this.failed = true; this.failReason = 'FUEL EXHAUSTED'; }
  }

  // Payment breakdown for the results screen.
  settle() {
    const m = this.mission;
    const moodMult = 0.4 + (m.passenger.mood / 100) * 0.9; // 0.4×..1.3×
    const fare = Math.round(m.baseFee * moodMult / 10) * 10;
    const speedBonus = m.type.id === 'medicine' && this.elapsed < m.distanceKm * 42
      ? Math.round(m.baseFee * 0.35) : 0;
    const total = fare + this.killEarnings + speedBonus;
    const stars = m.passenger.health <= 0 ? 0
      : Math.max(1, Math.min(5, Math.round(m.passenger.mood / 20)));
    return { fare, moodMult, killEarnings: this.killEarnings, speedBonus, total, stars };
  }
}
