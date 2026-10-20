import { HTTP_METHOD } from '../../http/constants.js'
import { withErrors } from '../../http/middleware/errors.js'
import type { Route } from '../../http/router.js'
import { MAPS_ROUTES } from './constants/maps.constants.js'
import { searchPlacesController } from './controllers/maps.controller.js'

export type { MapPoint, RoadRoute } from './interfaces/maps.interface.js'
export { parseMapPoint } from './schemas/maps.schema.js'
export { routeBetween } from './services/maps.service.js'

export const mapsRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: MAPS_ROUTES.PLACES, handler: withErrors(searchPlacesController) },
]
