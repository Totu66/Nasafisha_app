export interface DumpingSite {
    id: string;
    name: string;
    zoneId: string;
    zoneName?: string;
    location: string;
    latitude: number;
    longitude: number;
    status: "active" | "inactive" | "closed";
    wasteLevel: "low" | "medium" | "high" | "critical";
    lastInspection?: string;
    description?: string;
}
