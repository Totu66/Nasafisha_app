<<<<<<< HEAD
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AccountsTable from '@/components/admin/AccountsTable.vue'
import NewAccountForm from '@/components/admin/NewAccountForm.vue'
import { useAccountsStore } from '@/store/accounts.store'
import type { NewAccountPayload } from '@/types/account'
import type { Role } from '@/config/roles'

const { t } = useI18n()
const store = useAccountsStore()
const { accounts, isLoading, hasError } = storeToRefs(store)

const showForm = ref(false)
const isSaving = ref(false)
const createFailed = ref(false)
const actionFailed = ref(false)

onMounted(() => store.load())

async function onCreate(payload: NewAccountPayload) {
  isSaving.value = true
  createFailed.value = false
  try {
    await store.create(payload)
    showForm.value = false
  } catch {
    createFailed.value = true
  } finally {
    isSaving.value = false
  }
}

// Role changes and (de)activation share one error banner.
async function run(action: () => Promise<void>) {
  actionFailed.value = false
  try {
    await action()
  } catch {
    actionFailed.value = true
  }
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-green-900">{{ t('admin.accounts.title') }}</h1>
      <button type="button" class="rounded bg-green-700 px-3 py-2 text-sm font-medium text-white" @click="showForm = !showForm">
        + {{ t('admin.accounts.new') }}
      </button>
    </div>

    <div v-if="showForm" class="mt-4">
      <NewAccountForm :is-saving="isSaving" :failed="createFailed" @create="onCreate" @cancel="showForm = false" />
    </div>

    <p v-if="actionFailed" role="alert" class="mt-3 rounded bg-red-50 p-2 text-sm text-red-800">
      {{ t('admin.accounts.actionFailed') }}
    </p>

    <p v-if="isLoading" class="mt-4 text-stone-600">{{ t('common.loading') }}</p>
    <div v-else-if="hasError" role="alert" class="mt-4 rounded bg-red-50 p-3 text-sm text-red-800">
      {{ t('common.loadError') }}
      <button type="button" class="ml-2 underline" @click="store.load()">{{ t('common.retry') }}</button>
    </div>
    <div v-else class="mt-4">
      <AccountsTable
        :accounts="accounts"
        @change-role="(id: string, role: Role) => run(() => store.changeRole(id, role))"
        @toggle-active="(id: string) => run(() => store.toggleActive(id))"
      />
    </div>

    <p class="mt-3 text-sm text-stone-600">{{ t('admin.accounts.rules') }}</p>
  </section>
</template>
=======
<template><main class="p-6"><h1 class="text-xl font-semibold text-slate-800">UsersRolesView</h1></main></template>
<script setup lang="ts"></script>
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
