<template>
  <ContractorLayout>
    <div class="space-y-6">
      <!-- Breadcrumb (Figma: Contractor Performance / proof audit) -->
      <nav
        class="flex items-center gap-1.5 text-xs text-[var(--ns-ash-600,#4F5B57)]"
        aria-label="Breadcrumb"
      >
        <router-link
          to="/contractor"
          class="font-semibold hover:text-[var(--ns-lake-900,#0F2E27)]"
        >
          Contractor Performance
        </router-link>
        <span aria-hidden="true">/</span>
        <span class="text-[var(--ns-lake-900,#0F2E27)]">proof audit</span>
      </nav>

      <!-- Header -->
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
            Proof audit
          </h1>
          <p class="mt-1 text-sm text-[var(--ns-ash-600,#4F5B57)]">
            Closure trail you produce, kept in step with the county.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <BaseButton
            variant="secondary"
            size="sm"
            icon="refresh"
            :loading="store.isLoading"
            @click="refreshLedger"
          >
            Refresh
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="sm"
            icon="download"
            @click="exportLedgerCsv"
          >
            Export CSV
          </BaseButton>
        </div>
      </header>

      <p
        v-if="store.error"
        class="rounded-xl border border-[var(--ns-danger-border,#F87171)] bg-[var(--ns-danger-bg,#FEE2E2)] px-4 py-3 text-sm text-[var(--ns-danger-fg,#991B1B)]"
      >
        {{ store.error }}
      </p>

      <!-- Zone filter pills -->
      <ZoneFilterPills />

      <!-- Ledger + evidence + shared rail -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="space-y-6 xl:col-span-2">
          <!-- Closed-ticket ledger -->
          <section class="rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white shadow-xs">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ns-ash-200,#D5DBD9)] px-6 py-5">
              <h2 class="text-base font-bold text-[var(--ns-lake-900,#0F2E27)]">
                Closed-ticket ledger
              </h2>
              <span class="rounded-full bg-[var(--ns-cream,#F9F6EB)] px-3 py-1 text-xs font-semibold text-[var(--ns-ash-700,#3B4743)]">
                {{ store.filteredTickets.length }} completed record{{ store.filteredTickets.length === 1 ? '' : 's' }}
              </span>
            </div>

            <div
              v-if="store.filteredTickets.length"
              class="overflow-x-auto"
            >
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="text-[11px] font-semibold uppercase tracking-wider text-[var(--ns-ash-600,#4F5B57)]">
                    <th
                      scope="col"
                      class="px-6 py-3"
                    >
                      Reference
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3"
                    >
                      Zone
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3"
                    >
                      Closed
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-right"
                    >
                      Within SLA?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="ticket in store.filteredTickets"
                    :key="ticket.id"
                    class="cursor-pointer border-t border-[var(--ns-ash-100,#EDF1EF)] transition hover:bg-[var(--ns-lake-50,#F0F7F4)]"
                    :class="{ 'bg-[var(--ns-lake-50,#F0F7F4)]': selected?.id === ticket.id }"
                    :aria-selected="selected?.id === ticket.id"
                    @click="select(ticket)"
                  >
                    <td class="px-6 py-4 font-mono text-xs font-bold text-[var(--ns-lake-900,#0F2E27)]">
                      {{ ticket.referenceNumber }}
                    </td>
                    <td class="px-6 py-4 text-[var(--ns-ash-700,#3B4743)]">
                      {{ ticket.zone }}
                    </td>
                    <td class="px-6 py-4 text-xs text-[var(--ns-ash-600,#4F5B57)]">
                      {{ ticket.resolvedAt }}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span
                        class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                        :class="withinSlaClass(ticket.slaOutcome)"
                      >
                        <AppIcon
                          :name="withinSlaIcon(ticket.slaOutcome)"
                          :size="13"
                        />
                        {{ withinSlaLabel(ticket.slaOutcome) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p
              v-else
              class="px-6 py-10 text-center text-sm text-[var(--ns-ash-600,#4F5B57)]"
            >
              No closed tickets match the current filters.
            </p>
          </section>

          <!-- Evidence panel for the selected ticket -->
          <section
            v-if="selected"
            class="rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-6 shadow-xs"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-bold text-[var(--ns-lake-900,#0F2E27)]">
                  Evidence · {{ selected.referenceNumber }}
                </h2>
                <p class="mt-1 text-xs text-[var(--ns-ash-600,#4F5B57)]">
                  Closed {{ selected.resolvedAt }}
                </p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-bold"
                :class="withinSlaClass(selected.slaOutcome)"
              >
                {{ selected.slaOutcome === 'MET' ? 'matches SLA' : withinSlaLabel(selected.slaOutcome) }}
              </span>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <figure class="overflow-hidden rounded-xl border border-[var(--ns-ash-200,#D5DBD9)]">
                <figcaption
                  class="border-b border-[var(--ns-ash-200,#D5DBD9)] bg-[var(--ns-cream,#F9F6EB)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--ns-ash-600,#4F5B57)]"
                >
                  Before
                </figcaption>
                <img
                  v-if="selected.beforePhotoUrl"
                  :src="selected.beforePhotoUrl"
                  :alt="`Before photo for ${selected.referenceNumber}`"
                  class="h-40 w-full object-cover"
                  loading="lazy"
                >
                <p
                  v-else
                  class="flex h-40 items-center justify-center text-xs text-[var(--ns-ash-600,#4F5B57)]"
                >
                  Photo expected
                </p>
              </figure>

              <figure class="overflow-hidden rounded-xl border border-[var(--ns-ash-200,#D5DBD9)]">
                <figcaption
                  class="border-b border-[var(--ns-ash-200,#D5DBD9)] bg-[var(--ns-cream,#F9F6EB)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--ns-ash-600,#4F5B57)]"
                >
                  After
                </figcaption>
                <img
                  v-if="selected.afterPhotoUrl"
                  :src="selected.afterPhotoUrl"
                  :alt="`After photo for ${selected.referenceNumber}`"
                  class="h-40 w-full object-cover"
                  loading="lazy"
                >
                <p
                  v-else
                  class="flex h-40 items-center justify-center text-xs text-[var(--ns-ash-600,#4F5B57)]"
                >
                  Photo expected
                </p>
              </figure>
            </div>

            <p class="mt-4 flex items-center gap-2 text-xs font-medium text-[var(--ns-ash-700,#3B4743)]">
              <AppIcon
                name="map-pin"
                :size="14"
                class="text-[var(--ns-lake-900,#0F2E27)]"
              />
              Exif location is captured in the record
              <span
                v-if="selected.gpsCoordinates"
                class="text-[var(--ns-ash-600,#4F5B57)]"
              >
                · {{ selected.gpsCoordinates.address }}
              </span>
            </p>
          </section>
        </div>

        <!-- Shared-evidence rail (Figma: pale green card) -->
        <aside class="rounded-2xl border border-[var(--ns-lake-200,#B2D9CE)] bg-[var(--ns-lake-50,#F0F7F4)] p-5">
          <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ns-lake-900,#0F2E27)] text-[var(--ns-sun-500,#F5D142)]">
              <AppIcon
                name="shield-check"
                :size="16"
              />
            </span>
            <h2 class="text-sm font-bold text-[var(--ns-lake-900,#0F2E27)]">
              Shared evidence. One tamper-proof record.
            </h2>
          </div>

          <p class="mt-3 text-sm leading-relaxed text-[var(--ns-lake-900,#0F2E27)]">
            Every closure you log lands on the county's ledger with its timestamp, GPS fix and
            before/after photos — the same record they audit.
          </p>

          <p class="mt-4 inline-flex rounded-lg bg-white px-3 py-2 text-xs font-bold text-[var(--ns-lake-900,#0F2E27)]">
            Your zone only. No self-scope.
          </p>
        </aside>
      </div>
    </div>
  </ContractorLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import ContractorLayout from '../../layouts/ContractorLayout.vue';
import ZoneFilterPills from '../../components/contractors/ZoneFilterPills.vue';
import { useContractorsStore } from '../../store/contractors.store';
import type { EvidenceTicket, SLAOutcome } from '../../types/contractor';
import { AppIcon, BaseButton } from '../../components/common';

const store = useContractorsStore();

const selected = computed<EvidenceTicket | null>(() => store.selectedTicket);

onMounted(async () => {
  await store.fetchEvidenceLedger();
  selectDefault();
});

watch(
  () => store.filteredTickets,
  () => {
    if (!store.filteredTickets.some((t) => t.id === store.selectedTicket?.id)) {
      selectDefault();
    }
  }
);

function selectDefault() {
  const first = store.filteredTickets[0];
  if (first && !store.selectedTicket) store.selectedTicket = first;
}

function select(ticket: EvidenceTicket) {
  store.selectedTicket = ticket;
}

function withinSlaLabel(outcome: SLAOutcome): string {
  if (outcome === 'MET') return 'Yes';
  if (outcome === 'WARNING') return 'Near limit';
  return 'Late';
}

function withinSlaIcon(outcome: SLAOutcome): string {
  if (outcome === 'MET') return 'check';
  if (outcome === 'WARNING') return 'timer';
  return 'trend-down';
}

function withinSlaClass(outcome: SLAOutcome): string {
  if (outcome === 'MET') {
    return 'bg-[var(--ns-status-resolved-bg,#DCF2E6)] text-[var(--ns-status-resolved-fg,#14563F)]';
  }
  return 'bg-[var(--ns-status-progress-bg,#FFF1CC)] text-[var(--ns-status-progress-fg,#7A4B00)]';
}

async function refreshLedger() {
  await store.fetchEvidenceLedger();
}

function exportLedgerCsv() {
  alert('Exporting verified evidence records to CSV for county audit submission.');
}
</script>
