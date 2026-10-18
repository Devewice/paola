import { GetFines } from '@modules/voice/application/GetFines.ts'
import { GetReports } from '@modules/voice/application/GetReports.ts'
import { GetTips } from '@modules/voice/application/GetTips.ts'
import { SubmitReport } from '@modules/voice/application/SubmitReport.ts'
import type { FineCatalogPort } from '@modules/voice/domain/ports/FineCatalogPort.ts'
import type { ReportCatalogPort } from '@modules/voice/domain/ports/ReportCatalogPort.ts'
import type { ReportSubmitPort } from '@modules/voice/domain/ports/ReportSubmitPort.ts'
import type { TipCatalogPort } from '@modules/voice/domain/ports/TipCatalogPort.ts'
import type { VoiceAdminPort } from '@modules/voice/domain/ports/VoiceAdminPort.ts'

export type VoiceModule = {
  getTips: () => ReturnType<GetTips['execute']>
  getFines: () => ReturnType<GetFines['execute']>
  getReports: () => ReturnType<GetReports['execute']>
  submitReport: (draft: Record<string, unknown>) => ReturnType<SubmitReport['execute']>
  createTip: VoiceAdminPort['createTip']
  createFine: VoiceAdminPort['createFine']
  updateTip: VoiceAdminPort['updateTip']
  removeTip: VoiceAdminPort['removeTip']
  updateFine: VoiceAdminPort['updateFine']
  removeFine: VoiceAdminPort['removeFine']
  listOperatorReports: VoiceAdminPort['listReports']
  moderateReport: VoiceAdminPort['moderateReport']
}

export function createVoiceModule(
  tips: TipCatalogPort,
  fines: FineCatalogPort,
  reports: ReportCatalogPort,
  submit: ReportSubmitPort,
  admin: VoiceAdminPort,
): VoiceModule {
  const getTips = new GetTips(tips)
  const getFines = new GetFines(fines)
  const getReports = new GetReports(reports)
  const submitReport = new SubmitReport(submit)

  return {
    getTips: () => getTips.execute(),
    getFines: () => getFines.execute(),
    getReports: () => getReports.execute(),
    submitReport: (draft) => submitReport.execute(draft),
    createTip: (draft, clave) => admin.createTip(draft, clave),
    createFine: (draft, clave) => admin.createFine(draft, clave),
    updateTip: (id, draft, clave) => admin.updateTip(id, draft, clave),
    removeTip: (id, clave) => admin.removeTip(id, clave),
    updateFine: (id, draft, clave) => admin.updateFine(id, draft, clave),
    removeFine: (id, clave) => admin.removeFine(id, clave),
    listOperatorReports: (clave) => admin.listReports(clave),
    moderateReport: (id, status, clave, note) => admin.moderateReport(id, status, clave, note),
  }
}
