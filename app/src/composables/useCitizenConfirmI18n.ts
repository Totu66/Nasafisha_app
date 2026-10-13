import { useI18n } from 'vue-i18n'
import { citizenConfirmMessages } from '../i18n/citizenConfirm.messages'

/** Local-scope translations that follow the app language. Assumes vue-i18n with `legacy: false` (Composition API). */
export function useCitizenConfirmI18n() {
  return useI18n({ useScope: 'local', messages: citizenConfirmMessages })
}