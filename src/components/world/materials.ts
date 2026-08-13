'use client'

import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/* Procedural PBR surface library — seeded, generated once, shared.    */
/* Mirrors Kage's approach: a base-colour canvas + a tangent-space     */
/* normal map (blur then Sobel) + a roughness canvas, hung on one      */
/* MeshStandardMaterial so forms read as weathered structure instead   */
/* of flat neon.                                                       */
/* ------------------------------------------------------------------ */

const TAU = Math.PI * 2
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

/* stacked, up-scaled value noise — cheap and identical in practice to
   fbm once it is multiplied under a dark base colour */
function fbmCanvas(W: number, H: number, seed: number, octaves: number, baseCells: number, contrast: number) {
  const out = makeCanvas(W, H)
  const o = out.getContext('2d')!
  o.fillStyle = '#808080'
  o.fillRect(0, 0, W, H)
  let cells = baseCells
  let alpha = 1
  for (let i = 0; i < octaves; i++) {
    const n = makeCanvas(cells, cells)
    const nx = n.getContext('2d')!
    const im = nx.createImageData(cells, cells)
    const d = im.data
    const r = mulberry32(seed + i * 977)
    for (let k = 0; k < cells * cells; k++) {
      const v = 128 + (r() - 0.5) * 255 * contrast
      const c = clamp(v, 0, 255)
      d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = c
      d[k * 4 + 3] = 255
    }
    nx.putImageData(im, 0, 0)
    o.globalAlpha = alpha
    o.globalCompositeOperation = i === 0 ? 'source-over' : 'overlay'
    o.imageSmoothingEnabled = true
    o.imageSmoothingQuality = 'high'
    o.drawImage(n, 0, 0, W, H)
    cells *= 2
    alpha *= 0.62
  }
  o.globalAlpha = 1
  o.globalCompositeOperation = 'source-over'
  return out
}

/* height → tangent-space normal map (blur first, then Sobel) */
function normalFromHeight(hc: HTMLCanvasElement, strength = 2.2) {
  const W = hc.width
  const H = hc.height
  const b = makeCanvas(W, H)
  const bx = b.getContext('2d')!
  bx.filter = 'blur(1.1px)'
  bx.drawImage(hc, 0, 0)
  bx.filter = 'none'
  const src = bx.getImageData(0, 0, W, H).data
  const out = makeCanvas(W, H)
  const ox = out.getContext('2d')!
  const im = ox.createImageData(W, H)
  const d = im.data
  const at = (x: number, y: number) => src[(((y + H) % H) * W + ((x + W) % W)) * 4] / 255
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const gx = (at(x + 1, y) - at(x - 1, y)) * strength
      const gy = (at(x, y + 1) - at(x, y - 1)) * strength
      const nx = -gx
      const ny = gy
      const nz = 1
      const il = 1 / Math.hypot(nx, ny, nz)
      const i = (y * W + x) * 4
      d[i] = (nx * il * 0.5 + 0.5) * 255
      d[i + 1] = (ny * il * 0.5 + 0.5) * 255
      d[i + 2] = (nz * il * 0.5 + 0.5) * 255
      d[i + 3] = 255
    }
  }
  ox.putImageData(im, 0, 0)
  return out
}

function toTexture(canvas: HTMLCanvasElement, opts: { srgb?: boolean; repeat?: [number, number] } = {}) {
  const t = new THREE.CanvasTexture(canvas)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  if (opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1])
  if (opts.srgb !== false) t.colorSpace = THREE.SRGBColorSpace
  else t.colorSpace = THREE.NoColorSpace
  t.needsUpdate = true
  return t
}

type Surface = {
  map: HTMLCanvasElement
  normal: HTMLCanvasElement
  rough?: HTMLCanvasElement
}

/* build a shared PBR material from a generated surface */
function surfaceMaterial(t: Surface, repeat: [number, number], overrides: { color?: number; roughness?: number; metalness?: number; normal?: number } = {}) {
  const m = new THREE.MeshStandardMaterial({
    map: toTexture(t.map, { repeat }),
    normalMap: toTexture(t.normal, { srgb: false, repeat }),
    normalScale: new THREE.Vector2(overrides.normal ?? 0.7, overrides.normal ?? 0.7),
    color: overrides.color ?? 0xffffff,
    roughness: overrides.roughness ?? 1,
    metalness: overrides.metalness ?? 0.05,
  })
  if (t.rough) m.roughnessMap = toTexture(t.rough, { srgb: false, repeat })
  return m
}

/* ---- authored surfaces ------------------------------------------- */

/* long, wet, board-formed concrete — the ground platform */
function concreteGround(): Surface {
  const W = 1024
  const H = 1024
  const c = makeCanvas(W, H)
  const x = c.getContext('2d')!
  x.fillStyle = '#0c1316'
  x.fillRect(0, 0, W, H)

  x.globalCompositeOperation = 'overlay'
  x.globalAlpha = 0.82
  x.drawImage(fbmCanvas(W, H, 41, 6, 3, 1), 0, 0)
  x.globalAlpha = 1
  x.globalCompositeOperation = 'source-over'

  /* board seams */
  const rnd = mulberry32(7)
  for (let i = 1; i < 6; i++) {
    const y = (H / 6) * i
    x.fillStyle = 'rgba(0,0,0,0.45)'
    x.fillRect(0, y - 1.5, W, 3)
    x.fillStyle = 'rgba(170,200,200,0.05)'
    x.fillRect(0, y + 2, W, 2)
  }
  /* form-tie dimples */
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      const cx = (W / 4) * (j + 0.5) + (rnd() - 0.5) * 14
      const cy = (H / 6) * (i + 0.5)
      const g = x.createRadialGradient(cx, cy, 1, cx, cy, 11)
      g.addColorStop(0, 'rgba(0,0,0,0.5)')
      g.addColorStop(0.7, 'rgba(0,0,0,0.18)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      x.fillStyle = g
      x.beginPath()
      x.arc(cx, cy, 11, 0, TAU)
      x.fill()
    }
  }
  /* rain streaks */
  for (let i = 0; i < 150; i++) {
    const sx = rnd() * W
    const w = 0.6 + rnd() * 3
    const top = rnd() * H * 0.5
    const len = H * (0.4 + rnd() * 0.7)
    const g = x.createLinearGradient(0, top, 0, top + len)
    const dark = rnd() > 0.45
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(0.25, dark ? 'rgba(0,0,0,0.18)' : 'rgba(150,185,190,0.04)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    x.fillStyle = g
    x.fillRect(sx, top, w, len)
  }

  const h = makeCanvas(W, H)
  const hx = h.getContext('2d')!
  hx.fillStyle = '#808080'
  hx.fillRect(0, 0, W, H)
  hx.globalAlpha = 0.5
  hx.drawImage(fbmCanvas(W, H, 41, 5, 6, 1), 0, 0)
  hx.globalAlpha = 1
  for (let i = 1; i < 6; i++) {
    hx.fillStyle = '#2a2a2a'
    hx.fillRect(0, (H / 6) * i - 2, W, 4)
  }
  return { map: c, normal: normalFromHeight(h, 2.0) }
}

/* dark machine-panel metal — the service towers and stack plates */
function panelMetal(): Surface {
  const W = 512
  const H = 512
  const c = makeCanvas(W, H)
  const x = c.getContext('2d')!
  x.fillStyle = '#0a1215'
  x.fillRect(0, 0, W, H)
  x.globalCompositeOperation = 'overlay'
  x.globalAlpha = 0.7
  x.drawImage(fbmCanvas(W, H, 117, 6, 3, 1.2), 0, 0)
  x.globalAlpha = 1
  x.globalCompositeOperation = 'source-over'

  /* fine panel lines */
  const rnd = mulberry32(51)
  x.strokeStyle = 'rgba(0,0,0,0.55)'
  x.lineWidth = 2
  for (let i = 1; i < 4; i++) {
    const y = (H / 4) * i
    x.beginPath()
    x.moveTo(0, y)
    x.lineTo(W, y)
    x.stroke()
  }
  for (let i = 0; i < 60; i++) {
    const sx = rnd() * W
    const sy = rnd() * H
    const sw = 10 + rnd() * 60
    const sh = 2 + rnd() * 8
    x.fillStyle = 'rgba(0,0,0,0.22)'
    x.fillRect(sx, sy, sw, sh)
    x.fillStyle = 'rgba(160,200,200,0.04)'
    x.fillRect(sx, sy + sh, sw, 1)
  }

  const h = makeCanvas(W, H)
  const hx = h.getContext('2d')!
  hx.fillStyle = '#808080'
  hx.fillRect(0, 0, W, H)
  hx.globalAlpha = 0.4
  hx.drawImage(fbmCanvas(W, H, 117, 5, 6, 1), 0, 0)
  hx.globalAlpha = 1
  hx.strokeStyle = '#2a2a2a'
  hx.lineWidth = 3
  for (let i = 1; i < 4; i++) {
    const y = (H / 4) * i
    hx.beginPath()
    hx.moveTo(0, y)
    hx.lineTo(W, y)
    hx.stroke()
  }
  return { map: c, normal: normalFromHeight(h, 2.4) }
}

/* a dark terminal/code editor screen — indented syntax "lines" so screens
   read instantly as software, not a generic glowing panel */
function codeScreen(): Surface {
  const W = 512
  const H = 512
  const c = makeCanvas(W, H)
  const x = c.getContext('2d')!
  x.fillStyle = '#070c10'
  x.fillRect(0, 0, W, H)

  const rnd = mulberry32(808)
  const hues = ['#6fd4c9', '#7fb8ff', '#c9b36b', '#a3cf7a', '#ff8a76', '#5c7182']
  const gutter = 28
  for (let row = 0; row < 26; row++) {
    const y = 22 + row * 18
    const indent = [0, 0, 1, 1, 2, 2, 3, 2, 1, 0][row % 10]
    const x0 = 20 + indent * 22
    const len = 60 + rnd() * 300
    const h = hues[(row + indent) % hues.length]
    const bright = rnd() > 0.82
    x.fillStyle = bright ? 'rgba(210,230,228,0.9)' : h
    x.globalAlpha = bright ? 0.9 : 0.6
    x.fillRect(x0, y, len, 7)
    /* punctuation / bracket chips */
    if (rnd() > 0.7) {
      x.fillStyle = '#7fb8ff'
      x.fillRect(x0 + len + 8, y, 8 + rnd() * 14, 7)
    }
  }
  x.globalAlpha = 1

  /* line-number gutter */
  x.fillStyle = 'rgba(90,115,115,0.28)'
  x.fillRect(0, 0, gutter, H)
  x.fillStyle = 'rgba(150,180,180,0.35)'
  for (let row = 0; row < 26; row++) x.fillRect(6, 24 + row * 18, 14, 5)

  /* scanline shimmer */
  x.globalCompositeOperation = 'overlay'
  x.globalAlpha = 0.18
  x.drawImage(fbmCanvas(W, H, 919, 4, 4, 1), 0, 0)
  x.globalAlpha = 1
  x.globalCompositeOperation = 'source-over'

  const h = makeCanvas(W, H)
  const hx = h.getContext('2d')!
  hx.fillStyle = '#808080'
  hx.fillRect(0, 0, W, H)
  return { map: c, normal: normalFromHeight(h, 0.6) }
}

/* a printed-circuit-board floor — traces, pads and vias so the whole world
   reads as software/hardware ground, not abstract concrete */
function circuitBoard(): Surface {
  const W = 1024
  const H = 1024
  const c = makeCanvas(W, H)
  const x = c.getContext('2d')!
  x.fillStyle = '#050a0d'
  x.fillRect(0, 0, W, H)

  const rnd = mulberry32(2024)

  /* copper traces with right-angle bends */
  for (let i = 0; i < 64; i++) {
    const x0 = rnd() * W
    const y0 = rnd() * H
    const dir = rnd() > 0.5
    const seg1 = 60 + rnd() * 320
    const seg2 = 60 + rnd() * 320
    const col = rnd() > 0.55 ? 'rgba(64,116,118,0.5)' : 'rgba(120,120,90,0.42)'
    const w = 2 + rnd() * 3
    x.strokeStyle = col
    x.lineWidth = w
    x.beginPath()
    x.moveTo(x0, y0)
    if (dir) {
      x.lineTo(x0 + seg1, y0)
      x.lineTo(x0 + seg1, y0 + seg2)
    } else {
      x.lineTo(x0, y0 + seg1)
      x.lineTo(x0 + seg2, y0 + seg1)
    }
    x.stroke()
  }
  /* pads / vias */
  for (let i = 0; i < 120; i++) {
    const px = rnd() * W
    const py = rnd() * H
    const r = 3 + rnd() * 6
    x.fillStyle = rnd() > 0.5 ? 'rgba(96,158,158,0.5)' : 'rgba(180,180,140,0.4)'
    x.beginPath()
    x.arc(px, py, r, 0, TAU)
    x.fill()
    x.fillStyle = 'rgba(5,10,13,0.9)'
    x.beginPath()
    x.arc(px, py, r * 0.4, 0, TAU)
    x.fill()
  }
  /* subtle green solder-mask tint */
  x.globalCompositeOperation = 'overlay'
  x.globalAlpha = 0.12
  x.drawImage(fbmCanvas(W, H, 71, 4, 4, 1), 0, 0)
  x.globalAlpha = 1
  x.globalCompositeOperation = 'source-over'

  const h = makeCanvas(W, H)
  const hx = h.getContext('2d')!
  hx.fillStyle = '#808080'
  hx.fillRect(0, 0, W, H)
  hx.globalAlpha = 0.3
  hx.drawImage(fbmCanvas(W, H, 71, 4, 8, 1), 0, 0)
  hx.globalAlpha = 1
  return { map: c, normal: normalFromHeight(h, 0.5) }
}

/* ---- cached, shared library --------------------------------------- */

const LIB: Record<string, Surface> = {}
const lib = (k: string, f: () => Surface) => (LIB[k] || (LIB[k] = f()))

/* public material factories (idempotent, shared instances) */
export const worldMaterials = {
  ground: () => surfaceMaterial(lib('circuit', circuitBoard), [6, 24], { roughness: 0.9, metalness: 0.35, normal: 0.4 }),
  concrete: () => surfaceMaterial(lib('ground', concreteGround), [6, 24], { roughness: 0.94, metalness: 0.08, normal: 0.55 }),
  panel: () => surfaceMaterial(lib('panel', panelMetal), [1, 1], { roughness: 0.72, metalness: 0.5, normal: 0.6 }),
  code: () => {
    const m = new THREE.MeshStandardMaterial({
      map: toTexture(lib('code', codeScreen).map, { repeat: [1, 1] }),
      color: 0xffffff,
      roughness: 0.55,
      metalness: 0.1,
      emissive: 0x0a1a1a,
      emissiveIntensity: 0.6,
    })
    return m
  },
}

/* HDR-bright emitter colours — values above 1 survive into a half-float
   buffer and are exactly what bloom feeds on. */
export const hdr = (r: number, g: number, b: number) => new THREE.Color().setRGB(r, g, b)

/* palette tuned toward Kage's graphite/teal-black night */
export const worldPalette3D = {
  background: 0x050a0e,
  structure: 0x10282f,
  structureDark: 0x09191f,
  structureLight: 0x1b3d45,
  cyan: 0x70e6e0,
  blue: 0x74b9ff,
  amber: 0xffbf69,
  green: 0xb8f36b,
  project: 0xffd166,
  horizon: 0xf6f7eb,
}
