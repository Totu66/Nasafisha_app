<template>
  <main class="min-h-[75vh] flex items-center justify-center p-6">
    <div class="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div class="w-16 h-16 bg-red-50 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
        <AppIcon name="forbidden" :size="32" />
      </div>

      <div class="space-y-2">
        <span class="text-xs uppercase font-mono tracking-wider text-red-600 font-semibold">Error 403 · Access Restricted</span>
        <h1 class="text-2xl font-bold text-slate-900">Permission Required</h1>
        <p class="text-sm text-slate-600">
          Your current account does not have authorization to view this area.
          <span v-if="authStore.user" class="block mt-1 font-medium text-slate-800">
            Signed in as: <span class="capitalize text-emerald-700">{{ authStore.role }}</span> ({{ authStore.user.name }})
          </span>
        </p>
      </div>

      <div class="pt-2 flex flex-col gap-3">
        <BaseButton variant="primary" block @click="redirectToAuthorizedArea">
          Go to My Authorized Portal
        </BaseButton>

        <BaseButton variant="ghost" block @click="handleSignOut">
          Sign In With Another Account
        </BaseButton>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';
import { BaseButton, AppIcon } from '../../components/common';

const router = useRouter();
const authStore = useAuthStore();

function redirectToAuthorizedArea() {
  if (authStore.role === 'admin') {
    router.push('/admin');
  } else if (authStore.role === 'contractor') {
    router.push('/contractor/scorecard');
  } else if (authStore.role === 'field') {
    router.push('/field/tickets');
  } else {
    router.push('/citizen/reports');
  }
}

async function handleSignOut() {
  await authStore.logout();
  router.push('/login');
}
</script>
