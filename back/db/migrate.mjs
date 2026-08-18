import { getPool } from './pool.mjs'

const SALIDAS = `
CREATE TABLE IF NOT EXISTS salidas (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  date DATE NOT NULL,
  kind ENUM('rodada', 'actividad') NOT NULL,
  meeting_point VARCHAR(220) NOT NULL,
  route_text TEXT NOT NULL,
  capacity INT NOT NULL,
  what_to_bring TEXT NOT NULL,
  paid TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('abierto', 'lleno', 'cerrado', 'realizado') NOT NULL DEFAULT 'abierto',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`

import { getPool } from './pool.mjs'

const SALIDAS = `
CREATE TABLE IF NOT EXISTS salidas (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  date DATE NOT NULL,
  kind ENUM('rodada', 'actividad') NOT NULL,
  meeting_point VARCHAR(220) NOT NULL,
  route_text TEXT NOT NULL,
  capacity INT NOT NULL,
  what_to_bring TEXT NOT NULL,
  paid TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('abierto', 'lleno', 'cerrado', 'realizado') NOT NULL DEFAULT 'abierto',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`

const CUPOS = `
CREATE TABLE IF NOT EXISTS cupos (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  salida_id VARCHAR(64) NOT NULL,
  name VARCHAR(120) NOT NULL,
  whatsapp VARCHAR(32) NOT NULL,
  moto VARCHAR(120) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cupos_salida (salida_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`

export async function migrate() {
  const db = getPool()
  await db.query(SALIDAS)
  await db.query(CUPOS)
}
