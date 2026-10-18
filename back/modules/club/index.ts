import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { CLUB_ROUTES } from './constants/club.constants.js'
import {
  createAllianceController,
  createMemberController,
  deleteAllianceController,
  deleteMemberController,
  listAlliancesController,
  listMembersController,
  updateAllianceController,
  updateMemberController,
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
  { method: HTTP_METHOD.POST, path: CLUB_ROUTES.UPDATE_ALLIANCE, handler: withClubErrors(updateAllianceController) },
  { method: HTTP_METHOD.POST, path: CLUB_ROUTES.DELETE_ALLIANCE, handler: withClubErrors(deleteAllianceController) },
  { method: HTTP_METHOD.POST, path: CLUB_ROUTES.UPDATE_MEMBER, handler: withClubErrors(updateMemberController) },
  { method: HTTP_METHOD.POST, path: CLUB_ROUTES.DELETE_MEMBER, handler: withClubErrors(deleteMemberController) },
]
