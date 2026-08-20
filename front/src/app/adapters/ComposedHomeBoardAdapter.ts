import type { ClubModule } from '@modules/club/index.ts'
import { HOME_BOARD_COPY, HOME_JOIN_LABEL } from '@modules/home/constants/copy.ts'
import type { HomeBoard, HomeBoardPort, HomeRodadaCard } from '@modules/home/index.ts'
import { PAOLA_QUIEN_FALLBACK } from '@modules/paola/constants/copy.ts'
import type { PaolaModule } from '@modules/paola/index.ts'
import { remainingSpots, type Outing } from '@modules/rides/domain/entities/Outing.ts'
import { RIDES_KIND, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { RidesModule } from '@modules/rides/index.ts'
import type { VoiceModule } from '@modules/voice/index.ts'
import { APP_PATHS } from '@shared/http/constants.ts'

/** Cablea Inicio con club, rides, voice y paola. Vive en app/, no dentro de un módulo. */
export class ComposedHomeBoardAdapter implements HomeBoardPort {
  private readonly rides: RidesModule
  private readonly club: ClubModule
  private readonly voice: VoiceModule
  private readonly paola: PaolaModule

  constructor(rides: RidesModule, club: ClubModule, voice: VoiceModule, paola: PaolaModule) {
    this.rides = rides
    this.club = club
    this.voice = voice
    this.paola = paola
  }

  getBoard(): HomeBoard {
    const agenda = this.rides.getAgenda()
    const memories = this.rides.getMemories()
    const tips = this.voice.getTips()
    const today = new Date().toISOString().slice(0, 10)
    const upcoming = agenda.items.find((item) => item.when === 'proxima')
    const join = this.club.getJoinChannel()
    const members = this.club.getMembers()
    const quien = this.paola.getPage().narrative.find((section) => section.id === 'quien')
    const latest = memories.items[0] ?? null
    const featuredTip = tips.items[0] ?? null
    const photoByOuting = new Map(
      memories.items.map((memory) => [memory.outingId, memory.photos[0]] as const),
    )
    const rodadas = this.rides
      .listOutings()
      .filter(
        (outing) =>
          outing.kind === RIDES_KIND.RODADA &&
          outing.status !== RIDES_STATUS.REALIZADO &&
          outing.date >= today,
      )
      .map((outing) => toRodadaCard(outing, photoByOuting.get(outing.id)?.src))

    return {
      next: upcoming
        ? {
            title: upcoming.title,
            date: upcoming.date,
            kind: upcoming.kind,
            point: upcoming.point,
          }
        : null,
      nextEmptyCopy: agenda.emptyCopy,
      rodadas,
      join: {
        href: join.href,
        label: HOME_JOIN_LABEL,
      },
      totalKm: memories.items.length > 0 ? memories.totalKm : null,
      integrantesCount: members.items.length > 0 ? members.items.length : null,
      memory: latest
        ? {
            title: latest.title,
            date: latest.date,
            km: latest.km,
            credit: latest.credit,
            photoSrc: latest.photos[0]?.src,
            closingText: latest.closingText,
            photos: latest.photos,
          }
        : null,
      memoryEmptyCopy: memories.emptyCopy,
      voice: {
        tip: featuredTip
          ? {
              title: featuredTip.title,
              body: featuredTip.body,
              officialHref: featuredTip.officialHref,
            }
          : null,
        emptyCopy: tips.emptyCopy,
        to: APP_PATHS.TU_VOZ,
      },
      paola: {
        phrase: firstSentence(quien?.body),
        to: APP_PATHS.PAOLA,
      },
    }
  }
}

function toRodadaCard(outing: Outing, mediaSrc: string | undefined): HomeRodadaCard {
  const cupo =
    outing.status === RIDES_STATUS.LLENO ? 'Lleno' : String(remainingSpots(outing))
  return {
    id: outing.id,
    title: outing.title,
    date: outing.date,
    point: outing.meetingPoint,
    km: '—',
    cupo,
    splash: HOME_BOARD_COPY.splashPhrase,
    mediaLabel: mediaSrc ? outing.title : HOME_BOARD_COPY.panelEmptyMedia,
    mediaSrc,
  }
}

function firstSentence(body: string | undefined): string {
  if (!body) return PAOLA_QUIEN_FALLBACK
  const first = body.split('. ')[0]
  if (!first) return PAOLA_QUIEN_FALLBACK
  return first.endsWith('.') ? first : `${first}.`
}
