import type { Route } from '../../http/router.js'
import { HTTP_METHOD } from '../../http/constants.js'
import { ORDERS_ROUTES } from './constants/orders.constants.js'
import { createOrderController, listOperatorOrdersController } from './controllers/orders.controller.js'
import { withOrdersErrors } from './middlewares/orders.middleware.js'

export const ordersRoutes: readonly Route[] = [
  { method: HTTP_METHOD.POST, path: ORDERS_ROUTES.CREATE, handler: withOrdersErrors(createOrderController) },
  {
    method: HTTP_METHOD.GET,
    path: ORDERS_ROUTES.OPERAR_LIST,
    handler: withOrdersErrors(listOperatorOrdersController),
  },
]

