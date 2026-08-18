export type AppErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'INFRASTRUCTURE'
  | 'UNKNOWN'

export type AppError = {
  readonly code: AppErrorCode
  readonly message: string
  readonly cause?: unknown
}

export const appError = (
  code: AppErrorCode,
  message: string,
  cause?: unknown,
): AppError => ({
  code,
  message,
  cause,
})
