import type { ClubContentPort } from '@modules/club/domain/ports/ClubContentPort.ts'
import type { JoinChannel } from '@modules/club/domain/entities/JoinChannel.ts'
import { parseAlliance, parseMember } from '@modules/club/infrastructure/parseClub.ts'
import { SnapshotClubContent } from '@modules/club/infrastructure/SnapshotClubContent.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import { API, FETCH_TIMEOUT_MS } from '@shared/http/constants.ts'

async function readList(url: string, key: string): Promise<unknown[]> {
  const response = await fetch(url, { signal: abortAfter(FETCH_TIMEOUT_MS) })
  if (!response.ok) return []
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object' || !(key in body)) return []
  const raw = (body as Record<string, unknown>)[key]
  return Array.isArray(raw) ? raw : []
}

/** Origen único: MySQL vía GET. Si falla, listas vacías — no hay JSON. */
export async function loadClubCatalog(join: JoinChannel): Promise<ClubContentPort> {
  try {
    const [alliancesRaw, membersRaw] = await Promise.all([
      readList(API.ALLIANCES, 'alliances'),
      readList(API.MEMBERS, 'members'),
    ])
    return new SnapshotClubContent(
      alliancesRaw.map(parseAlliance).filter((item) => item !== null),
      membersRaw.map(parseMember).filter((item) => item !== null),
      join,
    )
  } catch {
    return new SnapshotClubContent([], [], join)
  }
}
