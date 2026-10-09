<template>
  <div class="min-h-screen bg-[var(--ns-ash-50,#F3F5F4)] flex flex-col font-sans">
    <!-- Top bar -->
    <header class="bg-white border-b border-[var(--ns-ash-200,#D5DBD9)] sticky top-0 z-40 shadow-xs">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16 gap-4">
          <!-- Brand -->
          <router-link to="/citizen/reports" class="flex items-center gap-3 group shrink-0">
            <div
              class="w-10 h-10 rounded-xl bg-[var(--ns-primary,#1F6F5C)] flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-[var(--ns-lake-800,#185746)] transition"
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
                  class="text-[11px] px-2 py-0.5 rounded-md bg-[var(--ns-lake-50,#F0F7F4)] text-[var(--ns-primary,#1F6F5C)] font-mono font-medium"
                >
                  {{ t('nav.reports') }}
                </span>
              </div>
              <p class="text-xs text-[var(--ns-ash-600,#4F5B57)]">{{ t('tagline') }}</p>
            </div>
          </router-link>

          <!-- Desktop nav -->
          <nav class="hidden md:flex items-center gap-1" :aria-label="t('nav.home')">
            <router-link
              v-for="item in primaryNav"
              :key="item.to"
              :to="item.to"
              class="px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
              :class="isActive(item.to)
                ? 'bg-[var(--ns-lake-50,#F0F7F4)] text-[var(--ns-primary,#1F6F5C)] font-semibold'
                : 'text-[var(--ns-ash-600,#4F5B57)] hover:text-[var(--ns-lake-900,#0F2E27)] hover:bg-[var(--ns-ash-50,#F3F5F4)]'"
            >
              <AppIcon :name="item.icon" :size="17" />
              {{ t(item.label) }}
            </router-link>
          </nav>

          <!-- User controls -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="relative p-2 rounded-lg text-[var(--ns-ash-600,#4F5B57)] hover:text-[var(--ns-lake-800,#185746)] hover:bg-[var(--ns-ash-50,#F3F5F4)] transition"
              :title="t('nav.notifications')"
              :aria-label="t('nav.notifications')"
              @click="router.push('/citizen/reports')"
            >
              <AppIcon name="notification" :size="19" />
              <span
                class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--ns-flamingo-600,#B8325A)]"
                aria-hidden="true"
              />
            </button>

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

      <!-- Mobile bottom-style sub nav -->
      <div class="md:hidden border-t border-[var(--ns-ash-200,#D5DBD9)] bg-[var(--ns-ash-50,#F3F5F4)] px-2 py-1.5 flex justify-around">
        <router-link
          v-for="item in mobileNav"
          :key="item.to"
          :to="item.to"
          class="px-2.5 py-1.5 text-[11px] font-medium rounded-md flex flex-col items-center gap-0.5"
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

    <!-- Primary action (mobile) -->
    <div class="md:hidden sticky bottom-0 z-30 border-t border-[var(--ns-ash-200,#D5DBD9)] bg-white/95 backdrop-blur px-4 py-3">
      <BaseButton variant="primary" block icon="plus" @click="router.push('/citizen/report-new')">
        {{ t('nav.reportNew') }}
      </BaseButton>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-[var(--ns-ash-200,#D5DBD9)] py-4 px-6 text-center text-xs text-[var(--ns-ash-600,#4F5B57)]">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2">
        <p>© 2026 Nakuru County · {{ t('tagline') }}</p>
        <div class="flex items-center gap-3">
          <BaseBadge :variant="online ? 'resolved' : 'stale'" size="sm" :dot="true">
            {{ online ? t('offline.online') : t('offline.offline') }}
          </BaseBadge>
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
}

const PRIMARY: NavItem[] = [
  { to: '/citizen/reports', label: 'nav.reports', icon: 'report' },
  { to: '/citizen/payments', label: 'nav.payments', icon: 'reference-number' },
  { to: '/citizen/community', label: 'nav.community', icon: 'users' },
];

const MOBILE: NavItem[] = [
  { to: '/citizen/reports', label: 'nav.reports', shortLabel: 'nav.reports', icon: 'report' },
  { to: '/citizen/payments', label: 'nav.payments', shortLabel: 'nav.payments', icon: 'reference-number' },
  { to: '/citizen/community', label: 'nav.community', shortLabel: 'nav.community', icon: 'users' },
  { to: '/citizen/report-new', label: 'nav.reportNew', shortLabel: 'nav.reportNew', icon: 'plus' },
];

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { online } = useOnlineStatus();
const { t, locale, toggleLocale } = useI18n();

const primaryNav = computed(() => PRIMARY);
const mobileNav = computed(() => MOBILE);

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`);
}

async function handleLogout(): Promise<void> {
  await authStore.logout();
  router.push('/citizen/login');
}
</script>
