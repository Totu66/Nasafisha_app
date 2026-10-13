<template>
  <div class="min-h-screen bg-[var(--ns-ash-50,#F3F5F4)] flex font-sans">
    <!-- Sidebar -->
    <aside
      class="hidden lg:flex flex-col w-64 shrink-0 bg-[var(--ns-lake-900,#0F2E27)] text-emerald-100 sticky top-0 h-screen"
    >
      <router-link to="/admin" class="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div
          class="w-9 h-9 rounded-xl bg-[var(--ns-primary,#1F6F5C)] flex items-center justify-center text-white font-bold shadow-xs"
          aria-hidden="true"
        >
          N
        </div>
        <div>
          <p class="text-sm font-bold text-white leading-tight">{{ t('app') }}</p>
          <p class="text-[11px] text-emerald-300/70">County control</p>
        </div>
      </router-link>

      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1" :aria-label="t('nav.admin')">
        <p class="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-400/60">
          Operations
        </p>
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition"
          :class="isActive(item.to)
            ? 'bg-[var(--ns-primary,#1F6F5C)] text-white shadow-xs'
            : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'"
        >
          <AppIcon :name="item.icon" :size="17" />
          <span class="truncate">{{ t(item.label) }}</span>
        </router-link>
      </nav>

      <div class="px-5 py-4 border-t border-white/10">
        <p class="text-[11px] text-emerald-300/60 leading-relaxed">
          SRS-NASAFISHA-001<br />
          <span class="font-mono">Role: {{ permission.label }}</span>
        </p>
      </div>
    </aside>

    <!-- Main column -->
    <div class="flex-1 min-w-0 flex flex-col">
      <!-- Top bar -->
      <header class="bg-white border-b border-[var(--ns-ash-200,#D5DBD9)] sticky top-0 z-40 shadow-xs">
        <div class="px-4 sm:px-6">
          <div class="flex items-center justify-between h-16 gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <!-- Mobile brand -->
              <div
                class="lg:hidden w-9 h-9 rounded-xl bg-[var(--ns-primary,#1F6F5C)] flex items-center justify-center text-white font-bold text-sm shrink-0"
                aria-hidden="true"
              >
                N
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-[var(--ns-lake-900,#0F2E27)] truncate">
                  {{ currentTitle }}
                </p>
                <p class="text-[11px] text-[var(--ns-ash-600,#4F5B57)] truncate">
                  {{ authStore.user?.name || 'County operations' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                class="hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--ns-ash-600,#4F5B57)] hover:bg-[var(--ns-ash-50,#F3F5F4)] transition"
                @click="toggleLocale()"
              >
                {{ locale === 'en' ? 'Kiswahili' : 'English' }}
              </button>

              <button
                type="button"
                class="p-2 rounded-lg text-[var(--ns-ash-600,#4F5B57)] hover:text-[var(--ns-lake-800,#185746)] hover:bg-[var(--ns-ash-50,#F3F5F4)] transition"
                :title="t('nav.notifications')"
                :aria-label="t('nav.notifications')"
              >
                <AppIcon name="notification" :size="19" />
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

        <!-- Mobile nav -->
        <div class="lg:hidden border-t border-[var(--ns-ash-200,#D5DBD9)] bg-[var(--ns-ash-50,#F3F5F4)] px-2 py-1.5 flex justify-around overflow-x-auto">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-2.5 py-1.5 text-[11px] font-medium rounded-md flex flex-col items-center gap-0.5 shrink-0"
            :class="isActive(item.to)
              ? 'bg-white shadow-xs text-[var(--ns-primary,#1F6F5C)] font-bold'
              : 'text-[var(--ns-ash-600,#4F5B57)]'"
          >
            <AppIcon :name="item.icon" :size="16" />
            {{ t(item.label) }}
          </router-link>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <router-view />
      </main>

      <footer class="border-t border-[var(--ns-ash-200,#D5DBD9)] bg-white py-4 px-6 text-center text-xs text-[var(--ns-ash-600,#4F5B57)]">
        © 2026 Nakuru County · {{ t('tagline') }}
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppIcon } from '../components/common';
import { useAuthStore } from '../store/auth.store';
import { usePermission } from '../composables/usePermission';
import { useI18n } from '../i18n';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'nav.dashboard', icon: 'dashboard' },
  { to: '/admin/tickets', label: 'nav.tickets', icon: 'report' },
  { to: '/admin/fleet', label: 'nav.fleet', icon: 'truck' },
  { to: '/admin/audit-logs', label: 'nav.audit', icon: 'audit-log' },
];

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const permission = usePermission();
const { t, locale, toggleLocale } = useI18n();

const navItems = computed(() => NAV_ITEMS);

const currentTitle = computed(() => {
  const matched = route.matched[route.matched.length - 1];
  const title = matched?.meta?.title;
  return typeof title === 'string' ? title : t('nav.dashboard');
});

function isActive(path: string): boolean {
  if (path === '/admin') return route.path === '/admin';
  return route.path === path || route.path.startsWith(`${path}/`);
}

async function handleLogout(): Promise<void> {
  await authStore.logout();
  router.push('/login');
}
</script>
