<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

async function handleSubmit() {
  const success = await auth.signUp({
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value,
  })
  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-5">
      <div class="card border-0 bg-dark text-white">
        <div class="card-body p-4">
          <h1 class="h3 mb-2">Criar conta</h1>
          <p class="text-muted mb-4 text-white-50">
            Registre-se e salve comentários, curta e acesse o leitor online.
          </p>

          <div class="mb-3">
            <label class="form-label">Nome</label>
            <input type="text" v-model="name" class="form-control" placeholder="Seu nome" />
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              placeholder="you@example.com"
            />
          </div>

          <div class="mb-4">
            <label class="form-label">Senha</label>
            <input type="password" v-model="password" class="form-control" placeholder="••••••••" />
          </div>

          <button class="btn btn-primary w-100 btn-dark" @click.prevent="handleSubmit">Criar conta</button>

          <p class="text-center text-muted mt-3 mb-0 text-white-50">
            Já tem uma conta? <router-link to="/login">Login</router-link>
          </p>

          <div v-if="auth.error" class="alert alert-danger mt-3 mb-0">{{ auth.error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
