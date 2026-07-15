// ============================================================
// Weapons — 4 hardpoints with distinct feel: pooled projectiles,
// gentle auto-aim cone, homing missiles, splash damage.
// ============================================================

import * as THREE from 'three';
import { WEAPONS } from './config.js';

const MAX_PROJ = 220;

export class WeaponSystem {
  constructor(scene, plane, effects, audio) {
    this.scene = scene;
    this.plane = plane;
    this.effects = effects;
    this.audio = audio;

    this.current = 0;
    this.cooldown = 0;
    this.ammo = WEAPONS.map(w => w.ammo);
    this.muzzleSide = 1;

    // projectile pool (one instanced mesh)
    const geo = new THREE.SphereGeometry(1, 6, 5);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.InstancedMesh(geo, mat, MAX_PROJ);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.colors = new THREE.InstancedBufferAttribute(new Float32Array(MAX_PROJ * 3), 3);
    this.mesh.instanceColor = this.colors;
    scene.add(this.mesh);

    this.projs = [];
    for (let i = 0; i < MAX_PROJ; i++) {
      this.projs.push({ alive: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(),
        life: 0, damage: 0, splash: 0, size: 1, color: new THREE.Color(), homing: false,
        target: null, turnRate: 0, trail: false });
    }
    this._cursor = 0;
    this._dummy = new THREE.Object3D();
    this._tmp = new THREE.Vector3();
    this._tmp2 = new THREE.Vector3();
  }

  get weapon() { return WEAPONS[this.current]; }

  resetForMission(upgrades) {
    const ammoScale = 1 + 0.25 * upgrades.ammo;
    this.ammo = WEAPONS.map(w => w.ammo === Infinity ? Infinity : Math.round(w.ammo * ammoScale));
    this.current = 0;
    this.cooldown = 0;
    for (const p of this.projs) p.alive = false;
  }

  switchTo(i) {
    if (i >= 0 && i < WEAPONS.length && i !== this.current) {
      this.current = i;
      this.cooldown = Math.max(this.cooldown, 0.25); // swap delay
      return true;
    }
    return false;
  }

  // Soft auto-aim: pick the enemy closest to the crosshair within a cone.
  _aimDir(enemies) {
    const fwd = this.plane.forward.clone();
    let best = null, bestDot = 0.986; // ~9.5° cone
    for (const e of enemies) {
      if (!e.alive || e.latched) continue;
      this._tmp.copy(e.pos).sub(this.plane.position);
      const dist = this._tmp.length();
      if (dist > 700) continue;
      this._tmp.divideScalar(dist);
      const dot = this._tmp.dot(fwd);
      if (dot > bestDot) { bestDot = dot; best = e; }
    }
    if (best) {
      // lead the target slightly
      this._tmp.copy(best.pos).addScaledVector(best.vel, 0.18).sub(this.plane.position).normalize();
      return { dir: this._tmp.clone(), target: best };
    }
    return { dir: fwd, target: null };
  }

  tryFire(enemies, dmgScale) {
    if (this.cooldown > 0 || this.plane.dead) return;
    const w = this.weapon;
    if (this.ammo[this.current] <= 0) { this.audio.alarm && null; return; }
    this.cooldown = 1 / w.fireRate;
    if (this.ammo[this.current] !== Infinity) this.ammo[this.current]--;

    const { dir, target } = this._aimDir(enemies);
    // muzzle position alternates wing pods
    this.muzzleSide *= -1;
    const right = this._tmp2.set(1, 0, 0).applyQuaternion(this.plane.group.quaternion);
    const muzzle = this.plane.position.clone()
      .addScaledVector(right, this.muzzleSide * 3.2)
      .addScaledVector(dir, 5);

    const spread = w.spread;
    const shotDir = dir.clone();
    shotDir.x += (Math.random() - 0.5) * spread;
    shotDir.y += (Math.random() - 0.5) * spread;
    shotDir.z += (Math.random() - 0.5) * spread;
    shotDir.normalize();

    const p = this.projs[this._cursor];
    this._cursor = (this._cursor + 1) % MAX_PROJ;
    p.alive = true;
    p.pos.copy(muzzle);
    p.vel.copy(shotDir).multiplyScalar(w.speed).add(this.plane.velocity.clone().multiplyScalar(0.5));
    p.life = 3.2;
    p.damage = w.damage * dmgScale;
    p.splash = w.splash;
    p.size = w.projSize;
    p.color.set(w.projColor);
    p.homing = w.homing;
    p.target = w.homing ? (target || this._nearestEnemy(enemies)) : null;
    p.turnRate = w.turnRate || 0;
    p.trail = !!w.trail;

    this.effects.muzzleFlash(muzzle, shotDir);
    this.effects.shake = Math.min(1.4, this.effects.shake + w.recoil * 0.1);
    this.audio.shoot(w.sound);
  }

  _nearestEnemy(enemies) {
    let best = null, bd = Infinity;
    for (const e of enemies) {
      if (!e.alive) continue;
      const d = e.pos.distanceToSquared(this.plane.position);
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }

  // Returns array of {enemy, damage} hits this frame; enemy manager applies them.
  update(dt, enemies, onHit) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    const d = this._dummy;
    for (let i = 0; i < MAX_PROJ; i++) {
      const p = this.projs[i];
      if (!p.alive) {
        d.position.set(0, -9999, 0); d.scale.setScalar(0.001);
        d.updateMatrix(); this.mesh.setMatrixAt(i, d.matrix);
        continue;
      }
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }

      // homing steer
      if (p.homing && p.target && p.target.alive) {
        this._tmp.copy(p.target.pos).sub(p.pos).normalize();
        const speed = p.vel.length();
        p.vel.normalize().lerp(this._tmp, Math.min(1, p.turnRate * dt)).normalize().multiplyScalar(speed);
      }
      p.pos.addScaledVector(p.vel, dt);
      if (p.trail && Math.random() < 0.7) this.effects.smokeTrail(p.pos);

      // collision vs enemies (sphere test)
      for (const e of enemies) {
        if (!e.alive) continue;
        const hitR = e.size + p.size + 1.2;
        if (p.pos.distanceToSquared(e.pos) < hitR * hitR) {
          p.alive = false;
          if (p.splash > 0) {
            this.effects.explosion(p.pos.clone(), p.splash * 0.7);
            this.audio.explosion(false);
            for (const e2 of enemies) {
              if (!e2.alive) continue;
              const dd = e2.pos.distanceTo(p.pos);
              if (dd < p.splash) onHit(e2, p.damage * (1 - dd / p.splash * 0.5));
            }
          } else {
            onHit(e, p.damage);
          }
          break;
        }
      }
      if (!p.alive) continue;

      d.position.copy(p.pos);
      d.scale.setScalar(p.size);
      d.updateMatrix();
      this.mesh.setMatrixAt(i, d.matrix);
      this.colors.setXYZ(i, p.color.r, p.color.g, p.color.b);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.colors.needsUpdate = true;
  }
}
