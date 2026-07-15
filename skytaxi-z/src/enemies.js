// ============================================================
// Enemies — airborne infected. Each archetype has its own
// steering behavior; all surround the plane rather than
// beelining. Manager owns spawning, hits, deaths and the boss.
// ============================================================

import * as THREE from 'three';
import { ENEMIES } from './config.js';

let _id = 0;

class Enemy {
  constructor(type, scene) {
    this.id = _id++;
    this.type = type;
    this.def = ENEMIES[type];
    this.alive = false;
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.hp = 0;
    this.size = this.def.size;
    this.latched = false;
    this.latchOffset = new THREE.Vector3();
    this.orbitPhase = Math.random() * Math.PI * 2;
    this.orbitDir = Math.random() < 0.5 ? 1 : -1;
    this.stateTimer = 0;
    this.diving = false;
    this.wobble = Math.random() * 10;

    this.group = this._buildMesh();
    this.group.visible = false;
    scene.add(this.group);
  }

  _buildMesh() {
    const g = new THREE.Group();
    const d = this.def;
    const bodyMat = new THREE.MeshLambertMaterial({ color: d.color, flatShading: true });
    const body = new THREE.Mesh(new THREE.SphereGeometry(d.size * 0.55, 6, 5), bodyMat);
    body.scale.set(1, 0.8, 1.3);
    g.add(body);
    // wings — flapped in update
    const wGeo = new THREE.BoxGeometry(d.size * 1.6, d.size * 0.08, d.size * 0.7);
    this.wingL = new THREE.Mesh(wGeo, bodyMat);
    this.wingL.position.x = -d.size * 0.9;
    this.wingR = new THREE.Mesh(wGeo, bodyMat);
    this.wingR.position.x = d.size * 0.9;
    g.add(this.wingL, this.wingR);
    // glowing eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    const eGeo = new THREE.SphereGeometry(d.size * 0.1, 4, 4);
    const e1 = new THREE.Mesh(eGeo, eyeMat); e1.position.set(-d.size * 0.2, d.size * 0.15, d.size * 0.6);
    const e2 = new THREE.Mesh(eGeo, eyeMat); e2.position.set(d.size * 0.2, d.size * 0.15, d.size * 0.6);
    g.add(e1, e2);
    if (d.glow) {
      const glow = new THREE.Mesh(new THREE.SphereGeometry(d.size * 0.75, 6, 5),
        new THREE.MeshBasicMaterial({ color: 0xd0ff50, transparent: true, opacity: 0.3 }));
      g.add(glow);
      this.glowMesh = glow;
    }
    return g;
  }

  spawn(pos, hpScale = 1) {
    this.alive = true;
    this.pos.copy(pos);
    this.vel.set(0, 0, 0);
    this.hp = this.def.hp * hpScale;
    this.latched = false;
    this.diving = false;
    this.stateTimer = 1 + Math.random() * 3;
    this.group.visible = true;
  }

  kill() {
    this.alive = false;
    this.latched = false;
    this.group.visible = false;
  }
}

export class EnemyManager {
  constructor(scene, plane, effects, audio) {
    this.scene = scene;
    this.plane = plane;
    this.effects = effects;
    this.audio = audio;
    this.enemies = [];
    this.pools = { winged: 14, bat: 20, exploder: 8, latcher: 6, boss: 1 };
    for (const [type, n] of Object.entries(this.pools)) {
      for (let i = 0; i < n; i++) this.enemies.push(new Enemy(type, scene));
    }
    // boss spit projectiles
    this.spits = [];
    const spitGeo = new THREE.SphereGeometry(1.6, 6, 5);
    const spitMat = new THREE.MeshBasicMaterial({ color: 0xb0ff40 });
    for (let i = 0; i < 12; i++) {
      const m = new THREE.Mesh(spitGeo, spitMat);
      m.visible = false; scene.add(m);
      this.spits.push({ mesh: m, alive: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0 });
    }
    this._tmp = new THREE.Vector3();
    this._tmp2 = new THREE.Vector3();
    this.onEnemyKilled = null;  // set by mission manager
    this.onPlaneHit = null;
    this._contactGrace = 0;     // brief mercy window between contact hits
  }

  get alive() { return this.enemies.filter(e => e.alive); }
  get aliveCount() { let n = 0; for (const e of this.enemies) if (e.alive) n++; return n; }

  reset() {
    for (const e of this.enemies) e.kill();
    for (const s of this.spits) { s.alive = false; s.mesh.visible = false; }
  }

  spawnWave(types, hpScale = 1) {
    const planePos = this.plane.position;
    let spawned = 0;
    for (const type of types) {
      const e = this.enemies.find(x => x.type === type && !x.alive);
      if (!e) continue;
      // spawn in a ring around the plane, biased ahead, out of sight-ish
      const ang = Math.random() * Math.PI * 2;
      const dist = 380 + Math.random() * 200;
      this._tmp.set(Math.cos(ang) * dist, 40 + Math.random() * 120 - 40, Math.sin(ang) * dist).add(planePos);
      this._tmp.y = Math.max(30, this._tmp.y);
      e.spawn(this._tmp, hpScale);
      spawned++;
    }
    if (spawned > 0) this.audio.screech();
    return spawned;
  }

  hit(enemy, damage) {
    if (!enemy.alive) return;
    enemy.hp -= damage;
    this.effects.sparks(enemy.pos);
    if (enemy.hp <= 0) {
      this._die(enemy);
    }
  }

  _die(enemy, silent = false) {
    const def = enemy.def;
    if (def.behavior === 'kamikaze' && !silent) {
      // exploders detonate on death — near the plane, that hurts
      this.effects.explosion(enemy.pos.clone(), def.blastRadius, false);
      this.audio.explosion(false);
      const d = enemy.pos.distanceTo(this.plane.position);
      if (d < def.blastRadius && this.onPlaneHit) this.onPlaneHit(def.damage * (1 - d / def.blastRadius));
    } else {
      this.effects.bloodBurst(enemy.pos, def.size);
      if (def.behavior === 'boss') { this.effects.explosion(enemy.pos.clone(), 40, true); this.audio.explosion(true); }
    }
    this.audio.screech();
    enemy.kill();
    if (this.onEnemyKilled) this.onEnemyKilled(enemy);
  }

  // Kill/damage everything within radius (360° barrage ability).
  barrage(radius, damage) {
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (e.latched || e.pos.distanceTo(this.plane.position) < radius) {
        this.effects.explosion(e.pos.clone(), 8);
        this.hit(e, damage);
      }
    }
    this.audio.explosion(true);
  }

  // Flares: break latchers off and scatter nearby enemies.
  flare() {
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (e.latched) { e.latched = false; e.stateTimer = 4; }
      if (e.pos.distanceTo(this.plane.position) < 160) {
        this._tmp.copy(e.pos).sub(this.plane.position).normalize().multiplyScalar(90);
        e.vel.add(this._tmp);
        e.stateTimer = 3 + Math.random() * 2;
        e.diving = false;
      }
    }
  }

  update(dt, time) {
    const planePos = this.plane.position;
    const planeVel = this.plane.velocity;
    this._contactGrace = Math.max(0, this._contactGrace - dt);

    for (const e of this.enemies) {
      if (!e.alive) continue;
      const def = e.def;
      e.stateTimer -= dt;

      if (e.latched) {
        // ride the plane, chew on it
        e.pos.copy(planePos).add(this._tmp.copy(e.latchOffset).applyQuaternion(this.plane.group.quaternion));
        if (this.onPlaneHit) this.onPlaneHit(def.latchDps * dt, true);
        // hard rolling shakes them loose
        if (this.plane.hardRolling && Math.random() < dt * 1.4) {
          e.latched = false;
          this._tmp.copy(e.pos).sub(planePos).normalize().multiplyScalar(60);
          e.vel.copy(this._tmp);
          e.stateTimer = 3;
        }
      } else {
        // ---- steering by archetype ----
        let target = this._tmp2;
        if (def.behavior === 'orbit-dive') {
          if (!e.diving && e.stateTimer <= 0) { e.diving = true; e.stateTimer = 2.2; }
          if (e.diving && e.stateTimer <= 0) { e.diving = false; e.stateTimer = def.diveInterval[0] + Math.random() * (def.diveInterval[1] - def.diveInterval[0]); }
          if (e.diving) {
            target.copy(planePos).addScaledVector(planeVel, 0.35); // intercept course
          } else {
            e.orbitPhase += dt * 0.7 * e.orbitDir;
            target.set(Math.cos(e.orbitPhase) * def.orbitRadius, 25 * Math.sin(e.orbitPhase * 0.7), Math.sin(e.orbitPhase) * def.orbitRadius).add(planePos);
          }
        } else if (def.behavior === 'swarm') {
          e.wobble += dt * def.weave;
          target.copy(planePos)
            .addScaledVector(planeVel, 0.2)
            .add(this._tmp.set(Math.sin(e.wobble * 1.7) * 40, Math.cos(e.wobble * 2.3) * 25, Math.cos(e.wobble * 1.3) * 40));
        } else if (def.behavior === 'kamikaze') {
          target.copy(planePos).addScaledVector(planeVel, 0.5);
          const d = e.pos.distanceTo(planePos);
          if (d < def.blastRadius * 0.7) { this._die(e); continue; } // boom
        } else if (def.behavior === 'latcher') {
          target.copy(planePos).addScaledVector(planeVel, 0.25);
          const d = e.pos.distanceTo(planePos);
          if (d < 10 && e.stateTimer <= 0) {
            e.latched = true;
            e.latchOffset.set((Math.random() - 0.5) * 8, Math.random() * 2, (Math.random() - 0.5) * 6);
            this.audio.screech();
          }
        } else if (def.behavior === 'boss') {
          // boss shadows the plane from behind-above and spits
          this._tmp.copy(planeVel).normalize().multiplyScalar(-120);
          target.copy(planePos).add(this._tmp);
          target.y += 40;
          if (e.stateTimer <= 0) {
            e.stateTimer = def.spitInterval;
            this._spit(e.pos, planePos, planeVel);
          }
        }

        // seek with clamped speed
        const speed = def.speed * (e.diving ? 1.5 : 1);
        this._tmp.copy(target).sub(e.pos).normalize().multiplyScalar(speed);
        e.vel.lerp(this._tmp, Math.min(1, dt * 2.2));
        e.pos.addScaledVector(e.vel, dt);
        e.pos.y = Math.max(15, e.pos.y);

        // contact damage on dive-through
        if (def.behavior !== 'latcher' && def.behavior !== 'kamikaze') {
          const hitR = def.size + 6;
          if (e.pos.distanceToSquared(planePos) < hitR * hitR) {
            if (this.onPlaneHit && this._contactGrace <= 0) {
              this.onPlaneHit(def.damage);
              this._contactGrace = 0.35;
            }
            this._tmp.copy(e.pos).sub(planePos).normalize().multiplyScalar(70);
            e.vel.copy(this._tmp); // bounce off
            e.stateTimer = Math.max(e.stateTimer, 1.5);
            e.diving = false;
          }
        }
      }

      // ---- animate ----
      e.group.position.copy(e.pos);
      if (e.vel.lengthSq() > 1) {
        this._tmp.copy(e.pos).add(e.vel);
        e.group.lookAt(this._tmp);
      }
      const flap = Math.sin(time * 14 + e.wobble * 7) * 0.7;
      e.wingL.rotation.z = flap;
      e.wingR.rotation.z = -flap;
      if (e.glowMesh) {
        const near = 1 - Math.min(1, e.pos.distanceTo(planePos) / 200);
        e.glowMesh.material.opacity = 0.25 + near * 0.5 + Math.sin(time * 10) * 0.1 * near;
      }
    }

    // ---- boss spit projectiles ----
    for (const s of this.spits) {
      if (!s.alive) continue;
      s.life -= dt;
      if (s.life <= 0) { s.alive = false; s.mesh.visible = false; continue; }
      s.pos.addScaledVector(s.vel, dt);
      s.mesh.position.copy(s.pos);
      if (s.pos.distanceTo(planePos) < 8) {
        s.alive = false; s.mesh.visible = false;
        if (this.onPlaneHit) this.onPlaneHit(ENEMIES.boss.damage);
        this.effects.explosion(s.pos.clone(), 8);
        this.audio.explosion(false);
      }
    }
  }

  _spit(from, planePos, planeVel) {
    const s = this.spits.find(x => !x.alive);
    if (!s) return;
    s.alive = true;
    s.pos.copy(from);
    this._tmp.copy(planePos).addScaledVector(planeVel, 0.8).sub(from).normalize().multiplyScalar(190);
    s.vel.copy(this._tmp);
    s.life = 4;
    s.mesh.visible = true;
  }

  // threat level 0..1 for music / HUD
  threat() {
    let t = 0;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      t += e.type === 'boss' ? 0.5 : e.latched ? 0.15 : 0.06;
    }
    return Math.min(1, t);
  }
}
