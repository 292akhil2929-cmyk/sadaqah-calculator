// ============================================================
// HUD — DOM-based overlay: status bars, radar canvas, compass
// tape, passenger bubble, warnings, center messages.
// ============================================================

import { WEAPONS } from './config.js';

const $ = (id) => document.getElementById(id);

export class HUD {
  constructor() {
    this.root = $('hud');
    this.radarCtx = $('radar').getContext('2d');
    this._bubbleTimer = 0;
    this._msgTimer = 0;
    // build compass tape once: N . E . S . W repeated
    const seq = ['N', '·', 'E', '·', 'S', '·', 'W', '·'];
    let tape = '';
    for (let i = 0; i < 6; i++) for (const s of seq) tape += ` ${s} `;
    $('compass-tape').textContent = tape;
  }

  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); }

  centerMsg(text, seconds = 2.2) {
    const el = $('center-msg');
    el.innerHTML = text;
    el.classList.remove('hidden');
    this._msgTimer = seconds;
  }

  _setBar(id, frac) {
    const el = $(id);
    el.style.width = Math.max(0, Math.min(100, frac * 100)) + '%';
    el.classList.toggle('low', frac < 0.3);
  }

  update(dt, ctx) {
    const { plane, weapons, passenger, director, money, threat, save } = ctx;

    // bars
    this._setBar('bar-hull', plane.hull / plane.maxHull);
    this._setBar('bar-engine', plane.engineHealth / 100);
    this._setBar('bar-fuel', plane.fuel / 100);
    this._setBar('bar-boost', plane.boost / plane.boostMax);
    this._setBar('bar-mood', passenger.mood / 100);
    this._setBar('bar-paxhp', passenger.health / 100);
    $('pax-face').textContent = passenger.moodFace;
    $('pax-name').textContent = `${passenger.name} · ${passenger.def.trait}`;

    // flight data
    $('hud-speed').textContent = Math.round(plane.speed * 3.6);
    $('hud-alt').textContent = Math.round(plane.position.y);

    // objective
    $('objective-text').textContent = `Deliver ${passenger.name} → ${director.mission.destName}`;
    $('dist-text').textContent = (director.distanceLeft / 1000).toFixed(1) + ' km to destination';

    // money + combo
    $('hud-money').textContent = '$' + (money + director.killEarnings).toLocaleString();
    $('hud-combo').textContent = director.combo > 1 ? `COMBO ×${director.combo}` : '';

    // weapon
    const w = weapons.weapon;
    $('weapon-name').textContent = w.name;
    const ammo = weapons.ammo[weapons.current];
    $('weapon-ammo').textContent = ammo === Infinity ? '∞' : ammo;
    const slots = $('weapon-slots');
    if (slots.children.length !== WEAPONS.length) {
      slots.innerHTML = WEAPONS.map(() => '<i></i>').join('');
    }
    [...slots.children].forEach((el, i) => el.classList.toggle('on', i === weapons.current));

    // abilities
    for (const [id, elId] of [['flare', 'ab-flare'], ['barrage', 'ab-barrage'], ['repair', 'ab-repair'], ['slowmo', 'ab-slowmo']]) {
      const el = $(elId);
      const cd = plane.cooldowns[id];
      el.classList.toggle('ready', cd <= 0);
      el.querySelector('.cd').style.width = cd > 0 ? (cd / 40 * 100) + '%' : '0%';
    }

    // warnings
    const warns = [];
    if (plane.onFire) warns.push('⚠ CABIN FIRE');
    if (plane.hull / plane.maxHull < 0.3) warns.push('⚠ HULL CRITICAL');
    if (plane.fuel < 20) warns.push('⚠ LOW FUEL');
    if (plane.engineHealth < 40) warns.push('⚠ ENGINE DAMAGE');
    if (ctx.latchedCount > 0) warns.push(`⚠ ${ctx.latchedCount} LATCHED — ROLL (A/D)!`);
    $('warnings').innerHTML = warns.map(w2 => `<div class="warn">${w2}</div>`).join('');

    // threat
    const tl = $('threat-level');
    tl.textContent = threat > 0.6 ? 'EXTREME' : threat > 0.3 ? 'HIGH' : threat > 0.05 ? 'MODERATE' : 'LOW';
    tl.style.color = threat > 0.6 ? '#ff3b3b' : threat > 0.3 ? '#ff9a3c' : threat > 0.05 ? '#ffd24a' : '#7CFF6B';

    // compass: heading of plane (y rotation) → tape scroll
    const fwd = plane.forward;
    const heading = Math.atan2(fwd.x, fwd.z); // 0 = north(+z)
    const tapeW = $('compass-tape').scrollWidth / 6;
    $('compass-tape').style.left = (170 - ((heading / (Math.PI * 2)) + 0.5) * tapeW - tapeW * 2) + 'px';
    // waypoint tick: bearing to destination relative to heading
    const toDest = ctx.destDir;
    const destBearing = Math.atan2(toDest.x, toDest.z);
    let rel = destBearing - heading;
    while (rel > Math.PI) rel -= Math.PI * 2;
    while (rel < -Math.PI) rel += Math.PI * 2;
    $('waypoint-tick').style.left = (165 + Math.max(-160, Math.min(150, rel / Math.PI * 340))) + 'px';

    // passenger bubble
    if (passenger.pendingLine) {
      $('pax-bubble-name').textContent = passenger.pendingLine.name.toUpperCase();
      $('pax-bubble-text').textContent = '“' + passenger.pendingLine.text + '”';
      $('pax-bubble').classList.remove('hidden');
      this._bubbleTimer = 3.6;
      passenger.pendingLine = null;
    }
    this._bubbleTimer -= dt;
    if (this._bubbleTimer <= 0) $('pax-bubble').classList.add('hidden');

    this._msgTimer -= dt;
    if (this._msgTimer <= 0) $('center-msg').classList.add('hidden');

    // hit vignette follows recent shake
    $('hit-vignette').style.boxShadow = `inset 0 0 140px rgba(255,30,30,${Math.min(0.55, ctx.hurtFlash)})`;

    this._drawRadar(ctx);
  }

  _drawRadar({ plane, enemies, destDir }) {
    const c = this.radarCtx, W = 150, R = W / 2;
    c.clearRect(0, 0, W, W);
    c.strokeStyle = 'rgba(90,255,150,.25)';
    c.beginPath(); c.arc(R, R, R - 4, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.arc(R, R, R * 0.55, 0, Math.PI * 2); c.stroke();

    const fwd = plane.forward;
    const heading = Math.atan2(fwd.x, fwd.z);
    const range = 550;

    // destination marker on rim
    const destBearing = Math.atan2(destDir.x, destDir.z) - heading;
    c.fillStyle = '#7CFF6B';
    c.beginPath();
    c.arc(R + Math.sin(destBearing) * (R - 8), R - Math.cos(destBearing) * (R - 8), 4, 0, Math.PI * 2);
    c.fill();

    // enemies
    for (const e of enemies) {
      if (!e.alive) continue;
      const dx = e.pos.x - plane.position.x, dz = e.pos.z - plane.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist > range) continue;
      const bearing = Math.atan2(dx, dz) - heading;
      const r = (dist / range) * (R - 8);
      c.fillStyle = e.type === 'boss' ? '#ff3b3b' : e.latched ? '#ff9a3c' : '#ffd24a';
      const size = e.type === 'boss' ? 5 : 2.5;
      c.beginPath();
      c.arc(R + Math.sin(bearing) * r, R - Math.cos(bearing) * r, size, 0, Math.PI * 2);
      c.fill();
    }

    // player wedge
    c.fillStyle = '#cfeaff';
    c.beginPath();
    c.moveTo(R, R - 6); c.lineTo(R - 4, R + 5); c.lineTo(R + 4, R + 5);
    c.closePath(); c.fill();
  }
}
