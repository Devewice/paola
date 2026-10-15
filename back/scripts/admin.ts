/**
 * Crea o sube a admin una cuenta. La contraseña se escribe aquí y no queda en ningún archivo.
 *
 *   npm run admin
 *   npm run admin -- correo@dominio.com
 */
import { createInterface } from 'node:readline'
import { destroyDb } from '../db/knex.js'
import { migrate } from '../db/migrate.js'
import { ADMIN_CLI_COPY, ROLES_LIMITS } from '../modules/roles/constants/roles.constants.js'
import { makeAdmin } from '../modules/roles/services/roles.service.js'

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

function askHidden(question: string): Promise<string> {
  const stdin = process.stdin
  if (!stdin.isTTY) return ask(question)
  process.stdout.write(question)
  return new Promise((resolve) => {
    let value = ''
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') {
          stdin.setRawMode(false)
          stdin.pause()
          stdin.off('data', onData)
          process.stdout.write('\n')
          resolve(value)
          return
        }
        if (char === '\u0003') {
          stdin.setRawMode(false)
          process.exit(130)
        }
        if (char === '\u007f' || char === '\b') {
          value = value.slice(0, -1)
          continue
        }
        value += char
      }
    }
    stdin.on('data', onData)
  })
}

async function main(): Promise<void> {
  const email = (process.argv[2] ?? (await ask(ADMIN_CLI_COPY.askEmail))).trim().toLowerCase()
  if (!email.includes('@')) throw new Error(ADMIN_CLI_COPY.emailInvalid)

  await migrate()

  if ((await makeAdmin(email)) === 'promoted') {
    console.log(ADMIN_CLI_COPY.promoted(email))
    return
  }

  const password = await askHidden(ADMIN_CLI_COPY.askPassword)
  if (password.trim().length < ROLES_LIMITS.PASSWORD_MIN) throw new Error(ADMIN_CLI_COPY.passwordShort)
  if ((await askHidden(ADMIN_CLI_COPY.askRepeat)) !== password) throw new Error(ADMIN_CLI_COPY.passwordMismatch)

  await makeAdmin(email, password)
  console.log(ADMIN_CLI_COPY.created(email))
}

main()
  .catch((error: unknown) => {
    console.error(ADMIN_CLI_COPY.failed, error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
  .finally(async () => {
    await destroyDb()
  })
