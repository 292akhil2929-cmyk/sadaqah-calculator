// ============================================================
// Menus — screen flow: main / hangar / briefing / results /
// pause. Pure DOM; gameplay never touches these elements.
// ============================================================

import { UPGRADES } from './config.js';
import { writeSave } from './save.js';

const $ = (id) => document.getElementById(id);
const SCREENS = ['menu-main', 'menu-hangar', 'menu-brief', 'menu-howto', 'menu-results', 'menu-pause'];

export class Menus {
  constructor(save, callbacks) {
    this.save = save;
    this.cb = callbacks; // { onLaunch(mission), onGenerateMission(), onAudioUnlock() }
    this.pendingMission = null;

    $('btn-fly').onclick = () => { this.cb.onAudioUnlock(); this._openBriefing(); };
    $('btn-hangar').onclick = () => { this.cb.onAudioUnlock(); this._openHangar(); };
    $('btn-howto').onclick = () => this.showOnly('menu-howto');
    $('btn-howto-back').onclick = () => this.showMain();
    $('btn-hangar-back').onclick = () => this.showMain();
    $('btn-launch').onclick = () => { if (this.pendingMission) this.cb.onLaunch(this.pendingMission); };
    $('btn-reroll').onclick = () => this._openBriefing();
    $('btn-brief-back').onclick = () => this.showMain();
    $('btn-next-job').onclick = () => this._openBriefing();
    $('btn-results-hangar').onclick = () => this._openHangar();
    $('btn-results-menu').onclick = () => this.showMain();
  }

  showOnly(id) {
    for (const s of SCREENS) $(s).classList.toggle('hidden', s !== id);
  }
  hideAll() {
    for (const s of SCREENS) $(s).classList.add('hidden');
  }

  showMain() {
    this.showOnly('menu-main');
    $('menu-stats').textContent =
      `Missions ${this.save.missionsCompleted} · Kills ${this.save.totalKills} · Best combo ×${this.save.bestCombo} · $${this.save.money.toLocaleString()}`;
  }

  showPause(visible) {
    $('menu-pause').classList.toggle('hidden', !visible);
  }

  _openBriefing() {
    this.pendingMission = this.cb.onGenerateMission();
    const m = this.pendingMission;
    const p = m.passenger;
    $('brief-card').innerHTML = `
      <div class="b-face">${p.def.face}</div>
      <h3>${p.name}</h3>
      <div class="b-trait">${p.def.trait}</div>
      <p>"${p.def.lines.board[0]}"</p>
      <div class="b-row"><span>Mission</span><b>${m.type.label}</b></div>
      <div class="b-row"><span>Destination</span><b>${m.destName}</b></div>
      <div class="b-row"><span>Distance</span><b>${m.distanceKm.toFixed(1)} km</b></div>
      <div class="b-row"><span>Conditions</span><b>${m.weather.toUpperCase()}${m.hasBoss ? ' · ⚠ LARGE CONTACT ON ROUTE' : ''}</b></div>
      <div class="b-row"><span>Base fee</span><b>$${m.baseFee.toLocaleString()}</b></div>
      <p style="margin-top:8px">${m.type.desc}</p>`;
    this.showOnly('menu-brief');
  }

  _openHangar() {
    $('hangar-money').textContent = '$' + this.save.money.toLocaleString();
    const list = $('upgrade-list');
    list.innerHTML = '';
    for (const u of UPGRADES) {
      const lvl = this.save.upgrades[u.id];
      const cost = Math.round(u.base * Math.pow(1.6, lvl));
      const maxed = lvl >= u.max;
      const el = document.createElement('div');
      el.className = 'upg';
      el.innerHTML = `
        <div>
          <div class="u-name">${u.name}</div>
          <div class="u-desc">${u.desc}</div>
          <div class="pips">${Array.from({ length: u.max }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</div>
        </div>
        <button ${maxed || this.save.money < cost ? 'disabled' : ''}>${maxed ? 'MAX' : '$' + cost.toLocaleString()}</button>`;
      el.querySelector('button').onclick = () => {
        if (maxed || this.save.money < cost) return;
        this.save.money -= cost;
        this.save.upgrades[u.id]++;
        writeSave(this.save);
        this.cb.onUpgradesChanged && this.cb.onUpgradesChanged();
        this._openHangar(); // re-render
      };
      list.appendChild(el);
    }
    this.showOnly('menu-hangar');
  }

  showResults(director, settlement, success) {
    const m = director.mission;
    $('results-title').textContent = success ? 'FLIGHT COMPLETE' : director.failReason;
    $('results-stars').textContent = success
      ? '★'.repeat(settlement.stars) + '☆'.repeat(5 - settlement.stars)
      : '☆☆☆☆☆';
    const rows = success ? [
      [`Fare (${m.passenger.name}, mood ×${settlement.moodMult.toFixed(2)})`, settlement.fare],
      [`Combat bonus (${director.kills} kills, best combo ×${director.bestCombo})`, settlement.killEarnings],
      ...(settlement.speedBonus ? [['Speed bonus', settlement.speedBonus]] : []),
    ] : [
      ['Fare', 0],
      [`Salvaged combat pay (${director.kills} kills)`, Math.round(director.killEarnings * 0.3)],
    ];
    const total = success ? settlement.total : Math.round(director.killEarnings * 0.3);
    $('results-breakdown').innerHTML =
      rows.map(([k, v]) => `<div class="r-row"><span>${k}</span><span>$${v.toLocaleString()}</span></div>`).join('') +
      `<div class="r-row r-total"><span>TOTAL</span><span>$${total.toLocaleString()}</span></div>`;
    this.showOnly('menu-results');
    return total;
  }
}
