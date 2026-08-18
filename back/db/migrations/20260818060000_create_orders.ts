import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'orders', (table) => {
    table.string('id', 64).primary()

    // Para Fase 14, el pedido corresponde a un servicio (lavado de cascos).
    table.string('service_id', 64).notNullable()
    table.string('item_title', 180).notNullable()

    // "Talla" queda como texto para que la fase 14 sea flexible; para lavado se puede dejar vacío.
    table.string('size', 40).nullable()

    // Zona de entrega (valores DB en inglés, copia puede usar español).
    table
      .enu('delivery_zone', ['bogota', 'soacha', 'fuera'])
      .notNullable()
      .defaultTo('bogota')

    // Datos de contacto para que Paola responda.
    table.string('customer_name', 120).notNullable()
    table.string('customer_whatsapp', 32).notNullable()

    // "kind/status" anticipan futuras fases (eventos/productos).
    table.enu('kind', ['lavado', 'producto', 'evento']).notNullable().defaultTo('lavado')
    table.enu('status', ['pendiente', 'cancelado', 'entregado']).notNullable().defaultTo('pendiente')

    table.boolean('paid').notNullable().defaultTo(false)

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())

    table.index(['service_id'], 'idx_orders_service')
    table.index(['delivery_zone'], 'idx_orders_delivery_zone')
    table.foreign('service_id').references('id').inTable('services')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('orders')
}

