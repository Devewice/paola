import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { RIDES_ROUTES } from './constants/rides.constants.js'
import {
  claimSpotController,
  createOutingController,
  listOperatorBoardController,
  listOutingsController,
  setOutingStatusController,
} from './controllers/rides.controller.js'
import { withRidesErrors } from './middlewares/rides.middleware.js'

export const ridesRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: RIDES_ROUTES.LIST, handler: withRidesErrors(listOutingsController) },
  { method: HTTP_METHOD.POST, path: RIDES_ROUTES.CLAIM, handler: withRidesErrors(claimSpotController) },
  {
    method: HTTP_METHOD.GET,
    path: RIDES_ROUTES.OPERATE_LIST,
    handler: withRidesErrors(listOperatorBoardController),
  },
  {
    method: HTTP_METHOD.POST,
    path: RIDES_ROUTES.OPERATE_CREATE,
    handler: withRidesErrors(createOutingController),
  },
  {
    method: HTTP_METHOD.POST,
    path: RIDES_ROUTES.OPERATE_STATUS,
    handler: withRidesErrors(setOutingStatusController),
  },
]
