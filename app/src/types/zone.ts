export interface Zone {
    id: string;
    name: string;
    municipality?: string;
    status?: "active" | "inactive";
}
