export interface EfficiencyIndex {
    zoneId: string;
    zoneName: string;
    score: number;
    collectionEfficiency: number;
    routeEfficiency: number;
    responseEfficiency: number;
    cleanlinessScore: number;
    trend: "up" | "down" | "stable";
    calculatedAt: string;
}
