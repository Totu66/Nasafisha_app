<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { PERMISSIONS } from '@/config/permissions'
import { usePermission } from '@/composables/usePermission'
import { useSupervisorStore } from '@/store/supervisor.store'

const { t } = useI18n()
const { can } = usePermission()
const supervisor = useSupervisorStore()
const { needsYouCount } = storeToRefs(supervisor)

const isSupervisor = computed(() => can(PERMISSIONS.CREW_STATUS_VIEW))
onMounted(() => {
  if (isSupervisor.value) supervisor.loadAll()
})

const linkClass = 'text-stone-700'
const activeClass = 'font-semibold text-green-900'
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <header class="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
      <span class="font-bold text-green-900">NASAFISHA</span>

      <nav aria-label="Main" class="flex items-center gap-4 text-sm">
        <template v-if="isSupervisor">
          <RouterLink :to="{ name: 'field-crews' }" :class="linkClass" :active-class="activeClass">{{ t('field.nav.crews') }}</RouterLink>
          <RouterLink :to="{ name: 'field-alerts' }" :class="linkClass" :active-class="activeClass">
            {{ t('field.nav.alerts', { count: needsYouCount }) }}
          </RouterLink>
          <RouterLink :to="{ name: 'field-reset-pin' }" :class="linkClass" :active-class="activeClass">{{ t('field.nav.resetPin') }}</RouterLink>
        </template>
        <template v-else>
          <RouterLink :to="{ name: 'field-tickets' }" :class="linkClass" :active-class="activeClass">{{ t('field.nav.tickets') }}</RouterLink>
          <RouterLink :to="{ name: 'field-done-today' }" :class="linkClass" :active-class="activeClass">{{ t('field.nav.doneToday') }}</RouterLink>
        </template>
        <LanguageSwitcher />
      </nav>
    </header>

    <main class="mx-auto max-w-4xl p-4">
      <RouterView />
    </main>
  </div>
</template>
