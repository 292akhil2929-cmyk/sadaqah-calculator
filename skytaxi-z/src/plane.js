// ============================================================
// Plane — the armored sky-taxi. Procedural mesh (no assets),
// arcade flight model, hull/engine damage, boost, abilities.
// ============================================================

import * as THREE from 'three';
import { FLIGHT, ABILITIES } from './config.js';
import { terrainHeight } from './world.js';

export class Plane {
  constructor(scene, upgrades) {
    this.upgrades = upgrades;
    this.group = new THREE.Group();       // position + heading
    this.visual = new THREE.Group();      // banking roll only
    this.group.add(this.visual);
    scene.add(this.group);
    this._buildMesh();

    // flight state
    this.speed = FLIGHT.minSpeed + 20;
    this.throttle = 0.7;
    this.velocity = new THREE.Vector3();
    this.bank = 0;

    // health / systems
    this.maxHull = 100 * (1 + 0.2 * upgrades.armor);
    this.hull = this.maxHull;
    this.engineHealth = 100;
    this.fuel = 100;
    this.onFire = false;
    this.dead = false;

    // boost
    this.boostMax = 100 * (1 + 0.3 * upgrades.boost);
    this.boost = this.boostMax;
    this.boosting = false;

    // abilities: id -> remaining cooldown
    this.cooldowns = { flare: 0, barrage: 0, repair: 0, slowmo: 0 };
    this.repairTime = 0;
    this.slowmoTime = 0;

    this._tmp = new THREE.Vector3();
  }

  _buildMesh() {
    const hullMat = new THREE.MeshLambertMaterial({ color: 0xd8dde6, flatShading: true });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x2a2f3a, flatShading: true });
    const accentMat = new THREE.MeshLambertMaterial({ color: 0xcc3333, flatShading: true });

    // fuselage
    const fus = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.7, 9, 8), hullMat);
    fus.rotation.x = Math.PI / 2;
    this.visual.add(fus);
    // nose cone + prop
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 8), darkMat);
    nose.rotation.x = Math.PI / 2; nose.position.z = 5.2;
    this.visual.add(nose);
    this.prop = new THREE.Mesh(new THREE.BoxGeometry(7, 0.35, 0.12), darkMat);
    this.prop.position.z = 5.9;
    this.visual.add(this.prop);
    // cockpit canopy
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.0, 8, 6),
      new THREE.MeshLambertMaterial({ color: 0x6fb8ff, flatShading: true }));
    canopy.scale.set(0.85, 0.7, 1.7); canopy.position.set(0, 0.85, 1.6);
    this.visual.add(canopy);
    // wings with armor plates
    const wing = new THREE.Mesh(new THREE.BoxGeometry(14, 0.28, 2.6), hullMat);
    wing.position.set(0, 0.3, 0.6);
    this.visual.add(wing);
    const plateL = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 2.0), darkMat);
    plateL.position.set(-4.5, 0.5, 0.6); this.visual.add(plateL);
    const plateR = plateL.clone(); plateR.position.x = 4.5; this.visual.add(plateR);
    // tail
    const tailH = new THREE.Mesh(new THREE.BoxGeometry(5, 0.22, 1.4), hullMat);
    tailH.position.set(0, 0.4, -4.2); this.visual.add(tailH);
    const tailV = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.2, 1.6), accentMat);
    tailV.position.set(0, 1.2, -4.3); this.visual.add(tailV);
    // wing hardpoints (visual weapon pods)
    const podGeo = new THREE.CylinderGeometry(0.32, 0.32, 1.8, 6);
    for (const x of [-3.2, 3.2]) {
      const pod = new THREE.Mesh(podGeo, darkMat);
      pod.rotation.x = Math.PI / 2; pod.position.set(x, -0.15, 1.2);
      this.visual.add(pod);
    }
    // engine flame (boost visual)
    this.flame = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3, 6),
      new THREE.MeshBasicMaterial({ color: 0x7ce0ff, transparent: true, opacity: 0.8 }));
    this.flame.rotation.x = -Math.PI / 2; this.flame.position.z = -5.6;
    this.flame.visible = false;
    this.visual.add(this.flame);
    // searchlight for night missions
    this.searchlight = new THREE.SpotLight(0xfff4d6, 0, 600, 0.32, 0.5);
    this.searchlight.position.set(0, -0.5, 4);
    this.searchlight.target.position.set(0, -30, 300);
    this.visual.add(this.searchlight);
    this.visual.add(this.searchlight.target);
  }

  get position() { return this.group.position; }
  get forward() { return this.group.getWorldDirection(this._tmp); }

  applyUpgrades(upgrades) {
    this.upgrades = upgrades;
    this.maxHull = 100 * (1 + 0.2 * upgrades.armor);
    this.boostMax = 100 * (1 + 0.3 * upgrades.boost);
  }

  resetForMission() {
    this.hull = this.maxHull;
    this.engineHealth = 100;
    this.fuel = 100;
    this.boost = this.boostMax;
    this.onFire = false;
    this.dead = false;
    this.speed = FLIGHT.minSpeed + 20;
    this.throttle = 0.7;
    this.cooldowns = { flare: 0, barrage: 0, repair: 0, slowmo: 0 };
    this.repairTime = 0; this.slowmoTime = 0;
    this.group.position.set(0, 120, 0);
    this.group.quaternion.identity();
    this.bank = 0;
  }

  damage(amount, effects) {
    if (this.dead) return;
    this.hull -= amount;
    if (effects) effects.shake = Math.min(1.4, effects.shake + amount * 0.02);
    if (Math.random() < 0.35) this.engineHealth = Math.max(10, this.engineHealth - amount * 0.5);
    if (this.hull < 30) this.onFire = true;
    if (this.hull <= 0) { this.hull = 0; this.dead = true; }
  }

  tryAbility(id, cdScale = 1) {
    if (this.cooldowns[id] > 0) return false;
    this.cooldowns[id] = ABILITIES[id].cooldown * cdScale;
    if (id === 'repair') this.repairTime = ABILITIES.repair.duration;
    if (id === 'slowmo') this.slowmoTime = ABILITIES.slowmo.duration;
    return true;
  }

  update(dt, input) {
    if (this.dead) {
      // death spiral
      this.group.rotateX(dt * 0.6);
      this.velocity.copy(this.forward).multiplyScalar(this.speed);
      this.velocity.y -= 30;
      this.group.position.addScaledVector(this.velocity, dt);
      return;
    }

    const up = this.upgrades;
    const maxSpeed = FLIGHT.maxSpeed * (1 + 0.08 * up.engine);
    const turnScale = (1 + 0.10 * up.handling) * (0.6 + 0.4 * (this.engineHealth / 100));

    // ---- throttle & boost ----
    if (input.down('w')) this.throttle = Math.min(1, this.throttle + dt * 0.8);
    if (input.down('s')) this.throttle = Math.max(0.15, this.throttle - dt * 0.8);
    this.boosting = input.down('shift') && this.boost > 1;
    if (this.boosting) this.boost = Math.max(0, this.boost - dt * 24);
    else this.boost = Math.min(this.boostMax, this.boost + dt * 7);

    const targetSpeed = this.boosting ? FLIGHT.boostSpeed
      : FLIGHT.minSpeed + (maxSpeed - FLIGHT.minSpeed) * this.throttle;
    this.speed += (targetSpeed - this.speed) * Math.min(1, dt * (this.boosting ? 2.4 : 1.2));
    this.flame.visible = this.boosting;
    if (this.boosting) this.flame.scale.setScalar(0.8 + Math.random() * 0.5);

    // ---- steering: mouse position = stick deflection ----
    let mx = input.mouseX, my = input.mouseY;
    if (Math.abs(mx) < FLIGHT.mouseDeadzone) mx = 0;
    if (Math.abs(my) < FLIGHT.mouseDeadzone) my = 0;
    // arrow keys as fallback
    if (input.down('arrowleft')) mx = -1;
    if (input.down('arrowright')) mx = 1;
    if (input.down('arrowup')) my = -1;
    if (input.down('arrowdown')) my = 1;

    this.group.rotateY(-mx * FLIGHT.yawRate * turnScale * dt);
    this.group.rotateX(my * FLIGHT.pitchRate * turnScale * dt);

    // hard roll input (A/D) — used to shake off latchers, pure visual + gameplay flag
    this.hardRolling = input.down('a') || input.down('d');
    const rollDir = input.down('a') ? 1 : input.down('d') ? -1 : 0;

    // visual banking
    const targetBank = -mx * FLIGHT.bankAngle + rollDir * 1.8;
    this.bank += (targetBank - this.bank) * Math.min(1, dt * 5);
    this.visual.rotation.z = this.bank;

    // keep the nose from going fully vertical (forgiving arcade clamp)
    const fwd = this.forward;
    if (fwd.y > 0.85) this.group.rotateX(dt * 1.2);
    if (fwd.y < -0.85) this.group.rotateX(-dt * 1.2);

    // ---- move ----
    this.velocity.copy(this.forward).multiplyScalar(this.speed);
    this.group.position.addScaledVector(this.velocity, dt);

    // terrain floor: auto-pullup, never a crash (arcade forgiveness)
    const floor = terrainHeight(this.position.x, this.position.z) + FLIGHT.floorAltitude;
    if (this.position.y < floor) {
      this.position.y += (floor - this.position.y) * Math.min(1, dt * 4);
      this.group.rotateX(-dt * 0.8);
    }
    if (this.position.y > FLIGHT.ceiling) this.position.y = FLIGHT.ceiling;

    // ---- systems ----
    this.fuel = Math.max(0, this.fuel - dt * (0.10 + this.throttle * 0.12 + (this.boosting ? 0.5 : 0)));
    this.prop.rotation.z += dt * (20 + this.throttle * 40);

    for (const k in this.cooldowns) this.cooldowns[k] = Math.max(0, this.cooldowns[k] - dt);
    if (this.repairTime > 0) {
      this.repairTime -= dt;
      this.hull = Math.min(this.maxHull, this.hull + dt * 7 * (1 + 0.3 * up.armor));
      this.engineHealth = Math.min(100, this.engineHealth + dt * 8);
      if (this.hull > 35) this.onFire = false;
    }
    if (this.slowmoTime > 0) this.slowmoTime -= dt;
  }
}
