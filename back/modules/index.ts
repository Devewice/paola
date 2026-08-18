import type { Route } from '../http/router.js'
import { clubRoutes } from './club/index.js'
import { healthRoutes } from './health/index.js'
import { memoriesRoutes } from './memories/index.js'
import { ridesRoutes } from './rides/index.js'
import { shopRoutes } from './shop/index.js'
import { voiceRoutes } from './voice/index.js'
import { ordersRoutes } from './orders/index.js'
import { socialRoutes } from './social/index.js'

export const apiRoutes: readonly Route[] = [
  ...healthRoutes,
  ...ridesRoutes,
  ...memoriesRoutes,
  ...voiceRoutes,
  ...shopRoutes,
  ...clubRoutes,
  ...ordersRoutes,
  ...socialRoutes,
]
