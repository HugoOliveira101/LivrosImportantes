<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

auth.init()

const userName = computed(() => auth.user?.name || '')

function handleSignOut() {
  auth.signOut()
  router.push('/')
}
</script>

<template>
  <header class="site-header">
    <div class="brand">
      <router-link to="/">Livros Importantes</router-link>
    </div>

    <nav class="nav-links">
      <router-link to="/">Catálogo</router-link>
      <template v-if="auth.isAuthenticated">
        <span class="user-label">Olá, {{ userName }}</span>
        <button class="auth-button" @click="handleSignOut">Sair</button>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Registrar</router-link>
      </template>
    </nav>
  </header>
</template>

<style scoped></style>
