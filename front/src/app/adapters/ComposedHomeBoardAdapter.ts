import type { ClubModule } from '@modules/club/index.ts'
import type { HomeBoard, HomeBoardPort } from '@modules/home/index.ts'
import type { PaolaModule } from '@modules/paola/index.ts'
import type { RidesModule } from '@modules/rides/index.ts'
import type { VoiceModule } from '@modules/voice/index.ts'

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
    const upcoming = agenda.items.find((item) => item.when === 'proxima')
    const join = this.club.getJoinChannel()
    const quien = this.paola.getPage().narrative.find((section) => section.id === 'quien')
    const latest = memories.items[0] ?? null
    const featuredTip = tips.items[0] ?? null

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
      join: {
        href: join.href,
        label: 'Apúntese por WhatsApp',
      },
      totalKm: memories.items.length > 0 ? memories.totalKm : null,
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
        to: '/tu-voz',
      },
      paola: {
        phrase: firstSentence(quien?.body),
        to: '/paola',
      },
    }
  }
}

function firstSentence(body: string | undefined): string {
  const fallback = 'Soy Paola, creadora de contenido, motociclista y mujer de Usme.'
  if (!body) return fallback
  const first = body.split('. ')[0]
  if (!first) return fallback
  return first.endsWith('.') ? first : `${first}.`
}
