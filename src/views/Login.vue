<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  const success = await auth.signIn({ email: email.value.trim(), password: password.value })
  if (success) {
    const redirect = route.query.redirect?.toString() || '/'
    router.push(redirect)
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-5">
      <div class="card shadow-sm border-0 bg-dark text-white">
        <div class="card-body p-4">
          <h1 class="h3 mb-2">Login</h1>
          <p class="text-muted mb-4 text-white-50">
            Entre com suas credenciais para acessar o leitor e recursos de comentários.
          </p>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              placeholder="você@exemplo.com"
            />
          </div>

          <div class="mb-4">
            <label class="form-label">Senha</label>
            <input type="password" v-model="password" class="form-control" placeholder="••••••••" />
          </div>

          <button class="btn btn-primary w-100 btn-ghost" @click.prevent="handleSubmit">Login</button>

          <p class="text-center text-muted mt-3 mb-0 text-white-50">
            Não tem uma conta? <router-link to="/register">Crie uma</router-link>
          </p>

          <div v-if="auth.error" class="alert alert-danger mt-3 mb-0">{{ auth.error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
