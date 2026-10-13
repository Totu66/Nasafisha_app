<template>
  <div class="dashboard">

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
        <p class="nav-title">MAIN MENU</p>

        <router-link to="/dashboard" class="nav-item active">
          <span class="nav-icon">▣</span>
          <span>Executive Dashboard</span>
        </router-link>

        <router-link to="/operations" class="nav-item">
          <span class="nav-icon">◈</span>
          <span>Operations</span>
        </router-link>

        <router-link to="/fleet" class="nav-item">
          <span class="nav-icon">◆</span>
          <span>Fleet & Routes</span>
        </router-link>

        <router-link to="/accounts" class="nav-item">
          <span class="nav-icon">●</span>
          <span>Accounts</span>
        </router-link>

        <p class="nav-title second">SYSTEM</p>

        <a href="#" class="nav-item">
          <span class="nav-icon">⚙</span>
          <span>Settings</span>
        </a>
      </nav>

      <div class="sidebar-bottom">
        <div class="system-status">
          <span class="status-dot"></span>
          <div>
            <strong>System Online</strong>
            <small>Nasafisha platform</small>
          </div>
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
          <p class="breadcrumb">Home / Executive Dashboard</p>
          <h1>Executive Dashboard</h1>
        </div>

        <div class="topbar-right">
          <div class="date-box">
            <span class="date-label">Today</span>
            <strong>{{ currentDate }}</strong>
          </div>

          <div class="user-profile">
            <div class="avatar">E</div>
            <div>
              <strong>Executive</strong>
              <span>County Administrator</span>
            </div>
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT -->
      <section class="content">

        <!-- INTRO -->
        <div class="intro-section">
          <div>
            <h2>County Overview</h2>
            <p>
              Monitor cleaning operations, fleet performance and service
              delivery across the county.
            </p>
          </div>

          <div class="municipality-selector">
            <label for="municipality">Municipality</label>
            <select id="municipality" v-model="selectedMunicipality">
              <option>All Municipalities</option>
              <option>Municipality A</option>
              <option>Municipality B</option>
              <option>Municipality C</option>
            </select>
          </div>
        </div>

        <!-- KPI CARDS -->
        <div class="kpi-grid">

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Cleaning Zones</span>
              <div class="kpi-icon blue">Z</div>
            </div>

            <div class="kpi-value">--</div>

            <div class="kpi-footer">
              <span class="neutral">Data unavailable</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Active Vehicles</span>
              <div class="kpi-icon green">V</div>
            </div>

            <div class="kpi-value">--</div>

            <div class="kpi-footer">
              <span class="neutral">Data unavailable</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Open Tickets</span>
              <div class="kpi-icon orange">T</div>
            </div>

            <div class="kpi-value">--</div>

            <div class="kpi-footer">
              <span class="neutral">Data unavailable</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Efficiency Index</span>
              <div class="kpi-icon purple">E</div>
            </div>

            <div class="kpi-value">--</div>

            <div class="kpi-footer">
              <span class="neutral">Data unavailable</span>
            </div>
          </div>

        </div>

        <!-- MAIN GRID -->
        <div class="dashboard-grid">

          <!-- MUNICIPALITY PERFORMANCE -->
          <section class="panel large-panel">
            <div class="panel-header">
              <div>
                <h3>Municipality Performance</h3>
                <p>Cleaning service performance overview</p>
              </div>

              <button class="view-button" @click="goToOperations">
                View Operations
              </button>
            </div>

            <div class="empty-state">
              <div class="empty-icon">▣</div>
              <h4>Data unavailable</h4>
              <p>
                Municipality performance data will appear here once the
                operations data source is connected.
              </p>
            </div>
          </section>

          <!-- SYSTEM STATUS -->
          <section class="panel">
            <div class="panel-header">
              <div>
                <h3>System Status</h3>
                <p>Platform service health</p>
              </div>
            </div>

            <div class="status-list">

              <div class="status-row">
                <div class="status-name">
                  <span class="service-dot unavailable"></span>
                  <span>Operations Data</span>
                </div>
                <span class="status-text unavailable-text">
                  Unavailable
                </span>
              </div>

              <div class="status-row">
                <div class="status-name">
                  <span class="service-dot unavailable"></span>
                  <span>Fleet Data</span>
                </div>
                <span class="status-text unavailable-text">
                  Unavailable
                </span>
              </div>

              <div class="status-row">
                <div class="status-name">
                  <span class="service-dot unavailable"></span>
                  <span>Ticket Data</span>
                </div>
                <span class="status-text unavailable-text">
                  Unavailable
                </span>
              </div>

              <div class="status-row">
                <div class="status-name">
                  <span class="service-dot unavailable"></span>
                  <span>Database</span>
                </div>
                <span class="status-text unavailable-text">
                  Not connected
                </span>
              </div>

            </div>
          </section>

        </div>

        <!-- LOWER GRID -->
        <div class="dashboard-grid lower-grid">

          <!-- ATTENTION LIST -->
          <section class="panel">
            <div class="panel-header">
              <div>
                <h3>Attention Required</h3>
                <p>Issues requiring executive attention</p>
              </div>

              <span class="count-badge">0</span>
            </div>

            <div class="empty-state compact">
              <div class="empty-icon">!</div>
              <h4>No data available</h4>
              <p>
                Alerts and operational exceptions will appear here.
              </p>
            </div>
          </section>

          <!-- RECENT ACTIVITY -->
          <section class="panel">
            <div class="panel-header">
              <div>
                <h3>Recent Activity</h3>
                <p>Latest system activity</p>
              </div>
            </div>

            <div class="empty-state compact">
              <div class="empty-icon">↻</div>
              <h4>No recent activity</h4>
              <p>
                Recent operational activity will appear once the backend
                is connected.
              </p>
            </div>
          </section>

        </div>

        <!-- INFORMATION NOTICE -->
        <div class="info-notice">
          <div class="info-icon">i</div>
          <div>
            <strong>Dashboard data connection</strong>
            <p>
              The dashboard interface is ready. Live municipality,
              operations, fleet and ticket information will be loaded
              from the Nasafisha backend.
            </p>
          </div>
        </div>

      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedMunicipality = ref('All Municipalities')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-KE', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

const goToOperations = () => {
  router.push('/operations')
}

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

.dashboard {
  min-height: 100vh;
  display: flex;
  background: #f5f7fa;
  color: #172033;
  font-family: Arial, Helvetica, sans-serif;
}

/* SIDEBAR */

.sidebar {
  width: 260px;
  min-height: 100vh;
  background: #0f172a;
  color: white;
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
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #0f766e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
}

.brand h2 {
  margin: 0;
  font-size: 19px;
}

.brand span {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: 11px;
}

.navigation {
  padding: 24px 14px;
  flex: 1;
}

.nav-title {
  margin: 0 10px 10px;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}

.nav-title.second {
  margin-top: 28px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  margin-bottom: 5px;
  border-radius: 8px;
  color: #cbd5e1;
  text-decoration: none;
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

.nav-icon {
  width: 20px;
  text-align: center;
  font-weight: bold;
}

.sidebar-bottom {
  padding: 18px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.system-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
}

.system-status strong {
  display: block;
  font-size: 12px;
}

.system-status small {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: 10px;
}

.logout-button {
  width: 100%;
  padding: 10px;
  border: 1px solid #334155;
  border-radius: 7px;
  background: transparent;
  color: #cbd5e1;
  cursor: pointer;
}

.logout-button:hover {
  background: #1e293b;
}

/* MAIN */

.main-content {
  width: calc(100% - 260px);
  margin-left: 260px;
}

.topbar {
  min-height: 90px;
  padding: 20px 32px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb {
  margin: 0 0 6px;
  color: #94a3b8;
  font-size: 12px;
}

.topbar h1 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.date-box {
  text-align: right;
}

.date-label {
  display: block;
  color: #94a3b8;
  font-size: 11px;
}

.date-box strong {
  font-size: 13px;
  color: #334155;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 20px;
  border-left: 1px solid #e2e8f0;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ccfbf1;
  color: #0f766e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.user-profile strong {
  display: block;
  font-size: 13px;
}

.user-profile span {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: 10px;
}

/* CONTENT */

.content {
  padding: 30px 32px;
}

.intro-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.intro-section h2 {
  margin: 0 0 7px;
  font-size: 19px;
}

.intro-section p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.municipality-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.municipality-selector label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
}

.municipality-selector select {
  min-width: 190px;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: white;
  color: #334155;
  outline: none;
}

/* KPI */

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 20px;
}

.kpi-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 7px rgba(15, 23, 42, 0.03);
}

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-label {
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.kpi-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.kpi-icon.blue {
  background: #dbeafe;
  color: #2563eb;
}

.kpi-icon.green {
  background: #dcfce7;
  color: #15803d;
}

.kpi-icon.orange {
  background: #ffedd5;
  color: #c2410c;
}

.kpi-icon.purple {
  background: #f3e8ff;
  color: #7e22ce;
}

.kpi-value {
  margin: 18px 0 10px;
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
}

.kpi-footer {
  font-size: 11px;
}

.neutral {
  color: #94a3b8;
}

/* PANELS */

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.lower-grid {
  grid-template-columns: 1fr 1fr;
}

.panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  min-height: 260px;
}

.large-panel {
  min-height: 330px;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header h3 {
  margin: 0;
  color: #172033;
  font-size: 15px;
}

.panel-header p {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 11px;
}

.view-button {
  border: 1px solid #0f766e;
  background: white;
  color: #0f766e;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.view-button:hover {
  background: #f0fdfa;
}

.empty-state {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 30px;
  text-align: center;
}

.empty-state.compact {
  height: 200px;
}

.empty-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  margin-bottom: 12px;
}

.empty-state h4 {
  margin: 0 0 7px;
  font-size: 14px;
  color: #334155;
}

.empty-state p {
  max-width: 390px;
  margin: 0;
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.6;
}

/* STATUS */

.status-list {
  padding: 8px 20px;
}

.status-row {
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
}

.status-row:last-child {
  border-bottom: none;
}

.status-name {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: #334155;
}

.service-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.service-dot.unavailable {
  background: #cbd5e1;
}

.status-text {
  font-size: 10px;
  font-weight: 700;
}

.unavailable-text {
  color: #94a3b8;
}

.count-badge {
  min-width: 25px;
  height: 25px;
  padding: 0 7px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

/* INFO NOTICE */

.info-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 17px 20px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 9px;
  margin-top: 5px;
}

.info-icon {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #dbeafe;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
}

.info-notice strong {
  display: block;
  margin-bottom: 4px;
  color: #1e3a8a;
  font-size: 12px;
}

.info-notice p {
  margin: 0;
  color: #475569;
  font-size: 11px;
  line-height: 1.5;
}

/* RESPONSIVE */

@media (max-width: 1100px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .sidebar {
    width: 220px;
  }

  .main-content {
    width: calc(100% - 220px);
    margin-left: 220px;
  }

  .topbar {
    padding: 18px;
  }

  .content {
    padding: 20px;
  }

  .topbar-right {
    gap: 10px;
  }

  .date-box {
    display: none;
  }
}

@media (max-width: 600px) {
  .sidebar {
    position: relative;
    width: 100%;
    min-height: auto;
  }

  .main-content {
    width: 100%;
    margin-left: 0;
  }

  .dashboard {
    display: block;
  }

  .navigation {
    padding-bottom: 10px;
  }

  .sidebar-bottom {
    display: none;
  }

  .topbar {
    display: block;
  }

  .topbar-right {
    margin-top: 15px;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .intro-section {
    display: block;
  }

  .municipality-selector {
    margin-top: 15px;
  }

  .lower-grid {
    grid-template-columns: 1fr;
  }
}
</style>