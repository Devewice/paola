import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { VOICE_ROUTES } from './constants/voice.constants.js'
import {
  createFineController,
  createReportController,
  createTipController,
  listFinesController,
  listOperatorReportsController,
  listReportsController,
  listTipsController,
  moderateReportController,
} from './controllers/voice.controller.js'
import { withVoiceErrors } from './middlewares/voice.middleware.js'

export const voiceRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: VOICE_ROUTES.LIST, handler: withVoiceErrors(listTipsController) },
  { method: HTTP_METHOD.POST, path: VOICE_ROUTES.OPERAR_CREATE_TIP, handler: withVoiceErrors(createTipController) },
  { method: HTTP_METHOD.GET, path: VOICE_ROUTES.LIST_FINES, handler: withVoiceErrors(listFinesController) },
  { method: HTTP_METHOD.GET, path: VOICE_ROUTES.LEGACY_LIST_COMPARENDOS, handler: withVoiceErrors(listFinesController) },
  {
    method: HTTP_METHOD.POST,
    path: VOICE_ROUTES.OPERAR_CREATE_FINE,
    handler: withVoiceErrors(createFineController),
  },
  {
    method: HTTP_METHOD.POST,
    path: VOICE_ROUTES.LEGACY_OPERAR_CREATE_COMPARENDO,
    handler: withVoiceErrors(createFineController),
  },
  { method: HTTP_METHOD.GET, path: VOICE_ROUTES.LIST_REPORTS, handler: withVoiceErrors(listReportsController) },
  { method: HTTP_METHOD.GET, path: VOICE_ROUTES.LEGACY_LIST_DENUNCIAS, handler: withVoiceErrors(listReportsController) },
  { method: HTTP_METHOD.GET, path: VOICE_ROUTES.OPERAR_REPORTS, handler: withVoiceErrors(listOperatorReportsController) },
  {
    method: HTTP_METHOD.GET,
    path: VOICE_ROUTES.LEGACY_OPERAR_DENUNCIAS,
    handler: withVoiceErrors(listOperatorReportsController),
  },
  { method: HTTP_METHOD.POST, path: VOICE_ROUTES.CREATE_REPORT, handler: withVoiceErrors(createReportController) },
  { method: HTTP_METHOD.POST, path: VOICE_ROUTES.LEGACY_CREATE_DENUNCIA, handler: withVoiceErrors(createReportController) },
  {
    method: HTTP_METHOD.POST,
    path: VOICE_ROUTES.OPERAR_REPORT_STATUS,
    handler: withVoiceErrors(moderateReportController),
  },
  {
    method: HTTP_METHOD.POST,
    path: VOICE_ROUTES.LEGACY_OPERAR_DENUNCIA_STATUS,
    handler: withVoiceErrors(moderateReportController),
  },
]
