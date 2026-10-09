<template>
  <div class="min-h-screen bg-[var(--ns-ash-50,#F3F5F4)] flex flex-col font-sans">
    <!-- Crew status strip -->
    <div
      class="text-xs py-2 px-4 border-b flex flex-wrap items-center justify-between gap-2"
      :class="online
        ? 'bg-[var(--ns-lake-950,#081B17)] text-emerald-300 border-emerald-950'
        : 'bg-[var(--ns-status-stale-bg,#FCE9B8)] text-[var(--ns-status-stale-fg,#6B4A00)] border-[var(--ns-status-stale-border,#EDCF72)]'"
    >
      <div class="flex items-center gap-2">
        <AppIcon :name="online ? 'online' : 'offline'" :size="14" />
        <span class="font-mono tracking-wide">
          {{ online ? 'CREW ONLINE · LIVE SYNC' : 'CREW OFFLINE · CHANGES QUEUED' }}
        </span>
        <span v-if="!online" class="hidden sm:inline opacity-80">
          {{ t('offline.pendingSync') }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-slate-400" v-if="authStore.user">
          <strong class="text-white font-mono">{{ authStore.user.badgeNumber || authStore.user.name }}</strong>
        </span>
        <BaseBadge :variant="online ? 'resolved' : 'stale'" size="sm" :dot="true">
          {{ online ? t('offline.online') : t('offline.offline') }}
        </BaseBadge>
      </div>
    </div>

    <!-- Header -->
    <header class="bg-white border-b border-[var(--ns-ash-200,#D5DBD9)] sticky top-0 z-40 shadow-xs">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16 gap-4">
          <router-link to="/field/tickets" class="flex items-center gap-3 group shrink-0">
            <div
              class="w-10 h-10 rounded-xl bg-[var(--ns-lake-900,#0F2E27)] flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-[var(--ns-lake-800,#185746)] transition"
              aria-hidden="true"
            >
              N
            </div>
            <div class="hidden sm:block">
              <div class="flex items-center gap-2">
                <span class="font-bold text-[var(--ns-lake-900,#0F2E27)] tracking-tight text-base">
                  {{ t('app') }}
                </span>
                <span
                  class="text-[11px] px-2 py-0.5 rounded-md bg-[var(--ns-ash-100,#E6EBE9)] text-[var(--ns-ash-700,#3B4743)] font-mono font-medium"
                >
                  Field ops
                </span>
              </div>
              <p class="text-xs text-[var(--ns-ash-600,#4F5B57)]">{{ authStore.user?.assignedZone || 'Nakuru County' }}</p>
            </div>
          </router-link>

          <!-- Desktop nav -->
          <nav class="hidden md:flex items-center gap-1" :aria-label="t('nav.tickets')">
            <router-link
              v-for="item in nav"
              :key="item.to"
              :to="item.to"
              class="px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
              :class="isActive(item.to)
                ? 'bg-[var(--ns-lake-50,#F0F7F4)] text-[var(--ns-primary,#1F6F5C)] font-semibold'
                : 'text-[var(--ns-ash-600,#4F5B57)] hover:text-[var(--ns-lake-900,#0F2E27)] hover:bg-[var(--ns-ash-50,#F3F5F4)]'"
            >
              <AppIcon :name="item.icon" :size="17" />
              {{ t(item.label) }}
              <span
                v-if="item.badge"
                class="ml-0.5 min-w-5 h-5 px-1 rounded-full bg-[var(--ns-flamingo-600,#B8325A)] text-white text-[10px] font-bold flex items-center justify-center"
              >
                {{ item.badge }}
              </span>
            </router-link>
          </nav>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="p-2 rounded-lg text-[var(--ns-ash-600,#4F5B57)] hover:text-red-700 hover:bg-red-50 transition"
              :title="t('common.signOut')"
              :aria-label="t('common.signOut')"
              @click="handleLogout"
            >
              <AppIcon name="logout" :size="19" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile sub nav -->
      <div class="md:hidden border-t border-[var(--ns-ash-200,#D5DBD9)] bg-[var(--ns-ash-50,#F3F5F4)] px-2 py-1.5 flex justify-around">
        <router-link
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="px-2 py-1.5 text-[11px] font-medium rounded-md flex flex-col items-center gap-0.5"
          :class="isActive(item.to)
            ? 'bg-white shadow-xs text-[var(--ns-primary,#1F6F5C)] font-bold'
            : 'text-[var(--ns-ash-600,#4F5B57)]'"
        >
          <AppIcon :name="item.icon" :size="16" />
          {{ t(item.shortLabel ?? item.label) }}
        </router-link>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <router-view />
    </main>

    <!-- Offline queue banner -->
    <div
      v-if="!online"
      class="sticky bottom-0 z-30 border-t border-[var(--ns-status-stale-border,#EDCF72)] bg-[var(--ns-status-stale-bg,#FCE9B8)] px-4 py-3"
    >
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs text-[var(--ns-status-stale-fg,#6B4A00)]">
        <span class="flex items-center gap-2 font-medium">
          <AppIcon name="pending-sync" :size="15" />
          {{ t('errors.network') }}
        </span>
        <BaseButton variant="secondary" size="sm" icon="refresh" @click="router.push('/field/sync')">
          {{ t('nav.sync') }}
        </BaseButton>
      </div>
    </div>

    <footer class="bg-white border-t border-[var(--ns-ash-200,#D5DBD9)] py-4 px-6 text-center text-xs text-[var(--ns-ash-600,#4F5B57)]">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2">
        <p>© 2026 Nakuru County · {{ t('tagline') }}</p>
        <div class="flex items-center gap-3">
          <span class="font-mono text-[11px]">Crew sync v1.1</span>
          <button
            type="button"
            class="underline underline-offset-2 hover:text-[var(--ns-primary,#1F6F5C)]"
            @click="toggleLocale()"
          >
            {{ locale === 'en' ? 'Kiswahili' : 'English' }}
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppIcon, BaseButton, BaseBadge } from '../components/common';
import { useAuthStore } from '../store/auth.store';
import { useOnlineStatus } from '../composables/useOnlineStatus';
import { useI18n } from '../i18n';

interface NavItem {
  to: string;
  label: string;
  shortLabel?: string;
  icon: string;
  badge?: number;
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { online } = useOnlineStatus();
const { t, locale, toggleLocale } = useI18n();

const nav = computed<NavItem[]>(() => [
  { to: '/field/tickets', label: 'nav.tickets', icon: 'report' },
  { to: '/field/sync', label: 'nav.sync', shortLabel: 'nav.sync', icon: 'pending-sync' },
  { to: '/field/safety', label: 'nav.safety', shortLabel: 'nav.safety', icon: 'alert', badge: 2 },
]);

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`);
}

async function handleLogout(): Promise<void> {
  await authStore.logout();
  router.push('/field/login');
}
</script>
