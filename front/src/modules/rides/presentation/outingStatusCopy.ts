import { RIDES_AGENDA_COPY, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { OutingStatus } from '@modules/rides/domain/entities/Outing.ts'

/** Por qué una salida ya no recibe inscripciones. */
export function outingStatusCopy(status: OutingStatus): string {
  if (status === RIDES_STATUS.LLENO) return RIDES_AGENDA_COPY.full
  if (status === RIDES_STATUS.CERRADO) return RIDES_AGENDA_COPY.closed
  if (status === RIDES_STATUS.REALIZADO) return RIDES_AGENDA_COPY.done
  return RIDES_AGENDA_COPY.past
}
