/**
 * Validation helpers (shared).
 * Each rule returns an error message string, or `undefined` when valid,
 * which makes them directly assignable to BaseInput's `error` prop.
 *
 *   const err = validators.email(form.email);
 *   <BaseInput :error="err" />
 */

export type Validator = (value: unknown, ...rest: any[]) => string | undefined;

/** E.164-ish Kenyan or international MSISDN: +254712345678, 0712345678 */
const PHONE_RE = /^(?:\+?\d{7,15})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const ALPHA_RE = /^[A-Za-z][A-Za-z\s'-]*$/;
const ALPHANUM_RE = /^[A-Za-z0-9]+$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_COLOUR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function asString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export const required: Validator = (value) =>
  asString(value).length > 0 ? undefined : 'This field is required.';

export const minLength = (min: number): Validator => (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return text.length >= min
    ? undefined
    : `Must be at least ${min} characters.`;
};

export const maxLength = (max: number): Validator => (value) => {
  const text = asString(value);
  return text.length <= max ? undefined : `Must be at most ${max} characters.`;
};

export const email: Validator = (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return EMAIL_RE.test(text) ? undefined : 'Enter a valid email address.';
};

/** Accepts local (+254 / 07xx) and international formats, normalises to E.164. */
export const phone: Validator = (value) => {
  const text = asString(value).replace(/[\s()-]/g, '');
  if (text.length === 0) return undefined;
  if (!PHONE_RE.test(text)) return 'Enter a valid phone number.';
  if (text.startsWith('0') && text.length === 10) return undefined;
  if (text.startsWith('+254') && text.length === 13) return undefined;
  if (text.startsWith('254') && text.length === 12) return undefined;
  return text.length >= 7 ? undefined : 'Enter a valid phone number.';
};

/** Normalises Kenyan local numbers to +254 E.164. */
export function normalisePhone(value: string): string {
  const digits = asString(value).replace(/[\s()+-]/g, '');
  if (digits.startsWith('0')) return `+254${digits.slice(1)}`;
  if (digits.startsWith('254')) return `+${digits}`;
  return `+${digits}`;
}

export const otp: Validator = (value, length = 6) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return new RegExp(`^\\d{${length}}$`).test(text)
    ? undefined
    : `Enter the ${length}-digit code.`;
};

/** Minimum 8 chars with at least one letter and one number. */
export const password: Validator = (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  if (text.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(text)) return 'Include at least one letter.';
  if (!/\d/.test(text)) return 'Include at least one number.';
  return undefined;
};

export const matches = (other: () => unknown, message = 'Values do not match.'): Validator => (value) =>
  asString(value) === asString(other()) ? undefined : message;

export const numeric: Validator = (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return /^-?\d+(\.\d+)?$/.test(text) ? undefined : 'Enter a number.';
};

export const range = (min: number, max: number): Validator => (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  const num = Number(text);
  if (Number.isNaN(num)) return 'Enter a number.';
  if (num < min || num > max) return `Must be between ${min} and ${max}.`;
  return undefined;
};

export const url: Validator = (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return URL_RE.test(text) ? undefined : 'Enter a valid URL.';
};

export const oneOf = (allowed: readonly string[], message?: string): Validator => (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return allowed.includes(text)
    ? undefined
    : message ?? `Must be one of: ${allowed.join(', ')}.`;
};

export const alpha: Validator = (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return ALPHA_RE.test(text) ? undefined : 'Use letters only.';
};

export const alphanumeric: Validator = (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return ALPHANUM_RE.test(text) ? undefined : 'Use letters and numbers only.';
};

export const slug: Validator = (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return SLUG_RE.test(text) ? undefined : 'Use lowercase letters, numbers and hyphens.';
};

export const colour: Validator = (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  return HEX_COLOUR_RE.test(text) ? undefined : 'Enter a hex colour like #1F6F5C.';
};

/** Future date check, used by scheduled pickups and cleanup events. */
export const futureDate: Validator = (value) => {
  const text = asString(value);
  if (text.length === 0) return undefined;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return 'Enter a valid date.';
  return date.getTime() > Date.now() ? undefined : 'Must be in the future.';
};

/** Runs every rule in order and returns the first failure. */
export function validate(
  value: unknown,
  rules: Validator[],
  ...rest: any[]
): string | undefined {
  for (const rule of rules) {
    const message = rule(value, ...rest);
    if (message) return message;
  }
  return undefined;
}

/** Builds an error map from a record of field rules. */
export function validateAll<T extends Record<string, unknown>>(
  values: T,
  rules: Partial<Record<keyof T, Validator[]>>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const key of Object.keys(rules) as Array<keyof T>) {
    const fieldRules = rules[key];
    if (!fieldRules) continue;
    const message = validate(values[key], fieldRules);
    if (message) errors[key] = message;
  }
  return errors;
}

export const validators = {
  required,
  minLength,
  maxLength,
  email,
  phone,
  normalisePhone,
  otp,
  password,
  matches,
  numeric,
  range,
  url,
  oneOf,
  alpha,
  alphanumeric,
  slug,
  colour,
  futureDate,
  validate,
  validateAll,
};

export default validators;
