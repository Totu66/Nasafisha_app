<template>
  <div class="fleet-page">

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

        <router-link to="/dashboard" class="nav-item">
          <span class="nav-icon">▣</span>
          <span>Executive Dashboard</span>
        </router-link>

        <router-link to="/operations" class="nav-item">
          <span class="nav-icon">◈</span>
          <span>Operations</span>
        </router-link>

        <router-link to="/fleet" class="nav-item active">
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
          <p class="breadcrumb">
            Home / Fleet & Routes
          </p>

          <h1>
            Fleet & Route Audit
          </h1>
        </div>

        <div class="topbar-right">

          <div class="date-box">
            <span>Today</span>
            <strong>{{ currentDate }}</strong>
          </div>

          <div class="user-profile">

            <div class="avatar">
              F
            </div>

            <div>
              <strong>Fleet Operations</strong>
              <span>Vehicle Management</span>
            </div>

          </div>

        </div>

      </header>


      <!-- CONTENT -->
      <section class="content">

        <!-- INTRO -->
        <div class="page-intro">

          <div>

            <h2>
              Fleet Monitoring
            </h2>

            <p>
              Monitor cleaning vehicles and compare planned routes
              against actual movement.
            </p>

          </div>


          <div class="filter-box">

            <label for="fleetStatus">
              Fleet Status
            </label>

            <select
              id="fleetStatus"
              v-model="selectedStatus"
            >

              <option>
                All Vehicles
              </option>

              <option>
                Active
              </option>

              <option>
                Idle
              </option>

              <option>
                Offline
              </option>

            </select>

          </div>

        </div>


        <!-- KPI CARDS -->
        <div class="kpi-grid">

          <div class="kpi-card">

            <div class="kpi-heading">

              <span>
                Total Vehicles
              </span>

              <div class="kpi-icon blue">
                V
              </div>

            </div>

            <div class="kpi-value">
              --
            </div>

            <div class="kpi-status">
              Data unavailable
            </div>

          </div>


          <div class="kpi-card">

            <div class="kpi-heading">

              <span>
                Active Vehicles
              </span>

              <div class="kpi-icon green">
                A
              </div>

            </div>

            <div class="kpi-value">
              --
            </div>

            <div class="kpi-status">
              Data unavailable
            </div>

          </div>


          <div class="kpi-card">

            <div class="kpi-heading">

              <span>
                Routes Today
              </span>

              <div class="kpi-icon purple">
                R
              </div>

            </div>

            <div class="kpi-value">
              --
            </div>

            <div class="kpi-status">
              Data unavailable
            </div>

          </div>


          <div class="kpi-card">

            <div class="kpi-heading">

              <span>
                Route Deviations
              </span>

              <div class="kpi-icon orange">
                !
              </div>

            </div>

            <div class="kpi-value">
              --
            </div>

            <div class="kpi-status">
              Data unavailable
            </div>

          </div>

        </div>


        <!-- MAP SECTION -->
        <section class="panel map-panel">

          <div class="panel-header">

            <div>

              <h3>
                Live Fleet Map
              </h3>

              <p>
                Vehicle locations and route monitoring
              </p>

            </div>

            <span class="live-label">

              <span class="live-dot"></span>

              LIVE

            </span>

          </div>


          <div class="map-area">

            <div class="map-background">

              <!-- ROADS -->

              <div class="road road-1"></div>
              <div class="road road-2"></div>
              <div class="road road-3"></div>
              <div class="road road-4"></div>


              <!-- PLANNED ROUTE -->

              <div class="planned-route"></div>


              <!-- ACTUAL ROUTE -->

              <div class="actual-route"></div>


              <!-- VEHICLE MARKERS -->

              <div class="vehicle-marker vehicle-one">
                V1
              </div>

              <div class="vehicle-marker vehicle-two">
                V2
              </div>

              <div class="vehicle-marker vehicle-three">
                V3
              </div>


              <!-- MAP MESSAGE -->

              <div class="map-message">

                <div class="map-icon">
                  M
                </div>

                <strong>
                  Fleet location data unavailable
                </strong>

                <p>
                  Live vehicle locations will appear here
                  when the fleet tracking service is connected.
                </p>

              </div>

            </div>


            <!-- MAP LEGEND -->

            <div class="map-legend">

              <div class="legend-item">

                <span class="legend-line planned"></span>

                Planned Route

              </div>

              <div class="legend-item">

                <span class="legend-line actual"></span>

                Actual Route

              </div>

              <div class="legend-item">

                <span class="legend-vehicle"></span>

                Vehicle

              </div>

            </div>

          </div>

        </section>


        <!-- ROUTE AUDIT -->
        <section class="panel route-panel">

          <div class="panel-header">

            <div>

              <h3>
                Planned vs Actual Route
              </h3>

              <p>
                Route performance and deviation audit
              </p>

            </div>

            <span class="data-state">
              Data unavailable
            </span>

          </div>


          <div class="route-empty">

            <div class="empty-icon">
              R
            </div>

            <h4>
              Route audit data unavailable
            </h4>

            <p>
              Planned routes, actual vehicle paths and route
              deviations will appear here once fleet data is connected.
            </p>

          </div>

        </section>


        <!-- VEHICLE TABLE -->
        <section class="panel vehicle-panel">

          <div class="panel-header">

            <div>

              <h3>
                Vehicle Details
              </h3>

              <p>
                Current fleet vehicle information
              </p>

            </div>

            <span class="data-state">
              Data unavailable
            </span>

          </div>


          <div class="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Vehicle
                  </th>

                  <th>
                    Registration
                  </th>

                  <th>
                    Driver
                  </th>

                  <th>
                    Zone
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Last Update
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr>

                  <td colspan="6">

                    <div class="table-empty">

                      <div class="empty-icon">
                        V
                      </div>

                      <strong>
                        Vehicle data unavailable
                      </strong>

                      <p>
                        Fleet vehicle information will appear
                        after the backend connection is established.
                      </p>

                    </div>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </section>


        <!-- LOWER GRID -->
        <div class="bottom-grid">

          <!-- ROUTE STATUS -->
          <section class="panel">

            <div class="panel-header">

              <div>

                <h3>
                  Route Status
                </h3>

                <p>
                  Fleet route monitoring
                </p>

              </div>

            </div>


            <div class="status-list">

              <div class="status-row">

                <div class="status-name">

                  <span class="status-circle gray"></span>

                  Planned routes

                </div>

                <strong>
                  Unavailable
                </strong>

              </div>


              <div class="status-row">

                <div class="status-name">

                  <span class="status-circle gray"></span>

                  Actual routes

                </div>

                <strong>
                  Unavailable
                </strong>

              </div>


              <div class="status-row">

                <div class="status-name">

                  <span class="status-circle gray"></span>

                  Route deviations

                </div>

                <strong>
                  Unavailable
                </strong>

              </div>

            </div>

          </section>


          <!-- SELECTED VEHICLE -->
          <section class="panel">

            <div class="panel-header">

              <div>

                <h3>
                  Selected Vehicle
                </h3>

                <p>
                  Vehicle details
                </p>

              </div>

            </div>


            <div class="selected-vehicle">

              <div class="vehicle-icon">
                V
              </div>

              <div>

                <strong>
                  No vehicle selected
                </strong>

                <p>
                  Select a vehicle from the fleet data
                  to view route and operational details.
                </p>

              </div>

            </div>

          </section>

        </div>


        <!-- INFORMATION -->
        <div class="info-notice">

          <div class="info-icon">
            i
          </div>

          <div>

            <strong>
              Fleet tracking connection
            </strong>

            <p>
              The Fleet & Route Audit interface is ready.
              Live vehicle positions, planned routes, actual routes
              and route deviations will be loaded from the Nasafisha
              backend.
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

const selectedStatus = ref('All Vehicles')

const currentDate = computed(() => {

  return new Date().toLocaleDateString('en-KE', {

    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'

  })

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


/* PAGE */

.fleet-page {

  min-height: 100vh;

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

  position: fixed;

  left: 0;

  top: 0;

  bottom: 0;

  display: flex;

  flex-direction: column;

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

  padding: 12px;

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


/* TOP BAR */

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


.date-box span {

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


.page-intro {

  display: flex;

  justify-content: space-between;

  align-items: flex-end;

  margin-bottom: 24px;

}


.page-intro h2 {

  margin: 0 0 7px;

  font-size: 19px;

}


.page-intro p {

  margin: 0;

  color: #64748b;

  font-size: 13px;

}


/* FILTER */

.filter-box {

  display: flex;

  flex-direction: column;

  gap: 6px;

}


.filter-box label {

  color: #64748b;

  font-size: 11px;

  font-weight: 700;

}


.filter-box select {

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

  box-shadow: 0 2px 7px rgba(15,23,42,0.03);

}


.kpi-heading {

  display: flex;

  align-items: center;

  justify-content: space-between;

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


.kpi-icon.purple {

  background: #f3e8ff;

  color: #7e22ce;

}


.kpi-icon.orange {

  background: #ffedd5;

  color: #c2410c;

}


.kpi-value {

  margin: 18px 0 9px;

  font-size: 30px;

  font-weight: 800;

  color: #0f172a;

}


.kpi-status {

  color: #94a3b8;

  font-size: 11px;

}


/* PANEL */

.panel {

  background: white;

  border: 1px solid #e2e8f0;

  border-radius: 10px;

  overflow: hidden;

  margin-bottom: 20px;

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

  font-size: 15px;

  color: #172033;

}


.panel-header p {

  margin: 5px 0 0;

  color: #94a3b8;

  font-size: 11px;

}


.data-state {

  color: #94a3b8;

  font-size: 10px;

  font-weight: 700;

}


/* LIVE LABEL */

.live-label {

  display: flex;

  align-items: center;

  gap: 6px;

  color: #15803d;

  font-size: 10px;

  font-weight: 800;

}


.live-dot {

  width: 7px;

  height: 7px;

  border-radius: 50%;

  background: #22c55e;

}


/* MAP */

.map-area {

  padding: 18px;

}


.map-background {

  height: 430px;

  border-radius: 8px;

  position: relative;

  overflow: hidden;

  background:

    linear-gradient(
      30deg,
      transparent 45%,
      #dbe4ec 46%,
      #dbe4ec 49%,
      transparent 50%
    ),

    linear-gradient(
      120deg,
      transparent 45%,
      #dbe4ec 46%,
      #dbe4ec 49%,
      transparent 50%
    ),

    #eef2f5;

}


/* ROADS */

.road {

  position: absolute;

  background: white;

  opacity: 0.9;

}


.road-1 {

  width: 120%;

  height: 16px;

  top: 25%;

  left: -10%;

  transform: rotate(-12deg);

}


.road-2 {

  width: 120%;

  height: 13px;

  top: 62%;

  left: -10%;

  transform: rotate(14deg);

}


.road-3 {

  width: 14px;

  height: 120%;

  left: 28%;

  top: -10%;

  transform: rotate(15deg);

}


.road-4 {

  width: 14px;

  height: 120%;

  left: 70%;

  top: -10%;

  transform: rotate(-11deg);

}


/* ROUTES */

.planned-route {

  position: absolute;

  width: 55%;

  height: 120px;

  left: 20%;

  top: 35%;

  border-top: 4px dashed #2563eb;

  border-radius: 50%;

  transform: rotate(-12deg);

}


.actual-route {

  position: absolute;

  width: 48%;

  height: 100px;

  left: 25%;

  top: 38%;

  border-top: 4px solid #0f766e;

  border-radius: 50%;

  transform: rotate(-7deg);

}


/* VEHICLES */

.vehicle-marker {

  position: absolute;

  width: 38px;

  height: 38px;

  border-radius: 50%;

  background: #0f766e;

  border: 4px solid white;

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 9px;

  font-weight: 800;

  box-shadow: 0 4px 12px rgba(15,23,42,0.2);

}


.vehicle-one {

  left: 25%;

  top: 33%;

}


.vehicle-two {

  left: 55%;

  top: 46%;

}


.vehicle-three {

  left: 68%;

  top: 30%;

}


/* MAP MESSAGE */

.map-message {

  position: absolute;

  left: 50%;

  top: 50%;

  transform: translate(-50%, -50%);

  width: 285px;

  padding: 23px;

  text-align: center;

  background: rgba(255,255,255,0.95);

  border: 1px solid #e2e8f0;

  border-radius: 10px;

  box-shadow: 0 8px 25px rgba(15,23,42,0.08);

}


.map-icon {

  width: 42px;

  height: 42px;

  margin: 0 auto 10px;

  border-radius: 50%;

  background: #f1f5f9;

  color: #64748b;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 800;

}


.map-message strong {

  display: block;

  color: #334155;

  font-size: 13px;

}


.map-message p {

  margin: 7px 0 0;

  color: #94a3b8;

  font-size: 10px;

  line-height: 1.5;

}


/* LEGEND */

.map-legend {

  display: flex;

  gap: 22px;

  padding: 15px 5px 2px;

}


.legend-item {

  display: flex;

  align-items: center;

  gap: 7px;

  color: #64748b;

  font-size: 10px;

}


.legend-line {

  width: 25px;

  display: block;

}


.legend-line.planned {

  border-top: 3px dashed #2563eb;

}


.legend-line.actual {

  border-top: 3px solid #0f766e;

}


.legend-vehicle {

  width: 9px;

  height: 9px;

  border-radius: 50%;

  background: #0f766e;

}


/* ROUTE EMPTY */

.route-empty {

  min-height: 230px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  padding: 30px;

}


.empty-icon {

  width: 44px;

  height: 44px;

  border-radius: 50%;

  background: #f1f5f9;

  color: #64748b;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 800;

  margin-bottom: 12px;

}


.route-empty h4 {

  margin: 0 0 7px;

  color: #334155;

  font-size: 14px;

}


.route-empty p {

  max-width: 500px;

  margin: 0;

  color: #94a3b8;

  font-size: 11px;

  line-height: 1.6;

}


/* TABLE */

.table-wrapper {

  overflow-x: auto;

}


table {

  width: 100%;

  border-collapse: collapse;

}


th {

  padding: 13px 20px;

  background: #f8fafc;

  color: #64748b;

  text-align: left;

  font-size: 10px;

  font-weight: 700;

  text-transform: uppercase;

}


td {

  border-top: 1px solid #eef2f7;

}


.table-empty {

  min-height: 170px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

}


.table-empty strong {

  margin-bottom: 5px;

  color: #334155;

  font-size: 13px;

}


.table-empty p {

  margin: 0;

  color: #94a3b8;

  font-size: 10px;

}


/* BOTTOM */

.bottom-grid {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 20px;

}


/* STATUS */

.status-list {

  padding: 8px 20px;

}


.status-row {

  min-height: 54px;

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

  color: #334155;

  font-size: 12px;

}


.status-circle {

  width: 8px;

  height: 8px;

  border-radius: 50%;

}


.status-circle.gray {

  background: #cbd5e1;

}


.status-row strong {

  color: #94a3b8;

  font-size: 10px;

}


/* SELECTED VEHICLE */

.selected-vehicle {

  min-height: 150px;

  padding: 25px;

  display: flex;

  align-items: center;

  gap: 15px;

}


.vehicle-icon {

  width: 48px;

  height: 48px;

  flex-shrink: 0;

  border-radius: 10px;

  background: #ccfbf1;

  color: #0f766e;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 800;

}


.selected-vehicle strong {

  color: #334155;

  font-size: 14px;

}


.selected-vehicle p {

  margin: 6px 0 0;

  color: #94a3b8;

  font-size: 11px;

  line-height: 1.5;

}


/* INFO */

.info-notice {

  display: flex;

  align-items: flex-start;

  gap: 12px;

  padding: 17px 20px;

  background: #eff6ff;

  border: 1px solid #dbeafe;

  border-radius: 9px;

  margin-top: 20px;

}


.info-icon {

  width: 25px;

  height: 25px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #dbeafe;

  color: #2563eb;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 12px;

  font-weight: 800;

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

}


@media (max-width: 800px) {

  .sidebar {

    width: 220px;

  }

  .main-content {

    width: calc(100% - 220px);

    margin-left: 220px;

  }

  .content {

    padding: 20px;

  }

  .topbar {

    padding: 18px;

  }

  .date-box {

    display: none;

  }

  .bottom-grid {

    grid-template-columns: 1fr;

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

  .fleet-page {

    display: block;

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

  .page-intro {

    display: block;

  }

  .filter-box {

    margin-top: 15px;

  }

  .map-background {

    height: 350px;

  }

  .map-message {

    width: 230px;

  }

}

</style>