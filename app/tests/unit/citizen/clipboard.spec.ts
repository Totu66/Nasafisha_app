import { describe, expect, it } from 'vitest'
import { copyText } from '../../../src/helpers/clipboard'

describe('FE-022 copyText', () => {
  it('uses the clipboard API when available', async () => {
    let copied = ''
    const ok = await copyText('NSF-1042', { clipboard: { writeText: async (t: string) => { copied = t } } })
    expect(ok).toBe(true)
    expect(copied).toBe('NSF-1042')
  })
  it('falls back when the clipboard API rejects (e.g. blocked on http)', async () => {
    const ok = await copyText('NSF-1042', {
      clipboard: { writeText: async () => { throw new Error('denied') } },
      fallback: () => true,
    })
    expect(ok).toBe(true)
  })
  it('reports failure instead of throwing when nothing works', async () => {
    expect(await copyText('x', {})).toBe(false)
    expect(await copyText('x', { fallback: () => { throw new Error('boom') } })).toBe(false)
  })
})