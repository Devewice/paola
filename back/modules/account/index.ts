import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { ACCOUNT_ROUTES } from './constants/account.constants.js'
import {
  addMotorcycleController,
  catalogController,
  primaryMotorcycleController,
  readAccountController,
  removeMotorcycleController,
  saveProfileController,
  saveSafetyController,
} from './controllers/account.controller.js'
import { withAccountErrors } from './middlewares/account.middleware.js'

export const accountRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: ACCOUNT_ROUTES.PROFILE, handler: withAccountErrors(readAccountController) },
  { method: HTTP_METHOD.POST, path: ACCOUNT_ROUTES.PROFILE, handler: withAccountErrors(saveProfileController) },
  { method: HTTP_METHOD.POST, path: ACCOUNT_ROUTES.SAFETY, handler: withAccountErrors(saveSafetyController) },
  { method: HTTP_METHOD.GET, path: ACCOUNT_ROUTES.CATALOG, handler: withAccountErrors(catalogController) },
  { method: HTTP_METHOD.POST, path: ACCOUNT_ROUTES.MOTORCYCLES, handler: withAccountErrors(addMotorcycleController) },
  { method: HTTP_METHOD.POST, path: ACCOUNT_ROUTES.MOTORCYCLE_DELETE, handler: withAccountErrors(removeMotorcycleController) },
  { method: HTTP_METHOD.POST, path: ACCOUNT_ROUTES.MOTORCYCLE_PRIMARY, handler: withAccountErrors(primaryMotorcycleController) },
]
