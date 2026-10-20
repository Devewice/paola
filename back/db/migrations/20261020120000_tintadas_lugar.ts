import type { Knex } from 'knex'

/** Lugar real de cada tintada: la de junio fue en Comuneros y la de los llaveros en Bosa. */

const PLACES: readonly { id: string; meetingPoint: string; previous: string }[] = [
  { id: 'tintada-2026-06-19', meetingPoint: 'Comuneros, Bogotá', previous: 'Bogotá · punto anunciado en el grupo de WhatsApp' },
  { id: 'tintada-2026-09-01', meetingPoint: 'Bosa, Bogotá', previous: 'Bogotá · punto anunciado en el grupo de WhatsApp' },
]

export async function up(knex: Knex): Promise<void> {
  for (const place of PLACES) {
    await knex('outings').where({ id: place.id }).update({ meeting_point: place.meetingPoint })
  }
}

export async function down(knex: Knex): Promise<void> {
  for (const place of PLACES) {
    await knex('outings').where({ id: place.id }).update({ meeting_point: place.previous })
  }
}
