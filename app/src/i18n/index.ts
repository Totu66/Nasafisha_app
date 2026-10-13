import en from './locales/en.json';
import sw from './locales/sw.json';

const dictionaries = {
  en,
  sw,
} as const;

const defaultLocale = 'en';

function resolvePath(target: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, target);
}

export function useI18n(locale = defaultLocale) {
  const dictionary = dictionaries[locale as keyof typeof dictionaries] ?? dictionaries[defaultLocale];

  const t = (key: string, params: Record<string, string | number> = {}): string => {
    const value = resolvePath(dictionary, key);
    if (typeof value !== 'string') {
      return key;
    }

    return Object.entries(params).reduce((text, [placeholder, replacement]) => {
      return text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(replacement));
    }, value);
  };

  return { t, locale, setLocale: (nextLocale: keyof typeof dictionaries) => nextLocale };
}

export default { useI18n };
