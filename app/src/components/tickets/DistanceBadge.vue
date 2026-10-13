<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CLOSURE_RADIUS_METERS } from '@/config/constants'

// meters = null while we are still finding the crew member's position.
const props = defineProps<{ meters: number | null }>()
const { t } = useI18n()

const isNear = computed(() => props.meters !== null && props.meters <= CLOSURE_RADIUS_METERS)
</script>

<template>
  <span
    class="inline-block rounded-full px-3 py-1 text-xs font-semibold"
    :class="isNear ? 'bg-green-100 text-green-900' : 'bg-stone-800 text-white'"
  >
    <template v-if="meters === null">{{ t('field.detail.locating') }}</template>
    <template v-else>{{ t('field.detail.distance', { meters }) }}</template>
  </span>
</template>