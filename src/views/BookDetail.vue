<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '../stores/books'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const booksStore = useBooksStore()

const commentText = ref('')

onMounted(async () => {
  auth.init()
  await booksStore.loadBooks()
})

const bookId = computed(() => route.params.id)
const book = computed(() => booksStore.currentBook(bookId.value))
const interaction = computed(() => booksStore.interactionFor(bookId.value))
const isLiked = computed(() => interaction.value.likedBy.includes(auth.user?.id || ''))

function openReader() {
  router.push(`/reader/${bookId.value}`)
}

function handleToggleLike() {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  booksStore.toggleLike(bookId.value, auth.user.id)
}

function submitComment() {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }

  if (!commentText.value.trim()) {
    return
  }

  booksStore.addComment(bookId.value, {
    author: auth.user.name,
    userId: auth.user.id,
    text: commentText.value.trim(),
  })
  commentText.value = ''
}
</script>

<template>
  <div class="page-shell">
    <div class="mb-4">
      <router-link class="text-decoration-none text-muted text-white-50" to="/">← Voltar ao catálogo</router-link>
    </div>

    <div v-if="!book" class="card shadow-sm border-0 p-4">
      <h2>Livro não encontrado</h2>
      <p>Verifique o catálogo e tente novamente.</p>
    </div>

    <div v-else class="row g-4">
      <div class="col-12 col-xl-7">
        <div class="card shadow-sm border-0 h-100 p-4">
          <span class="badge bg-secondary mb-3 text-uppercase">{{ book.category }}</span>
          <h1 class="h3">{{ book.title }}</h1>
          <p class="text-muted mb-3">Por {{ book.author }}</p>
          <p class="text-body-secondary mb-4">{{ book.description }}</p>

          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-primary btn-dark" @click="openReader">Ler online</button>
            <a
              class="btn btn-outline-secondary text-white-50 btn-dark"
              :href="book.pdf_url"
              target="_blank"
              rel="noopener"
              download
            >
              Baixar PDF
            </a>
            <button class="btn btn-outline-secondary text-white-50 btn-dark" @click="handleToggleLike">
              {{ isLiked ? 'Descurtir' : 'Curtir' }} ({{ interaction.likes }})
            </button>
          </div>
        </div>
      </div>

      <div class="col-12 col-xl-5">
        <div class="card shadow-sm border-0 p-4 h-100 d-flex flex-column gap-4">
          <div>
            <h2 class="h5">Comentários</h2>
          </div>

          <div v-if="auth.isAuthenticated">
            <div class="mb-3">
              <textarea
                v-model="commentText"
                rows="4"
                class="form-control"
                placeholder="Escreva seu comentário"
              ></textarea>
            </div>
            <button class="btn btn-primary w-100 btn-dark" @click="submitComment">
              Adicionar comentário
            </button>
          </div>

          <div v-else class="alert alert-secondary">
            <p class="mb-3">Entre para comentar e curtir livros.</p>
            <router-link class="btn btn-dark" to="/login">Login</router-link>
          </div>

          <div v-if="interaction.comments.length === 0" class="text-muted">
            Ainda não há comentários. Seja o primeiro a compartilhar uma opinião.
          </div>

          <ul v-else class="list-group comment-list">
            <li
              v-for="comment in interaction.comments"
              :key="comment.id"
              class="list-group-item px-0 py-3"
            >
              <div class="d-flex justify-content-between align-items-center mb-2 text-muted small">
                <span>{{ comment.author }}</span>
                <span>{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
              </div>
              <p class="mb-0">{{ comment.text }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
