import { HTTP_METHOD } from '../../http/constants.js'
import type { Route } from '../../http/router.js'
import { VOICE_ROUTES } from './constants/voice.constants.js'
import { listTipsController } from './controllers/voice.controller.js'
import { withVoiceErrors } from './middlewares/voice.middleware.js'

export const voiceRoutes: readonly Route[] = [
  { method: HTTP_METHOD.GET, path: VOICE_ROUTES.LIST, handler: withVoiceErrors(listTipsController) },
]
