/**
 * Sustituye patrones HTML del kit por componentes Vue de @ui.
 * Ejecutar después de `node front/scripts/extract-html-kit.mjs`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const kitPath = join(root, 'front/src/app/shell/KitView.vue')
let src = readFileSync(kitPath, 'utf8')

const imports = `import { nextTick, onMounted } from 'vue'
import { runKitHeroEntrance } from '@shared/motion/runKitHero.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
`

src = src.replace(
  /<script setup lang="ts">[\s\S]*?<\/script>/,
  `<script setup lang="ts">
${imports}
onMounted(async () => {
  try {
    if (document.fonts?.ready) await document.fonts.ready
  } catch {
    /* seguir */
  }
  await nextTick()
  runKitHeroEntrance('hero')
  runKitHeroEntrance('hero-portal')
})
</script>`,
)

src = src.replace(
  /<span class="voice-badge voice-badge--loigca">Moto Loigca<\/span>/g,
  '<VoiceBadge voice="loigca" />',
)
src = src.replace(
  /<span class="voice-badge voice-badge--incauta">Cámara Incauta<\/span>/g,
  '<VoiceBadge voice="incauta" />',
)
src = src.replace(
  /<span class="voice-badge voice-badge--armargura">Paola Armargura<\/span>/g,
  '<VoiceBadge voice="armargura" />',
)

const chipMap = [
  ['chip-open', 'abierto'],
  ['chip-full', 'lleno'],
  ['chip-done', 'realizado'],
  ['chip-ok', 'zona-ok'],
]

for (const [cls, tone] of chipMap) {
  const open =
    tone === 'abierto'
      ? new RegExp(`<span class="chip ${cls}">([^<]*)</span>`, 'g')
      : new RegExp(`<span class="chip ${cls}">([^<]*)</span>`, 'g')
  src = src.replace(open, (_, text) =>
    tone === 'abierto' ? `<Chip>${text}</Chip>` : `<Chip tone="${tone}">${text}</Chip>`,
  )
}

src = src.replace(
  /<div class="alert alert-info">([\s\S]*?)<\/div>/g,
  '<Alert>$1</Alert>',
)
src = src.replace(
  /<div class="alert alert-ok">([\s\S]*?)<\/div>/g,
  '<Alert tone="ok">$1</Alert>',
)
src = src.replace(
  /<div class="alert alert-bad">([\s\S]*?)<\/div>/g,
  '<Alert tone="bad">$1</Alert>',
)
src = src.replace(
  /<div class="alert alert-warn">([\s\S]*?)<\/div>/g,
  '<Alert tone="warn">$1</Alert>',
)

function btnReplace(html, pattern, replacement) {
  return html.replace(pattern, replacement)
}

src = btnReplace(
  src,
  /<button class="btn btn-primary btn-primary--hero btn-sm" type="button">([^<]*)<\/button>/g,
  '<Button variant="hero" size="sm">$1</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-primary btn-primary--hero btn-lg" type="button">([^<]*)<\/button>/g,
  '<Button variant="hero" size="lg">$1</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-primary btn-primary--hero" type="button">([^<]*)<\/button>/g,
  '<Button variant="hero">$1</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-ghost btn-sm" type="button"([^>]*)>([^<]*)<\/button>/g,
  '<Button variant="ghost" size="sm"$1>$2</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-ghost" type="button"([^>]*)>([^<]*)<\/button>/g,
  '<Button variant="ghost"$1>$2</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-dark btn-sm" type="button"([^>]*)>([^<]*)<\/button>/g,
  '<Button variant="dark" size="sm"$1>$2</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-dark" type="button"([^>]*)>([^<]*)<\/button>/g,
  '<Button variant="dark"$1>$2</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-danger btn-sm" type="button"([^>]*)>([^<]*)<\/button>/g,
  '<Button variant="danger" size="sm"$1>$2</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-danger" type="button"([^>]*)>([^<]*)<\/button>/g,
  '<Button variant="danger"$1>$2</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-primary btn-sm" type="button"([^>]*)>([^<]*)<\/button>/g,
  '<Button size="sm"$1>$2</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-primary" type="button" disabled>([^<]*)<\/button>/g,
  '<Button disabled>$1</Button>',
)
src = btnReplace(
  src,
  /<button class="btn btn-primary" type="button"([^>]*)>([^<]*)<\/button>/g,
  '<Button$1>$2</Button>',
)

writeFileSync(kitPath, src)
console.log('remap-kit-vue: componentes @ui aplicados donde el patrón coincide')
