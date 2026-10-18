import { describe, it, expect } from 'vitest'
import { router } from '../../src/router'

const WIRED_PATHS = [
  // Citizen
  '/citizen/auth-choice',
  '/citizen/register',
  '/citizen/notifications',
  '/citizen/payments/history',
  '/citizen/cleanup-events',
  '/citizen/disposal-guidance',
  '/citizen/consent',
  // Field
  '/field/tickets/:id',
  '/field/tickets/:id/close',
  '/field/crew/:crewId?/reset-pin',
  '/field/crews',
  '/field/alerts',
  '/field/shift',
  '/field/attendance',
  // Admin
  '/admin/tickets/:id',
  '/admin/accounts',
  '/admin/zoning',
  '/admin/trends',
  '/admin/spatial-ledger',
  '/admin/shifts',
  '/admin/safety-alerts',
  '/admin/payments',
  '/admin/payment-compliance',
  '/admin/notifications',
  '/admin/hotspots',
  '/admin/finance',
  '/admin/efficiency-index',
  '/admin/dumping-sites',
  '/admin/attendance',
  // Auth alternate
  '/login/admin',
  // Legacy
  '/legacy',
  '/legacy/dashboard',
  '/legacy/operations',
  '/legacy/fleet',
  '/legacy/tickets',
  '/legacy/dumping-sites',
  '/legacy/accounts',
  '/legacy/login',
  '/legacy/landing',
  '/legacy/home',
  '/legacy/details',
  '/legacy/posts',
  '/legacy/pinia',
  '/legacy/api-test',
  '/legacy/citizen-report',
  '/legacy/contractor-login',
  '/legacy/contractor-ledger',
]

const CRITICAL_NAMES = [
  'admin-tickets',
  'admin-ticket-detail',
  'field-tickets',
  'field-ticket-detail',
  'field-close-ticket',
  'field-reset-pin',
  'field-crews',
  'CitizenAuthChoice',
  'CitizenRegister',
  'CitizenNotifications',
  'AdminLogin',
]

describe('route coverage', () => {
  it('registers every newly wired path', () => {
    const paths = router.getRoutes().map((route) => route.path)
    for (const path of WIRED_PATHS) {
      expect(paths, `missing route path: ${path}`).toContain(path)
    }
  })

  it('resolves the critical route names', () => {
    for (const name of CRITICAL_NAMES) {
      expect(router.getRoutes().some((r) => r.name === name), `missing route name: ${name}`).toBe(true)
    }
  })
})
