import { readdirSync } from 'node:fs'
import { join, parse } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Knex } from 'knex'
import { KNEX_LOAD_EXTENSIONS, MYSQL } from './constants.js'

type MigrationFile = { readonly name: string; readonly file: string }

/** Local corre `.ts` (tsx) y producción `.js` (build): ambos se registran con el mismo nombre canónico. */
export function canonicalMigrationName(file: string): string {
  return `${parse(file).name}.${MYSQL.EXTENSION}`
}

export class CanonicalMigrationSource implements Knex.MigrationSource<MigrationFile> {
  private readonly directory: string

  constructor(directory: string) {
    this.directory = directory
  }

  async getMigrations(): Promise<MigrationFile[]> {
    const byName = new Map<string, MigrationFile>()
    for (const file of readdirSync(this.directory).sort()) {
      if (file.endsWith('.d.ts') || !(KNEX_LOAD_EXTENSIONS as readonly string[]).includes(parse(file).ext)) continue
      const name = canonicalMigrationName(file)
      if (!byName.has(name)) byName.set(name, { name, file: join(this.directory, file) })
    }
    return [...byName.values()]
  }

  getMigrationName(migration: MigrationFile): string {
    return migration.name
  }

  async getMigration(migration: MigrationFile): Promise<Knex.Migration> {
    return (await import(pathToFileURL(migration.file).href)) as Knex.Migration
  }
}
