import { useI18n } from '../i18n'
import { onboardingMessages } from '../i18n/onboarding.messages'

type OnboardingBundle = (typeof onboardingMessages)['en']

function lookup(bundle: OnboardingBundle, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, bundle)
  return typeof value === 'string' ? value : undefined
}

/** Local-scope translations for citizen onboarding + home that follow the app language. */
export function useOnboardingI18n() {
  const { locale, setLocale, toggleLocale } = useI18n()

  function t(key: string, params?: Record<string, unknown>): string {
    const bundle =
      onboardingMessages[locale.value as keyof typeof onboardingMessages] ??
      onboardingMessages.en
    const template = lookup(bundle as OnboardingBundle, key) ?? lookup(onboardingMessages.en, key) ?? key
    if (!params) return template
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match
    )
  }

  return { t, locale, setLocale, toggleLocale }
}

export default useOnboardingI18n
