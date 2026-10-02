<template>
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
  </div>
</template>

<script setup>
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
