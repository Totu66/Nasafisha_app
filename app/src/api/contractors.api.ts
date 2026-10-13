import { api } from './http';
import type { ApiResponse } from '../types/api';
import type {
  ContractorProfile,
  ScorecardMetrics,
  WeeklyTrendPoint,
  EvidenceTicket,
  EvidenceLedgerFilter,
} from '../types/contractor';

// Mock Profile for Nakuru Franchise Operator
const MOCK_PROFILE: ContractorProfile = {
  id: 'CNT-NK-003',
  name: 'Nakuru Green Clean Franchise Ltd',
  contractCode: 'FRAN-2025/2027-E03',
  assignedZone: 'Zone E — Nakuru East & Section 58',
  franchiseArea: 'Nakuru East Sub-County',
  activeSlaTarget: 95.0,
  contractStartDate: '2025-01-01',
  contractEndDate: '2027-12-31',
  contactPerson: 'Winfred Njeri',
  contactEmail: 'winfred.njeri@nakurugreenclean.co.ke',
  contactPhone: '+254 722 987 654',
  vehicleFleetSize: 8,
};

// Mock Scorecard Metrics
const MOCK_METRICS: ScorecardMetrics = {
  complianceRate: 96.4,
  targetComplianceRate: 95.0,
  complianceDelta: 1.4,
  mttrHours: 3.2,
  mttrTargetHours: 4.0,
  firstTimeFixRate: 98.2,
  totalTicketsResolved: 142,
  slaBreachesCount: 5,
  activeVehiclesTracked: 7,
  totalVolumeTonnes: 184.6,
};

// Mock Weekly Trend (Monday to Sunday)
const MOCK_WEEKLY_TREND: WeeklyTrendPoint[] = [
  { day: 'Mon', date: '2026-10-01', complianceRate: 97.2, targetRate: 95.0, resolvedCount: 22, breachedCount: 0 },
  { day: 'Tue', date: '2026-10-02', complianceRate: 95.8, targetRate: 95.0, resolvedCount: 24, breachedCount: 1 },
  { day: 'Wed', date: '2026-10-03', complianceRate: 94.1, targetRate: 95.0, resolvedCount: 19, breachedCount: 2 },
  { day: 'Thu', date: '2026-10-04', complianceRate: 96.5, targetRate: 95.0, resolvedCount: 26, breachedCount: 1 },
  { day: 'Fri', date: '2026-10-05', complianceRate: 98.0, targetRate: 95.0, resolvedCount: 25, breachedCount: 0 },
  { day: 'Sat', date: '2026-10-06', complianceRate: 95.5, targetRate: 95.0, resolvedCount: 15, breachedCount: 1 },
  { day: 'Sun', date: '2026-10-07', complianceRate: 97.8, targetRate: 95.0, resolvedCount: 11, breachedCount: 0 },
];

// Mock Evidence Tickets with Before/After photographic proof
const MOCK_EVIDENCE_TICKETS: EvidenceTicket[] = [
  {
    id: 'tkt_001',
    referenceNumber: 'NSF-2026-0842',
    zone: 'Nakuru East — Section 58 Market',
    issueCategory: 'illegal-dumping',
    reportedAt: '2026-10-07 08:15 EAT',
    resolvedAt: '2026-10-07 10:45 EAT',
    slaTargetHours: 4.0,
    actualDurationHours: 2.5,
    slaOutcome: 'MET',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
    gpsCoordinates: {
      lat: -0.2831,
      lng: 36.0682,
      address: 'Plot 44, Section 58 Commercial strip, Nakuru',
      distanceMeters: 14,
    },
    crewName: 'Crew Alpha (Kamau / Ochieng)',
    crewBadge: 'FLD-2026-12',
    vehiclePlate: 'KDG 482M (Compactor 3)',
    supervisorName: 'David Kiptoo (Supervisor)',
    supervisorVerified: true,
    notes: 'Commercial market accumulation removed. 1.8 tonnes hauled to Gioto dumpsite. Area swept and sanitized.',
  },
  {
    id: 'tkt_002',
    referenceNumber: 'NSF-2026-0839',
    zone: 'Nakuru East — Free Area / Bondeni Junction',
    issueCategory: 'overflowing-bin',
    reportedAt: '2026-10-07 07:30 EAT',
    resolvedAt: '2026-10-07 09:50 EAT',
    slaTargetHours: 4.0,
    actualDurationHours: 2.3,
    slaOutcome: 'MET',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    gpsCoordinates: {
      lat: -0.2878,
      lng: 36.0715,
      address: 'Main Stage transit hub bin cluster',
      distanceMeters: 8,
    },
    crewName: 'Crew Bravo (Mutua / Njoroge)',
    crewBadge: 'FLD-2026-18',
    vehiclePlate: 'KDF 219B (Side-loader 2)',
    supervisorName: 'David Kiptoo (Supervisor)',
    supervisorVerified: true,
    notes: 'Three 240L municipal bins emptied and replaced with clean liners. Surrounding litter raked.',
  },
  {
    id: 'tkt_003',
    referenceNumber: 'NSF-2026-0824',
    zone: 'Nakuru East — Hyrax Hill Access Road',
    issueCategory: 'missed-collection',
    reportedAt: '2026-10-06 14:00 EAT',
    resolvedAt: '2026-10-06 19:30 EAT',
    slaTargetHours: 4.0,
    actualDurationHours: 5.5,
    slaOutcome: 'BREACHED',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1611288875785-5b8782a2e85a?auto=format&fit=crop&w=600&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
    gpsCoordinates: {
      lat: -0.2792,
      lng: 36.0894,
      address: 'Hyrax Hill Gate B residential line',
      distanceMeters: 22,
    },
    crewName: 'Crew Gamma (Chebet / Waweru)',
    crewBadge: 'FLD-2026-09',
    vehiclePlate: 'KDJ 710K (Tipper 1)',
    supervisorName: 'David Kiptoo (Supervisor)',
    supervisorVerified: true,
    notes: 'Delay caused by heavy downpour and road blockage. Route completed late with 1.5h SLA breach logged.',
  },
  {
    id: 'tkt_004',
    referenceNumber: 'NSF-2026-0811',
    zone: 'Nakuru East — Lanet Ward Center',
    issueCategory: 'blocked-drain',
    reportedAt: '2026-10-06 09:10 EAT',
    resolvedAt: '2026-10-06 12:40 EAT',
    slaTargetHours: 4.0,
    actualDurationHours: 3.5,
    slaOutcome: 'MET',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    gpsCoordinates: {
      lat: -0.2921,
      lng: 36.1154,
      address: 'Lanet culvert outlet #3',
      distanceMeters: 6,
    },
    crewName: 'Crew Alpha (Kamau / Ochieng)',
    crewBadge: 'FLD-2026-12',
    vehiclePlate: 'KDG 482M (Compactor 3)',
    supervisorName: 'Grace Achieng (Lead Inspector)',
    supervisorVerified: true,
    notes: 'Organic waste and plastic buildup unblocked. Water flow restored into municipal retention trench.',
  },
  {
    id: 'tkt_005',
    referenceNumber: 'NSF-2026-0795',
    zone: 'Nakuru East — Section 58 Phase II',
    issueCategory: 'illegal-dumping',
    reportedAt: '2026-10-05 11:20 EAT',
    resolvedAt: '2026-10-05 15:10 EAT',
    slaTargetHours: 4.0,
    actualDurationHours: 3.8,
    slaOutcome: 'WARNING',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
    gpsCoordinates: {
      lat: -0.2815,
      lng: 36.0741,
      address: 'Corner of Acacia & Baobab Ave',
      distanceMeters: 38,
    },
    crewName: 'Crew Bravo (Mutua / Njoroge)',
    crewBadge: 'FLD-2026-18',
    vehiclePlate: 'KDF 219B (Side-loader 2)',
    supervisorName: 'David Kiptoo (Supervisor)',
    supervisorVerified: true,
    notes: 'Cleared within 12 minutes of SLA expiry deadline. Geolocation within permissible 50m tolerance.',
  },
];

export const contractorsApi = {
  /**
   * Fetch current contractor profile
   */
  async getProfile(): Promise<ApiResponse<ContractorProfile>> {
    try {
      return await api.get<ContractorProfile>('/contractor/profile');
    } catch {
      return {
        success: true,
        data: MOCK_PROFILE,
        message: 'Contractor profile retrieved',
      };
    }
  },

  /**
   * Fetch KPI scorecard figures
   */
  async getScorecard(): Promise<ApiResponse<ScorecardMetrics>> {
    try {
      return await api.get<ScorecardMetrics>('/contractor/scorecard');
    } catch {
      return {
        success: true,
        data: MOCK_METRICS,
        message: 'Scorecard metrics loaded',
      };
    }
  },

  /**
   * Fetch weekly compliance trend data points
   */
  async getWeeklyTrend(): Promise<ApiResponse<WeeklyTrendPoint[]>> {
    try {
      return await api.get<WeeklyTrendPoint[]>('/contractor/weekly-trend');
    } catch {
      return {
        success: true,
        data: MOCK_WEEKLY_TREND,
        message: 'Weekly compliance trend loaded',
      };
    }
  },

  /**
   * Fetch evidence ledger with optional filtering
   */
  async getEvidenceLedger(filters?: EvidenceLedgerFilter): Promise<ApiResponse<EvidenceTicket[]>> {
    try {
      return await api.get<EvidenceTicket[]>('/contractor/evidence-ledger', { params: filters });
    } catch {
      let filtered = [...MOCK_EVIDENCE_TICKETS];
      if (filters?.outcome && filters.outcome !== 'ALL') {
        filtered = filtered.filter((t) => t.slaOutcome === filters.outcome);
      }
      if (filters?.issueCategory && filters.issueCategory !== 'ALL') {
        filtered = filtered.filter((t) => t.issueCategory === filters.issueCategory);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.referenceNumber.toLowerCase().includes(q) ||
            t.zone.toLowerCase().includes(q) ||
            t.notes.toLowerCase().includes(q)
        );
      }
      return {
        success: true,
        data: filtered,
        message: `Found ${filtered.length} evidence records`,
      };
    }
  },

  /**
   * Fetch specific ticket proof audit details
   */
  async getTicketProof(id: string): Promise<ApiResponse<EvidenceTicket>> {
    try {
      return await api.get<EvidenceTicket>(`/contractor/evidence/${id}`);
    } catch {
      const found = MOCK_EVIDENCE_TICKETS.find((t) => t.id === id || t.referenceNumber === id);
      if (found) {
        return {
          success: true,
          data: found,
          message: 'Evidence proof record loaded',
        };
      }
      throw {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Evidence ticket not found' },
      };
    }
  },
};

export default contractorsApi;
