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
  <div class="auth-page">
    <div class="auth-card">
      <h1>Criar conta</h1>
      <p>Registre-se e salve comentários, curta e acesse o leitor online.</p>
      <label>
        Nome
        <input type="text" v-model="name" placeholder="Seu nome" />
      </label>
      <label>
        Email
        <input type="email" v-model="email" placeholder="you@example.com" />
      </label>
      <label>
        Senha
        <input type="password" v-model="password" placeholder="••••••••" />
      </label>
      <button class="button button--primary" @click.prevent="handleSubmit">Criar conta</button>
      <p class="auth-footer">Já tem uma conta? <router-link to="/login">Login</router-link></p>
      <p v-if="auth.error" class="auth-error">{{ auth.error }}</p>
    </div>
  </div>
</template>

