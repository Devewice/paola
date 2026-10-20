import type { Knex } from 'knex'

/**
 * Salida y destino de cada rodada en el mapa, con la ruta por carretera ya trazada (OSRM, polyline precisión 5).
 * Las rutas de las rodadas hechas se dejan calculadas aquí para no depender del servicio al desplegar.
 */

const TABLE = 'outing_routes'

const SEEDED: readonly {
  outingId: string
  start: { label: string; lat: number; lng: number }
  end: { label: string; lat: number; lng: number }
  path: string
  distanceM: number
  durationS: number
}[] = [
  {
    outingId: 'rodada-cumple-guatavita-2026-06-07',
    start: { label: 'Bomba antes del peaje Patios', lat: 4.661555, lng: -74.005538 },
    end: { label: 'Guatavita', lat: 4.934395, lng: -73.835301 },
    path: 'wmm[reubMkoBqxAwfBqa@stAquAu{@eZq`@u`@dIai@yJkQyh@uKeoBbGog@lHsb@t_@am@|Eaf@o_@i{Cm]uhB}h@_c@_^lJsb@}[~@cS}X}b@_Eb\\}OuaAoy@ijIo_EeWqhAsy@_Mo|@{~CgkB{sAPdX',
    distanceM: 43566,
    durationS: 2886,
  },
  {
    outingId: 'rodada-anapoima-2026-07-05',
    start: { label: 'Bogotá · salida por la Calle 13', lat: 4.673604, lng: -74.158151 },
    end: { label: 'Anapoima', lat: 4.549301, lng: -74.535912 },
    path: 'ewo[p`scMfVqQkHeTezAjf@u~@pmAsTrkA~MhrE{^hu@cCpv@jhAxuAbtBlpAj{@bnC~~@vNvb@{Gfb@tUO`[vc@pMmi@vk@bPjM}`AdzBfIdOg`Adg@wX{L_PxGw[k]wg@b]Eva@b]u[pUjn@lOi@qUxq@xNdf@wL`@sI{_@oZni@i_@lEnc@f`A_G~n@xp@`{@}Shx@fYdb@sd@n]l|@rBnIuQx[xA_E|TxXz\\qNpIbMzIj]qKaG~|A|h@h[iZd{Anq@|Brl@hzAdw@nm@|C|UbNy[r_@xaAje@wk@fyBduBz]kHbXb[lz@rNvEnb@h_@|Rri@naC`\\zm@dW~B',
    distanceM: 76185,
    durationS: 4865,
  },
  {
    outingId: 'rodada-sasaima-2026-08-30',
    start: { label: 'Bogotá · Portal 80', lat: 4.709903, lng: -74.111271 },
    end: { label: 'Sasaima', lat: 4.964577, lng: -74.433115 },
    path: 'yyv[l|icMo~F`tEkt@haAzs@ld@b|@pzAz_CffCpoBxnDoAvn@gv@tXcxAjIixAzk@aOn|A`OtbBqjB`gDi|BtvAmq@xsAowA`UaZ`h@|A|b@{~AteB{vAfdCw{ChnCP|o@vSgKmFfe@bSIck@hp@jFt`@{i@ok@mLfa@c`Bd\\zFrMmmArk@qGqW|PmEwj@{bAt@a`@_k@pMtMy^k[~LvCuVqSrK{I{Qmr@fo@q[t@cMg^aFpOubBaYoyB~fA',
    distanceM: 73563,
    durationS: 4534,
  },
]

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable(TABLE))) return
  if (!(await knex.schema.hasColumn(TABLE, 'start_lat'))) {
    await knex.schema.alterTable(TABLE, (table) => {
      table.string('start_label', 160).nullable()
      table.decimal('start_lat', 9, 6).nullable()
      table.decimal('start_lng', 9, 6).nullable()
      table.string('end_label', 160).nullable()
      table.decimal('end_lat', 9, 6).nullable()
      table.decimal('end_lng', 9, 6).nullable()
      table.text('path').nullable()
      table.integer('distance_m').unsigned().nullable()
      table.integer('duration_s').unsigned().nullable()
    })
  }

  for (const ride of SEEDED) {
    await knex(TABLE).where({ outing_id: ride.outingId }).update({
      start_label: ride.start.label,
      start_lat: ride.start.lat,
      start_lng: ride.start.lng,
      end_label: ride.end.label,
      end_lat: ride.end.lat,
      end_lng: ride.end.lng,
      path: ride.path,
      distance_m: ride.distanceM,
      duration_s: ride.durationS,
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasColumn(TABLE, 'start_lat'))) return
  await knex.schema.alterTable(TABLE, (table) => {
    table.dropColumns(
      'start_label',
      'start_lat',
      'start_lng',
      'end_label',
      'end_lat',
      'end_lng',
      'path',
      'distance_m',
      'duration_s',
    )
  })
}
