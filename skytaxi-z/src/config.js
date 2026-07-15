// ============================================================
// SkyTaxi Z — central tuning data. Every system reads from here
// so new weapons / enemies / passengers are one-entry additions.
// ============================================================

export const FLIGHT = {
  minSpeed: 40,          // m/s — plane never stalls below this (arcade!)
  maxSpeed: 105,         // base top speed, scaled by engine upgrade
  boostSpeed: 190,
  accel: 38,
  pitchRate: 1.15,       // rad/s at full stick
  yawRate: 0.9,
  bankAngle: 1.0,        // visual roll into turns
  mouseDeadzone: 0.06,
  floorAltitude: 14,     // auto-pullup height above terrain
  ceiling: 900,
};

export const WEAPONS = [
  {
    id: 'mg', name: 'TWIN MG', slotKey: '1',
    damage: 8, fireRate: 11, speed: 620, spread: 0.016, ammo: Infinity,
    projColor: 0xffd24a, projSize: 0.5, splash: 0, homing: false,
    recoil: 0.12, sound: 'mg',
  },
  {
    id: 'cannon', name: 'HEAVY CANNON', slotKey: '2',
    damage: 60, fireRate: 1.6, speed: 480, spread: 0.004, ammo: 90,
    projColor: 0xff8a3c, projSize: 1.4, splash: 14, homing: false,
    recoil: 0.8, sound: 'cannon',
  },
  {
    id: 'rockets', name: 'ROCKET PODS', slotKey: '3',
    damage: 45, fireRate: 3.2, speed: 300, spread: 0.05, ammo: 60,
    projColor: 0xff5f6d, projSize: 1.1, splash: 20, homing: false,
    recoil: 0.4, trail: true, sound: 'rocket',
  },
  {
    id: 'homing', name: 'HOMING MISSILES', slotKey: '4',
    damage: 110, fireRate: 0.85, speed: 240, spread: 0, ammo: 18,
    projColor: 0x7ce0ff, projSize: 1.3, splash: 16, homing: true, turnRate: 2.6,
    recoil: 0.5, trail: true, sound: 'missile',
  },
];

// Enemy archetypes. behavior: orbit-dive | swarm | kamikaze | latcher | boss
export const ENEMIES = {
  winged: {
    name: 'Winged Zombie', hp: 34, speed: 78, size: 2.6, color: 0x7a9b4e,
    behavior: 'orbit-dive', damage: 5, score: 90, orbitRadius: 90, diveInterval: [3, 6],
  },
  bat: {
    name: 'Zombie Bat', hp: 10, speed: 96, size: 1.4, color: 0x5a4a7a,
    behavior: 'swarm', damage: 2, score: 40, weave: 2.4,
  },
  exploder: {
    name: 'Bloated Screamer', hp: 16, speed: 66, size: 3.2, color: 0xb0d64a,
    behavior: 'kamikaze', damage: 16, score: 140, blastRadius: 26, glow: true,
  },
  latcher: {
    name: 'Parasite Latcher', hp: 24, speed: 108, size: 1.8, color: 0xc06a9a,
    behavior: 'latcher', damage: 4, score: 160, latchDps: 4,
  },
  boss: {
    name: 'Bio-Colossus', hp: 900, speed: 52, size: 12, color: 0x8a3a3a,
    behavior: 'boss', damage: 14, score: 2500, spitInterval: 2.2,
  },
};

export const PASSENGERS = [
  {
    trait: 'CELEBRITY', names: ['Zara Vox', 'Kiko Blaze', 'Dex Molloy'], face: '😎',
    fee: 1.25, moodSensitivity: 1.3,
    lines: {
      board: ["Make it smooth, darling. I'm live-tweeting this.", "No autographs. Unless you're cute."],
      turbulence: ["This turbulence is UNACCEPTABLE.", "My latte! This is going on the story."],
      enemy: ["Is that... a zombie?! EW EW EW!", "Shoot it! SHOOT IT! I have a premiere!"],
      kill: ["Okay that was actually iconic.", "Content! Pure content!"],
      damage: ["I'M LEAVING A ONE STAR REVIEW!", "I paid for FIRST CLASS!"],
      lowMood: ["My agent will hear about this.", "Worst. Charter. Ever."],
      near: ["Finally. Civilization... sort of.", "Touch down gently, I bruise easily."],
    },
  },
  {
    trait: 'SCIENTIST', names: ['Dr. Elin Marsh', 'Prof. Adeyemi', 'Dr. Yusuf Rahman'], face: '🧑‍🔬',
    fee: 1.0, moodSensitivity: 0.8,
    lines: {
      board: ["The samples must stay below 8°C. And alive. Mostly.", "Fascinating flight vector."],
      turbulence: ["G-forces within tolerance... barely.", "My centrifuge is NOT rated for this."],
      enemy: ["Remarkable! A Class-4 airborne mutation!", "Please don't let it bite the fuselage."],
      kill: ["Specimen neutralized. Shame, I wanted a sample.", "Effective ballistic solution."],
      damage: ["Hull integrity is dropping. That is suboptimal.", "We are venting something important."],
      lowMood: ["My confidence interval in you is shrinking.", "Statistically, we should be dead."],
      near: ["The lab is close. Steady hands now.", "Almost there. The cure travels with us."],
    },
  },
  {
    trait: 'MILLIONAIRE', names: ['Sterling Cash III', 'Vivienne Gold', 'Baron Aziz'], face: '🤑',
    fee: 1.5, moodSensitivity: 1.15,
    lines: {
      board: ["I bought this airline. Twice. Impress me.", "Champagne. Now. And no zombies."],
      turbulence: ["I could BUY a smoother flight!", "Do you know who I am?!"],
      enemy: ["I'll pay you double to make it go away!", "That thing is devaluing my portfolio!"],
      kill: ["Excellent. There's a bonus in it for you.", "Money well spent."],
      damage: ["That dent is coming out of YOUR pay!", "This aircraft was a write-off anyway."],
      lowMood: ["I want a refund. And your license.", "Unbelievable. UNBELIEVABLE."],
      near: ["Ah, my bunker. Home sweet bunker.", "Land well and there's a tip in it."],
    },
  },
  {
    trait: 'GENERAL', names: ['Gen. Okafor', 'Gen. Petrova', 'Gen. Stone'], face: '🎖️',
    fee: 1.1, moodSensitivity: 0.6,
    lines: {
      board: ["Wheels up, pilot. We're burning daylight.", "I've jumped out of better planes than this."],
      turbulence: ["Call THIS turbulence? Ha!", "Steady, soldier."],
      enemy: ["Contact! Six o'clock high!", "Weapons free, pilot. WEAPONS FREE!"],
      kill: ["Good kill! GOOD KILL!", "Outstanding gunnery, son."],
      damage: ["We're hit! Keep her flying!", "Pain is weakness leaving the airframe."],
      lowMood: ["I've seen rookies fly better.", "You'd fail basic, pilot."],
      near: ["LZ in sight. Bring us home.", "Almost home. Don't get sloppy."],
    },
  },
  {
    trait: 'STREAMER', names: ['PixelPria', 'xX_Raidz_Xx', 'NoScopeNina'], face: '🎮',
    fee: 0.9, moodSensitivity: 1.2,
    lines: {
      board: ["YO CHAT we are LIVE from the apocalypse!!", "Clip it if we die, promise?"],
      turbulence: ["CHAT WE'RE SHAKING, GG GG GG", "This is content but also HELP"],
      enemy: ["ZOMBIE CAM! GET THE ZOMBIE CAM!", "CHAT SPAM F IN THE... WAIT SHOOT IT"],
      kill: ["POGGERS! CLIP IT!", "W PILOT! W PILOT!"],
      damage: ["WE'RE HIT, THAT'S SO BAD FOR MY KDA", "chat is saying we're cooked"],
      lowMood: ["chat is UNSUBBING because of you", "this stream is an L, no cap"],
      near: ["ENDING SCREEN SOON, SMASH THAT LIKE", "We survived?? WE SURVIVED CHAT"],
    },
  },
];

export const MISSION_TYPES = [
  { id: 'escort', label: 'VIP Charter', desc: 'Fly the client to their destination in one piece.' },
  { id: 'medicine', label: 'Medicine Run', desc: 'Time-critical medical delivery. Bonus for speed.' },
  { id: 'stormrun', label: 'Storm Corridor', desc: 'The only route left goes through the weather.' },
  { id: 'nightrun', label: 'Night Flight', desc: 'After dark, the sky belongs to them.' },
  { id: 'bosshunt', label: 'Red Zone Crossing', desc: 'Something enormous patrols this route.' },
];

export const WEATHERS = {
  clear:  { fog: 0.00045, fogColor: 0x9db8d6, sky: 0x86a8cc, sun: 1.0, rain: false, night: false },
  fog:    { fog: 0.0022,  fogColor: 0x8a9aa8, sky: 0x77858f, sun: 0.55, rain: false, night: false },
  storm:  { fog: 0.0012,  fogColor: 0x4a5361, sky: 0x39424e, sun: 0.35, rain: true,  night: false, lightning: true },
  night:  { fog: 0.0009,  fogColor: 0x0a0e1c, sky: 0x060a16, sun: 0.12, rain: false, night: true },
};

export const UPGRADES = [
  { id: 'engine',  name: 'Engine',        desc: '+8% top speed / level',          base: 900,  max: 5 },
  { id: 'armor',   name: 'Armor Plating', desc: '+20% hull integrity / level',    base: 850,  max: 5 },
  { id: 'damage',  name: 'Weapon Systems',desc: '+12% weapon damage / level',     base: 1000, max: 5 },
  { id: 'ammo',    name: 'Ammo Racks',    desc: '+25% ammo capacity / level',     base: 700,  max: 4 },
  { id: 'boost',   name: 'Nitro Tanks',   desc: '+30% boost duration / level',    base: 750,  max: 4 },
  { id: 'handling',name: 'Control Servos',desc: '+10% turn rate / level',         base: 800,  max: 4 },
  { id: 'cabin',   name: 'Luxury Cabin',  desc: 'VIP mood drains 12% slower / lvl', base: 950, max: 4 },
  { id: 'cooldown',name: 'Ability Reactor',desc: 'Abilities recharge 12% faster / lvl', base: 1100, max: 4 },
];

export const ABILITIES = {
  flare:   { key: 'f', cooldown: 18, duration: 0 },
  barrage: { key: 'x', cooldown: 26, duration: 0 },
  repair:  { key: 'r', cooldown: 32, duration: 6 },
  slowmo:  { key: 'v', cooldown: 30, duration: 4 },
};

export const ECON = {
  baseFee: 600,          // per km, scaled by passenger.fee
  killBonus: 0.4,        // × enemy score
  comboWindow: 3.0,      // seconds between kills to keep the chain
  comboMax: 5,
};
