<template>
  <div class="app-layout">

    <!-- SIDEBAR -->
    <aside class="sidebar">

      <div class="brand">
        <div class="brand-logo">N</div>

        <div>
          <h2>Nasafisha</h2>
          <span>Cleaning Management</span>
        </div>
      </div>

      <nav class="navigation">

        <router-link to="/dashboard" class="nav-item">
          Dashboard
        </router-link>

        <router-link to="/operations" class="nav-item">
          Operations
        </router-link>

        <router-link to="/fleet" class="nav-item">
          Fleet & Routes
        </router-link>

        <router-link to="/tickets" class="nav-item">
          Tickets
        </router-link>

        <router-link to="/dumping-sites" class="nav-item active">
          Dumping Sites
        </router-link>

        <router-link to="/accounts" class="nav-item">
          Accounts
        </router-link>

      </nav>

      <div class="sidebar-bottom">

        <div class="system-status">
          <span class="status-dot"></span>
          <span>System Online</span>
        </div>

        <button class="logout-button" @click="logout">
          Sign Out
        </button>

      </div>

    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">

      <!-- TOP BAR -->
      <header class="topbar">

        <div>
          <h1>Dumping Sites & Efficiency</h1>

          <p>
            Monitor dumping hotspots and environmental cleaning efficiency.
          </p>
        </div>

        <div class="user-info">

          <span class="role">
            {{ userRole }}
          </span>

          <div class="user-avatar">
            {{ userInitial }}
          </div>

        </div>

      </header>

      <section class="content">

        <!-- FILTER -->
        <div class="filter-panel">

          <div class="filter-group">

            <label>Zone</label>

            <select v-model="selectedZone">

              <option value="All">
                All Zones
              </option>

              <option value="Zone 01">
                Zone 01
              </option>

              <option value="Zone 02">
                Zone 02
              </option>

              <option value="Zone 03">
                Zone 03
              </option>

              <option value="Zone 04">
                Zone 04
              </option>

            </select>

          </div>

          <div class="filter-group">

            <label>Period</label>

            <select v-model="selectedPeriod">

              <option value="Today">
                Today
              </option>

              <option value="This Week">
                This Week
              </option>

              <option value="This Month">
                This Month
              </option>

              <option value="This Year">
                This Year
              </option>

            </select>

          </div>

        </div>

        <!-- KPI CARDS -->
        <div class="kpi-grid">

          <div class="kpi-card">

            <span class="kpi-label">
              Efficiency Index
            </span>

            <strong>--</strong>

            <small>
              Data unavailable
            </small>

          </div>

          <div class="kpi-card">

            <span class="kpi-label">
              Active Hotspots
            </span>

            <strong>--</strong>

            <small>
              Data unavailable
            </small>

          </div>

          <div class="kpi-card">

            <span class="kpi-label">
              Sites Cleared
            </span>

            <strong>--</strong>

            <small>
              Data unavailable
            </small>

          </div>

          <div class="kpi-card">

            <span class="kpi-label">
              Collection Rate
            </span>

            <strong>--</strong>

            <small>
              Data unavailable
            </small>

          </div>

        </div>

        <!-- TREND + BREAKDOWN -->
        <div class="two-column">

          <!-- TREND -->
          <section class="panel">

            <div class="panel-header">

              <div>

                <h2>
                  Efficiency Index Trend
                </h2>

                <p>
                  Cleaning efficiency over time.
                </p>

              </div>

            </div>

            <div class="chart-area">

              <div class="chart-message">

                <div class="chart-icon">
                  EI
                </div>

                <strong>
                  Data unavailable
                </strong>

                <span>
                  Efficiency trend data will appear here
                  when the backend is connected.
                </span>

              </div>

            </div>

          </section>

          <!-- BREAKDOWN -->
          <section class="panel">

            <div class="panel-header">

              <div>

                <h2>
                  Zone Efficiency
                </h2>

                <p>
                  Efficiency breakdown by zone.
                </p>

              </div>

            </div>

            <div class="breakdown">

              <div
                v-for="zone in zones"
                :key="zone"
                class="zone-row"
              >

                <div class="zone-name">
                  {{ zone }}
                </div>

                <div class="progress">

                  <div class="progress-bar"></div>

                </div>

                <span class="zone-value">
                  --
                </span>

              </div>

              <div class="unavailable-text">
                Data unavailable
              </div>

            </div>

          </section>

        </div>

        <!-- HOTSPOT REGISTER -->
        <section class="panel">

          <div class="panel-header">

            <div>

              <h2>
                Dumping Hotspot Register
              </h2>

              <p>
                Monitor known illegal dumping and waste accumulation sites.
              </p>

            </div>

            <button class="refresh-button">
              Refresh
            </button>

          </div>

          <div class="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Site ID
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Zone
                  </th>

                  <th>
                    Risk Level
                  </th>

                  <th>
                    Last Cleared
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td
                    colspan="7"
                    class="unavailable"
                  >

                    <strong>
                      Data unavailable
                    </strong>

                    <span>
                      Dumping site information will appear here
                      when the backend is connected.
                    </span>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </section>

        <!-- SITE SUMMARY -->
        <div class="summary-grid">

          <div class="summary-card">

            <span>
              High Risk Sites
            </span>

            <strong>
              --
            </strong>

          </div>

          <div class="summary-card">

            <span>
              Sites Requiring Attention
            </span>

            <strong>
              --
            </strong>

          </div>

          <div class="summary-card">

            <span>
              Cleared This Period
            </span>

            <strong>
              --
            </strong>

          </div>

        </div>

        <!-- BACKEND NOTICE -->
        <div class="backend-notice">

          <strong>
            Backend connection
          </strong>

          <span>
            Dumping site and Efficiency Index information is currently
            unavailable because the backend/database connection has not
            yet been connected to this screen.
          </span>

        </div>

      </section>

    </main>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedZone = ref('All')
const selectedPeriod = ref('Today')

const zones = [
  'Zone 01',
  'Zone 02',
  'Zone 03',
  'Zone 04'
]

const userRole =
  localStorage.getItem('nasafisha_user_role') || 'Executive'

const userInitial = computed(() => {
  return userRole.charAt(0).toUpperCase()
})

const logout = () => {
  localStorage.removeItem('nasafisha_logged_in')
  localStorage.removeItem('nasafisha_user_role')

  router.push('/login')
}
</script>

<style scoped>

* {
  box-sizing: border-box;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  background: #f1f5f9;
  font-family: Arial, sans-serif;
  color: #0f172a;
}

/* SIDEBAR */

.sidebar {
  width: 250px;
  min-height: 100vh;
  background: #0f172a;
  color: white;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
  margin-bottom: 34px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #0f766e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
}

.brand h2 {
  margin: 0;
  font-size: 18px;
}

.brand span {
  font-size: 11px;
  color: #94a3b8;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.nav-item {
  padding: 12px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: #cbd5e1;
  font-size: 14px;
  transition: 0.2s;
}

.nav-item:hover {
  background: #1e293b;
  color: white;
}

.nav-item.active {
  background: #0f766e;
  color: white;
}

.sidebar-bottom {
  margin-top: auto;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  margin-bottom: 10px;
  color: #94a3b8;
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
}

.logout-button {
  width: 100%;
  padding: 11px;
  border: 1px solid #334155;
  background: transparent;
  color: #cbd5e1;
  border-radius: 7px;
  cursor: pointer;
}

.logout-button:hover {
  background: #1e293b;
}

/* MAIN */

.main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
  min-height: 100vh;
}

.topbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar h1 {
  margin: 0 0 6px;
  font-size: 26px;
}

.topbar p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role {
  font-size: 13px;
  color: #475569;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #0f766e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* CONTENT */

.content {
  padding: 28px 32px;
}

/* FILTER */

.filter-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 22px;
}

.filter-group label {
  display: block;
  font-size: 12px;
  font-weight: bold;
  color: #475569;
  margin-bottom: 7px;
}

.filter-group select {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: white;
  color: #334155;
}

/* KPI */

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 22px;
}

.kpi-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.kpi-label {
  display: block;
  color: #64748b;
  font-size: 13px;
  margin-bottom: 10px;
}

.kpi-card strong {
  display: block;
  font-size: 28px;
  margin-bottom: 6px;
}

.kpi-card small {
  color: #94a3b8;
  font-size: 12px;
}

/* PANELS */

.panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 22px;
  overflow: hidden;
}

.panel-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h2 {
  margin: 0 0 5px;
  font-size: 17px;
}

.panel-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

/* CHART */

.chart-area {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-message {
  text-align: center;
  max-width: 300px;
}

.chart-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 14px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.chart-message strong {
  display: block;
  margin-bottom: 7px;
}

.chart-message span {
  display: block;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
}

/* BREAKDOWN */

.breakdown {
  padding: 25px;
}

.zone-row {
  display: grid;
  grid-template-columns: 70px 1fr 30px;
  gap: 12px;
  align-items: center;
  margin-bottom: 22px;
}

.zone-name {
  font-size: 12px;
  color: #475569;
}

.progress {
  height: 8px;
  border-radius: 20px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar {
  width: 0%;
  height: 100%;
  background: #0f766e;
}

.zone-value {
  color: #94a3b8;
  font-size: 12px;
}

.unavailable-text {
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
  margin-top: 10px;
}

/* TABLE */

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  text-align: left;
  padding: 13px 16px;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 15px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
}

.unavailable {
  text-align: center;
  padding: 45px 20px;
}

.unavailable strong {
  display: block;
  color: #475569;
  margin-bottom: 6px;
}

.unavailable span {
  color: #94a3b8;
  font-size: 12px;
}

.refresh-button {
  border: 1px solid #cbd5e1;
  background: white;
  padding: 9px 15px;
  border-radius: 7px;
  cursor: pointer;
}

.refresh-button:hover {
  background: #f8fafc;
}

/* SUMMARY */

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 22px;
}

.summary-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.summary-card span {
  display: block;
  color: #64748b;
  font-size: 13px;
  margin-bottom: 10px;
}

.summary-card strong {
  font-size: 25px;
}

/* BACKEND NOTICE */

.backend-notice {
  padding: 16px 18px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 9px;
  margin-bottom: 20px;
}

.backend-notice strong {
  display: block;
  margin-bottom: 5px;
  color: #92400e;
  font-size: 13px;
}

.backend-notice span {
  color: #a16207;
  font-size: 12px;
  line-height: 1.5;
}

/* RESPONSIVE */

@media (max-width: 1000px) {

  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .two-column {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 750px) {

  .sidebar {
    width: 210px;
  }

  .main-content {
    margin-left: 210px;
    width: calc(100% - 210px);
  }

  .topbar,
  .content {
    padding: 20px;
  }

}

@media (max-width: 600px) {

  .sidebar {
    position: static;
    width: 100%;
    min-height: auto;
  }

  .app-layout {
    display: block;
  }

  .main-content {
    margin-left: 0;
    width: 100%;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .filter-panel {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

}

</style>