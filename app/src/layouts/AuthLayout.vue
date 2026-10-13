<template>
  <div class="min-h-screen bg-[var(--ns-ash-50,#F3F5F4)] lg:grid lg:grid-cols-[1.1fr_1fr]">
    <!-- Brand panel -->
    <aside class="hidden lg:flex flex-col justify-between bg-[var(--ns-lake-900,#0F2E27)] p-10 text-white">
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ns-primary,#1F6F5C)] text-lg font-bold text-white"
          aria-hidden="true"
        >
          N
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.24em] text-emerald-300">{{ t('app') }}</p>
          <p class="text-sm text-emerald-100/80">{{ t('tagline') }}</p>
        </div>
      </div>

      <div class="space-y-4 max-w-md">
        <h1 class="text-3xl font-bold leading-tight">
          Nakuru County waste operations, in one place.
        </h1>
        <p class="text-sm leading-relaxed text-emerald-100/75">
          Report issues, track collections and review the shared SLA evidence ledger that keeps
          county staff, field crews and franchise operators accountable.
        </p>
        <ul class="space-y-2 pt-2 text-sm text-emerald-100/85">
          <li class="flex items-center gap-2">
            <AppIcon name="check" :size="16" color="#6EE7B7" />
            Real-time ticket and fleet status
          </li>
          <li class="flex items-center gap-2">
            <AppIcon name="check" :size="16" color="#6EE7B7" />
            Offline-first field capture with background sync
          </li>
          <li class="flex items-center gap-2">
            <AppIcon name="check" :size="16" color="#6EE7B7" />
            Tamper-evident proof of work for every closure
          </li>
        </ul>
      </div>

      <p class="font-mono text-[11px] text-emerald-200/50">
        SRS-NASAFISHA-001 · Role-based access control
      </p>
    </aside>

    <!-- Form panel -->
    <div class="flex min-h-screen flex-col">
      <header class="flex items-center justify-between px-6 py-4 lg:px-10">
        <div class="flex items-center gap-3 lg:hidden">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ns-primary,#1F6F5C)] text-sm font-bold text-white"
            aria-hidden="true"
          >
            N
          </div>
          <span class="text-sm font-semibold text-[var(--ns-lake-900,#0F2E27)]">{{ t('app') }}</span>
        </div>

        <button
          type="button"
          class="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--ns-ash-600,#4F5B57)] transition hover:bg-white"
          @click="toggleLocale()"
        >
          <AppIcon name="external-link" :size="14" />
          {{ locale === 'en' ? 'Kiswahili' : 'English' }}
        </button>
      </header>

      <main class="flex flex-1 items-center justify-center px-6 pb-10 lg:px-10">
        <div class="w-full max-w-md">
          <router-view />
        </div>
      </main>

      <footer class="px-6 pb-6 text-center text-xs text-[var(--ns-ash-600,#4F5B57)] lg:px-10">
        © 2026 Nakuru County · {{ t('tagline') }}
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppIcon } from '../components/common';
import { useI18n } from '../i18n';

const { t, locale, toggleLocale } = useI18n();
</script>
