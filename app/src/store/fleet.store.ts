import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as fleetApi from '@/api/fleet.api';
import { usePolling } from '@/composables/usePolling';
import type {
  LiveVehicle,
  VehicleServiceStatus,
  DeviationAlert,
  DeviationStatus,
  AcknowledgeStalePayload,
  AuthoriseDeviationPayload,
} from '@/types/deviationAlert';
import type { RouteAudit, RouteAuditFilter } from '@/types/routeAudit';
import type { ShiftPositionHistory } from '@/types/positionLog';
import type { PlannedRoute } from '@/types/route';

/**
 * Staleness threshold: vehicle is considered stale if no report for > 15 minutes (BR-020.1, SRS §5.1).
 * Exported for use in composables or tests.
 */
export const STALE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Dark alert threshold: vehicle is considered dark (extended comm loss) if no report for > 30 minutes (SRS §5.1).
 */
export const DARK_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Zone statistics.
 */
export interface ZoneStats {
  zoneId: string;
  zoneName: string;
  vehicleCount: number;
  enRouteCount: number;
  servicingCount: number;
  idleCount: number;
  staleCount: number;
  darkCount: number;
  activeDeviationCount: number;
}

/**
 * Fleet store state shape.
 */
interface FleetState {
  // Live vehicle data
  vehicles: LiveVehicle[];
  selectedVehicleId: string | null;
  zoneFilter: string | null;
  statusFilter: VehicleServiceStatus | null;

  // Position history for selected vehicle
  history: ShiftPositionHistory | null;

  // Planned route for selected vehicle
  plannedRoute: PlannedRoute | null;

  // Route audits
  audits: RouteAudit[];
  selectedAudit: RouteAudit | null;

  // Deviation alerts
  deviations: DeviationAlert[];

  // Loading states (granular per domain)
  loading: {
    vehicles: boolean;
    history: boolean;
    plannedRoute: boolean;
    audits: boolean;
    deviations: boolean;
    acknowledgeStale: boolean;
    authoriseDeviation: boolean;
  };

  // Error states (granular per domain)
  error: {
    vehicles: Error | null;
    history: Error | null;
    plannedRoute: Error | null;
    audits: Error | null;
    deviations: Error | null;
    acknowledgeStale: Error | null;
    authoriseDeviation: Error | null;
  };

  // Timestamp of the last successful vehicles fetch (ISO 8601 UTC)
  lastUpdatedAt: string | null;

  // When the vehicles feed fails, we keep the last data but expose this flag.
  // UI should show "data unavailable" state instead of presenting old positions as current (ERR-030.1).
  isDataUnavailable: boolean;
}

/**
 * Pinia fleet store (useFleetStore).
 * Manages live vehicle tracking, route audits, and deviation alerts (FR-020, FR-021, FR-022).
 *
 * Key features:
 * - Granular loading and error states per domain.
 * - Live polling with automatic pause/resume via usePolling.
 * - Stale flag semantics: never auto-clears; requires acknowledgment or fresh data (BR-020.1).
 * - Optimistic updates with rollback on error.
 * - Dark alert detection for extended communication loss (SRS §5.1).
 * - Zone-based statistics and pending acknowledgment tracking.
 */
export const useFleetStore = defineStore('fleet', () => {
  // ===== STATE =====
  const state = ref<FleetState>({
    vehicles: [],
    selectedVehicleId: null,
    zoneFilter: null,
    statusFilter: null,
    history: null,
    plannedRoute: null,
    audits: [],
    selectedAudit: null,
    deviations: [],
    loading: {
      vehicles: false,
      history: false,
      plannedRoute: false,
      audits: false,
      deviations: false,
      acknowledgeStale: false,
      authoriseDeviation: false,
    },
    error: {
      vehicles: null,
      history: null,
      plannedRoute: null,
      audits: null,
      deviations: null,
      acknowledgeStale: null,
      authoriseDeviation: null,
    },
    lastUpdatedAt: null,
    isDataUnavailable: false,
  });

  // Polling control (set when live polling starts)
  let pollingControl: ReturnType<typeof usePolling<void>> | null = null;

  // ===== COMPUTED STATE / GETTERS =====

  /**
   * Vehicles filtered by zone and status.
   */
  const filteredVehicles = computed(() => {
    return state.value.vehicles.filter((v) => {
      if (state.value.zoneFilter && v.zoneId !== state.value.zoneFilter) {
        return false;
      }
      if (state.value.statusFilter && v.status !== state.value.statusFilter) {
        return false;
      }
      return true;
    });
  });

  /**
   * Vehicles with stale flag set (BR-020.1).
   */
  const staleVehicles = computed(() => {
    return state.value.vehicles.filter((v) => v.isStale);
  });

  /**
   * Vehicles in dark state (no report for > 30 minutes).
   * Operations Manager is alerted (SRS §5.1).
   */
  const darkVehicles = computed(() => {
    const now = Date.now();
    return state.value.vehicles.filter((v) => {
      const lastReportedMs = new Date(v.lastReportedAt).getTime();
      return now - lastReportedMs > DARK_THRESHOLD_MS;
    });
  });

  /**
   * Vehicles with stale flag that have NOT been acknowledged yet.
   * Field supervisors can use this to prioritize acknowledgments.
   */
  const pendingAcknowledgments = computed(() => {
    return state.value.vehicles.filter(
      (v) => v.isStale && !v.staleAcknowledgedAt && !v.staleAcknowledgedBy
    );
  });

  /**
   * Active deviation alerts (status = 'active').
   */
  const activeDeviations = computed(() => {
    return state.value.deviations.filter((d) => d.status === 'active');
  });

  /**
   * Currently selected vehicle (from selectedVehicleId).
   */
  const selectedVehicle = computed(() => {
    if (!state.value.selectedVehicleId) {
      return null;
    }
    return (
      state.value.vehicles.find((v) => v.id === state.value.selectedVehicleId) || null
    );
  });

  /**
   * Count of vehicles by status.
   */
  const vehicleCounts = computed(() => {
    const counts: Record<VehicleServiceStatus, number> = {
      en_route: 0,
      servicing: 0,
      idle: 0,
    };
    state.value.vehicles.forEach((v) => {
      counts[v.status]++;
    });
    return counts;
  });

  /**
   * Statistics grouped by zone.
   * Includes vehicle counts (by status), stale/dark vehicles, and active deviations per zone.
   */
  const zoneStats = computed(() => {
    const zoneMap = new Map<string, ZoneStats>();

    // Initialize zones from vehicles
    state.value.vehicles.forEach((v) => {
      if (!zoneMap.has(v.zoneId)) {
        zoneMap.set(v.zoneId, {
          zoneId: v.zoneId,
          zoneName: v.zoneName,
          vehicleCount: 0,
          enRouteCount: 0,
          servicingCount: 0,
          idleCount: 0,
          staleCount: 0,
          darkCount: 0,
          activeDeviationCount: 0,
        });
      }

      const stats = zoneMap.get(v.zoneId)!;
      stats.vehicleCount++;

      // Status counts
      if (v.status === 'en_route') stats.enRouteCount++;
      if (v.status === 'servicing') stats.servicingCount++;
      if (v.status === 'idle') stats.idleCount++;

      // Stale count
      if (v.isStale) stats.staleCount++;

      // Dark count
      const now = Date.now();
      const lastReportedMs = new Date(v.lastReportedAt).getTime();
      if (now - lastReportedMs > DARK_THRESHOLD_MS) {
        stats.darkCount++;
      }
    });

    // Add active deviation counts per zone
    state.value.deviations.forEach((d) => {
      if (d.status === 'active') {
        const stats = zoneMap.get(d.zoneId);
        if (stats) {
          stats.activeDeviationCount++;
        }
      }
    });

    return Array.from(zoneMap.values());
  });

  // ===== ACTIONS =====

  /**
   * Fetch live vehicles and active deviation alerts.
   * On success, updates state and clears isDataUnavailable.
   * On failure, keeps last data but sets isDataUnavailable = true (ERR-030.1).
   * Updates stale flags based on lastReportedAt (BR-020.1).
   */
  async function fetchVehicles(): Promise<void> {
    state.value.loading.vehicles = true;
    state.value.error.vehicles = null;
    try {
      const snapshot = await fleetApi.getLiveVehicles({
        zoneId: state.value.zoneFilter || undefined,
      });

      const now = Date.now();
      const updatedVehicles: LiveVehicle[] = snapshot.liveVehicles.map((v) => {
        const lastReportedMs = new Date(v.lastReportedAt).getTime();
        const oldVehicle = state.value.vehicles.find((ov) => ov.id === v.id);
        const isStale = Boolean(oldVehicle?.isStale) || now - lastReportedMs > STALE_THRESHOLD_MS;

        return {
          ...v,
          isStale,
          staleAcknowledgedAt: oldVehicle?.staleAcknowledgedAt ?? v.staleAcknowledgedAt ?? null,
          staleAcknowledgedBy: oldVehicle?.staleAcknowledgedBy ?? v.staleAcknowledgedBy ?? null,
        };
      });

      state.value.vehicles = updatedVehicles;
      state.value.deviations = snapshot.deviationAlerts;
      state.value.lastUpdatedAt = snapshot.timestamp;
      state.value.isDataUnavailable = false;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      state.value.error.vehicles = error;
      state.value.isDataUnavailable = true;
      // Keep last vehicles data; UI will show "data unavailable" overlay (ERR-030.1).
    } finally {
      state.value.loading.vehicles = false;
    }
  }

  /**
   * Start live polling of vehicles (FR-020, FR-021, FR-022).
   * Uses usePolling with default interval 10s (NFR-001 P95 <= 30s).
   * Automatically pauses/resumes when tab visibility changes.
   * Call stop() to halt polling and cleanup.
   */
  function startLivePolling(): void {
    if (pollingControl) {
      return; // Already polling.
    }

    pollingControl = usePolling(() => fetchVehicles(), {
      intervalMs: 10_000, // 10 s default (NFR-001)
      immediate: true,
      pauseWhenHidden: true,
    });

    pollingControl.start();
  }

  /**
   * Stop live polling and cleanup resources.
   */
  function stopLivePolling(): void {
    if (pollingControl) {
      pollingControl.stop();
      pollingControl = null;
    }
  }

  /**
   * Select a vehicle by ID. Updates selectedVehicleId.
   */
  function selectVehicle(vehicleId: string | null): void {
    state.value.selectedVehicleId = vehicleId;
  }

  /**
   * Fetch position history for the selected vehicle.
   * Implements FR-021 (route auditing).
   */
  async function fetchHistory(vehicleId: string, shiftId?: string): Promise<void> {
    state.value.loading.history = true;
    state.value.error.history = null;
    try {
      const history = await fleetApi.getVehicleHistory(vehicleId, shiftId);
      state.value.history = history;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      state.value.error.history = error;
    } finally {
      state.value.loading.history = false;
    }
  }

  /**
   * Fetch the planned route for the selected vehicle.
   * Implements FR-021.
   */
  async function fetchPlannedRoute(vehicleId: string): Promise<void> {
    state.value.loading.plannedRoute = true;
    state.value.error.plannedRoute = null;
    try {
      const route = await fleetApi.getPlannedRoute(vehicleId);
      state.value.plannedRoute = route;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      state.value.error.plannedRoute = error;
    } finally {
      state.value.loading.plannedRoute = false;
    }
  }

  /**
   * Acknowledge a stale vehicle flag (BR-020.1).
   * Optimistic update: immediately set staleAcknowledgedAt/staleAcknowledgedBy in local state.
   * On error, rollback and expose error.
   *
   * @param vehicleId Vehicle with stale flag
   * @param userId User ID of the supervisor acknowledging
   */
  async function acknowledgeStale(vehicleId: string, userId: string): Promise<void> {
    state.value.loading.acknowledgeStale = true;
    state.value.error.acknowledgeStale = null;

    // Find the vehicle in state
    const vehicleIdx = state.value.vehicles.findIndex((v) => v.id === vehicleId);
    if (vehicleIdx === -1) {
      state.value.error.acknowledgeStale = new Error('Vehicle not found');
      state.value.loading.acknowledgeStale = false;
      return;
    }

    const vehicle = state.value.vehicles[vehicleIdx];
    const backup = { ...vehicle };

    try {
      // Optimistic update
      const now = new Date().toISOString();
      state.value.vehicles[vehicleIdx] = {
        ...vehicle,
        staleAcknowledgedAt: now,
        staleAcknowledgedBy: userId,
      };

      // Persist to server
      const payload: AcknowledgeStalePayload = { vehicleId, acknowledgedBy: userId };
      const updated = await fleetApi.acknowledgeStale(vehicleId, payload);

      // Update with server response
      state.value.vehicles[vehicleIdx] = updated;
    } catch (e) {
      // Rollback on error
      state.value.vehicles[vehicleIdx] = backup;
      const error = e instanceof Error ? e : new Error(String(e));
      state.value.error.acknowledgeStale = error;
    } finally {
      state.value.loading.acknowledgeStale = false;
    }
  }

  /**
   * Fetch route audits with optional filter.
   * Implements FR-021.
   */
  async function fetchAudits(filter: RouteAuditFilter): Promise<void> {
    state.value.loading.audits = true;
    state.value.error.audits = null;
    try {
      const audits = await fleetApi.getRouteAudits(filter);
      state.value.audits = audits;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      state.value.error.audits = error;
    } finally {
      state.value.loading.audits = false;
    }
  }

  /**
   * Fetch a single route audit by ID.
   * Implements FR-021.
   */
  async function fetchAudit(auditId: string): Promise<void> {
    state.value.loading.audits = true;
    state.value.error.audits = null;
    try {
      const audit = await fleetApi.getRouteAudit(auditId);
      state.value.selectedAudit = audit;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      state.value.error.audits = error;
    } finally {
      state.value.loading.audits = false;
    }
  }

  /**
   * Fetch deviation alerts.
   * Implements FR-022.
   */
  async function fetchDeviations(params?: {
    status?: DeviationStatus;
    zoneId?: string;
  }): Promise<void> {
    state.value.loading.deviations = true;
    state.value.error.deviations = null;
    try {
      const deviations = await fleetApi.getDeviationAlerts(
        params as { status?: string; zoneId?: string } | undefined
      );
      state.value.deviations = deviations;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      state.value.error.deviations = error;
    } finally {
      state.value.loading.deviations = false;
    }
  }

  /**
   * Fetch the audit trail for a deviation alert.
   * Implements AC-022.3.
   * Returns DeviationAuditEvent[] (not stored in state; returned directly for detail view).
   */
  async function fetchDeviationTrail(
    alertId: string
  ): Promise<import('@/types/deviationAlert').DeviationAuditEvent[]> {
    try {
      return await fleetApi.getDeviationAuditTrail(alertId);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      state.value.error.deviations = error;
      throw error;
    }
  }

  /**
   * Authorize a deviation alert (FR-022, AC-022.2).
   * Optimistic update: immediately update the alert's status.
   * On error, rollback and expose error.
   *
   * @param alertId Deviation alert ID
   * @param userId User ID of the person authorizing
   * @param note Optional note
   */
  async function authoriseDeviation(alertId: string, userId: string, note?: string): Promise<void> {
    state.value.loading.authoriseDeviation = true;
    state.value.error.authoriseDeviation = null;

    // Find the deviation in state
    const deviationIdx = state.value.deviations.findIndex((d) => d.id === alertId);
    if (deviationIdx === -1) {
      state.value.error.authoriseDeviation = new Error('Deviation alert not found');
      state.value.loading.authoriseDeviation = false;
      return;
    }

    const deviation = state.value.deviations[deviationIdx];
    const backup = { ...deviation };

    try {
      // Optimistic update
      const now = new Date().toISOString();
      state.value.deviations[deviationIdx] = {
        ...deviation,
        status: 'authorised' as DeviationStatus,
        authorisedAt: now,
        authorisedBy: userId,
      };

      // Persist to server
      const payload: AuthoriseDeviationPayload = { alertId, authorisedBy: userId, note };
      const updated = await fleetApi.authoriseDeviation(alertId, payload);

      // Update with server response
      state.value.deviations[deviationIdx] = updated;
    } catch (e) {
      // Rollback on error
      state.value.deviations[deviationIdx] = backup;
      const error = e instanceof Error ? e : new Error(String(e));
      state.value.error.authoriseDeviation = error;
    } finally {
      state.value.loading.authoriseDeviation = false;
    }
  }

  /**
   * Reset all filters to their default state.
   */
  function resetFilters(): void {
    state.value.zoneFilter = null;
    state.value.statusFilter = null;
  }

  // ===== RETURN STATE & ACTIONS =====
  return {
    // State
    state,

    // Computed (getters)
    filteredVehicles,
    staleVehicles,
    darkVehicles,
    pendingAcknowledgments,
    activeDeviations,
    selectedVehicle,
    vehicleCounts,
    zoneStats,

    // Actions
    fetchVehicles,
    startLivePolling,
    stopLivePolling,
    selectVehicle,
    fetchHistory,
    fetchPlannedRoute,
    acknowledgeStale,
    fetchAudits,
    fetchAudit,
    fetchDeviations,
    fetchDeviationTrail,
    authoriseDeviation,
    resetFilters,
  };
});
