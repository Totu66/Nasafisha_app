<template>
  <section class="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <div class="mb-6">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Staff login</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Operations access</h1>
    </div>

    <form class="space-y-5" @submit.prevent="submitLogin">
      <BaseAlert v-if="errorMessage" variant="error" :dismissible="false">
        {{ errorMessage }}
      </BaseAlert>

      <label class="block text-sm font-medium text-slate-700">
        <span class="mb-2 block">Staff email</span>
        <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500" placeholder="ops@nasafisha.org" />
      </label>

      <label class="block text-sm font-medium text-slate-700">
        <span class="mb-2 block">Password</span>
        <input v-model="form.password" type="password" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500" placeholder="••••••••" />
      </label>

      <button
        type="submit"
        class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="authStore.isLoading"
      >
        {{ authStore.isLoading ? 'Signing in…' : 'Sign in as staff' }}
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BaseAlert } from '../../components/common';
import { useAuthStore } from '../../store/auth.store';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const form = reactive({ email: '', password: '' });
const errorMessage = ref('');

const submitLogin = async () => {
  errorMessage.value = '';
  try {
    await authStore.login({ email: form.email, password: form.password, role: 'admin' });
    const redirect = (route.query.redirect as string) || '/admin';
    router.push(redirect);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Staff login failed';
  }
};
</script>
