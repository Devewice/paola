<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ShopModule } from '@modules/shop/index.ts'
import type { MysteryDeckCard } from '@modules/shop/domain/entities/MysteryDeck.ts'
import {
  SHOP_COPY,
  SHOP_CATEGORY_CHECKS,
  SHOP_HERO_PHOTO,
  SHOP_PREFILTERS,
  SHOP_PRICE_CHECKS,
  SHOP_PROMO,
  SHOP_SORT,
  SHOP_SORT_COLOR_AXIS_OPTIONS,
  SHOP_SORT_IDLE,
  SHOP_SORT_PRICE_AXIS_OPTIONS,
  SHOP_SORT_TIME_OPTIONS,
  SHOP_STOCK_CHECKS,
  shopResultCopy,
  shopStockCopy,
} from '@modules/shop/constants/copy.ts'
import {
  productPasses,
  servicePasses,
  shelfIsOn,
  sortCatalog,
  uniqueLabels,
  SHOP_SHELF,
  type CatalogFilter,
  type ShopShelfId,
} from '@modules/shop/application/filterCatalog.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import { pickDailyDeal } from '@modules/shop/application/pickDailyDeal.ts'
import DealDeck from '@modules/shop/presentation/DealDeck.vue'
import MysteryAuthGate from '@modules/shop/presentation/MysteryAuthGate.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import {
  API,
  APP_PATHS,
  JSON_HEADERS,
  appTiendaFicha,
  appTiendaServicio,
} from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import AficheHero from '@ui/AficheHero.vue'
import BrushSplash from '@ui/BrushSplash.vue'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import DealSpotlight from '@ui/DealSpotlight.vue'
import Empty from '@ui/Empty.vue'
import Icon from '@ui/Icon.vue'
import NoticeBar from '@ui/NoticeBar.vue'
import ProductCard from '@ui/ProductCard.vue'
import Search from '@ui/Search.vue'
import Select from '@ui/Select.vue'
import ServiceCard from '@ui/ServiceCard.vue'
import SortToolbar from '@ui/SortToolbar.vue'

type FilterChip = {
  readonly id: string
  readonly label: string
  readonly clear: () => void
}

const props = defineProps<{
  module: ShopModule
}>()

const bindReveal = usePageReveal()
const copy = SHOP_COPY
const query = ref('')
const shelvesOn = ref<ShopShelfId[]>([])
const priceBands = ref<string[]>([])
const categoriesOn = ref<string[]>([])
const colorsOn = ref<string[]>([])
const sizesOn = ref<string[]>([])
const stocksOn = ref<string[]>([])
const withPhoto = ref(false)
const sortBy = ref<string>(SHOP_SORT.NEWEST)

const sessionId = ref('')
const mysteryEnabled = ref(false)
const mysteryCards = ref<MysteryDeckCard[]>([])
const authOpen = ref(false)
const authBusy = ref(false)
const authError = ref('')
const pendingCardId = ref<string | null>(null)

const contact = computed(() => props.module.getContact())
const catalog = computed(() => props.module.getShelves())
const services = computed(() => props.module.getServices())
const allProducts = computed(() => [...catalog.value.own, ...catalog.value.collab])
const dailyDeal = computed(() => pickDailyDeal(allProducts.value))
const registered = computed(() => Boolean(sessionId.value))
const showMysteryDeck = computed(() => mysteryEnabled.value && mysteryCards.value.length > 0)

function readSession(): string {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function writeSession(id: string) {
  sessionId.value = id
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, id)
  } catch {
    /* sin storage */
  }
}

async function refreshMysteryDeck() {
  const deck = await props.module.loadMysteryDeck(sessionId.value)
  mysteryEnabled.value = deck.enabled
  mysteryCards.value = [...deck.cards]
}

async function onPickCard(cardId: string) {
  const result = await props.module.revealMysteryCard(cardId, sessionId.value)
  if (!result.ok) {
    if (result.error.code === 'VALIDATION') {
      authOpen.value = true
      pendingCardId.value = cardId
      return
    }
    authError.value = result.error.message || copy.deckFlipFail
    authOpen.value = true
    return
  }
  mysteryCards.value = mysteryCards.value.map((card) =>
    card.id === cardId ? result.value : card,
  )
}

function onNeedAuth() {
  pendingCardId.value = null
  authError.value = ''
  authOpen.value = true
}

async function afterAuth() {
  authOpen.value = false
  authError.value = ''
  await refreshMysteryDeck()
  if (pendingCardId.value) {
    const id = pendingCardId.value
    pendingCardId.value = null
    await onPickCard(id)
  }
}

async function onRegister(draft: { alias: string; email: string; password: string }) {
  authBusy.value = true
  authError.value = ''
  try {
    const response = await fetch(API.USERS_REGISTER, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(draft),
    })
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
    if (!response.ok || typeof body.sessionId !== 'string') {
      authError.value = typeof body.detail === 'string' ? body.detail : copy.deckAuthFail
      return
    }
    writeSession(body.sessionId)
    await afterAuth()
  } catch {
    authError.value = copy.deckAuthFail
  } finally {
    authBusy.value = false
  }
}

async function onLogin(draft: { email: string; password: string }) {
  authBusy.value = true
  authError.value = ''
  try {
    const response = await fetch(API.USERS_LOGIN, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(draft),
    })
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
    if (!response.ok || typeof body.sessionId !== 'string') {
      authError.value = typeof body.detail === 'string' ? body.detail : copy.deckAuthFail
      return
    }
    writeSession(body.sessionId)
    await afterAuth()
  } catch {
    authError.value = copy.deckAuthFail
  } finally {
    authBusy.value = false
  }
}

onMounted(() => {
  sessionId.value = readSession()
  void refreshMysteryDeck()
})

const filterState = computed((): CatalogFilter => ({
  query: query.value,
  shelves: shelvesOn.value,
  priceBands: priceBands.value,
  categories: categoriesOn.value,
  colors: colorsOn.value,
  sizes: sizesOn.value,
  stocks: stocksOn.value,
  withPhoto: withPhoto.value,
}))

const ownItems = computed(() => {
  if (!shelfIsOn(SHOP_SHELF.OWN, filterState.value.shelves)) return []
  return sortCatalog(catalog.value.own.filter((item) => productPasses(item, filterState.value)), sortBy.value)
})
const collabItems = computed(() => {
  if (!shelfIsOn(SHOP_SHELF.COLLAB, filterState.value.shelves)) return []
  return sortCatalog(catalog.value.collab.filter((item) => productPasses(item, filterState.value)), sortBy.value)
})
const serviceItems = computed(() => {
  if (!shelfIsOn(SHOP_SHELF.SERVICE, filterState.value.shelves)) return []
  return sortCatalog(
    services.value.items.filter((item) => servicePasses(item, filterState.value)),
    sortBy.value,
  )
})

const visibleCount = computed(
  () => ownItems.value.length + collabItems.value.length + serviceItems.value.length,
)

const colorLabels = computed(() => uniqueLabels(allProducts.value.map((item) => item.color)))
const sizeLabels = computed(() => uniqueLabels(allProducts.value.map((item) => item.size)))

function isShelfOn(id: ShopShelfId): boolean {
  return shelvesOn.value.includes(id)
}

function toggleShelf(id: ShopShelfId) {
  if (isShelfOn(id)) {
    shelvesOn.value = shelvesOn.value.filter((item) => item !== id)
    return
  }
  shelvesOn.value = [...shelvesOn.value, id]
}

function isOn(list: readonly string[], id: string): boolean {
  return list.includes(id)
}

function toggleValue(list: string[], id: string, on: boolean): string[] {
  if (on) return list.includes(id) ? list : [...list, id]
  return list.filter((item) => item !== id)
}

function pickLabel(options: readonly { value: string; label: string }[], value: string): string {
  return options.find((item) => item.value === value)?.label ?? value
}

function applySort(value: string) {
  sortBy.value = value || SHOP_SORT.NEWEST
}

const timeSort = computed({
  get: () =>
    sortBy.value === SHOP_SORT.NEWEST || sortBy.value === SHOP_SORT.OLDEST ? sortBy.value : SHOP_SORT_IDLE,
  set: applySort,
})

const priceSort = computed({
  get: () =>
    sortBy.value === SHOP_SORT.PRICE_ASC || sortBy.value === SHOP_SORT.PRICE_DESC
      ? sortBy.value
      : SHOP_SORT_IDLE,
  set: applySort,
})

const colorSort = computed({
  get: () =>
    sortBy.value === SHOP_SORT.COLOR_ASC || sortBy.value === SHOP_SORT.COLOR_DESC
      ? sortBy.value
      : SHOP_SORT_IDLE,
  set: applySort,
})

function clearFilters() {
  query.value = ''
  shelvesOn.value = []
  priceBands.value = []
  categoriesOn.value = []
  colorsOn.value = []
  sizesOn.value = []
  stocksOn.value = []
  withPhoto.value = false
}

const chips = computed((): FilterChip[] => {
  const next: FilterChip[] = []
  const needle = query.value.trim()
  if (needle) {
    next.push({ id: 'query', label: needle, clear: () => { query.value = '' } })
  }
  for (const item of SHOP_PREFILTERS) {
    if (!isShelfOn(item.id)) continue
    next.push({
      id: item.id,
      label: `${item.tag} · ${item.label}`,
      clear: () => toggleShelf(item.id),
    })
  }
  for (const category of categoriesOn.value) {
    next.push({
      id: `cat-${category}`,
      label: pickLabel(SHOP_CATEGORY_CHECKS, category),
      clear: () => { categoriesOn.value = toggleValue(categoriesOn.value, category, false) },
    })
  }
  for (const band of priceBands.value) {
    next.push({
      id: `price-${band}`,
      label: pickLabel(SHOP_PRICE_CHECKS, band),
      clear: () => { priceBands.value = toggleValue(priceBands.value, band, false) },
    })
  }
  for (const kind of stocksOn.value) {
    next.push({
      id: `stock-${kind}`,
      label: pickLabel(SHOP_STOCK_CHECKS, kind),
      clear: () => { stocksOn.value = toggleValue(stocksOn.value, kind, false) },
    })
  }
  if (withPhoto.value) {
    next.push({
      id: 'photo',
      label: copy.withPhoto,
      clear: () => { withPhoto.value = false },
    })
  }
  for (const label of colorsOn.value) {
    next.push({
      id: `color-${label}`,
      label,
      clear: () => { colorsOn.value = toggleValue(colorsOn.value, label, false) },
    })
  }
  for (const label of sizesOn.value) {
    next.push({
      id: `size-${label}`,
      label,
      clear: () => { sizesOn.value = toggleValue(sizesOn.value, label, false) },
    })
  }
  return next
})

const filtersDirty = computed(() => chips.value.length > 0)
</script>

<template>
  <div :ref="bindReveal">
    <AficheHero
      :kicker="copy.kicker"
      :title="copy.title"
      :plate="copy.plate"
      :photo-src="SHOP_HERO_PHOTO"
      data-reveal
    >
      <template #lead>{{ copy.lead }}</template>
      <template #actions>
        <Button variant="hero" :href="contact.whatsappHref" target="_blank">
          {{ copy.writeCta }}
          <Icon name="whatsapp" size="sm" tone="white" :circle="false" />
        </Button>
      </template>
      <template #panel>
        <DealDeck
          v-if="showMysteryDeck"
          :cards="mysteryCards"
          :registered="registered"
          @pick="onPickCard"
          @need-auth="onNeedAuth"
        />
        <DealSpotlight
          v-else-if="dailyDeal"
          :kicker="copy.dealKicker"
          :title="dailyDeal.title"
          :price="formatProductPrice(dailyDeal.priceCop)"
          :photo-src="dailyDeal.photoSrc"
          :media-label="copy.dealMediaLabel"
          :cta-label="copy.dealCta"
          :cta-to="appTiendaFicha(dailyDeal.id)"
        />
        <DealSpotlight
          v-else
          mystery
          :kicker="copy.dealKicker"
          :title="copy.dealMysteryTitle"
          :lead="copy.dealMysteryLead"
        />
      </template>
    </AficheHero>

    <MysteryAuthGate
      v-model="authOpen"
      :busy="authBusy"
      :error="authError"
      @register="onRegister"
      @login="onLogin"
    />

    <main class="wrap shop-market">
      <NoticeBar v-if="SHOP_PROMO.on" :kicker="SHOP_PROMO.kicker" :text="SHOP_PROMO.text" data-reveal />

      <div
        class="shop-market__prefilters filter-pills"
        role="group"
        :aria-label="copy.filtersShelf"
        data-reveal
      >
        <button
          v-for="item in SHOP_PREFILTERS"
          :key="item.id"
          type="button"
          class="filter-pill"
          :class="{ 'is-on': isShelfOn(item.id) }"
          :aria-pressed="isShelfOn(item.id)"
          @click="toggleShelf(item.id)"
        >
          <span class="shop-market__prefilter-tag">{{ item.tag }}</span>
          {{ item.label }}
        </button>
      </div>

      <div class="shop-market__layout">
        <div class="shop-market__aside">
          <div class="shop-market__events" data-reveal>
            <h2>{{ copy.eventsTitle }}</h2>
            <p class="meta">{{ copy.eventsLead }}</p>
            <Button size="sm" :to="APP_PATHS.PARCHESE">{{ copy.eventsCta }}</Button>
          </div>
          <aside class="shop-market__filters" :aria-label="copy.filtersTitle" data-reveal>
          <h2>{{ copy.filtersTitle }}</h2>
          <Search v-model="query" :placeholder="copy.searchPlaceholder" />

          <div class="shop-market__facet-block">
            <h3>{{ copy.filtersPiece }}</h3>
            <Choice
              v-for="item in SHOP_CATEGORY_CHECKS"
              :key="item.value"
              :model-value="isOn(categoriesOn, item.value)"
              :label="item.label"
              @update:model-value="categoriesOn = toggleValue(categoriesOn, item.value, $event)"
            />
          </div>

          <div class="shop-market__facet-block">
            <h3>{{ copy.filtersPrice }}</h3>
            <Choice
              v-for="item in SHOP_PRICE_CHECKS"
              :key="item.value"
              :model-value="isOn(priceBands, item.value)"
              :label="item.label"
              @update:model-value="priceBands = toggleValue(priceBands, item.value, $event)"
            />
          </div>
          <div class="shop-market__facet-block">
            <h3>{{ copy.filtersStock }}</h3>
            <Choice
              v-for="item in SHOP_STOCK_CHECKS"
              :key="item.value"
              :model-value="isOn(stocksOn, item.value)"
              :label="item.label"
              @update:model-value="stocksOn = toggleValue(stocksOn, item.value, $event)"
            />
          </div>
          <div class="shop-market__facet-block">
            <h3>{{ copy.filtersPhoto }}</h3>
            <Choice v-model="withPhoto" :label="copy.withPhoto" />
          </div>
          <div v-if="colorLabels.length" class="shop-market__facet-block">
            <h3>{{ copy.filtersColor }}</h3>
            <Choice
              v-for="label in colorLabels"
              :key="label"
              :model-value="isOn(colorsOn, label)"
              :label="label"
              @update:model-value="colorsOn = toggleValue(colorsOn, label, $event)"
            />
          </div>
          <div v-if="sizeLabels.length" class="shop-market__facet-block">
            <h3>{{ copy.filtersSize }}</h3>
            <Choice
              v-for="label in sizeLabels"
              :key="label"
              :model-value="isOn(sizesOn, label)"
              :label="label"
              @update:model-value="sizesOn = toggleValue(sizesOn, label, $event)"
            />
          </div>

          <Button v-if="filtersDirty" variant="ghost" size="sm" @click="clearFilters">
            {{ copy.filtersClear }}
          </Button>
          </aside>
        </div>

        <div class="shop-market__results">
          <SortToolbar
            v-model:sort-model="timeSort"
            :count="shopResultCopy(visibleCount)"
            :sort-label="copy.sortTime"
            :sort-options="SHOP_SORT_TIME_OPTIONS"
          >
            <Select
              v-model="priceSort"
              :label="copy.filtersPrice"
              :options="SHOP_SORT_PRICE_AXIS_OPTIONS"
            />
            <Select
              v-model="colorSort"
              :label="copy.sortColorAxis"
              :options="SHOP_SORT_COLOR_AXIS_OPTIONS"
            />
          </SortToolbar>

          <div v-if="chips.length" class="shop-market__chips filter-pills">
            <button
              v-for="chip in chips"
              :key="chip.id"
              type="button"
              class="filter-pill is-on"
              :aria-label="`${copy.filtersClear}: ${chip.label}`"
              @click="chip.clear"
            >
              {{ chip.label }}
            </button>
          </div>

          <Empty
            v-if="!visibleCount"
            compact
            glyph="◎"
            hide-cta
            :title="copy.emptyFilterTitle"
            :copy="copy.emptyFilterCopy"
            :mascot-src="MASCOT.LENTE"
          />

          <section v-if="ownItems.length" :aria-label="copy.ownAria" data-reveal>
            <BrushSplash :label="copy.ownHeading" tone="blue" size="sm" style="margin: 0 0 12px" />
            <div class="grid grid-3 shop-market__shelf">
              <ProductCard
                v-for="item in ownItems"
                :key="item.id"
                :title="item.title"
                :price="formatProductPrice(item.priceCop)"
                :note="item.stock === null ? undefined : shopStockCopy(item.stock)"
                :photo-src="item.photoSrc"
                :to="appTiendaFicha(item.id)"
                :cta-label="copy.fichaCta"
                :shelf="copy.kindOwnTag"
                :media-label="copy.mediaLabel"
              />
            </div>
          </section>

          <section v-if="collabItems.length" :aria-label="copy.collabAria" data-reveal>
            <BrushSplash :label="copy.collabHeading" tone="white" size="sm" style="margin: 0 0 12px" />
            <div class="grid grid-3 shop-market__shelf">
              <ProductCard
                v-for="item in collabItems"
                :key="item.id"
                collab
                :title="item.title"
                :price="formatProductPrice(item.priceCop)"
                :note="item.stock === null ? undefined : shopStockCopy(item.stock)"
                :photo-src="item.photoSrc"
                :to="appTiendaFicha(item.id)"
                :cta-label="copy.fichaCta"
                :shelf="copy.kindCollabTag"
                :media-label="copy.mediaLabel"
              />
            </div>
          </section>

          <section v-if="serviceItems.length" :aria-label="copy.serviceAria" data-reveal>
            <BrushSplash :label="copy.serviceHeading" tone="blue" size="sm" style="margin: 0 0 12px" />
            <div class="grid grid-2 shop-market__shelf">
              <ServiceCard
                v-for="item in serviceItems"
                :key="item.id"
                :title="item.title"
                :copy="`${copy.kindWashTag}. ${item.includesText}`"
              >
                <p class="price">{{ formatProductPrice(item.priceCop) }}</p>
                <Button size="sm" variant="ghost" :to="appTiendaServicio(item.id)">{{ copy.fichaCta }}</Button>
              </ServiceCard>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
