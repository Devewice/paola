import { ref } from 'vue'
import { MEMORY_COMMENTS_MOD_COPY } from '@modules/rides/constants/copy.ts'
import type { MemoryComment, MemoryCommentStatus } from '@modules/rides/domain/entities/MemoryComment.ts'
import type { MemoryCommentsPort } from '@modules/rides/domain/ports/MemoryCommentsPort.ts'
import { showToast } from '@ui/toast.ts'

export type ModAction = 'approve' | 'hide' | 'reject' | 'pin' | 'remove'

const STATUS_FOR: Partial<Record<ModAction, MemoryCommentStatus>> = {
  approve: 'publicado',
  hide: 'oculto',
  reject: 'rechazado',
}

/** Qué acciones tienen sentido según el estado actual del comentario. */
export function modActionsFor(comment: MemoryComment): ModAction[] {
  const actions: ModAction[] = []
  if (comment.status !== 'publicado') actions.push('approve')
  if (comment.status === 'publicado') actions.push('hide')
  if (comment.status === 'en_revision') actions.push('reject')
  if (comment.status === 'publicado' && !comment.parentId) actions.push('pin')
  actions.push('remove')
  return actions
}

export function modActionLabel(action: ModAction, comment: MemoryComment): string {
  const copy = MEMORY_COMMENTS_MOD_COPY
  if (action === 'pin') return comment.isPinned ? copy.unpin : copy.pin
  return copy[action]
}

export function useCommentModeration(comments: () => MemoryCommentsPort, clave: () => string, onDone: () => void) {
  const busy = ref<string | null>(null)
  const removing = ref<MemoryComment | null>(null)

  async function run(action: ModAction, comment: MemoryComment): Promise<void> {
    if (action === 'remove') {
      removing.value = comment
      return
    }
    busy.value = comment.id
    const status = STATUS_FOR[action]
    const port = comments()
    const result = status
      ? await port.moderate(comment.id, status, clave())
      : await port.pin(comment.id, clave())
    busy.value = null
    if (!result.ok) {
      showToast(result.error.message || MEMORY_COMMENTS_MOD_COPY.fail, 'bad')
      return
    }
    showToast(MEMORY_COMMENTS_MOD_COPY.done, 'ok')
    onDone()
  }

  async function confirmRemove(): Promise<void> {
    const comment = removing.value
    if (!comment) return
    busy.value = comment.id
    const result = await comments().remove(comment.id, clave())
    busy.value = null
    removing.value = null
    if (!result.ok) {
      showToast(result.error.message || MEMORY_COMMENTS_MOD_COPY.fail, 'bad')
      return
    }
    showToast(MEMORY_COMMENTS_MOD_COPY.removed, 'ok')
    onDone()
  }

  return { busy, removing, run, confirmRemove }
}
