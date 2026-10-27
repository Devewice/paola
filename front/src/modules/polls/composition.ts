import { SubmitBallot } from '@modules/polls/application/SubmitBallot.ts'
import type {
  BallotDraftPort,
  PollsAdminPort,
  PollsPort,
  VoterIdentityPort,
} from '@modules/polls/domain/ports/PollsPort.ts'

export type PollsModule = {
  list: PollsPort['list']
  get: PollsPort['get']
  submit: SubmitBallot['execute']
  isSignedIn: () => boolean
  drafts: BallotDraftPort
  track: PollsPort['track']
  listOperator: PollsAdminPort['list']
  create: PollsAdminPort['create']
  edit: PollsAdminPort['edit']
  update: PollsAdminPort['update']
  remove: PollsAdminPort['remove']
  insights: PollsAdminPort['insights']
  removeResponse: PollsAdminPort['removeResponse']
  clearResponses: PollsAdminPort['clearResponses']
  exportResponses: PollsAdminPort['exportResponses']
}

export function createPollsModule(
  polls: PollsPort,
  admin: PollsAdminPort,
  identity: VoterIdentityPort,
  drafts: BallotDraftPort,
): PollsModule {
  const submitBallot = new SubmitBallot(polls)
  return {
    list: (filter) => polls.list(filter),
    get: (id) => polls.get(id),
    submit: (poll, ballot, signedIn) => submitBallot.execute(poll, ballot, signedIn),
    isSignedIn: () => identity.sessionId().length > 0,
    drafts,
    track: (id, kind) => polls.track(id, kind),
    listOperator: (clave) => admin.list(clave),
    create: (draft, clave) => admin.create(draft, clave),
    edit: (id, draft, clave) => admin.edit(id, draft, clave),
    update: (id, patch, clave) => admin.update(id, patch, clave),
    remove: (id, clave) => admin.remove(id, clave),
    insights: (id, clave) => admin.insights(id, clave),
    removeResponse: (id, responseId, clave) => admin.removeResponse(id, responseId, clave),
    clearResponses: (id, clave) => admin.clearResponses(id, clave),
    exportResponses: (id, clave) => admin.exportResponses(id, clave),
  }
}
