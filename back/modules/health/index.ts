import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { HEALTH_ROUTES } from './constants/health.constants.js'
import { healthController } from './controllers/health.controller.js'
import { withHealthErrors } from './middlewares/health.middleware.js'

export const healthRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: HEALTH_ROUTES.GET, handler: withHealthErrors(healthController) },
]
