import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

type CatalogSeed = readonly [brand: string, model: string, cc: number]

/** Motos que se venden en Colombia. Lo que no esté aquí se registra como «Otra». */
const CATALOG: readonly CatalogSeed[] = [
  ['AKT', 'Special 110', 110],
  ['AKT', 'Flex 125', 125],
  ['AKT', 'NKD 125', 125],
  ['AKT', 'Dynamic Pro 125', 125],
  ['AKT', 'Jet 5 125', 125],
  ['AKT', 'CR4 125', 125],
  ['AKT', 'TT 125', 125],
  ['AKT', 'RTX 150', 150],
  ['AKT', 'CR4 162', 162],
  ['AKT', 'CR5 180', 180],
  ['AKT', 'TT DS 200', 200],
  ['AKT', 'TTR 200', 200],

  ['Bajaj', 'Boxer CT 100', 100],
  ['Bajaj', 'Platino 100', 100],
  ['Bajaj', 'Discover 125', 125],
  ['Bajaj', 'Pulsar NS 125', 125],
  ['Bajaj', 'Pulsar N 160', 160],
  ['Bajaj', 'Pulsar NS 160', 160],
  ['Bajaj', 'Pulsar 180', 180],
  ['Bajaj', 'Pulsar NS 200', 200],
  ['Bajaj', 'Pulsar RS 200', 200],
  ['Bajaj', 'Avenger 220 Street', 220],
  ['Bajaj', 'Pulsar N 250', 250],
  ['Bajaj', 'Dominar 250', 250],
  ['Bajaj', 'Dominar 400', 400],

  ['Victory', 'One 100', 100],
  ['Victory', 'Combat 100', 100],
  ['Victory', 'Advance R 125', 125],
  ['Victory', 'Bomber 125', 125],
  ['Victory', 'Switch 125', 125],
  ['Victory', 'MRX 125', 125],
  ['Victory', 'MRX 150', 150],

  ['Yamaha', 'Crypton FI', 115],
  ['Yamaha', 'Libero 125', 125],
  ['Yamaha', 'YBR 125', 125],
  ['Yamaha', 'XTZ 125', 125],
  ['Yamaha', 'BWS 125', 125],
  ['Yamaha', 'FZ 150', 150],
  ['Yamaha', 'XTZ 150', 150],
  ['Yamaha', 'NMAX 155', 155],
  ['Yamaha', 'Aerox 155', 155],
  ['Yamaha', 'MT-15', 155],
  ['Yamaha', 'R15', 155],
  ['Yamaha', 'FZ25', 250],
  ['Yamaha', 'XTZ 250', 250],
  ['Yamaha', 'XMAX 300', 292],
  ['Yamaha', 'MT-03', 321],
  ['Yamaha', 'R3', 321],
  ['Yamaha', 'MT-07', 689],
  ['Yamaha', 'Ténéré 700', 689],
  ['Yamaha', 'MT-09', 890],

  ['Honda', 'Wave 110', 110],
  ['Honda', 'Navi 110', 110],
  ['Honda', 'Dio 110', 110],
  ['Honda', 'CB 125F', 125],
  ['Honda', 'XR 150L', 150],
  ['Honda', 'PCX 160', 157],
  ['Honda', 'CB 190R', 184],
  ['Honda', 'XR 190L', 184],
  ['Honda', 'XRE 300', 291],
  ['Honda', 'CB 300F Twister', 293],
  ['Honda', 'CB 500F', 471],
  ['Honda', 'CB 500X', 471],
  ['Honda', 'CB 650R', 649],
  ['Honda', 'CBR 650R', 649],
  ['Honda', 'NC 750X', 745],
  ['Honda', 'Africa Twin CRF1100L', 1084],

  ['Suzuki', 'AX 100', 100],
  ['Suzuki', 'Viva R 115', 113],
  ['Suzuki', 'Burgman Street 125', 124],
  ['Suzuki', 'Best 125', 125],
  ['Suzuki', 'GN 125', 125],
  ['Suzuki', 'DR 150', 149],
  ['Suzuki', 'Gixxer 150', 155],
  ['Suzuki', 'V-Strom 250', 248],
  ['Suzuki', 'Gixxer 250', 249],
  ['Suzuki', 'Gixxer SF 250', 249],
  ['Suzuki', 'DR 650', 644],
  ['Suzuki', 'V-Strom 650', 645],
  ['Suzuki', 'GSX-S 750', 749],
  ['Suzuki', 'GSX-8S', 776],
  ['Suzuki', 'V-Strom 800DE', 776],
  ['Suzuki', 'Hayabusa', 1340],

  ['Kawasaki', 'W175', 177],
  ['Kawasaki', 'Versys-X 300', 296],
  ['Kawasaki', 'Ninja 400', 399],
  ['Kawasaki', 'Z400', 399],
  ['Kawasaki', 'Ninja 500', 451],
  ['Kawasaki', 'Ninja ZX-6R', 636],
  ['Kawasaki', 'Z650', 649],
  ['Kawasaki', 'Versys 650', 649],
  ['Kawasaki', 'Vulcan S', 649],
  ['Kawasaki', 'KLR 650', 652],
  ['Kawasaki', 'Z900', 948],
  ['Kawasaki', 'Ninja ZX-10R', 998],

  ['KTM', 'Duke 200', 199],
  ['KTM', 'RC 200', 199],
  ['KTM', 'Duke 250', 249],
  ['KTM', '250 Adventure', 249],
  ['KTM', 'Duke 390', 399],
  ['KTM', 'RC 390', 373],
  ['KTM', '390 Adventure', 399],
  ['KTM', '790 Duke', 799],
  ['KTM', '890 Adventure', 889],
  ['KTM', '1290 Super Duke R', 1301],

  ['Husqvarna', 'Svartpilen 401', 399],
  ['Husqvarna', 'Vitpilen 401', 399],

  ['Hero', 'Eco Deluxe', 97],
  ['Hero', 'Xoom 110', 110],
  ['Hero', 'Ignitor 125', 125],
  ['Hero', 'Hunk 160R 4V', 163],
  ['Hero', 'Xtreme 160R', 163],
  ['Hero', 'Xpulse 200 4V', 199],

  ['TVS', 'Sport 100', 100],
  ['TVS', 'Raider 125', 125],
  ['TVS', 'Ntorq 125', 125],
  ['TVS', 'Apache RTR 160', 160],
  ['TVS', 'Apache RTR 160 4V', 160],
  ['TVS', 'Apache RTR 200 4V', 198],
  ['TVS', 'Ronin 225', 225],
  ['TVS', 'Apache RR 310', 312],

  ['Royal Enfield', 'Classic 350', 349],
  ['Royal Enfield', 'Hunter 350', 349],
  ['Royal Enfield', 'Meteor 350', 349],
  ['Royal Enfield', 'Himalayan 411', 411],
  ['Royal Enfield', 'Scram 411', 411],
  ['Royal Enfield', 'Himalayan 450', 452],
  ['Royal Enfield', 'Interceptor 650', 648],
  ['Royal Enfield', 'Continental GT 650', 648],
  ['Royal Enfield', 'Super Meteor 650', 648],

  ['Benelli', 'TNT 135', 135],
  ['Benelli', '180S', 175],
  ['Benelli', 'TRK 251', 249],
  ['Benelli', 'Leoncino 250', 249],
  ['Benelli', '302S', 300],
  ['Benelli', 'Imperiale 400', 374],
  ['Benelli', 'TRK 502', 500],
  ['Benelli', 'TRK 502X', 500],
  ['Benelli', 'Leoncino 500', 500],

  ['CFMoto', '150NK', 150],
  ['CFMoto', '300NK', 292],
  ['CFMoto', '300SR', 292],
  ['CFMoto', '450SR', 450],
  ['CFMoto', '450MT', 449],
  ['CFMoto', '650MT', 649],
  ['CFMoto', '700CL-X', 693],
  ['CFMoto', '800MT', 799],

  ['Voge', '300 Rally', 292],
  ['Voge', '500DS', 471],
  ['Voge', '525DSX', 494],
  ['Voge', '650DS', 652],

  ['Zontes', '310T', 312],
  ['Zontes', '350T', 348],
  ['Zontes', '350R', 348],

  ['Kymco', 'Agility 125', 125],
  ['Kymco', 'X-Town 300', 276],
  ['Kymco', 'Downtown 350', 321],
  ['Kymco', 'AK 550', 550],

  ['Vespa', 'Primavera 150', 155],
  ['Vespa', 'Sprint 150', 155],
  ['Vespa', 'GTS 300', 278],

  ['BMW', 'G 310 R', 313],
  ['BMW', 'G 310 GS', 313],
  ['BMW', 'C 400 X', 350],
  ['BMW', 'F 800 GS', 895],
  ['BMW', 'F 900 R', 895],
  ['BMW', 'F 900 GS', 895],
  ['BMW', 'S 1000 RR', 999],
  ['BMW', 'R nineT', 1170],
  ['BMW', 'R 1250 GS', 1254],
  ['BMW', 'R 1300 GS', 1300],

  ['Ducati', 'Scrambler Icon', 803],
  ['Ducati', 'Monster', 937],
  ['Ducati', 'Multistrada V2', 937],
  ['Ducati', 'DesertX', 937],
  ['Ducati', 'Panigale V2', 955],
  ['Ducati', 'Panigale V4', 1103],
  ['Ducati', 'Streetfighter V4', 1103],
  ['Ducati', 'Multistrada V4', 1158],

  ['Triumph', 'Speed 400', 398],
  ['Triumph', 'Scrambler 400 X', 398],
  ['Triumph', 'Trident 660', 660],
  ['Triumph', 'Tiger Sport 660', 660],
  ['Triumph', 'Street Triple 765', 765],
  ['Triumph', 'Tiger 900', 888],
  ['Triumph', 'Speed Twin 900', 900],
  ['Triumph', 'Tiger 1200', 1160],
  ['Triumph', 'Bonneville T120', 1200],
  ['Triumph', 'Rocket 3', 2458],

  ['Harley-Davidson', 'Iron 883', 883],
  ['Harley-Davidson', 'Nightster', 975],
  ['Harley-Davidson', 'Sportster S', 1252],
  ['Harley-Davidson', 'Pan America 1250', 1252],
  ['Harley-Davidson', 'Street Bob', 1868],
  ['Harley-Davidson', 'Fat Bob', 1868],
  ['Harley-Davidson', 'Road King', 1868],
  ['Harley-Davidson', 'Low Rider S', 1923],
  ['Harley-Davidson', 'Street Glide', 1923],
]

function slug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** MySQL no deshace DDL si algo falla a mitad: cada paso revisa qué ya quedó hecho. */
export async function up(knex: Knex): Promise<void> {
  const hasDisplayName = await knex.schema.hasColumn('users', 'display_name')
  const hasFullName = await knex.schema.hasColumn('users', 'full_name')
  if (!hasDisplayName || !hasFullName) {
    await knex.schema.alterTable('users', (table) => {
      if (!hasDisplayName) table.string('display_name', 80).nullable()
      if (!hasFullName) table.string('full_name', 120).nullable()
    })
  }

  // Un intento previo pudo dejar el catálogo con otra intercalación; sin motos de usuarios aún, se rehace.
  if (!(await knex.schema.hasTable('user_motorcycles'))) {
    await knex.schema.dropTableIfExists('motorcycle_catalog')
  }

  await createTableOnce(knex, 'motorcycle_catalog', (table) => {
    table.string('id', 64).primary()
    table.string('brand', 80).notNullable()
    table.string('model', 120).notNullable()
    table.integer('cc').notNullable()
    table.unique(['brand', 'model'])
  })

  await createTableOnce(knex, 'user_motorcycles', (table) => {
    table.string('id', 64).primary()
    table.string('user_id', 64).notNullable()
    table.string('catalog_id', 64).nullable()
    table.string('brand', 80).notNullable()
    table.string('model', 120).notNullable()
    table.integer('cc').nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['user_id'], 'idx_user_motorcycles_user')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('catalog_id').references('id').inTable('motorcycle_catalog').onDelete('SET NULL')
  })

  await knex('motorcycle_catalog')
    .insert(CATALOG.map(([brand, model, cc]) => ({ id: `${slug(brand)}-${slug(model)}`, brand, model, cc })))
    .onConflict('id')
    .ignore()
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_motorcycles')
  await knex.schema.dropTableIfExists('motorcycle_catalog')
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('full_name')
    table.dropColumn('display_name')
  })
}
