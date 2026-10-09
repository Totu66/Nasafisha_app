<template>
<<<<<<< HEAD
  <div class="min-h-screen bg-white">
    <Header />
    <div class="mt-4">
      <RouterView />
      <!-- LOGIN MODAL -->      
      <div
        v-if="auth.isLoginModalOpen"
        class="modal-overlay"
        id="login-form"
        @click="closeModal()"
      >
        <div class="modal-content max-w-7xl" @click.stop>
          <LoginEmail />
        </div>
      </div>
    </div>
    <Footer />
=======
  <div class="min-h-screen bg-slate-100 text-slate-800">
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">N</div>
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Nasafisha</p>
            <p class="text-sm font-semibold">Waste operations dashboard</p>
          </div>
        </div>

        <div class="flex items-center gap-2 text-sm font-medium">
          <router-link class="rounded-full px-3 py-2 hover:bg-slate-100" to="/admin">Admin</router-link>
          <router-link class="rounded-full px-3 py-2 hover:bg-slate-100" to="/citizen/reports">Citizen</router-link>
          <router-link class="rounded-full px-3 py-2 hover:bg-slate-100" to="/field/tickets">Field</router-link>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl p-6">
      <router-view />
    </main>
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useAuthStore } from "./store";
import LoginEmail from "@/components/LoginEmail.vue";

/**VARIABLES */
const auth = useAuthStore();

/**FUNCTIONS*/
const closeModal = () => {
  auth.isLoginModalOpen = false;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 26;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
=======
</script>
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
