// postinstall: Hostinger (preset Express) solo corre `npm install` y luego busca back/dist/index.js.
// En un clon limpio compila; en local, con build previo, no hace nada.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

if (existsSync('back/dist/index.js') && existsSync('dist/index.html')) process.exit(0)

const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true })
process.exit(result.status ?? 1)
