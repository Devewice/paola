import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type {
  MemoryComment,
  MemoryCommentCounts,
  MemoryCommentFilter,
  MemoryCommentLike,
  MemoryCommentStatus,
  OperatorMemoryComment,
} from '@modules/rides/domain/entities/MemoryComment.ts'

export type OperatorMemoryComments = {
  readonly comments: readonly OperatorMemoryComment[]
  readonly counts: MemoryCommentCounts
}

export interface MemoryCommentsPort {
  hasSession(): boolean
  list(memoryId: string): Promise<Result<readonly MemoryComment[], AppError>>
  post(memoryId: string, body: string, parentId?: string): Promise<Result<true, AppError>>
  like(commentId: string): Promise<Result<MemoryCommentLike, AppError>>
  listOperator(filter: MemoryCommentFilter, clave: string): Promise<Result<OperatorMemoryComments, AppError>>
  moderate(commentId: string, status: MemoryCommentStatus, clave: string): Promise<Result<true, AppError>>
  pin(commentId: string, clave: string): Promise<Result<true, AppError>>
  remove(commentId: string, clave: string): Promise<Result<true, AppError>>
}
