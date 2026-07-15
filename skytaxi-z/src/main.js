// ============================================================
// SkyTaxi Z — entry point. Owns the render loop, camera rig,
// game states (menu / flight / pause / results) and wires all
// systems together.
// ============================================================

import * as THREE from 'three';
import { Input } from './input.js';
import { loadSave, writeSave } from './save.js';
import { AudioSystem } from './audio.js';
import { Effects } from './effects.js';
import { World } from './world.js';
import { Plane } from './plane.js';
import { WeaponSystem } from './weapons.js';
import { EnemyManager } from './enemies.js';
import { MissionDirector, generateMission } from './missions.js';
import { HUD } from './hud.js';
import { Menus } from './menus.js';

// ---------- core setup ----------
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.5, 8000);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ---------- systems ----------
const save = loadSave();
const input = new Input(canvas);
const audio = new AudioSystem();
const effects = new Effects(scene);
const world = new World(scene);
const plane = new Plane(scene, save.upgrades);
const weapons = new WeaponSystem(scene, plane, effects, audio);
const enemyMgr = new EnemyManager(scene, plane, effects, audio);
const hud = new HUD();

// ---------- game state ----------
let state = 'menu';           // menu | flight | paused | results
let director = null;
let mission = null;
let hurtFlash = 0;
let deathTimer = 0;
let camMode = 0;              // 0 chase, 1 cockpit, 2 cinematic
let cineAngle = 0, cineTimer = 0;

const menus = new Menus(save, {
  onAudioUnlock: () => audio.init(),
  onGenerateMission: () => generateMission(save),
  onLaunch: (m) => startMission(m),
  onUpgradesChanged: () => plane.applyUpgrades(save.upgrades),
});
menus.showMain();
world.setWeather('clear', scene);
plane.resetForMission();

// ---------- wiring: combat events ----------
enemyMgr.onEnemyKilled = (enemy) => {
  if (director) director.registerKill(enemy);
};
enemyMgr.onPlaneHit = (amount, silent = false) => {
  plane.damage(amount, effects);
  hurtFlash = Math.min(1, hurtFlash + amount * 0.04);
  if (mission) mission.passenger.onPlaneDamaged(amount);
  if (!silent && amount > 6) audio.alarm();
};

// ---------- mission lifecycle ----------
function startMission(m) {
  mission = m;
  plane.applyUpgrades(save.upgrades);
  plane.resetForMission();
  weapons.resetForMission(save.upgrades);
  enemyMgr.reset();
  director = new MissionDirector(m, enemyMgr, plane);
  world.setWeather(m.weather, scene);
  world.setDestination(director.destination);
  plane.searchlight.intensity = m.weather === 'night' ? 900 : 0;
  menus.hideAll();
  hud.show();
  hud.centerMsg(`${m.type.label.toUpperCase()}<br><small style="font-size:14px">Deliver ${m.passenger.name} to ${m.destName}</small>`, 3.5);
  m.passenger.onBoard();
  input.center();
  hurtFlash = 0; deathTimer = 0;
  state = 'flight';
}

function endMission(success) {
  state = 'results';
  hud.hide();
  const settlement = success ? director.settle() : null;
  const earned = menus.showResults(director, settlement || {}, success);
  save.money += earned;
  save.totalKills += director.kills;
  save.bestCombo = Math.max(save.bestCombo, director.bestCombo);
  if (success) {
    save.missionsCompleted++;
    save.bestRating = Math.max(save.bestRating, settlement.stars);
    audio.cash();
  }
  writeSave(save);
}

// ---------- pause ----------
document.getElementById('btn-resume').onclick = () => { state = 'flight'; menus.showPause(false); };
document.getElementById('btn-abort').onclick = () => {
  menus.showPause(false);
  director.failed = true;
  director.failReason = 'CHARTER ABORTED';
  endMission(false);
};

// ---------- camera rig ----------
const camPos = new THREE.Vector3(0, 130, -40);
const camTarget = new THREE.Vector3();
const _v = new THREE.Vector3();
const _fwd = new THREE.Vector3();

function updateCamera(dt, time) {
  plane.group.getWorldDirection(_fwd);
  const p = plane.position;

  if (camMode === 0) {
    // chase: behind + above, soft follow
    _v.copy(p).addScaledVector(_fwd, -26).add({ x: 0, y: 9, z: 0 });
    camPos.lerp(_v, Math.min(1, dt * 4.5));
    camera.position.copy(camPos);
    camTarget.copy(p).addScaledVector(_fwd, 40);
    camera.lookAt(camTarget);
  } else if (camMode === 1) {
    // cockpit
    camera.position.copy(p).addScaledVector(_fwd, 2.2).add({ x: 0, y: 1.4, z: 0 });
    camera.quaternion.copy(plane.group.quaternion);
    camera.rotateZ(plane.bank * 0.4);
    camPos.copy(camera.position);
  } else {
    // cinematic: slow orbit that re-frames every few seconds
    cineTimer -= dt;
    if (cineTimer <= 0) { cineTimer = 5; cineAngle = Math.random() * Math.PI * 2; }
    cineAngle += dt * 0.25;
    _v.set(Math.cos(cineAngle) * 45, 12 + Math.sin(time * 0.4) * 6, Math.sin(cineAngle) * 45).add(p);
    camPos.lerp(_v, Math.min(1, dt * 3));
    camera.position.copy(camPos);
    camera.lookAt(p);
  }

  // impact shake
  if (effects.shake > 0.01) {
    camera.position.x += (Math.random() - 0.5) * effects.shake * 1.6;
    camera.position.y += (Math.random() - 0.5) * effects.shake * 1.6;
    camera.position.z += (Math.random() - 0.5) * effects.shake * 1.6;
  }
}

// ---------- abilities ----------
function handleAbilities() {
  const cdScale = 1 / (1 + 0.12 * save.upgrades.cooldown);
  if (input.justPressed('f') && plane.tryAbility('flare', cdScale)) {
    enemyMgr.flare();
    for (let i = 0; i < 10; i++) {
      effects.spawn(plane.position.clone(),
        new THREE.Vector3((Math.random() - 0.5) * 60, -20 - Math.random() * 20, (Math.random() - 0.5) * 60),
        1.4, 2.5, 0xffe9a0, { gravity: -10 });
    }
    hud.centerMsg('FLARES DEPLOYED', 1.2);
  }
  if (input.justPressed('x') && plane.tryAbility('barrage', cdScale)) {
    enemyMgr.barrage(140, 70 * (1 + 0.12 * save.upgrades.damage));
    effects.explosion(plane.position.clone().addScaledVector(plane.forward, 20), 22);
    hud.centerMsg('360° BARRAGE', 1.2);
  }
  if (input.justPressed('r') && plane.tryAbility('repair', cdScale)) {
    hud.centerMsg('REPAIR DRONE ACTIVE', 1.2);
  }
  if (input.justPressed('v') && plane.tryAbility('slowmo', cdScale)) {
    hud.centerMsg('TACTICAL SLOW-MO', 1.2);
  }
}

// ---------- main loop ----------
const clock = new THREE.Clock();
let elapsed = 0;

function frame() {
  requestAnimationFrame(frame);
  let dt = Math.min(clock.getDelta(), 0.05);
  const rawDt = dt;
  elapsed += rawDt;

  if (state === 'flight') {
    // slow motion warps gameplay time, not camera/UI time
    const timeScale = plane.slowmoTime > 0 ? 0.35 : 1;
    dt *= timeScale;

    // input → systems
    if (input.justPressed('escape')) { state = 'paused'; menus.showPause(true); }
    if (input.justPressed('c')) camMode = (camMode + 1) % 3;
    for (let i = 0; i < 4; i++) {
      if (input.justPressed(String(i + 1))) weapons.switchTo(i);
    }
    handleAbilities();

    plane.update(dt, input);
    if (input.fire) weapons.tryFire(enemyMgr.enemies, 1 + 0.12 * save.upgrades.damage);
    weapons.update(dt, enemyMgr.enemies, (e, dmg) => enemyMgr.hit(e, dmg));
    enemyMgr.update(dt, elapsed);
    director.update(dt);
    mission.passenger.update(dt, plane, enemyMgr.threat());

    // storm turbulence rattles the plane and the VIP
    if (mission.weather === 'storm' && Math.random() < dt * 0.5) {
      plane.group.rotateZ((Math.random() - 0.5) * 0.15);
      effects.shake = Math.min(1.4, effects.shake + 0.25);
      if (Math.random() < 0.4) mission.passenger.onTurbulence();
    }

    // burning plane trails smoke
    if (plane.onFire && Math.random() < dt * 22) effects.damageSmoke(plane.position);
    if (plane.hull / plane.maxHull < 0.55 && Math.random() < dt * 8) effects.smokeTrail(plane.position);

    // audio
    audio.setEngine(plane.throttle, plane.boosting, !plane.dead);
    audio.intensity = enemyMgr.threat();
    audio.updateMusic(rawDt, true);

    hurtFlash = Math.max(0, hurtFlash - rawDt * 1.4);

    // latched count for HUD warning
    let latchedCount = 0;
    for (const e of enemyMgr.enemies) if (e.alive && e.latched) latchedCount++;

    // HUD
    _v.copy(director.destination).sub(plane.position).normalize();
    hud.update(rawDt, {
      plane, weapons, passenger: mission.passenger, director,
      money: save.money, threat: enemyMgr.threat(), save,
      enemies: enemyMgr.enemies, destDir: _v, hurtFlash, latchedCount,
    });

    // win / lose
    if (director.complete) {
      hud.centerMsg('DESTINATION REACHED', 2);
      endMission(true);
    } else if (director.failed) {
      deathTimer += rawDt;
      if (deathTimer > (plane.dead ? 2.2 : 0.8)) endMission(false);
    }
  } else {
    // menus: idle ambient + gentle attract-mode camera drift
    audio.setEngine(0.2, false, state !== 'menu' ? false : true);
    audio.updateMusic(rawDt, false);
    if (state === 'menu' || state === 'results') {
      cineAngle += rawDt * 0.08;
      camera.position.set(Math.cos(cineAngle) * 60 + plane.position.x, plane.position.y + 14, Math.sin(cineAngle) * 60 + plane.position.z);
      camera.lookAt(plane.position);
    }
  }

  if (state === 'flight' || state === 'paused') updateCamera(state === 'paused' ? 0.0001 : rawDt, elapsed);

  world.update(rawDt, plane.position, elapsed);
  effects.update(state === 'paused' ? 0 : rawDt, camera);
  renderer.render(scene, camera);
  input.endFrame();
}

frame();
