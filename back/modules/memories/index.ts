import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { MEMORY_ROUTES } from './constants/memories.constants.js'
import {
  createMemoryController,
  listMemoriesController,
} from './controllers/memories.controller.js'
import { withMemoriesErrors } from './middlewares/memories.middleware.js'

export const memoriesRoutes: readonly Route[] = [
  {
    method: HTTP_METHOD.GET,
    path: MEMORY_ROUTES.LIST,
    handler: withMemoriesErrors(listMemoriesController),
  },
  {
    method: HTTP_METHOD.POST,
    path: MEMORY_ROUTES.CREATE,
    handler: withMemoriesErrors(createMemoryController),
  },
]
