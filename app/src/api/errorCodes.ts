// Shared error-code registry (SRS §5.3). Add new codes here.
export const ERROR_CODES = {
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ROLE_FORBIDDEN: 'ROLE_FORBIDDEN',
} as const

// Reads `error.code` from a failed API response. Returns null if there is none.
export function getApiErrorCode(err: unknown): string | null {
  const code = (err as { response?: { data?: { error?: { code?: string } } } })
    ?.response?.data?.error?.code
  return code ?? null
}
