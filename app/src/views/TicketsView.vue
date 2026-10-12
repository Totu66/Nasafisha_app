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

        <router-link to="/tickets" class="nav-item active">
          Tickets
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
          <h1>Ticket Queue</h1>
          <p>Manage cleaning service tickets and review ticket activity.</p>
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

        <!-- FILTERS -->
        <div class="filter-panel">

          <div class="filter-group">
            <label>Ticket Status</label>

            <select v-model="selectedStatus">
              <option value="All">All Tickets</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Priority</label>

            <select v-model="selectedPriority">
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Zone</label>

            <select v-model="selectedZone">
              <option value="All">All Zones</option>
              <option value="Zone 01">Zone 01</option>
              <option value="Zone 02">Zone 02</option>
              <option value="Zone 03">Zone 03</option>
              <option value="Zone 04">Zone 04</option>
            </select>
          </div>

        </div>

        <!-- KPI CARDS -->
        <div class="kpi-grid">

          <div class="kpi-card">
            <span class="kpi-label">Open Tickets</span>
            <strong>--</strong>
            <small>Data unavailable</small>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">High Priority</span>
            <strong>--</strong>
            <small>Data unavailable</small>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">In Progress</span>
            <strong>--</strong>
            <small>Data unavailable</small>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Resolved Today</span>
            <strong>--</strong>
            <small>Data unavailable</small>
          </div>

        </div>

        <!-- TICKET QUEUE -->
        <section class="panel">

          <div class="panel-header">
            <div>
              <h2>Ticket Queue</h2>
              <p>Service requests, complaints and operational issues.</p>
            </div>

            <button class="refresh-button">
              Refresh
            </button>
          </div>

          <div class="table-container">

            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Issue</th>
                  <th>Zone</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td colspan="7" class="unavailable">
                    <strong>Data unavailable</strong>
                    <span>
                      Ticket data will appear here when the backend is connected.
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>

          </div>

        </section>

        <!-- DETAIL AND AUDIT -->
        <div class="two-column">

          <!-- TICKET DETAIL -->
          <section class="panel detail-panel">

            <div class="panel-header">
              <div>
                <h2>Ticket Detail</h2>
                <p>Selected ticket information.</p>
              </div>
            </div>

            <div class="empty-detail">

              <div class="detail-icon">
                T
              </div>

              <h3>No Ticket Selected</h3>

              <p>
                Select a ticket from the queue to view its details,
                assignment and current status.
              </p>

            </div>

          </section>

          <!-- AUDIT -->
          <section class="panel">

            <div class="panel-header">
              <div>
                <h2>Ticket Audit</h2>
                <p>Activity history and status changes.</p>
              </div>
            </div>

            <div class="audit-list">

              <div class="audit-empty">
                <strong>Data unavailable</strong>
                <p>
                  Ticket audit information will appear here when
                  backend data is available.
                </p>
              </div>

            </div>

          </section>

        </div>

        <!-- ACTION AREA -->
        <section class="panel action-panel">

          <div>
            <h2>Ticket Actions</h2>
            <p>
              Operations Managers will be able to review, assign,
              update and resolve tickets.
            </p>
          </div>

          <div class="action-buttons">
            <button class="secondary-button" disabled>
              Assign Ticket
            </button>

            <button class="primary-button" disabled>
              Update Status
            </button>
          </div>

        </section>

        <!-- BACKEND NOTICE -->
        <div class="backend-notice">
          <strong>Backend connection</strong>
          <span>
            Ticket information is currently unavailable because the
            backend/database connection has not yet been connected to
            this screen.
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

const selectedStatus = ref('All')
const selectedPriority = ref('All')
const selectedZone = ref('All')

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

/* FILTERS */

.filter-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

/* TWO COLUMNS */

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.empty-detail {
  padding: 45px 30px;
  text-align: center;
}

.detail-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 15px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.empty-detail h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.empty-detail p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.6;
}

.audit-list {
  padding: 25px;
}

.audit-empty {
  padding: 25px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  text-align: center;
}

.audit-empty strong {
  display: block;
  color: #475569;
  margin-bottom: 6px;
}

.audit-empty p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
}

/* ACTIONS */

.action-panel {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-panel h2 {
  margin: 0 0 5px;
  font-size: 16px;
}

.action-panel p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.primary-button,
.secondary-button {
  padding: 10px 15px;
  border-radius: 7px;
  font-size: 13px;
}

.primary-button {
  border: none;
  background: #0f766e;
  color: white;
}

.secondary-button {
  border: 1px solid #cbd5e1;
  background: white;
  color: #64748b;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
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

  .filter-panel {
    grid-template-columns: 1fr;
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

  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .action-panel {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>