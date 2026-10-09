<template>
  <main class="min-h-[75vh] flex items-center justify-center p-6">
    <div class="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div class="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl mx-auto flex items-center justify-center">
        <AppIcon name="search" :size="32" />
      </div>

      <div class="space-y-2">
        <span class="text-xs uppercase font-mono tracking-wider text-slate-500 font-semibold">Error 404</span>
        <h1 class="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p class="text-sm text-slate-600">
          The requested page or resource could not be found or has moved.
        </p>
      </div>

      <div class="pt-2">
        <BaseButton variant="primary" block @click="router.push('/')">
          Return Home
        </BaseButton>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { BaseButton, AppIcon } from '../../components/common';

const router = useRouter();
</script>
