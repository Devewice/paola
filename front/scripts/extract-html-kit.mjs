import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const htmlPath = join(root, 'docs/index.html')
const html = readFileSync(htmlPath, 'utf8')

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/)
if (!styleMatch) throw new Error('No se encontró <style> en docs/index.html')

const css = styleMatch[1]
  .replaceAll('url("resoruces/', 'url("/kit-assets/')
  .replaceAll("url('resoruces/", "url('/kit-assets/")

writeFileSync(
  join(root, 'front/src/shared/ui/html-kit.css'),
  `/* Estilos del kit visual. Los componentes Vue de @ui usan estas clases. */\n${css}\n`,
)

const assetsDir = join(root, 'front/public/kit-assets')
mkdirSync(assetsDir, { recursive: true })
const assets = [
  'logo.png',
  'Rodada anapoimap.png',
  'Primera rodada.webp',
  '_ref_cumple.png',
  'Brush King.otf',
]
for (const name of assets) {
  copyFileSync(join(root, 'docs/resoruces', name), join(assetsDir, name))
}

console.log('Kit extraído: html-kit.css + kit-assets (KitView.vue ya es Vue; no se pisa)')
