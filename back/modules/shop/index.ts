import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { SHOP_ROUTES } from './constants/shop.constants.js'
import {
  createProductController,
  createServiceController,
  listProductsController,
  listServicesController,
} from './controllers/shop.controller.js'
import { withShopErrors } from './middlewares/shop.middleware.js'

export const shopRoutes: readonly Route[] = [
  {
    method: HTTP_METHOD.GET,
    path: SHOP_ROUTES.LIST,
    handler: withShopErrors(listProductsController),
  },
  {
    method: HTTP_METHOD.POST,
    path: SHOP_ROUTES.CREATE,
    handler: withShopErrors(createProductController),
  },
  {
    method: HTTP_METHOD.GET,
    path: SHOP_ROUTES.SERVICES,
    handler: withShopErrors(listServicesController),
  },
  {
    method: HTTP_METHOD.POST,
    path: SHOP_ROUTES.CREATE_SERVICE,
    handler: withShopErrors(createServiceController),
  },
]
