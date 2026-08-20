import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return walkFiles(full)
      return [full]
    }),
  )
  return files.flat()
}

async function computeUiUsageCounts(frontRoot: string): Promise<Record<string, number>> {
  const srcRoot = path.join(frontRoot, 'src')
  const kitViewPath = path.join(srcRoot, 'app', 'shell', 'KitView.vue')
  const kitView = await readFile(kitViewPath, 'utf8')

  const imports = [...kitView.matchAll(/import\s+[A-Za-z0-9_]+\s+from\s+'@ui\/([A-Za-z0-9_-]+)\.vue'/g)]
  const names = [...new Set(imports.map((m) => m[1]).filter(Boolean))] as string[]
  const counts = Object.fromEntries(names.map((name) => [name, 0]))

  const files = await walkFiles(srcRoot)
  const targetFiles = files.filter((file) => (file.endsWith('.vue') || file.endsWith('.ts')) && file !== kitViewPath)

  for (const file of targetFiles) {
    const text = await readFile(file, 'utf8')
    for (const name of names) {
      const token = `from '@ui/${name}.vue'`
      const found = text.split(token).length - 1
      if (found > 0) counts[name] = (counts[name] ?? 0) + found
    }
  }

  return counts
}

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vuetify({ autoImport: true }),
    {
      name: 'kit-usage-counts-endpoint',
      configureServer(server) {
        server.middlewares.use('/__kit-usage-counts', async (_req, res) => {
          try {
            const counts = await computeUiUsageCounts(server.config.root)
            res.setHeader('content-type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ counts }))
          } catch {
            res.statusCode = 500
            res.setHeader('content-type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ counts: {}, error: 'No se pudo calcular el contador.' }))
          }
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
      '@ui': fileURLToPath(new URL('./src/shared/ui', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        timeout: 4000,
      },
    },
  },
  test: {
    environment: 'node',
  },
})
