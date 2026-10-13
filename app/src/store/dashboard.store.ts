import { ref } from "vue";
import type { DashboardData } from "../api/dashboard.api";
import { getDashboardData } from "../api/dashboard.api";

const dashboardData = ref<DashboardData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export async function loadDashboard() {
    loading.value = true;
    error.value = null;

    try {
        dashboardData.value = await getDashboardData();
    } catch (err) {
        error.value =
            err instanceof Error
                ? err.message
                : "Unable to load dashboard data";
    } finally {
        loading.value = false;
    }
}

export function useDashboardStore() {
    return {
        dashboardData,
        loading,
        error,
        loadDashboard,
    };
}
