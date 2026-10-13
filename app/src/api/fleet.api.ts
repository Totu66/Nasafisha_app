import httpClient from './http';
import type {
  LiveVehicle,
  FleetSnapshot,
  AuthoriseDeviationPayload,
  AcknowledgeStalePayload,
  DeviationAlert,
  DeviationAuditEvent,
} from '@/types/deviationAlert';
import type { RouteAudit, RouteAuditFilter } from '@/types/routeAudit';
import type { ShiftPositionHistory } from '@/types/positionLog';
import type { PlannedRoute } from '@/types/route';

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/**
 * PROPOSED FLEET API ENDPOINTS (SRS FR-020, FR-021, FR-022, §5.3)
 * Please confirm these with the backend team:
 *
 * GET    /fleet/vehicles                        → { success, data: FleetSnapshot }
 * GET    /fleet/vehicles/:id/history            → { success, data: ShiftPositionHistory }
 * POST   /fleet/vehicles/:id/acknowledge-stale  → { success, data: LiveVehicle }
 * GET    /fleet/vehicles/:id/route              → { success, data: PlannedRoute }
 * GET    /fleet/route-audits                    → { success, data: RouteAudit[] }
 * GET    /fleet/route-audits/:id                → { success, data: RouteAudit }
 * GET    /fleet/deviations                      → { success, data: DeviationAlert[] }
 * GET    /fleet/deviations/:id/audit            → { success, data: DeviationAuditEvent[] }
 * POST   /fleet/deviations/:id/authorise        → { success, data: DeviationAlert }
 */

/**
 * Check if we should use mock data.
 * Looks for VITE_MOCK_API=true in environment variables.
 */
function useMockData(): boolean {
  return import.meta.env.VITE_MOCK_API === 'true';
}

/**
 * Load mock fleet data from app/data/db.json.
 * Returns the raw data structure for testing/development.
 */
async function loadMockDb(): Promise<Record<string, unknown>> {
  try {
    const response = await fetch('/data/db.json');
    if (!response.ok) {
      throw new Error('Failed to load mock data');
    }
    return await response.json();
  } catch {
    throw new Error('Mock data unavailable');
  }
}

/**
 * Fetch live vehicles and active deviation alerts.
 * Falls back to mock data if VITE_MOCK_API=true.
 * Implements SRS FR-020 (live tracking) and FR-022 (deviations).
 * Returns the current fleet snapshot.
 *
 * @param params Optional filter { zoneId?: string }
 * @returns FleetSnapshot with liveVehicles and deviationAlerts
 */
export async function getLiveVehicles(params?: {
  zoneId?: string;
}): Promise<FleetSnapshot> {
  if (useMockData()) {
    const db = await loadMockDb();
    const liveVehicles = asArray<LiveVehicle>(db.liveVehicles);
    const deviationAlerts = asArray<DeviationAlert>(db.deviationAlerts);
    return {
      timestamp: new Date().toISOString(),
      liveVehicles,
      deviationAlerts,
    };
  }

  const res = await httpClient.get<{ success: boolean; data: FleetSnapshot }>(
    '/fleet/vehicles',
    { params }
  );
  if (!res.data.success) {
    throw new Error(
      `Failed to fetch live vehicles: ${res.data.data?.toString() || 'Unknown error'}`
    );
  }
  return res.data.data;
}

/**
 * Fetch position history for a vehicle during a specific shift.
 * Falls back to mock data if VITE_MOCK_API=true.
 * Implements SRS FR-021 (route auditing).
 *
 * @param vehicleId Vehicle identifier
 * @param shiftId Optional shift identifier; if omitted, returns latest shift
 * @returns ShiftPositionHistory with GPS entries
 */
export async function getVehicleHistory(
  vehicleId: string,
  shiftId?: string
): Promise<ShiftPositionHistory> {
  if (useMockData()) {
    const db = await loadMockDb();
    const positionHistory = asArray<ShiftPositionHistory>(db.positionHistory);
    const history = positionHistory.find(
      (entry) => entry.vehicleId === vehicleId && (!shiftId || entry.shiftId === shiftId)
    );
    if (!history) {
      throw new Error('Position history not found');
    }
    return history;
  }

  const params = shiftId ? { shiftId } : undefined;
  const res = await httpClient.get<{ success: boolean; data: ShiftPositionHistory }>(
    `/fleet/vehicles/${vehicleId}/history`,
    { params }
  );
  if (!res.data.success) {
    throw new Error(`Failed to fetch vehicle history: ${res.data.data?.toString() || 'Unknown error'}`);
  }
  return res.data.data;
}

/**
 * Acknowledge a stale vehicle flag (BR-020.1).
 * Falls back to mock data if VITE_MOCK_API=true.
 * Field Supervisor marks that they have seen and noted the communication delay.
 * Stale flag does not auto-clear; acknowledgment or fresh data must arrive.
 *
 * @param vehicleId Vehicle with stale flag
 * @param payload { acknowledgedBy: userId }
 * @returns Updated LiveVehicle with staleAcknowledgedAt and staleAcknowledgedBy set
 */
export async function acknowledgeStale(
  vehicleId: string,
  payload: AcknowledgeStalePayload
): Promise<LiveVehicle> {
  if (useMockData()) {
    const db = await loadMockDb();
    const liveVehicles = asArray<LiveVehicle>(db.liveVehicles);
    const vehicle = liveVehicles.find((entry) => entry.id === vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return {
      ...vehicle,
      staleAcknowledgedAt: new Date().toISOString(),
      staleAcknowledgedBy: payload.acknowledgedBy,
    };
  }

  const res = await httpClient.post<{ success: boolean; data: LiveVehicle }>(
    `/fleet/vehicles/${vehicleId}/acknowledge-stale`,
    payload
  );
  if (!res.data.success) {
    throw new Error(
      `Failed to acknowledge stale: ${res.data.data?.toString() || 'Unknown error'}`
    );
  }
  return res.data.data;
}

/**
 * Fetch the planned route assigned to a vehicle.
 * Falls back to mock data if VITE_MOCK_API=true.
 * Implements SRS FR-021.
 *
 * @param vehicleId Vehicle identifier
 * @returns PlannedRoute with path and duration estimates
 */
export async function getPlannedRoute(vehicleId: string): Promise<PlannedRoute> {
  if (useMockData()) {
    const db = await loadMockDb();
    const plannedRoutes = asArray<PlannedRoute>(db.plannedRoutes);
    const route = plannedRoutes.find((entry) => entry.vehicleId === vehicleId);
    if (!route) {
      throw new Error('Planned route not found');
    }
    return route;
  }

  const res = await httpClient.get<{ success: boolean; data: PlannedRoute }>(
    `/fleet/vehicles/${vehicleId}/route`
  );
  if (!res.data.success) {
    throw new Error(`Failed to fetch planned route: ${res.data.data?.toString() || 'Unknown error'}`);
  }
  return res.data.data;
}

/**
 * Fetch route audits with optional filters.
 * Falls back to mock data if VITE_MOCK_API=true.
 * Implements SRS FR-021 (route auditing). Returns variance metrics (distance and time).
 *
 * @param filter RouteAuditFilter { vehicleId?, zoneId?, dateFrom?, dateTo? }
 * @returns Array of RouteAudit records with numeric variance fields
 */
export async function getRouteAudits(filter: RouteAuditFilter): Promise<RouteAudit[]> {
  if (useMockData()) {
    const db = await loadMockDb();
    let audits = (db.routeAudits as RouteAudit[]) || [];

    // Apply filters
    if (filter.vehicleId) {
      audits = audits.filter((a) => a.vehicleId === filter.vehicleId);
    }
    if (filter.zoneId) {
      audits = audits.filter((a) => a.zoneId === filter.zoneId);
    }
    if (filter.dateFrom) {
      audits = audits.filter((a) => a.shiftEnd >= filter.dateFrom!);
    }
    if (filter.dateTo) {
      audits = audits.filter((a) => a.shiftEnd <= filter.dateTo!);
    }

    return audits;
  }

  const res = await httpClient.get<{ success: boolean; data: RouteAudit[] }>(
    '/fleet/route-audits',
    { params: filter }
  );
  if (!res.data.success) {
    throw new Error(`Failed to fetch route audits: ${res.data.data?.toString() || 'Unknown error'}`);
  }
  return res.data.data;
}

/**
 * Fetch a single route audit by ID.
 * Falls back to mock data if VITE_MOCK_API=true.
 * Implements SRS FR-021.
 *
 * @param id RouteAudit identifier
 * @returns RouteAudit with full details
 */
export async function getRouteAudit(id: string): Promise<RouteAudit> {
  if (useMockData()) {
    const db = await loadMockDb();
    const audits = (db.routeAudits as RouteAudit[]) || [];
    const audit = audits.find((a) => a.id === id);
    if (!audit) {
      throw new Error('Route audit not found');
    }
    return audit;
  }

  const res = await httpClient.get<{ success: boolean; data: RouteAudit }>(
    `/fleet/route-audits/${id}`
  );
  if (!res.data.success) {
    throw new Error(`Failed to fetch route audit: ${res.data.data?.toString() || 'Unknown error'}`);
  }
  return res.data.data;
}

/**
 * Fetch deviation alerts with optional filters.
 * Falls back to mock data if VITE_MOCK_API=true.
 * Implements SRS FR-022.
 *
 * @param params Optional filters { status?: DeviationStatus, zoneId?: string }
 * @returns Array of DeviationAlert records
 */
export async function getDeviationAlerts(params?: {
  status?: string;
  zoneId?: string;
}): Promise<DeviationAlert[]> {
  if (useMockData()) {
    const db = await loadMockDb();
    let alerts = (db.deviationAlerts as DeviationAlert[]) || [];

    // Apply filters
    if (params?.status) {
      alerts = alerts.filter((a) => a.status === params.status);
    }
    if (params?.zoneId) {
      alerts = alerts.filter((a) => a.zoneId === params.zoneId);
    }

    return alerts;
  }

  const res = await httpClient.get<{ success: boolean; data: DeviationAlert[] }>(
    '/fleet/deviations',
    { params }
  );
  if (!res.data.success) {
    throw new Error(
      `Failed to fetch deviation alerts: ${res.data.data?.toString() || 'Unknown error'}`
    );
  }
  return res.data.data;
}

/**
 * Fetch the audit trail for a deviation alert.
 * Falls back to mock data (empty trail) if VITE_MOCK_API=true.
 * Implements SRS AC-022.3 (shift audit trail).
 * Every raised/cleared/authorised event is recorded.
 *
 * @param alertId DeviationAlert identifier
 * @returns Array of DeviationAuditEvent records in chronological order
 */
export async function getDeviationAuditTrail(alertId: string): Promise<DeviationAuditEvent[]> {
  if (useMockData()) {
    // Return a mock audit trail for the alert
    return [
      {
        id: `event-${alertId}-1`,
        alertId,
        type: 'raised',
        at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
        actorId: undefined,
      },
    ];
  }

  const res = await httpClient.get<{ success: boolean; data: DeviationAuditEvent[] }>(
    `/fleet/deviations/${alertId}/audit`
  );
  if (!res.data.success) {
    throw new Error(
      `Failed to fetch deviation audit trail: ${res.data.data?.toString() || 'Unknown error'}`
    );
  }
  return res.data.data;
}

/**
 * Authorize a deviation alert.
 * Falls back to mock data if VITE_MOCK_API=true.
 * Implements SRS AC-022.2. Operations Manager or Field Supervisor marks a deviation as legitimate.
 * An audit event is created and the alert status changes to 'authorised'.
 *
 * @param alertId DeviationAlert identifier
 * @param payload { authorisedBy: userId, note?: string }
 * @returns Updated DeviationAlert with status='authorised', authorisedAt, authorisedBy
 */
export async function authoriseDeviation(
  alertId: string,
  payload: AuthoriseDeviationPayload
): Promise<DeviationAlert> {
  if (useMockData()) {
    const db = await loadMockDb();
    const alerts = asArray<DeviationAlert>(db.deviationAlerts);
    const alert = alerts.find((entry) => entry.id === alertId);
    if (!alert) {
      throw new Error('Deviation alert not found');
    }
    return {
      ...alert,
      status: 'authorised',
      authorisedAt: new Date().toISOString(),
      authorisedBy: payload.authorisedBy,
    };
  }

  const res = await httpClient.post<{ success: boolean; data: DeviationAlert }>(
    `/fleet/deviations/${alertId}/authorise`,
    payload
  );
  if (!res.data.success) {
    throw new Error(
      `Failed to authorise deviation: ${res.data.data?.toString() || 'Unknown error'}`
    );
  }
  return res.data.data;
}
