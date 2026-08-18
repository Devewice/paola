<script setup lang="ts">
import { ref } from 'vue'
import PaolaAccordion from '@ui/PaolaAccordion.vue'
import PaolaActionBar from '@ui/PaolaActionBar.vue'
import PaolaAgendaItem from '@ui/PaolaAgendaItem.vue'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaAllianceStrip from '@ui/PaolaAllianceStrip.vue'
import PaolaBanner from '@ui/PaolaBanner.vue'
import PaolaBrushBanner from '@ui/PaolaBrushBanner.vue'
import PaolaBrushDivider from '@ui/PaolaBrushDivider.vue'
import PaolaBrushPlate from '@ui/PaolaBrushPlate.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaCard from '@ui/PaolaCard.vue'
import PaolaChatBubble from '@ui/PaolaChatBubble.vue'
import PaolaChip from '@ui/PaolaChip.vue'
import PaolaChoice from '@ui/PaolaChoice.vue'
import PaolaComment from '@ui/PaolaComment.vue'
import PaolaCommunityCard from '@ui/PaolaCommunityCard.vue'
import PaolaComparendo from '@ui/PaolaComparendo.vue'
import PaolaDenunciaCard from '@ui/PaolaDenunciaCard.vue'
import PaolaDualChannel from '@ui/PaolaDualChannel.vue'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaEngageBar from '@ui/PaolaEngageBar.vue'
import PaolaFab from '@ui/PaolaFab.vue'
import PaolaFeedPost from '@ui/PaolaFeedPost.vue'
import PaolaField from '@ui/PaolaField.vue'
import PaolaFilterPills from '@ui/PaolaFilterPills.vue'
import PaolaFollow from '@ui/PaolaFollow.vue'
import PaolaGallery from '@ui/PaolaGallery.vue'
import PaolaIcon from '@ui/PaolaIcon.vue'
import PaolaInput from '@ui/PaolaInput.vue'
import PaolaKpiStrip from '@ui/PaolaKpiStrip.vue'
import PaolaList from '@ui/PaolaList.vue'
import PaolaMapBlock from '@ui/PaolaMapBlock.vue'
import PaolaMemoriaHero from '@ui/PaolaMemoriaHero.vue'
import PaolaMemberCard from '@ui/PaolaMemberCard.vue'
import PaolaOrderSummary from '@ui/PaolaOrderSummary.vue'
import PaolaPager from '@ui/PaolaPager.vue'
import PaolaProductCard from '@ui/PaolaProductCard.vue'
import PaolaQtyStepper from '@ui/PaolaQtyStepper.vue'
import PaolaRideCard from '@ui/PaolaRideCard.vue'
import PaolaSearch from '@ui/PaolaSearch.vue'
import PaolaSelect from '@ui/PaolaSelect.vue'
import PaolaShareRow from '@ui/PaolaShareRow.vue'
import PaolaSheet from '@ui/PaolaSheet.vue'
import PaolaSkeleton from '@ui/PaolaSkeleton.vue'
import PaolaStatGrid from '@ui/PaolaStatGrid.vue'
import PaolaSteps from '@ui/PaolaSteps.vue'
import PaolaTabs from '@ui/PaolaTabs.vue'
import PaolaTextarea from '@ui/PaolaTextarea.vue'
import PaolaTicketCard from '@ui/PaolaTicketCard.vue'
import PaolaTimeline from '@ui/PaolaTimeline.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'
import PaolaWaStrip from '@ui/PaolaWaStrip.vue'
import PaolaZoneBadge from '@ui/PaolaZoneBadge.vue'

const nombre = ref('')
const nota = ref('')
const salida = ref('manana')
const casco = ref(true)
const tab = ref('datos')
const page = ref(1)
const qty = ref(1)
const filtro = ref('todas')
const busqueda = ref('')

const iconos = [
  'heart',
  'pin',
  'helmet',
  'bike',
  'camera',
  'ticket',
  'shield',
  'chat',
  'copy',
  'share',
] as const
</script>

<template>
  <div class="paola-kit">
    <header>
      <p class="paola-empty__kicker">Kit visual · Vue</p>
      <h1 class="type-display">Componentes para las fases</h1>
      <p class="paola-empty__copy">
        Importar desde <code>@ui</code>. El HTML de <code>docs/index.html</code> sigue como referencia.
        Esta ruta no es una de las cinco pestañas.
      </p>
    </header>

    <section>
      <h2 class="type-display">Capa brocha (solo afiche)</h2>
      <PaolaBrushBanner />
      <PaolaBrushPlate text="Rodada" />
      <PaolaBrushDivider />
    </section>

    <section>
      <h2 class="type-display">Botones</h2>
      <div class="paola-kit__row">
        <PaolaButton>Escribirle a Paola</PaolaButton>
        <PaolaButton variant="hero">Apúntese pa rodar</PaolaButton>
        <PaolaButton variant="ghost">Ver memorias</PaolaButton>
        <PaolaButton variant="dark">En barra</PaolaButton>
        <PaolaButton variant="danger">Quitar</PaolaButton>
        <PaolaButton variant="brush">Brochazo</PaolaButton>
        <PaolaButton size="sm">Chico</PaolaButton>
        <PaolaButton size="lg">Grande</PaolaButton>
        <PaolaButton disabled>Disabled</PaolaButton>
      </div>
    </section>

    <section>
      <h2 class="type-display">Iconos</h2>
      <div class="paola-kit__row">
        <PaolaIcon v-for="name in iconos" :key="name" :name="name" />
        <PaolaIcon name="camera" tone="cyan" />
        <PaolaIcon name="heart" tone="white" />
      </div>
    </section>

    <section>
      <h2 class="type-display">Voces y chips</h2>
      <div class="paola-kit__row">
        <PaolaVoiceBadge voice="loigca" />
        <PaolaVoiceBadge voice="incauta" />
        <PaolaVoiceBadge voice="armargura" />
        <PaolaChip>Abierto</PaolaChip>
        <PaolaChip tone="lleno">Lleno</PaolaChip>
        <PaolaChip tone="cerrado">Cerrado</PaolaChip>
        <PaolaChip tone="realizado">Realizado</PaolaChip>
        <PaolaZoneBadge zone="bogota" />
        <PaolaZoneBadge zone="soacha" />
        <PaolaZoneBadge zone="fuera" />
      </div>
    </section>

    <section>
      <h2 class="type-display">Formularios</h2>
      <PaolaField label="Nombre">
        <PaolaInput v-model="nombre" placeholder="Tu nombre" />
      </PaolaField>
      <PaolaField label="Nota" error="Este campo es de ejemplo">
        <PaolaTextarea v-model="nota" placeholder="Sin distorsión de brocha" invalid />
      </PaolaField>
      <PaolaField label="Tipo de salida">
        <PaolaSelect
          v-model="salida"
          :options="[
            { value: 'manana', label: 'Mañana' },
            { value: 'tarde', label: 'Tarde' },
          ]"
        />
      </PaolaField>
      <PaolaChoice v-model="casco" label="Llevo casco" />
      <PaolaSearch v-model="busqueda" placeholder="Buscar rodada…" />
    </section>

    <section>
      <h2 class="type-display">Alertas y avisos</h2>
      <PaolaAlert tone="info">Dato, cupo, porqué.</PaolaAlert>
      <PaolaAlert tone="ok">Cupo confirmado a tu nombre.</PaolaAlert>
      <PaolaAlert tone="warn">Fuera de Bogotá y Soacha aún no hay entrega.</PaolaAlert>
      <PaolaAlert tone="bad">No se puede publicar esto.</PaolaAlert>
      <PaolaBanner>Aviso de página.</PaolaBanner>
      <PaolaBanner tone="offline">Sin red. El sitio se mira igual; el envío espera.</PaolaBanner>
      <PaolaBanner tone="consent">Cookies: aún no hay banner de venta de datos. Nunca lo habrá.</PaolaBanner>
    </section>

    <section>
      <h2 class="type-display">Producto</h2>
      <div class="paola-kit__grid">
        <PaolaRideCard title="Próxima rodada" meta="Punto · fecha aún no" featured />
        <PaolaRideCard title="Rodada llena" meta="Cupo cerrado" status="lleno" />
        <PaolaProductCard title="Marca propia" price="Precio · próximamente" />
        <PaolaProductCard title="Colaboración" price="Estantería aparte" collab />
        <PaolaTicketCard title="Ticket a tu nombre" meta="Cupo simple, sistema propio" />
        <PaolaComparendo />
        <PaolaDenunciaCard title="Constancia" meta="Moderación Paola" />
        <PaolaOrderSummary
          :lines="[
            { label: 'Prenda', value: 'próximamente' },
            { label: 'Entrega', value: 'Bogotá / Soacha' },
          ]"
          total="Escribirle a Paola"
        />
      </div>
      <PaolaStatGrid
        :items="[
          { value: '—', label: 'Km' },
          { value: '—', label: 'Fotos' },
          { value: '—', label: 'Gente' },
        ]"
      />
      <PaolaTimeline
        :steps="[
          { label: 'Creada', done: true },
          { label: 'Cupo', done: true },
          { label: 'Rodar' },
          { label: 'Memoria' },
        ]"
      />
      <PaolaWaStrip />
      <PaolaGallery />
      <PaolaMapBlock />
      <PaolaMemoriaHero title="Memoria" meta="Fotos · participantes · aún no hay fecha" />
      <PaolaQtyStepper v-model="qty" />
      <PaolaShareRow url="https://paolabiker.com" />
    </section>

    <section>
      <h2 class="type-display">Patrones de UI</h2>
      <PaolaFilterPills
        v-model="filtro"
        :pills="[
          { id: 'todas', label: 'Todas' },
          { id: 'abiertas', label: 'Abiertas' },
          { id: 'hechas', label: 'Realizadas' },
        ]"
      />
      <PaolaTabs
        v-model="tab"
        :tabs="[
          { id: 'datos', label: 'Datos' },
          { id: 'fotos', label: 'Fotos' },
        ]"
      />
      <PaolaAccordion title="Qué incluye">
        <p>Texto de apoyo. Formularios sin brocha.</p>
      </PaolaAccordion>
      <PaolaPager v-model="page" :pages="3" />
      <PaolaSteps :steps="['Cupo', 'Pago', 'Listo']" :current="1" />
      <PaolaSkeleton />
      <PaolaList :items="['Casco', 'Chaleco', 'Agua']" />
      <PaolaList kind="action" :items="['Mis tickets', 'Mis pedidos']" />
      <PaolaKpiStrip
        :items="[
          { value: '5', label: 'Pestañas' },
          { value: '3', label: 'Voces' },
          { value: '1', label: 'Operadora' },
        ]"
      />
      <PaolaSheet title="Acciones">
        <PaolaButton size="sm">Confirmar</PaolaButton>
      </PaolaSheet>
      <PaolaActionBar>
        <PaolaButton size="sm">Confirmar cupo</PaolaButton>
      </PaolaActionBar>
      <PaolaFab label="Rodar" />
    </section>

    <section>
      <h2 class="type-display">Alianzas (aparte de tienda)</h2>
      <PaolaAllianceStrip
        :alliances="{
          items: [],
          emptyCopy: 'Aún estamos armando el apoyo. No logos inventados.',
        }"
      />
      <PaolaMemberCard alias="Kit" moto="Ficha de ejemplo · no es integrante" />
      <PaolaAgendaItem
        date="2026-08-17"
        title="Rodada de ejemplo"
        kind="rodada"
        point="Punto de kit · no es fecha real"
        when="proxima"
      />
      <PaolaAgendaItem
        date="2026-06-01"
        title="Lavado grupal de cascos"
        kind="actividad"
        point="Actividad de kit · no es fecha real"
        when="pasada"
      />
    </section>

    <section>
      <h2 class="type-display">Comunidad (fases 25–44, solo cáscara)</h2>
      <PaolaDualChannel />
      <PaolaCommunityCard title="Comunidad" meta="Ficha persistente en web" />
      <PaolaFollow />
      <PaolaFeedPost author="Parcero" body="Placeholder. Sin nombres reales." meta="Cronológico" />
      <PaolaComment author="Alguien" body="Comentario moderado." />
      <PaolaEngageBar />
      <PaolaChatBubble body="Hola desde web." />
      <PaolaChatBubble mine body="WhatsApp sigue vivo." />
    </section>

    <section>
      <h2 class="type-display">Vacío y recorte</h2>
      <PaolaCard>
        <p>Superficie Paper Mario. La mascota Insta360 va en volumen, no recortada igual.</p>
      </PaolaCard>
      <PaolaEmpty title="Ejemplo de vacío" copy="Las pestañas de producto usan este mismo vacío." />
    </section>
  </div>
</template>
