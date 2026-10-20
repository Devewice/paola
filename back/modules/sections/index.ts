import { HTTP_METHOD } from '../../http/constants.js'
import { withErrors } from '../../http/middleware/errors.js'
import type { Route } from '../../http/router.js'
import { SECTIONS_ROUTES } from './constants/sections.constants.js'
import { listSectionsController, updateSectionController } from './controllers/sections.controller.js'

export const sectionsRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: SECTIONS_ROUTES.LIST, handler: withErrors(listSectionsController) },
  { method: HTTP_METHOD.POST, path: SECTIONS_ROUTES.UPDATE, handler: withErrors(updateSectionController) },
]
