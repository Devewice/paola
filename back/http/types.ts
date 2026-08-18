import type { IncomingMessage, ServerResponse } from 'node:http'

export type RouteParams = Record<string, string>

export type RouteHandler = (
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
  params: RouteParams,
) => void | Promise<void>

export type Fail = { ok: false; status: number; detail: string }

export type Parsed<T> = Fail | { ok: true; value: T }
