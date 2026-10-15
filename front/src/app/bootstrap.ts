import { ComposedHomeBoardAdapter } from '@app/adapters/ComposedHomeBoardAdapter.ts'
import { SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import {
  buildJoinChannel,
  createClubModule,
  HttpClubApi,
  loadClubCatalog,
  SnapshotClubContent,
  type ClubContentPort,
  type ClubModule,
} from '@modules/club/index.ts'
import { createHomeModule, type HomeModule } from '@modules/home/index.ts'
import { createPaolaModule, type PaolaModule } from '@modules/paola/index.ts'
import {
  BrowserVoterIdentity,
  createPollsModule,
  HttpPollsAdminApi,
  HttpPollsApi,
  InMemoryPollsAdminApi,
  InMemoryPollsApi,
  type PollsModule,
} from '@modules/polls/index.ts'
import {
  createRidesModule,
  loadMemoryCatalog,
  loadOutingCatalog,
  type RidesModule,
} from '@modules/rides/index.ts'
import type { MemoryCatalogPort } from '@modules/rides/domain/ports/MemoryCatalogPort.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'
import { InMemoryMemoryCatalog } from '@modules/rides/infrastructure/InMemoryMemoryCatalog.ts'
import { HttpRidesApi } from '@modules/rides/infrastructure/HttpRidesApi.ts'
import { InMemoryOutingCatalog } from '@modules/rides/infrastructure/InMemoryOutingCatalog.ts'
import {
  createShopModule,
  HttpShopApi,
  HttpShopOrdersApi,
  loadProductCatalog,
  loadServiceCatalog,
  InMemoryProductCatalog,
  InMemoryServiceCatalog,
  InMemoryServiceOrderApi,
  HttpPaymentsApi,
  InMemoryPaymentsApi,
  HttpMysteryDeckApi,
  InMemoryMysteryDeckApi,
  type ShopModule,
} from '@modules/shop/index.ts'
import type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'
import type { ServiceCatalogPort } from '@modules/shop/domain/ports/ServiceCatalogPort.ts'
import {
  createVoiceModule,
  loadTipCatalog,
  loadFineCatalog,
  loadReportCatalog,
  InMemoryTipCatalog,
  InMemoryFineCatalog,
  InMemoryReportCatalog,
  HttpReportApi,
  InMemoryReportApi,
  HttpVoiceAdminApi,
  InMemoryVoiceAdminApi,
  type VoiceModule,
} from '@modules/voice/index.ts'
import type { TipCatalogPort } from '@modules/voice/domain/ports/TipCatalogPort.ts'
import type { FineCatalogPort } from '@modules/voice/domain/ports/FineCatalogPort.ts'
import type { ReportCatalogPort } from '@modules/voice/domain/ports/ReportCatalogPort.ts'
import type { ReportSubmitPort } from '@modules/voice/domain/ports/ReportSubmitPort.ts'

export type AppDependencies = {
  paola: PaolaModule
  club: ClubModule
  rides: RidesModule
  voice: VoiceModule
  shop: ShopModule
  home: HomeModule
  polls: PollsModule
}

let dependencies: AppDependencies | null = null

function joinFromPaola(paola: PaolaModule) {
  return buildJoinChannel(paola.getPage().contact.whatsapp.href)
}

function wire(
  catalog: OutingCatalogPort,
  memoryCatalog: MemoryCatalogPort,
  clubContent: ClubContentPort,
  tipCatalog: TipCatalogPort,
  fineCatalog: FineCatalogPort,
  reportCatalog: ReportCatalogPort,
  reportSubmit: ReportSubmitPort,
  productCatalog: ProductCatalogPort,
  serviceCatalog: ServiceCatalogPort,
  ordersMode: 'http' | 'memory',
): AppDependencies {
  const paola = createPaolaModule()
  const contact = paola.getPage().contact
  const club = createClubModule(clubContent, new HttpClubApi())
  const rides = createRidesModule(
    catalog,
    memoryCatalog,
    new HttpRidesApi({
      email: contact.email,
      whatsappHref: contact.whatsapp.href,
      getSessionId: () => {
        try {
          return localStorage.getItem(SESSION_STORAGE_KEY) ?? ''
        } catch {
          return ''
        }
      },
    }),
  )
  const voice = createVoiceModule(
    tipCatalog,
    fineCatalog,
    reportCatalog,
    reportSubmit,
    ordersMode === 'http' ? new HttpVoiceAdminApi() : new InMemoryVoiceAdminApi(),
  )
  const ordersApi =
    ordersMode === 'http'
      ? new HttpShopOrdersApi({ whatsappHref: contact.whatsapp.href })
      : new InMemoryServiceOrderApi({ whatsappHref: contact.whatsapp.href })
  const shop = createShopModule(
    productCatalog,
    serviceCatalog,
    new HttpShopApi(),
    ordersApi,
    {
      email: contact.email,
      whatsappHref: contact.whatsapp.href,
    },
    ordersMode === 'http' ? new HttpPaymentsApi() : new InMemoryPaymentsApi(),
    ordersMode === 'http' ? new HttpMysteryDeckApi() : new InMemoryMysteryDeckApi(),
  )
  const home = createHomeModule(new ComposedHomeBoardAdapter(rides, club, voice, paola))
  const voter = new BrowserVoterIdentity(SESSION_STORAGE_KEY)
  const polls = createPollsModule(
    ordersMode === 'http' ? new HttpPollsApi(voter) : new InMemoryPollsApi(),
    ordersMode === 'http' ? new HttpPollsAdminApi() : new InMemoryPollsAdminApi(),
    voter,
  )
  dependencies = { paola, club, rides, voice, shop, home, polls }
  return dependencies
}

function emptyClub(paola: PaolaModule): ClubContentPort {
  return new SnapshotClubContent([], [], joinFromPaola(paola))
}

export async function createAppDependencies(): Promise<AppDependencies> {
  const join = joinFromPaola(createPaolaModule())
  const [
    catalog,
    memoryCatalog,
    clubContent,
    tipCatalog,
    fineCatalog,
    reportCatalog,
    productCatalog,
    serviceCatalog,
  ] = await Promise.all([
    loadOutingCatalog(),
    loadMemoryCatalog(),
    loadClubCatalog(join),
    loadTipCatalog(),
    loadFineCatalog(),
    loadReportCatalog(),
    loadProductCatalog(),
    loadServiceCatalog(),
  ])
  return wire(
    catalog,
    memoryCatalog,
    clubContent,
    tipCatalog,
    fineCatalog,
    reportCatalog,
    new HttpReportApi(),
    productCatalog,
    serviceCatalog,
    'http',
  )
}

/** Recarga inventario desde la API (Inicio, Parchese, Tienda, Tu voz). */
export async function refreshInventory(): Promise<void> {
  const join = joinFromPaola(createPaolaModule())
  const [
    catalog,
    memoryCatalog,
    clubContent,
    tipCatalog,
    fineCatalog,
    reportCatalog,
    productCatalog,
    serviceCatalog,
  ] = await Promise.all([
    loadOutingCatalog(),
    loadMemoryCatalog(),
    loadClubCatalog(join),
    loadTipCatalog(),
    loadFineCatalog(),
    loadReportCatalog(),
    loadProductCatalog(),
    loadServiceCatalog(),
  ])
  wire(
    catalog,
    memoryCatalog,
    clubContent,
    tipCatalog,
    fineCatalog,
    reportCatalog,
    new HttpReportApi(),
    productCatalog,
    serviceCatalog,
    'http',
  )
}

export function getAppDependencies(): AppDependencies {
  if (!dependencies) {
    const paola = createPaolaModule()
    return wire(
      new InMemoryOutingCatalog(),
      new InMemoryMemoryCatalog(),
      emptyClub(paola),
      new InMemoryTipCatalog(),
      new InMemoryFineCatalog(),
      new InMemoryReportCatalog(),
      new InMemoryReportApi(),
      new InMemoryProductCatalog(),
      new InMemoryServiceCatalog(),
      'memory',
    )
  }
  return dependencies
}
