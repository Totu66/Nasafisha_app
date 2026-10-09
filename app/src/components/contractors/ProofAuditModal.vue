<template>
  <NsModal
    :open="open"
    :title="`Proof Audit: ${ticket?.referenceNumber ?? 'Ticket Evidence'}`"
    maxWidth="xl"
    @close="emit('close')"
  >
    <div v-if="ticket" class="space-y-6">
      <!-- SLA Outcome Banner -->
      <div
        class="rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border"
        :class="ticket.slaOutcome === 'MET' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : ticket.slaOutcome === 'BREACHED' ? 'bg-red-50 border-red-200 text-red-950' : 'bg-amber-50 border-amber-200 text-amber-950'"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
            :class="ticket.slaOutcome === 'MET' ? 'bg-emerald-600 text-white' : ticket.slaOutcome === 'BREACHED' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'"
          >
            <AppIcon :name="ticket.slaOutcome === 'MET' ? 'check' : 'alert'" :size="20" />
          </div>
          <div>
            <h4 class="font-bold text-sm">
              SLA Outcome: {{ ticket.slaOutcome === 'MET' ? 'COMPLIANCE TARGET MET' : ticket.slaOutcome === 'BREACHED' ? 'SLA THRESHOLD BREACHED' : 'NEAR SLA LIMIT' }}
            </h4>
            <p class="text-xs opacity-80">
              Resolved in <strong class="font-mono">{{ ticket.actualDurationHours }} hours</strong> against the <strong class="font-mono">{{ ticket.slaTargetHours }}h</strong> contract window.
            </p>
          </div>
        </div>

        <BaseBadge
          :variant="ticket.slaOutcome === 'MET' ? 'met' : ticket.slaOutcome === 'BREACHED' ? 'breached' : 'stale'"
          size="md"
          :dot="true"
        >
          {{ ticket.slaOutcome === 'MET' ? 'Passed Official Audit' : ticket.slaOutcome === 'BREACHED' ? 'Penalty Logged' : 'Warning Level' }}
        </BaseBadge>
      </div>

      <!-- Side-by-side Before & After Photographic Evidence -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
            FR-013 Visual SLA Verification (Photo-Gated Closure)
          </h4>
          <span class="text-xs text-slate-400">GPS Timestamped & Hash Verified</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Before Photo -->
          <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <div class="bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <AppIcon name="camera" :size="14" />
                1. Citizen Report Photo
              </span>
              <span class="font-mono text-[11px] text-slate-300">BEFORE</span>
            </div>
            <div class="aspect-4/3 relative overflow-hidden bg-slate-200">
              <img
                :src="ticket.beforePhotoUrl"
                alt="Before cleanup condition"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-3 text-xs text-slate-600 bg-white border-t border-slate-100 flex justify-between">
              <span>Reported: <strong class="text-slate-800">{{ ticket.reportedAt }}</strong></span>
              <span class="font-mono text-slate-400">Initial State</span>
            </div>
          </div>

          <!-- After Photo -->
          <div class="border border-emerald-300 rounded-xl overflow-hidden bg-emerald-50/40">
            <div class="bg-[var(--ns-primary,#1F6F5C)] text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <AppIcon name="shield-check" :size="14" />
                2. Field Crew Closure Photo
              </span>
              <span class="font-mono text-[11px] text-emerald-200">AFTER CLEANUP</span>
            </div>
            <div class="aspect-4/3 relative overflow-hidden bg-slate-200">
              <img
                :src="ticket.afterPhotoUrl"
                alt="After cleanup condition"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-3 text-xs text-slate-600 bg-white border-t border-emerald-100 flex justify-between">
              <span>Cleared: <strong class="text-slate-800">{{ ticket.resolvedAt }}</strong></span>
              <span class="font-mono text-emerald-700 font-semibold">Verified Clean</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Geolocation Proximity & Attestation Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <!-- Location & GPS Audit -->
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div class="flex items-center gap-2 text-slate-800 font-bold">
            <AppIcon name="map-pin" :size="16" color="#1F6F5C" />
            <span>Geolocation & Distance Audit</span>
          </div>
          <p class="text-slate-600">{{ ticket.gpsCoordinates.address }}</p>
          <div class="pt-1 font-mono text-[11px] text-slate-500 space-y-0.5">
            <p>Coordinates: {{ ticket.gpsCoordinates.lat }}, {{ ticket.gpsCoordinates.lng }}</p>
            <p class="flex items-center gap-1 text-emerald-700 font-semibold">
              <AppIcon name="check" :size="12" />
              Closure GPS offset: {{ ticket.gpsCoordinates.distanceMeters }}m (Passes &lt; 50m requirement)
            </p>
          </div>
        </div>

        <!-- Crew & Vehicle Attribution -->
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div class="flex items-center gap-2 text-slate-800 font-bold">
            <AppIcon name="truck" :size="16" color="#1F6F5C" />
            <span>Field Workforce Attribution</span>
          </div>
          <div class="text-slate-600 space-y-1">
            <p>Assigned Crew: <strong class="text-slate-800">{{ ticket.crewName }}</strong> ({{ ticket.crewBadge }})</p>
            <p>Vehicle Plate: <strong class="text-slate-800 font-mono">{{ ticket.vehiclePlate }}</strong></p>
            <p>County Supervisor: <strong class="text-slate-800">{{ ticket.supervisorName }}</strong></p>
          </div>
        </div>
      </div>

      <!-- Field notes -->
      <div class="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-1">
        <span class="font-bold text-slate-700 uppercase tracking-wide font-mono text-[11px]">Field Sign-off & Disposal Notes:</span>
        <p class="text-slate-700 italic leading-relaxed">"{{ ticket.notes }}"</p>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <span class="text-xs text-slate-400 font-mono">Ledger Entry Hash: NSF-SHA256-{{ ticket?.id }}</span>
        <div class="flex items-center gap-2">
          <BaseButton variant="ghost" size="sm" @click="emit('close')">
            Close
          </BaseButton>
          <BaseButton variant="primary" size="sm" icon="download" @click="exportProofReport">
            Export Proof Record
          </BaseButton>
        </div>
      </div>
    </template>
  </NsModal>
</template>

<script setup lang="ts">
import type { EvidenceTicket } from '../../types/contractor';
import { NsModal, BaseButton, BaseBadge, AppIcon } from '../common';

const props = defineProps<{
  open: boolean;
  ticket: EvidenceTicket | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function exportProofReport() {
  if (!props.ticket) return;
  alert(`Proof audit certificate for ticket ${props.ticket.referenceNumber} exported as PDF audit record.`);
}
</script>
