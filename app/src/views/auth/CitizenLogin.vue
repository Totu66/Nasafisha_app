<script setup lang="ts">
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'
import OtpInput from '@/components/common/OtpInput.vue'
import { requestOtp, verifyOtp, loginWithEmail } from '@/api/auth.api'
import { normalizeKenyanPhone, formatKenyanPhone } from '@/helpers/validators'
import { formatCountdown } from '@/helpers/date'
import { OTP_LENGTH, OTP_LOCKOUT_MINUTES, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS } from '@/config/constants'
import { ApiError } from '@/types/api'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// Authentication mode state
const authMethod = ref<'phone' | 'email'>('phone')

// Phone / OTP State
const otpStep = ref<'phone' | 'otp'>('phone')
const phoneInput = ref('')
const phone = ref('')
const code = ref('')
const wrongTries = ref(0)
const resendIn = ref(0)
const lockedFor = ref(0)

// Email State
const emailForm = reactive({ email: '', password: '' })

// Shared UI State
const loading = ref(false)
const error = ref('')

// Timers
let timer: number | undefined
function startTimer() {
  if (timer !== undefined) return
  timer = window.setInterval(() => {
    if (resendIn.value > 0) resendIn.value--
    if (lockedFor.value > 0) lockedFor.value--
    if (resendIn.value === 0 && lockedFor.value === 0) stopTimer()
  }, 1000)
}
function stopTimer() {
  window.clearInterval(timer)
  timer = undefined
}
onBeforeUnmount(stopTimer)

const isLocked = computed(() => lockedFor.value > 0)
const shownPhone = computed(() => (phone.value ? formatKenyanPhone(phone.value) : ''))

// Unified Redirect Action
async function handlePostLogin(sessionData?: any) {
  if (sessionData) {
    auth.setSession(sessionData)
  }
  const targetRoute = typeof route.query.redirect === 'string' ? route.query.redirect : '/citizen/reports'
  if (!auth.consentAccepted) {
    await router.replace({ name: 'citizen-consent', query: { next: targetRoute } })
  } else {
    await router.replace(targetRoute)
  }
}

// Email Auth Handler
async function submitEmailLogin() {
  error.value = ''
  loading.value = true
  try {
    const session = await loginWithEmail({ email: emailForm.email, password: emailForm.password, role: 'citizen' })
    await handlePostLogin(session)
  } catch (err) {
    error.value = 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}

// Phone Auth Handlers
async function submitPhone() {
  error.value = ''
  const cleaned = normalizeKenyanPhone(phoneInput.value)
  if (!cleaned) {
    error.value = 'Enter a valid Kenyan phone number (e.g., 0712 345 678).'
    return
  }
  loading.value = true
  try {
    await requestOtp(cleaned)
    phone.value = cleaned
    wrongTries.value = 0
    otpStep.value = 'otp'
    resendIn.value = OTP_RESEND_SECONDS
    startTimer()
  } catch {
    error.value = 'We could not send the verification code. Try again.'
  } finally {
    loading.value = false
  }
}

async function submitCode() {
  if (loading.value || isLocked.value || code.value.length !== OTP_LENGTH) return
  error.value = ''
  loading.value = true
  try {
    const session = await verifyOtp(phone.value, code.value)
    await handlePostLogin(session)
  } catch (err) {
    code.value = ''
    if (err instanceof ApiError && err.code === 'OTP_LOCKED') {
      lockedFor.value = err.retryAfterSeconds ?? OTP_LOCKOUT_MINUTES * 60
      startTimer()
    } else if (err instanceof ApiError && err.code === 'OTP_INVALID') {
      wrongTries.value++
      const left = Math.max(0, OTP_MAX_ATTEMPTS - wrongTries.value)
      error.value = `Incorrect code. ${left} attempts remaining.`
    } else {
      error.value = 'Verification failed. Try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
    <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-xs font-medium uppercase tracking-widest text-emerald-600">Citizen Portal</p>
      <h1 class="mt-1 text-2xl font-bold text-slate-900">Welcome Back</h1>

      <!-- Mode Selector -->
      <div class="mt-6 flex border-b border-slate-200">
        <button
          type="button"
          class="pb-2 pr-4 text-sm font-semibold transition"
          :class="authMethod === 'phone' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500'"
          @click="authMethod = 'phone'; error = ''"
        >
          Phone Number
        </button>
        <button
          type="button"
          class="pb-2 px-4 text-sm font-semibold transition"
          :class="authMethod === 'email' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500'"
          @click="authMethod = 'email'; error = ''"
        >
          Email & Password
        </button>
      </div>

      <!-- Phone / OTP Flow -->
      <div v-if="authMethod === 'phone'" class="mt-6">
        <form v-if="otpStep === 'phone'" class="space-y-4" @submit.prevent="submitPhone">
          <label class="block text-sm font-medium text-slate-700">
            <span>Phone Number</span>
            <input
              v-model="phoneInput"
              type="tel"
              placeholder="0712 345 678"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-emerald-500"
            />
          </label>
          <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {{ loading ? 'Sending Code…' : 'Send Code' }}
          </button>
        </form>

        <div v-else class="space-y-4">
          <p class="text-sm text-slate-600">
            Enter the code sent to {{ shownPhone }}.
            <button type="button" class="text-emerald-600 underline" @click="otpStep = 'phone'">Change</button>
          </p>

          <OtpInput v-model="code" :length="OTP_LENGTH" :disabled="loading || isLocked" @complete="submitCode" />

          <p v-if="error" class="text-xs text-red-600">{{ error }}</p>

          <button
            type="button"
            :disabled="loading || isLocked || code.length !== OTP_LENGTH"
            class="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            @click="submitCode"
          >
            {{ loading ? 'Verifying…' : 'Confirm & Sign In' }}
          </button>
        </div>
      </div>

      <!-- Email Flow -->
      <form v-else class="mt-6 space-y-4" @submit.prevent="submitEmailLogin">
        <label class="block text-sm font-medium text-slate-700">
          <span>Email</span>
          <input
            v-model="emailForm.email"
            type="email"
            required
            class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-emerald-500"
          />
        </label>
        <label class="block text-sm font-medium text-slate-700">
          <span>Password</span>
          <input
            v-model="emailForm.password"
            type="password"
            required
            class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-emerald-500"
          />
        </label>
        <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {{ loading ? 'Signing In…' : 'Sign In' }}
        </button>
      </form>
    </div>
  </main>
</template>