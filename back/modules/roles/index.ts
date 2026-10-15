import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { ROLES_ROUTES } from './constants/roles.constants.js'
import {
  accessController,
  createRoleController,
  deleteRoleController,
  listRolesController,
  listUsersController,
  setUserRoleController,
  updateRoleController,
} from './controllers/roles.controller.js'
import { withRolesErrors } from './middlewares/roles.middleware.js'

export const rolesRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: ROLES_ROUTES.ACCESS, handler: withRolesErrors(accessController) },
  { method: HTTP_METHOD.GET, path: ROLES_ROUTES.LIST, handler: withRolesErrors(listRolesController) },
  { method: HTTP_METHOD.POST, path: ROLES_ROUTES.LIST, handler: withRolesErrors(createRoleController) },
  { method: HTTP_METHOD.POST, path: ROLES_ROUTES.DELETE, handler: withRolesErrors(deleteRoleController) },
  { method: HTTP_METHOD.POST, path: ROLES_ROUTES.UPDATE, handler: withRolesErrors(updateRoleController) },
  { method: HTTP_METHOD.GET, path: ROLES_ROUTES.USERS, handler: withRolesErrors(listUsersController) },
  { method: HTTP_METHOD.POST, path: ROLES_ROUTES.USER_ROLE, handler: withRolesErrors(setUserRoleController) },
]
