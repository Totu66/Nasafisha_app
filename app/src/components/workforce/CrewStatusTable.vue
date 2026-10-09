<<<<<<< HEAD
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { CrewLiveStatus, CrewStatus } from '@/types/crew'

defineProps<{ crews: CrewStatus[] }>()
const { t } = useI18n()

const STYLES: Record<CrewLiveStatus, string> = {
  en_route: 'bg-green-100 text-green-900',
  off_route: 'bg-amber-100 text-amber-900',
  stale: 'bg-red-100 text-red-900',
  idle: 'bg-stone-200 text-stone-800',
}
</script>

<template>
  <div class="overflow-x-auto rounded border border-stone-200 bg-white">
    <table class="w-full text-left text-sm">
      <thead class="border-b border-stone-200 text-stone-600">
        <tr>
          <th class="p-3 font-semibold">{{ t('supervisor.crews.crew') }}</th>
          <th class="p-3 font-semibold">{{ t('supervisor.crews.vehicle') }}</th>
          <th class="p-3 font-semibold">{{ t('supervisor.crews.status') }}</th>
          <th class="p-3 font-semibold">{{ t('supervisor.crews.tickets') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="crew in crews" :key="crew.crewId" class="border-b border-stone-100 last:border-0">
          <td class="p-3">{{ crew.crewLabel }}</td>
          <td class="p-3">{{ crew.vehiclePlate }}</td>
          <td class="p-3">
            <span class="rounded-full px-2 py-0.5 text-xs font-semibold" :class="STYLES[crew.status]">
              {{ t(`supervisor.crews.live.${crew.status}`, { minutes: crew.staleMinutes ?? 0 }) }}
            </span>
          </td>
          <td class="p-3">
            <template v-if="crew.ticketsTotal > 0">{{ crew.ticketsDone }} of {{ crew.ticketsTotal }}</template>
            <template v-else>—</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
=======
<template><section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 class="text-sm font-semibold text-slate-800">CrewStatusTable</h3></section></template>
<script setup lang="ts"></script>
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
