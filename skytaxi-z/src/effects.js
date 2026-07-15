// ============================================================
// Effects — pooled billboard particles for explosions, smoke,
// muzzle flash, debris, blood mist. One InstancedMesh keeps the
// whole system at a single draw call.
// ============================================================

import * as THREE from 'three';

const MAX_PARTICLES = 900;

export class Effects {
  constructor(scene) {
    this.scene = scene;
    const geo = new THREE.PlaneGeometry(1, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.9,
      depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, MAX_PARTICLES);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.colors = new THREE.InstancedBufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3);
    this.mesh.instanceColor = this.colors;
    scene.add(this.mesh);

    // particle pool
    this.parts = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.parts.push({ alive: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(),
        life: 0, maxLife: 1, size: 1, grow: 0, color: new THREE.Color(), gravity: 0 });
    }
    this._cursor = 0;
    this._dummy = new THREE.Object3D();
    this._camQuat = new THREE.Quaternion();

    this.shake = 0; // camera shake magnitude, consumed by camera
  }

  spawn(pos, vel, life, size, color, { grow = 0, gravity = 0 } = {}) {
    const p = this.parts[this._cursor];
    this._cursor = (this._cursor + 1) % MAX_PARTICLES;
    p.alive = true;
    p.pos.copy(pos); p.vel.copy(vel);
    p.life = life; p.maxLife = life;
    p.size = size; p.grow = grow; p.gravity = gravity;
    p.color.set(color);
  }

  explosion(pos, radius = 10, big = false) {
    const n = big ? 46 : 22;
    for (let i = 0; i < n; i++) {
      const dir = new THREE.Vector3().randomDirection();
      const speed = (8 + Math.random() * 30) * (radius / 10);
      this.spawn(pos, dir.multiplyScalar(speed), 0.5 + Math.random() * 0.7,
        radius * (0.25 + Math.random() * 0.4),
        Math.random() < 0.5 ? 0xff9a3c : 0xffd24a, { grow: radius * 0.6 });
    }
    for (let i = 0; i < n / 2; i++) {
      const dir = new THREE.Vector3().randomDirection();
      this.spawn(pos, dir.multiplyScalar(4 + Math.random() * 8), 1.2 + Math.random(),
        radius * 0.5, 0x333333, { grow: radius * 0.8, gravity: -3 });
    }
    this.shake = Math.min(1.4, this.shake + (big ? 0.9 : 0.35));
  }

  bloodBurst(pos, size = 3) {
    for (let i = 0; i < 12; i++) {
      const dir = new THREE.Vector3().randomDirection();
      this.spawn(pos, dir.multiplyScalar(6 + Math.random() * 14), 0.4 + Math.random() * 0.4,
        size * (0.4 + Math.random() * 0.5), 0x7ab03a, { gravity: -14 });
    }
  }

  muzzleFlash(pos, dir) {
    this.spawn(pos, dir.clone().multiplyScalar(6), 0.06, 1.6 + Math.random(), 0xffe9a0);
  }

  smokeTrail(pos) {
    this.spawn(pos, new THREE.Vector3((Math.random()-0.5)*2, 1, (Math.random()-0.5)*2),
      0.7 + Math.random() * 0.5, 1.0, 0x999999, { grow: 2.5 });
  }

  damageSmoke(pos) {
    this.spawn(pos, new THREE.Vector3((Math.random()-0.5)*3, 4 + Math.random()*3, (Math.random()-0.5)*3),
      1.1, 2.2, 0x222222, { grow: 4 });
  }

  sparks(pos) {
    for (let i = 0; i < 6; i++) {
      const dir = new THREE.Vector3().randomDirection();
      this.spawn(pos, dir.multiplyScalar(14 + Math.random() * 18), 0.25, 0.5, 0xffe9a0, { gravity: -30 });
    }
  }

  update(dt, camera) {
    camera.getWorldQuaternion(this._camQuat);
    const d = this._dummy;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = this.parts[i];
      if (!p.alive) {
        d.position.set(0, -9999, 0); d.scale.setScalar(0.001);
        d.updateMatrix(); this.mesh.setMatrixAt(i, d.matrix);
        continue;
      }
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }
      p.vel.y += p.gravity * dt;
      p.pos.addScaledVector(p.vel, dt);
      const t = p.life / p.maxLife;
      d.position.copy(p.pos);
      d.quaternion.copy(this._camQuat); // billboard toward camera
      d.scale.setScalar(p.size + p.grow * (1 - t));
      d.updateMatrix();
      this.mesh.setMatrixAt(i, d.matrix);
      this.colors.setXYZ(i, p.color.r * t, p.color.g * t, p.color.b * t);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.colors.needsUpdate = true;
    this.shake = Math.max(0, this.shake - dt * 2.2);
  }
}
