<script setup lang="ts">
// FE-005 (FR-002): Employee ID + PIN sign-in. If a valid stored session exists (for example after a
// connectivity gap or an app restart) the user goes straight in without re-entering credentials.
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import StaffPinForm from '../../components/auth/StaffPinForm.vue'
import { useFieldOpsI18n } from '../../composables/useFieldOpsI18n'
import {
  errorCode,
  errorDetails,
  getStoredSession,
  homeRouteForRole,
  staffLogin,
} from '../../composables/fieldAdapters'
import { decideAfterGap } from '../../helpers/sessionResume'

const router = useRouter()
const { t } = useFieldOpsI18n()
const loading = ref(false)
const error = ref<string | null>(null)
const form = ref<InstanceType<typeof StaffPinForm> | null>(null)

onMounted(() => {
  let session: ReturnType<typeof getStoredSession> = null
  try {
    session = getStoredSession()
  } catch {
    return // adapter not wired yet: show the form
  }
  // Validated locally, so this works with no network at all.
  if (session && decideAfterGap(session) === 'resume') void router.replace(homeRouteForRole(session.role ?? 'crew'))
})

function messageFor(e: unknown): string {
  switch (errorCode(e)) {
    case 'NETWORK':
      return t('login.needNetwork')
    case 'ACCOUNT_LOCKED':
      return t('login.locked')
    case 'INVALID_CREDENTIALS': {
      const left = errorDetails(e).attemptsLeft
      return typeof left === 'number' ? t('login.invalid', { n: left }) : t('login.invalidNoCount')
    }
    default:
      return t('login.error')
  }
}

async function onSubmit(credentials: { employeeId: string; pin: string }): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const session = await staffLogin(credentials.employeeId, credentials.pin)
    await router.replace(homeRouteForRole(session.role))
  } catch (e) {
    error.value = messageFor(e)
    form.value?.clearPin()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-sm space-y-4 p-4">
    <h1 class="text-xl font-bold">{{ t('login.title') }}</h1>
    <StaffPinForm ref="form" :loading="loading" :error="error" @submit="onSubmit" />
  </section>
</template>
