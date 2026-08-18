import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { CLUB_ROUTES } from './constants/club.constants.js'
import {
  createAllianceController,
  createMemberController,
  listAlliancesController,
  listMembersController,
} from './controllers/club.controller.js'
import { withClubErrors } from './middlewares/club.middleware.js'

export const clubRoutes: readonly Route[] = [
  {
    method: HTTP_METHOD.GET,
    path: CLUB_ROUTES.LIST_ALLIANCES,
    handler: withClubErrors(listAlliancesController),
  },
  {
    method: HTTP_METHOD.GET,
    path: CLUB_ROUTES.LIST_MEMBERS,
    handler: withClubErrors(listMembersController),
  },
  {
    method: HTTP_METHOD.POST,
    path: CLUB_ROUTES.CREATE_ALLIANCE,
    handler: withClubErrors(createAllianceController),
  },
  {
    method: HTTP_METHOD.POST,
    path: CLUB_ROUTES.CREATE_MEMBER,
    handler: withClubErrors(createMemberController),
  },
]
