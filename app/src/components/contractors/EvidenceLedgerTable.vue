<template>
  <div class="space-y-4">
    <!-- Filter Bar -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
      <div class="flex-1 min-w-[240px] max-w-md">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search by ticket ref, zone, crew..."
          @input="onSearchInput"
        >
          <template #prefix>
            <AppIcon name="search" :size="16" />
          </template>
        </BaseInput>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Outcome Filter -->
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-500 font-medium">SLA Outcome:</span>
          <select
            v-model="selectedOutcome"
            class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
            @change="onFilterChange"
          >
            <option value="ALL">All Outcomes</option>
            <option value="MET">SLA Met</option>
            <option value="BREACHED">SLA Breached</option>
            <option value="WARNING">Warning / Near Expiry</option>
          </select>
        </div>

        <!-- Issue Category Filter -->
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-500 font-medium">Category:</span>
          <select
            v-model="selectedCategory"
            class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
            @change="onFilterChange"
          >
            <option value="ALL">All Categories</option>
            <option value="illegal-dumping">Illegal Dumping</option>
            <option value="missed-collection">Missed Collection</option>
            <option value="overflowing-bin">Overflowing Bin</option>
            <option value="blocked-drain">Blocked Drain</option>
          </select>
        </div>

        <BaseButton
          v-if="hasActiveFilters"
          variant="ghost"
          size="sm"
          @click="resetAllFilters"
        >
          Reset Filters
        </BaseButton>
      </div>
    </div>

    <!-- Evidence Ledger Table -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-[11px] uppercase font-mono tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-5 py-3.5">Reference & Issue</th>
              <th class="px-5 py-3.5">Zone / Location</th>
              <th class="px-5 py-3.5">Turnaround & SLA Window</th>
              <th class="px-5 py-3.5 text-center">SLA Outcome</th>
              <th class="px-5 py-3.5">Photo Evidence</th>
              <th class="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-if="!tickets.length"
              class="text-center py-8 text-slate-400"
            >
              <td colspan="6" class="p-8">
                <AppIcon name="report" :size="32" class="mx-auto text-slate-300 mb-2" />
                <p class="font-medium text-slate-600">No closed ticket evidence found</p>
                <p class="text-xs text-slate-400">Try adjusting your search criteria or outcome filter.</p>
              </td>
            </tr>

            <tr
              v-for="ticket in tickets"
              :key="ticket.id"
              class="hover:bg-slate-50/80 transition"
            >
              <!-- Reference & Issue Category -->
              <td class="px-5 py-4">
                <div class="flex flex-col">
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono font-bold text-slate-900">{{ ticket.referenceNumber }}</span>
                  </div>
                  <span class="text-xs text-slate-500 capitalize flex items-center gap-1 mt-0.5">
                    <AppIcon :name="getCategoryIcon(ticket.issueCategory)" :size="14" />
                    {{ formatCategory(ticket.issueCategory) }}
                  </span>
                </div>
              </td>

              <!-- Zone / Location -->
              <td class="px-5 py-4">
                <div class="text-xs">
                  <p class="font-medium text-slate-800">{{ ticket.zone }}</p>
                  <p class="text-slate-400 font-mono text-[11px]">{{ ticket.crewName }}</p>
                </div>
              </td>

              <!-- Turnaround & Window -->
              <td class="px-5 py-4">
                <div class="text-xs">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold" :class="ticket.slaOutcome === 'BREACHED' ? 'text-red-600' : 'text-slate-800'">
                      {{ ticket.actualDurationHours }}h actual
                    </span>
                    <span class="text-slate-400">/ {{ ticket.slaTargetHours }}h target</span>
                  </div>
                  <p class="text-slate-400 text-[11px] mt-0.5">Resolved: {{ ticket.resolvedAt }}</p>
                </div>
              </td>

              <!-- SLA Outcome Badge -->
              <td class="px-5 py-4 text-center">
                <BaseBadge
                  :variant="ticket.slaOutcome === 'MET' ? 'met' : ticket.slaOutcome === 'BREACHED' ? 'breached' : 'stale'"
                  :dot="true"
                  size="sm"
                >
                  {{ ticket.slaOutcome === 'MET' ? 'SLA Met' : ticket.slaOutcome === 'BREACHED' ? 'SLA Breached' : 'Near Limit' }}
                </BaseBadge>
              </td>

              <!-- Photo Evidence Thumbnails -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <div class="relative group cursor-pointer" @click="emit('inspect', ticket)">
                    <img
                      :src="ticket.beforePhotoUrl"
                      alt="Before proof"
                      class="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                    <span class="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white font-mono text-center rounded-b-lg">
                      Before
                    </span>
                  </div>
                  <span class="text-slate-300 text-xs">→</span>
                  <div class="relative group cursor-pointer" @click="emit('inspect', ticket)">
                    <img
                      :src="ticket.afterPhotoUrl"
                      alt="After proof"
                      class="w-10 h-10 object-cover rounded-lg border border-emerald-300"
                    />
                    <span class="absolute bottom-0 inset-x-0 bg-emerald-800/80 text-[9px] text-white font-mono text-center rounded-b-lg">
                      After
                    </span>
                  </div>
                </div>
              </td>

              <!-- Action Button -->
              <td class="px-5 py-4 text-right">
                <BaseButton
                  variant="secondary"
                  size="sm"
                  @click="emit('inspect', ticket)"
                >
                  Inspect Proof
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { EvidenceTicket, SLAOutcome, IssueCategory } from '../../types/contractor';
import { BaseInput, BaseButton, BaseBadge, AppIcon } from '../common';

defineProps<{
  tickets: EvidenceTicket[];
}>();

const emit = defineEmits<{
  (e: 'inspect', ticket: EvidenceTicket): void;
  (e: 'filter-change', filters: { search: string; outcome: SLAOutcome | 'ALL'; issueCategory: IssueCategory | 'ALL' }): void;
}>();

const searchQuery = ref('');
const selectedOutcome = ref<SLAOutcome | 'ALL'>('ALL');
const selectedCategory = ref<IssueCategory | 'ALL'>('ALL');

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || selectedOutcome.value !== 'ALL' || selectedCategory.value !== 'ALL';
});

function onSearchInput() {
  emitFilter();
}

function onFilterChange() {
  emitFilter();
}

function emitFilter() {
  emit('filter-change', {
    search: searchQuery.value,
    outcome: selectedOutcome.value,
    issueCategory: selectedCategory.value,
  });
}

function resetAllFilters() {
  searchQuery.value = '';
  selectedOutcome.value = 'ALL';
  selectedCategory.value = 'ALL';
  emitFilter();
}

function formatCategory(category: IssueCategory): string {
  return category.replace(/-/g, ' ');
}

function getCategoryIcon(category: IssueCategory): string {
  switch (category) {
    case 'illegal-dumping': return 'illegal-dumping';
    case 'missed-collection': return 'missed-collection';
    case 'overflowing-bin': return 'illegal-dumping';
    case 'blocked-drain': return 'route';
    default: return 'report';
  }
}
</script>
