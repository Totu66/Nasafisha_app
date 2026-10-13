import { defineStore } from 'pinia';
import { ref } from 'vue';
import reportsApi from '../api/reports.api';
import type { Report, CreateReportPayload } from '../types/report';

export const useReportsStore = defineStore('reports', () => {
  const reports = ref<Report[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadMine() {
    isLoading.value = true;
    error.value = null;
    try {
      reports.value = await reportsApi.list();
    } catch {
      error.value = 'Could not load reports.';
    } finally {
      isLoading.value = false;
    }
  }

  async function submit(payload: CreateReportPayload): Promise<Report | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const report = await reportsApi.create(payload);
      reports.value.unshift(report);
      return report;
    } catch {
      error.value = 'Could not submit report.';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return { reports, isLoading, error, loadMine, submit };
});
