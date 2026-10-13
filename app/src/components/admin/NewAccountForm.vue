<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ROLES, type Role } from '@/config/roles'
import type { NewAccountPayload } from '@/types/account'

defineProps<{ isSaving: boolean; failed: boolean }>()
const emit = defineEmits<{ (e: 'create', payload: NewAccountPayload): void; (e: 'cancel'): void }>()
const { t } = useI18n()

const ROLE_OPTIONS: Role[] = [
  ROLES.EXECUTIVE, ROLES.OPERATIONS_MANAGER, ROLES.FIELD_SUPERVISOR, ROLES.FIELD_CREW, ROLES.COUNTY_ICT_ADMIN,
]
const form = reactive<NewAccountPayload>({ name: '', email: '', role: ROLES.OPERATIONS_MANAGER, zone: '' })
const isValid = computed(() => form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.zone.trim())

const field = 'mt-1 w-full rounded border border-stone-300 px-3 py-2'
</script>

<template>
  <form class="grid gap-3 rounded border border-stone-200 bg-white p-4 md:grid-cols-2" novalidate @submit.prevent="isValid && emit('create', { ...form })">
    <div>
      <label for="acc-name" class="text-sm font-medium">{{ t('admin.accounts.name') }}</label>
      <input id="acc-name" v-model="form.name" :class="field" />
    </div>
    <div>
      <label for="acc-email" class="text-sm font-medium">{{ t('admin.accounts.email') }}</label>
      <input id="acc-email" v-model="form.email" type="email" :class="field" />
    </div>
    <div>
      <label for="acc-role" class="text-sm font-medium">{{ t('admin.accounts.role') }}</label>
      <select id="acc-role" v-model="form.role" :class="field">
        <option v-for="r in ROLE_OPTIONS" :key="r" :value="r">{{ t(`roles.${r}`) }}</option>
      </select>
    </div>
    <div>
      <label for="acc-zone" class="text-sm font-medium">{{ t('admin.accounts.zone') }}</label>
      <input id="acc-zone" v-model="form.zone" :class="field" />
    </div>

    <p v-if="failed" role="alert" class="text-sm text-red-800 md:col-span-2">{{ t('admin.accounts.createFailed') }}</p>

    <div class="flex gap-2 md:col-span-2">
      <button type="submit" :disabled="!isValid || isSaving" class="rounded bg-green-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">
        {{ t('admin.accounts.create') }}
      </button>
      <button type="button" class="rounded border border-green-800 px-3 py-2 text-sm text-green-800" @click="emit('cancel')">
        {{ t('admin.accounts.cancel') }}
      </button>
    </div>
  </form>
</template>