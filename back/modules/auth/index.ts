import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { AUTH_ROUTES } from './constants/auth.constants.js'
import {
  getOperatorAuthController,
  googleStartController,
  listAuthMethodsController,
  saveOperatorAuthController,
} from './controllers/auth.controller.js'

export const authRoutes: readonly Route[] = [
  {
    method: HTTP_METHOD.GET,
    path: AUTH_ROUTES.METHODS,
    handler: listAuthMethodsController,
  },
  {
    method: HTTP_METHOD.GET,
    path: AUTH_ROUTES.GOOGLE_START,
    handler: googleStartController,
  },
  {
    method: HTTP_METHOD.GET,
    path: AUTH_ROUTES.OPERAR_GET,
    handler: getOperatorAuthController,
  },
  {
    method: HTTP_METHOD.POST,
    path: AUTH_ROUTES.OPERAR_SAVE,
    handler: saveOperatorAuthController,
  },
]
