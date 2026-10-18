import { useI18n } from '../i18n'
import { citizenConfirmMessages } from '../i18n/citizenConfirm.messages'

type ConfirmBundle = (typeof citizenConfirmMessages)['en']

function lookup(bundle: ConfirmBundle, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, bundle)
  return typeof value === 'string' ? value : undefined
}

/** Local-scope translations (FE-022/024) that follow the app language. */
export function useCitizenConfirmI18n() {
  const { locale } = useI18n()

  function t(key: string, params?: Record<string, unknown>): string {
    const bundle =
      citizenConfirmMessages[locale.value as keyof typeof citizenConfirmMessages] ??
      citizenConfirmMessages.en
    const template = lookup(bundle, key) ?? lookup(citizenConfirmMessages.en, key) ?? key
    if (!params) return template
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match
    )
  }

  return { t, locale }
}
