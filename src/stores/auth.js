import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const SESSION_KEY = 'livros-auth-session'
const USERS_KEY = 'livros-auth-users'

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
  } catch {
    return null
  }
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const status = ref('idle')
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  function init() {
    const session = loadSession()
    if (session?.user && session?.token) {
      user.value = session.user
      token.value = session.token
    }
  }

  async function signUp({ name, email, password }) {
    status.value = 'loading'
    error.value = null

    const users = loadUsers()

    if (users.some((existing) => existing.email === email)) {
      status.value = 'error'
      error.value = 'This email is already registered.'
      return false
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
    }

    users.push(newUser)
    saveUsers(users)

    const session = {
      token: `token-${Date.now()}`,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    }

    user.value = session.user
    token.value = session.token
    saveSession(session)
    status.value = 'success'
    return true
  }

  async function signIn({ email, password }) {
    status.value = 'loading'
    error.value = null

    const users = loadUsers()
    const existing = users.find((account) => account.email === email && account.password === password)

    if (!existing) {
      status.value = 'error'
      error.value = 'Invalid email or password.'
      return false
    }

    const session = {
      token: `token-${Date.now()}`,
      user: { id: existing.id, name: existing.name, email: existing.email },
    }

    user.value = session.user
    token.value = session.token
    saveSession(session)
    status.value = 'success'
    return true
  }

  function signOut() {
    user.value = null
    token.value = null
    status.value = 'idle'
    error.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  return {
    user,
    token,
    status,
    error,
    isAuthenticated,
    init,
    signUp,
    signIn,
    signOut,
  }
})
