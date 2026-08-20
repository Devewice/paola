export const MASCOT = {
  TUMBADA: '/mascota/tumbada.png',
  EN_PIE: '/mascota/en-pie.png',
  LENTE: '/mascota/lente.png',
  X5: '/mascota/x5.png',
} as const

export const MASCOT_FRAMES = [MASCOT.TUMBADA, MASCOT.EN_PIE, MASCOT.LENTE, MASCOT.X5] as const

export const MASCOT_FLASH = {
  hold: 2.4,
  pop: 0.05,
  fade: 0.32,
} as const

export const MASCOT_3D = {
  model: '/mascota/3d/camera.draco.glb',
  diffuse: '/mascota/3d/diffuse.png',
  metallic: '/mascota/3d/metallic.png',
  roughness: '/mascota/3d/roughness.png',
  look: {
    yaw: 0.42,
    tilt: 0.08,
    from: 0.38,
    to: 0.92,
    pauseMin: 0.12,
    pauseMax: 0.45,
  },
} as const

