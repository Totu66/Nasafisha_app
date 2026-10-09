/**
 * Types for Contractor Portal (Post-MVP PRD F-004)
 * Contractor Performance Ledger & Shared Evidenced Standard
 */

export type SLAOutcome = 'MET' | 'BREACHED' | 'WARNING';

export type IssueCategory =
  | 'missed-collection'
  | 'illegal-dumping'
  | 'overflowing-bin'
  | 'blocked-drain'
  | 'hazardous-waste';

export interface ContractorProfile {
  id: string;
  name: string;
  contractCode: string;
  assignedZone: string;
  franchiseArea: string;
  activeSlaTarget: number; // e.g. 95%
  contractStartDate: string;
  contractEndDate: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  vehicleFleetSize: number;
}

export interface ScorecardMetrics {
  complianceRate: number;       // e.g. 96.4%
  targetComplianceRate: number; // e.g. 95.0%
  complianceDelta: number;      // e.g. +1.4%
  mttrHours: number;            // Mean Time to Resolution: 3.2 hrs
  mttrTargetHours: number;      // Target: 4.0 hrs
  firstTimeFixRate: number;     // e.g. 98.2%
  totalTicketsResolved: number; // e.g. 142
  slaBreachesCount: number;     // e.g. 5
  activeVehiclesTracked: number;
  totalVolumeTonnes: number;
}

export interface WeeklyTrendPoint {
  day: string;
  date: string;
  complianceRate: number;
  targetRate: number;
  resolvedCount: number;
  breachedCount: number;
}

export interface EvidenceTicket {
  id: string;
  referenceNumber: string;        // e.g. "NSF-2026-0842"
  zone: string;                   // e.g. "Nakuru East — Section 58"
  issueCategory: IssueCategory;
  reportedAt: string;
  resolvedAt: string;
  slaTargetHours: number;         // Max allowed window (e.g. 4.0 hrs)
  actualDurationHours: number;    // Elapsed resolution time
  slaOutcome: SLAOutcome;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
    address: string;
    distanceMeters: number;       // Distance between report GPS & after photo GPS (<= 50m FR-013)
  };
  crewName: string;
  crewBadge: string;
  vehiclePlate: string;
  supervisorName: string;
  supervisorVerified: boolean;
  notes: string;
}

export interface EvidenceLedgerFilter {
  search?: string;
  outcome?: SLAOutcome | 'ALL';
  issueCategory?: IssueCategory | 'ALL';
  dateRange?: '7d' | '30d' | '90d' | 'all';
}
