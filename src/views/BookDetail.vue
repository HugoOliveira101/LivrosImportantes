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
    <div class="detail-header">
      <router-link class="back-link" to="/">← Voltar ao catálogo</router-link>
    </div>

    <div v-if="!book" class="detail-message">
      <h2>Livro não encontrado</h2>
      <p>Verifique o catálogo e tente novamente.</p>
    </div>

    <div v-else class="detail-grid">
      <section class="book-summary">
        <span class="book-category">{{ book.category }}</span>
        <h1>{{ book.title }}</h1>
        <p class="book-author">Por {{ book.author }}</p>
        <p class="book-description">{{ book.description }}</p>

        <div class="actions-row">
          <button class="button button--primary" @click="openReader">Ler online</button>
          <a
            class="button button--secondary"
            :href="book.pdf_url"
            target="_blank"
            rel="noopener"
            download
            >Baixar PDF</a
          >
          <button class="button button--ghost" @click="handleToggleLike">
            {{ isLiked ? 'Descurtir' : 'Curtir' }} ({{ interaction.likes }})
          </button>
        </div>
      </section>

      <section class="comment-panel">
        <h2>Comentários</h2>
        <div v-if="auth.isAuthenticated" class="comment-form">
          <textarea v-model="commentText" rows="4" placeholder="Escreva seu comentário"></textarea>
          <button class="button button--primary" @click="submitComment">
            Adicionar comentário
          </button>
        </div>
        <div v-else class="comment-hint">
          <p>Entre para comentar e curtir livros.</p>
          <router-link class="button button--secondary" to="/login">Login</router-link>
        </div>

        <div v-if="interaction.comments.length === 0" class="no-comments">
          <p>Ainda não há comentários. Seja o primeiro a compartilhar uma opinião.</p>
        </div>

        <ul v-else class="comment-list">
          <li v-for="comment in interaction.comments" :key="comment.id">
            <div class="comment-header">
              <span>{{ comment.author }}</span>
              <span>{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
            </div>
            <p>{{ comment.text }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

