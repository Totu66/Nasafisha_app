<template>
  <div class="command-center">
    <header class="page-header">
      <div>
        <h1>Command Center</h1>
        <p>County-wide environmental cleaning operations overview.</p>
      </div>

      <ExportButton
        :data="exportData"
        filename="command-center-report.csv"
      />
    </header>

    <div v-if="loading" class="state-message">
      Loading dashboard data...
    </div>

    <div v-else-if="error" class="state-message error">
      {{ error }}
    </div>

    <template v-else>
      <section class="kpi-grid">
        <article class="kpi-card">
          <span>Total Zones</span>
          <strong>{{ dashboardData?.summary.totalZones ?? 0 }}</strong>
        </article>

        <article class="kpi-card">
          <span>Active Vehicles</span>
          <strong>{{ dashboardData?.summary.activeVehicles ?? 0 }}</strong>
        </article>

        <article class="kpi-card">
          <span>Pending Tickets</span>
          <strong>{{ dashboardData?.summary.pendingTickets ?? 0 }}</strong>
        </article>

        <article class="kpi-card">
          <span>Cleanliness Score</span>
          <strong>
            {{ dashboardData?.summary.cleanlinessScore ?? 0 }}%
          </strong>
        </article>
      </section>

      <section class="content-grid">
        <article class="panel">
          <div class="panel-header">
            <h2>Zones</h2>
            <span>{{ dashboardData?.zones.length ?? 0 }} zones</span>
          </div>

          <div v-if="dashboardData?.zones.length" class="zone-list">
            <div
              v-for="zone in dashboardData.zones"
              :key="zone.id"
              class="zone-item"
            >
              <div>
                <strong>{{ zone.name }}</strong>
                <small>
                  {{ zone.municipality || 'Municipality not specified' }}
                </small>
              </div>

              <span
                class="status"
                :class="zone.status || 'active'"
              >
                {{ zone.status || 'active' }}
              </span>
            </div>
          </div>

          <p v-else class="empty-state">
            No zone data available.
          </p>
        </article>

        <article class="panel">
          <div class="panel-header">
            <h2>Dumping Hotspots</h2>
            <span>{{ dashboardData?.hotspots.length ?? 0 }}</span>
          </div>

          <div
            v-if="dashboardData?.hotspots.length"
            class="hotspot-list"
          >
            <div
              v-for="hotspot in dashboardData.hotspots"
              :key="hotspot.id"
              class="hotspot-item"
            >
              <div>
                <strong>{{ hotspot.name }}</strong>
                <small>
                  {{ hotspot.incidentCount }} incidents
                </small>
              </div>

              <span
                class="severity"
                :class="hotspot.severity"
              >
                {{ hotspot.severity }}
              </span>
            </div>
          </div>

          <p v-else class="empty-state">
            No hotspot data available.
          </p>
        </article>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import ExportButton from '../../components/dashboard/ExportButton.vue'
import { useDashboardStore } from '../../store/dashboard.store'

const {
  dashboardData,
  loading,
  error,
  loadDashboard
} = useDashboardStore()

const exportData = computed(() => {
  if (!dashboardData.value) {
    return []
  }

  return dashboardData.value.zones.map((zone) => ({
    Zone: zone.name,
    Municipality: zone.municipality || '',
    Status: zone.status || ''
  }))
})

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
.command-center {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
}

.page-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  padding: 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.kpi-card span {
  display: block;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 8px;
}

.kpi-card strong {
  font-size: 28px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
}

.panel-header span {
  color: #64748b;
  font-size: 14px;
}

.zone-list,
.hotspot-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zone-item,
.hotspot-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.zone-item strong,
.hotspot-item strong {
  display: block;
}

.zone-item small,
.hotspot-item small {
  display: block;
  margin-top: 4px;
  color: #64748b;
}

.status,
.severity {
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.status.active {
  background: #dcfce7;
  color: #166534;
}

.status.inactive {
  background: #fef3c7;
  color: #92400e;
}

.severity.low {
  background: #dcfce7;
  color: #166534;
}

.severity.medium {
  background: #fef3c7;
  color: #92400e;
}

.severity.high,
.severity.critical {
  background: #fee2e2;
  color: #991b1b;
}

.state-message,
.empty-state {
  padding: 24px;
  text-align: center;
  color: #64748b;
}

.state-message.error {
  color: #b91c1c;
}

@media (max-width: 900px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .command-center {
    padding: 16px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>