import type { Knex } from 'knex'

export function innodb(table: Knex.CreateTableBuilder): void {
  table.engine('InnoDB')
  table.charset('utf8mb4')
  table.collate('utf8mb4_unicode_ci')
}

export async function createTableOnce(
  knex: Knex,
  name: string,
  build: (table: Knex.CreateTableBuilder) => void,
): Promise<void> {
  if (await knex.schema.hasTable(name)) return
  await knex.schema.createTable(name, (table) => {
    build(table)
    innodb(table)
  })
}
