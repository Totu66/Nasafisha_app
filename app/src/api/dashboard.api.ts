import type { EfficiencyIndex } from "../types/efficiencyIndex";
import type { Hotspot } from "../types/hotspot";
import type { Zone } from "../types/zone";

const API_URL = "http://localhost:3000";

export interface DashboardSummary {
    totalZones: number;
    activeVehicles: number;
    pendingTickets: number;
    cleanlinessScore: number;
}

export interface DashboardData {
    summary: DashboardSummary;
    zones: Zone[];
    hotspots: Hotspot[];
    efficiencyIndex: EfficiencyIndex[];
}

export async function getDashboardData(): Promise<DashboardData> {
    const response = await fetch(`${API_URL}/dashboard`);

    if (!response.ok) {
        throw new Error("Failed to load dashboard data");
    }

    return response.json();
}
