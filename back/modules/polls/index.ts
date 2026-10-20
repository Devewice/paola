import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { POLL_ROUTES } from './constants/polls.constants.js'
import {
  clearResponsesController,
  createPollController,
  deletePollController,
  deleteResponseController,
  editPollController,
  listOperatorPollsController,
  listPollsController,
  pollInsightsController,
  readPollController,
  recordViewsController,
  updatePollController,
  votePollController,
} from './controllers/polls.controller.js'
import { withPollErrors } from './middlewares/polls.middleware.js'

export const pollsRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: POLL_ROUTES.LIST, handler: withPollErrors(listPollsController) },
  { method: HTTP_METHOD.POST, path: POLL_ROUTES.VIEWS, handler: withPollErrors(recordViewsController) },
  { method: HTTP_METHOD.GET, path: POLL_ROUTES.OPERAR_LIST, handler: withPollErrors(listOperatorPollsController) },
  { method: HTTP_METHOD.POST, path: POLL_ROUTES.OPERAR_CREATE, handler: withPollErrors(createPollController) },
  { method: HTTP_METHOD.GET, path: POLL_ROUTES.OPERAR_INSIGHTS, handler: withPollErrors(pollInsightsController) },
  { method: HTTP_METHOD.POST, path: POLL_ROUTES.OPERAR_EDIT, handler: withPollErrors(editPollController) },
  { method: HTTP_METHOD.POST, path: POLL_ROUTES.OPERAR_DELETE, handler: withPollErrors(deletePollController) },
  { method: HTTP_METHOD.POST, path: POLL_ROUTES.OPERAR_RESPONSES_CLEAR, handler: withPollErrors(clearResponsesController) },
  { method: HTTP_METHOD.POST, path: POLL_ROUTES.OPERAR_RESPONSE_DELETE, handler: withPollErrors(deleteResponseController) },
  { method: HTTP_METHOD.POST, path: POLL_ROUTES.OPERAR_UPDATE, handler: withPollErrors(updatePollController) },
  { method: HTTP_METHOD.GET, path: POLL_ROUTES.DETAIL, handler: withPollErrors(readPollController) },
  { method: HTTP_METHOD.POST, path: POLL_ROUTES.VOTE, handler: withPollErrors(votePollController) },
]
