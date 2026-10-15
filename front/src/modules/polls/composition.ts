import { SubmitBallot } from '@modules/polls/application/SubmitBallot.ts'
import type { PollsAdminPort, PollsPort, VoterIdentityPort } from '@modules/polls/domain/ports/PollsPort.ts'

export type PollsModule = {
  list: PollsPort['list']
  get: PollsPort['get']
  submit: SubmitBallot['execute']
  isSignedIn: () => boolean
  listOperator: PollsAdminPort['list']
  create: PollsAdminPort['create']
  update: PollsAdminPort['update']
  remove: PollsAdminPort['remove']
}

export function createPollsModule(
  polls: PollsPort,
  admin: PollsAdminPort,
  identity: VoterIdentityPort,
): PollsModule {
  const submitBallot = new SubmitBallot(polls)
  return {
    list: (filter) => polls.list(filter),
    get: (id) => polls.get(id),
    submit: (poll, ballot, signedIn) => submitBallot.execute(poll, ballot, signedIn),
    isSignedIn: () => identity.sessionId().length > 0,
    listOperator: (clave) => admin.list(clave),
    create: (draft, clave) => admin.create(draft, clave),
    update: (id, patch, clave) => admin.update(id, patch, clave),
    remove: (id, clave) => admin.remove(id, clave),
  }
}
