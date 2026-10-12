<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">N</div>
        <div>
          <h1>Nasafisha</h1>
          <p>Environmental Cleaning Management System</p>
        </div>
      </div>

      <div class="login-header">
        <h2>County Sign In</h2>
        <p>Sign in to access the Nasafisha management dashboard.</p>
      </div>

      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="login-button">
          Sign In
        </button>
      </form>

      <div class="demo-info">
        <strong>Demo account</strong>
        <p>Email: admin@nasafisha.go.ke</p>
        <p>Password: password123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const login = () => {
  errorMessage.value = ''

  if (
    email.value === 'admin@nasafisha.go.ke' &&
    password.value === 'password123'
  ) {
    localStorage.setItem('nasafisha_logged_in', 'true')
    localStorage.setItem('nasafisha_user_role', 'Executive')

    router.push('/dashboard')
    return
  }

  errorMessage.value = 'Invalid email or password.'
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f1f5f9;
  font-family: Arial, sans-serif;
}

.login-card {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border-radius: 16px;
  padding: 36px;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
}

.logo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #0f766e;
  color: white;
  font-size: 22px;
  font-weight: 700;
}

.brand h1 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
}

.brand p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.login-header {
  margin-bottom: 24px;
}

.login-header h2 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 26px;
}

.login-header p {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  font-size: 15px;
}

.form-group input:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.login-button {
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 14px;
  background: #0f766e;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.login-button:hover {
  background: #115e59;
}

.error-message {
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 7px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 14px;
}

.demo-info {
  margin-top: 24px;
  padding: 14px;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
}

.demo-info strong {
  display: block;
  margin-bottom: 6px;
  color: #334155;
}

.demo-info p {
  margin: 3px 0;
}
</style>
