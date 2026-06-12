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
  <header class="navbar navbar-expand-lg navbar-light bg-black shadow-sm rounded-4 mb-4 py-3 px-3">
    <div class="container-fluid px-0 align-items-center d-flex justify-content-between gap-3">
      <router-link class="navbar-brand fw-semibold mb-0 text-white" to="/">Livros Importantes</router-link>

      <div class="d-flex flex-wrap align-items-center gap-2">        
        <template v-if="auth.isAuthenticated">
          <span class="text-muted text-white-50">Olá, {{ userName }}</span>
          <button type="button" class="btn btn-outline-secondary btn-sm " @click="handleSignOut">
            Sair
          </button>
        </template>
        <template v-else>
          <router-link class="btn btn-sm text-white-50" to="/login">Login</router-link>
          <router-link class="btn btn-primary btn-sm btn-dark" to="/register">Cadastrar</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
