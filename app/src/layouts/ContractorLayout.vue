<template>
  <div class="min-h-screen flex flex-col bg-[var(--ns-cream,#F9F6EB)] font-sans">
    <!-- Yellow brand header -->
    <header class="sticky top-0 z-40 bg-[var(--ns-sun-500,#F5D142)] text-[var(--ns-lake-950,#081B17)] shadow-xs">
      <div class="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <router-link
          to="/contractor/scorecard"
          class="flex shrink-0 items-center gap-2.5"
        >
          <span
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ns-lake-950,#081B17)] text-sm font-extrabold text-[var(--ns-sun-500,#F5D142)]"
            aria-hidden="true"
          >
            N
          </span>
          <span class="text-base font-extrabold tracking-tight">NASAFISHA</span>
        </router-link>

        <nav
          class="hidden items-center gap-5 md:flex"
          aria-label="Contractor portal"
        >
          <router-link
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="relative flex h-16 items-center border-b-[3px] text-sm font-semibold transition"
            :class="isActive(item.to)
              ? 'border-[var(--ns-lake-950,#081B17)]'
              : 'border-transparent text-[var(--ns-lake-950,#081B17)]/65 hover:text-[var(--ns-lake-950,#081B17)]'"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="ml-auto flex items-center gap-3">
          <span class="hidden text-right text-xs leading-tight sm:block">
            <span class="block font-semibold">{{ companyName }}</span>
            <span class="text-[var(--ns-lake-950,#081B17)]/60">Contractor</span>
          </span>
          <span
            class="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ns-lake-950,#081B17)] text-sm font-bold text-white"
            aria-hidden="true"
          >
            {{ avatarInitial }}
          </span>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[var(--ns-lake-950,#081B17)]/10"
            title="Sign out"
            aria-label="Sign out"
            @click="handleLogout"
          >
            <AppIcon
              name="logout"
              :size="18"
            />
          </button>
        </div>
      </div>

      <!-- Mobile nav -->
      <nav
        class="flex border-t border-[var(--ns-lake-950,#081B17)]/15 md:hidden"
        aria-label="Contractor portal"
      >
        <router-link
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex-1 border-b-[3px] px-3 py-2.5 text-center text-xs font-semibold transition"
          :class="isActive(item.to)
            ? 'border-[var(--ns-lake-950,#081B17)]'
            : 'border-transparent text-[var(--ns-lake-950,#081B17)]/65'"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </header>

    <!-- Scope disclaimer strip -->
    <div class="border-b border-[var(--ns-ash-200,#D5DBD9)] bg-[var(--ns-cream,#F9F6EB)]">
      <div class="mx-auto flex max-w-7xl flex-col justify-between gap-1 px-4 py-2.5 text-[11px] text-[var(--ns-ash-600,#4F5B57)] sm:flex-row sm:px-6 lg:px-8">
        <span>Phase 3 concept · not part of the v1.0 MVP build</span>
        <span>Illustrative company and data; not confirmed scope or commitments.</span>
      </div>
    </div>

    <!-- Main content -->
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>

    <footer class="border-t border-[var(--ns-ash-200,#D5DBD9)] bg-white/60 py-4 px-6 text-center text-xs text-[var(--ns-ash-600,#4F5B57)]">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p>© 2026 Nakuru County · Franchise performance portal</p>
        <p class="font-mono text-[11px]">
          Read-only shared evidence standard · PRD F-004
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppIcon } from '../components/common';
import { useAuthStore } from '../store/auth.store';

interface NavItem {
  to: string;
  label: string;
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const nav: NavItem[] = [
  { to: '/contractor/scorecard', label: 'SLA scorecard' },
  { to: '/contractor/ledger', label: 'Proof audit' },
];

const companyName = computed(() => authStore.user?.companyName || 'Contractor account');
const avatarInitial = computed(() => companyName.value.trim().charAt(0).toUpperCase() || 'C');

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`);
}

async function handleLogout(): Promise<void> {
  await authStore.logout();
  router.push('/contractor/login');
}
</script>
