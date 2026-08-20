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
  obj: '/mascota/3d/camera.obj',
  diffuse: '/mascota/3d/diffuse.png',
  metallic: '/mascota/3d/metallic.png',
  roughness: '/mascota/3d/roughness.png',
  look: {
    yaw: 0.22,
    tilt: 0.05,
    from: 0.38,
    to: 0.92,
    pauseMin: 0.4,
    pauseMax: 1.6,
  },
} as const

