<template>
  <section class="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <div class="mb-6">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Contractor login</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Contractor access</h1>
    </div>

    <form class="space-y-5" @submit.prevent="submitLogin">
      <label class="block text-sm font-medium text-slate-700">
        <span class="mb-2 block">Contractor email</span>
        <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500" placeholder="contractor@nasafisha.org" />
      </label>

      <label class="block text-sm font-medium text-slate-700">
        <span class="mb-2 block">Password</span>
        <input v-model="form.password" type="password" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500" placeholder="••••••••" />
      </label>

      <button type="submit" class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">
        Sign in as contractor
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';

const router = useRouter();
const auth = useAuthStore();
const form = reactive({ email: '', password: '' });

const submitLogin = async () => {
  try {
    await auth.login({ email: form.email, password: form.password, role: 'contractor' });
    router.push('/contractor');
  } catch (error) {
    console.error('Contractor login failed', error);
  }
};
</script>
