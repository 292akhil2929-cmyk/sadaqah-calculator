// ============================================================
// Input — mouse steering + keyboard. Exposes a polled state
// object so gameplay code never touches DOM events directly.
// ============================================================

export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.mouseX = 0;   // -1..1, screen-relative steering
    this.mouseY = 0;
    this.firing = false;
    this.pressed = new Set(); // keys pressed this frame (edge-trigger)

    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (!this.keys.has(k)) this.pressed.add(k);
      this.keys.add(k);
      if (k === ' ') e.preventDefault();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => { this.keys.clear(); this.firing = false; });

    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      this.mouseX = Math.max(-1, Math.min(1, (e.clientX - cx) / (cx * 0.85)));
      this.mouseY = Math.max(-1, Math.min(1, (e.clientY - cy) / (cy * 0.85)));
    });
    canvas.addEventListener('mousedown', (e) => { if (e.button === 0) this.firing = true; });
    window.addEventListener('mouseup', (e) => { if (e.button === 0) this.firing = false; });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // Recenter the virtual stick (called on takeoff so the plane
  // doesn't inherit the menu-button mouse position and dive).
  center() { this.mouseX = 0; this.mouseY = 0; }

  down(k) { return this.keys.has(k); }
  justPressed(k) { return this.pressed.has(k); }
  get fire() { return this.firing || this.keys.has(' '); }
  endFrame() { this.pressed.clear(); }
}
