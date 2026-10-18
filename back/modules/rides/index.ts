import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { RIDES_ROUTES } from './constants/rides.constants.js'
import {
  claimSpotController,
  confirmSpotController,
  createOutingController,
  deleteOutingController,
  listOperatorBoardController,
  listOutingsController,
  outingCrewController,
  releaseSpotController,
  setOutingStatusController,
  updateOutingController,
} from './controllers/rides.controller.js'
import { withRidesErrors } from './middlewares/rides.middleware.js'

export const ridesRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: RIDES_ROUTES.LIST, handler: withRidesErrors(listOutingsController) },
  { method: HTTP_METHOD.POST, path: RIDES_ROUTES.CLAIM, handler: withRidesErrors(claimSpotController) },
  { method: HTTP_METHOD.GET, path: RIDES_ROUTES.CREW, handler: withRidesErrors(outingCrewController) },
  { method: HTTP_METHOD.POST, path: RIDES_ROUTES.CONFIRM, handler: withRidesErrors(confirmSpotController) },
  { method: HTTP_METHOD.POST, path: RIDES_ROUTES.RELEASE, handler: withRidesErrors(releaseSpotController) },
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
  {
    method: HTTP_METHOD.POST,
    path: RIDES_ROUTES.OPERATE_DELETE,
    handler: withRidesErrors(deleteOutingController),
  },
  {
    method: HTTP_METHOD.POST,
    path: RIDES_ROUTES.OPERATE_UPDATE,
    handler: withRidesErrors(updateOutingController),
  },
]
