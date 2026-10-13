import type { DumpingSite } from "../types/dumpingSite";

const API_URL = "http://localhost:3000";

export async function getDumpingSites(): Promise<DumpingSite[]> {
    const response = await fetch(`${API_URL}/dumping-sites`);

    if (!response.ok) {
        throw new Error("Failed to load dumping sites");
    }

    return response.json();
}

export async function getDumpingSite(id: string): Promise<DumpingSite> {
    const response = await fetch(`${API_URL}/dumping-sites/${id}`);

    if (!response.ok) {
        throw new Error("Failed to load dumping site");
    }

    return response.json();
}
