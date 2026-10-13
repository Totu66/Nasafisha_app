<template>
  <section class="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <div class="mb-6">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Citizen login</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Welcome back</h1>
    </div>

    <form class="space-y-5" @submit.prevent="submitLogin">
      <label class="block text-sm font-medium text-slate-700">
        <span class="mb-2 block">Email</span>
        <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500" placeholder="you@example.com" />
      </label>

      <label class="block text-sm font-medium text-slate-700">
        <span class="mb-2 block">Password</span>
        <input v-model="form.password" type="password" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500" placeholder="••••••••" />
      </label>

      <button type="submit" class="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
        Sign in
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import authApi from '../../api/auth.api';

const router = useRouter();
const form = reactive({ email: '', password: '' });

const submitLogin = async () => {
  try {
    await authApi.login({ email: form.email, password: form.password, role: 'citizen' });
    router.push('/citizen/reports');
  } catch (error) {
    console.error('Citizen login failed', error);
  }
};
</script>
