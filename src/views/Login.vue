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
  <div class="auth-page">
    <div class="auth-card">
      <h1>Login</h1>
      <p>Entre com suas credenciais para acessar o leitor e recursos de comentários.</p>
      <label>
        Email
        <input type="email" v-model="email" placeholder="você@exemplo.com" />
      </label>
      <label>
        Senha
        <input type="password" v-model="password" placeholder="••••••••" />
      </label>
      <button class="button button--primary" @click.prevent="handleSubmit">Login</button>
      <p class="auth-footer">
        Não tem uma conta? <router-link to="/register">Crie uma</router-link>
      </p>
      <p v-if="auth.error" class="auth-error">{{ auth.error }}</p>
    </div>
  </div>
</template>

