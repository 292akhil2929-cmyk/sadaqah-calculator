// ============================================================
// World — procedural low-poly terrain that follows the player,
// ruined city blocks, clouds, rain, lightning, day/night states.
// ============================================================

import * as THREE from 'three';
import { WEATHERS } from './config.js';

// Cheap layered value noise for terrain height.
export function terrainHeight(x, z) {
  let h = 0;
  h += Math.sin(x * 0.004) * Math.cos(z * 0.0035) * 26;
  h += Math.sin(x * 0.013 + 3.1) * Math.sin(z * 0.011 + 1.7) * 9;
  h += Math.sin(x * 0.05 + z * 0.04) * 2.5;
  return h;
}

const TILE = 600, GRID = 5; // 5x5 tiles follow the plane

export class World {
  constructor(scene) {
    this.scene = scene;

    // ---- lights ----
    this.sun = new THREE.DirectionalLight(0xfff2dd, 1.0);
    this.sun.position.set(300, 500, 200);
    scene.add(this.sun);
    this.ambient = new THREE.AmbientLight(0x8899bb, 0.55);
    scene.add(this.ambient);
    this.lightningLight = new THREE.PointLight(0xbfd4ff, 0, 4000);
    scene.add(this.lightningLight);

    // ---- terrain tiles ----
    this.tiles = [];
    const mat = new THREE.MeshLambertMaterial({ color: 0x4a5a43, flatShading: true });
    for (let i = 0; i < GRID * GRID; i++) {
      const geo = new THREE.PlaneGeometry(TILE, TILE, 24, 24);
      geo.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.gx = null;
      scene.add(mesh);
      this.tiles.push(mesh);
    }

    // ---- ruined city: instanced boxes with deterministic placement ----
    const bGeo = new THREE.BoxGeometry(1, 1, 1);
    const bMat = new THREE.MeshLambertMaterial({ color: 0x3a3f4a, flatShading: true });
    this.buildingCount = 500;
    this.buildings = new THREE.InstancedMesh(bGeo, bMat, this.buildingCount);
    this.buildings.frustumCulled = false;
    scene.add(this.buildings);
    this._buildingTile = null;

    // ---- clouds: big soft billboards ----
    const cMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.32, depthWrite: false });
    const cGeo = new THREE.PlaneGeometry(1, 1);
    this.clouds = new THREE.InstancedMesh(cGeo, cMat, 60);
    this.clouds.frustumCulled = false;
    scene.add(this.clouds);
    this._cloudSeeds = [];
    for (let i = 0; i < 60; i++) {
      this._cloudSeeds.push({
        off: new THREE.Vector3((Math.random()-0.5)*3000, 160 + Math.random()*260, (Math.random()-0.5)*3000),
        size: 120 + Math.random() * 260, rot: Math.random() * Math.PI,
      });
    }

    // ---- rain (storm only) ----
    const rainGeo = new THREE.BufferGeometry();
    const rainCount = 800;
    const rainPos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount * 3; i++) rainPos[i] = (Math.random() - 0.5) * 400;
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    this.rain = new THREE.Points(rainGeo, new THREE.PointsMaterial({ color: 0x99bbdd, size: 1.4, transparent: true, opacity: 0.6 }));
    this.rain.visible = false;
    scene.add(this.rain);

    // ---- destination beacon ----
    const ringGeo = new THREE.TorusGeometry(30, 2.2, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x7CFF6B });
    this.beacon = new THREE.Mesh(ringGeo, ringMat);
    const beamGeo = new THREE.CylinderGeometry(3, 3, 800, 8, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x7CFF6B, transparent: true, opacity: 0.18, depthWrite: false });
    this.beam = new THREE.Mesh(beamGeo, beamMat);
    this.beacon.add(this.beam);
    scene.add(this.beacon);

    this._lightningTimer = 0;
    this.weather = WEATHERS.clear;
    this._dummy = new THREE.Object3D();
  }

  setWeather(name, scene) {
    const w = WEATHERS[name] || WEATHERS.clear;
    this.weather = w;
    scene.fog = new THREE.FogExp2(w.fogColor, w.fog);
    scene.background = new THREE.Color(w.sky);
    this.sun.intensity = w.sun;
    this.ambient.intensity = w.night ? 0.18 : 0.55;
    this.rain.visible = !!w.rain;
  }

  setDestination(pos) {
    this.beacon.position.copy(pos);
    this.beam.position.y = -pos.y / 2 + 100; // beam reaches down to ground
  }

  update(dt, planePos, time) {
    // -- recenter terrain tiles around plane --
    const cx = Math.round(planePos.x / TILE), cz = Math.round(planePos.z / TILE);
    let idx = 0;
    for (let gx = -2; gx <= 2; gx++) {
      for (let gz = -2; gz <= 2; gz++) {
        const tile = this.tiles[idx++];
        const tx = (cx + gx) * TILE, tz = (cz + gz) * TILE;
        const key = tx + ':' + tz;
        if (tile.userData.gx !== key) {
          tile.userData.gx = key;
          tile.position.set(tx, 0, tz);
          const pos = tile.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            pos.setY(i, terrainHeight(tx + pos.getX(i), tz + pos.getZ(i)));
          }
          pos.needsUpdate = true;
          tile.geometry.computeVertexNormals();
        }
      }
    }

    // -- buildings: re-place deterministically when player crosses a tile --
    const bKey = cx + ':' + cz;
    if (this._buildingTile !== bKey) {
      this._buildingTile = bKey;
      const d = this._dummy;
      for (let i = 0; i < this.buildingCount; i++) {
        // hash-based stable placement around player
        const hx = Math.sin(i * 127.1 + cx * 311.7) * 43758.5453;
        const hz = Math.sin(i * 269.5 + cz * 183.3) * 28001.8384;
        const fx = (hx - Math.floor(hx)) - 0.5, fz = (hz - Math.floor(hz)) - 0.5;
        const bx = (cx + fx * GRID) * TILE, bz = (cz + fz * GRID) * TILE;
        const hgt = 14 + ((hx * 7919) % 60 + 60) % 60;
        const w = 10 + ((hz * 104729) % 18 + 18) % 18;
        d.position.set(bx, terrainHeight(bx, bz) + hgt / 2, bz);
        d.scale.set(w, hgt, w);
        d.rotation.set(0, fx * 6, ((hx % 10) / 10 - 0.5) * 0.16); // slight ruin tilt
        d.updateMatrix();
        this.buildings.setMatrixAt(i, d.matrix);
      }
      this.buildings.instanceMatrix.needsUpdate = true;
    }

    // -- clouds drift & follow --
    const d = this._dummy;
    for (let i = 0; i < this._cloudSeeds.length; i++) {
      const s = this._cloudSeeds[i];
      const x = planePos.x + ((s.off.x + time * 6 - planePos.x * 0.05) % 3000 + 3000) % 3000 - 1500;
      const z = planePos.z + ((s.off.z - planePos.z * 0.05) % 3000 + 3000) % 3000 - 1500;
      d.position.set(x, s.off.y, z);
      d.rotation.set(-Math.PI / 2, 0, s.rot);
      d.scale.setScalar(s.size);
      d.updateMatrix();
      this.clouds.setMatrixAt(i, d.matrix);
    }
    this.clouds.instanceMatrix.needsUpdate = true;

    // -- rain follows plane --
    if (this.rain.visible) {
      this.rain.position.copy(planePos);
      const pos = this.rain.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - dt * 220;
        if (y < -200) y += 400;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // -- lightning --
    if (this.weather.lightning) {
      this._lightningTimer -= dt;
      if (this._lightningTimer <= 0) {
        this._lightningTimer = 2 + Math.random() * 6;
        this.lightningLight.position.set(planePos.x + (Math.random()-0.5)*1200, 500, planePos.z + (Math.random()-0.5)*1200);
        this.lightningLight.intensity = 900;
      }
      this.lightningLight.intensity = Math.max(0, this.lightningLight.intensity - dt * 3200);
    }

    // -- beacon pulse --
    this.beacon.rotation.y += dt * 0.8;
    const pulse = 1 + Math.sin(time * 3) * 0.08;
    this.beacon.scale.setScalar(pulse);
  }
}
