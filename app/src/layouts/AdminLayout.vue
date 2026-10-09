<<<<<<< HEAD
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppTopNav from '@/components/common/AppTopNav.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import { ADMIN_NAV } from '@/config/adminNav'
import { usePermission } from '@/composables/usePermission'
import { useAuthStore } from '@/store/auth.store'

const auth = useAuthStore()
const router = useRouter()
const { t } = useI18n()
const { can } = usePermission()

const visibleNav = computed(() => ADMIN_NAV.filter((item) => can(item.permission)))
const roleLabel = computed(() => (auth.role ? t(`roles.${auth.role}`) : ''))

async function handleLogout() {
  auth.logout()
  await router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-stone-50">
    <a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>
    <AppTopNav :user-name="auth.user?.name ?? ''" :role-label="roleLabel" @logout="handleLogout" />
    <div class="flex flex-1">
      <AppSidebar :items="visibleNav" />
      <main id="main" class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
=======
<template><div class="min-h-screen bg-slate-100"><h2 class="p-4 text-lg font-semibold">AdminLayout</h2><slot /></div></template><script setup lang="ts"></script>
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
