import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { PAYMENT_ROUTES } from './constants/payments.constants.js'
import {
  checkoutController,
  listMethodsController,
  listOperatorGatewaysController,
  saveGatewaysController,
  testGatewayController,
} from './controllers/payments.controller.js'
import { withPaymentsErrors } from './middlewares/payments.middleware.js'

export const paymentsRoutes: readonly Route[] = [
  {
    method: HTTP_METHOD.GET,
    path: PAYMENT_ROUTES.METHODS,
    handler: withPaymentsErrors(listMethodsController),
  },
  {
    method: HTTP_METHOD.POST,
    path: PAYMENT_ROUTES.CHECKOUT,
    handler: withPaymentsErrors(checkoutController),
  },
  {
    method: HTTP_METHOD.GET,
    path: PAYMENT_ROUTES.OPERAR_LIST,
    handler: withPaymentsErrors(listOperatorGatewaysController),
  },
  {
    method: HTTP_METHOD.POST,
    path: PAYMENT_ROUTES.OPERAR_SAVE,
    handler: withPaymentsErrors(saveGatewaysController),
  },
  {
    method: HTTP_METHOD.POST,
    path: PAYMENT_ROUTES.OPERAR_TEST,
    handler: withPaymentsErrors(testGatewayController),
  },
]
