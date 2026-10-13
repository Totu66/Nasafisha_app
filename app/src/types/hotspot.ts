export interface Hotspot {
    id: string;
    name: string;
    zoneId: string;
    zoneName?: string;
    latitude: number;
    longitude: number;
    incidentCount: number;
    severity: "low" | "medium" | "high" | "critical";
    status?: "open" | "resolved";
}
