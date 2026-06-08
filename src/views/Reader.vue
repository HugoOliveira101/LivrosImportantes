<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '../stores/books'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const booksStore = useBooksStore()

onMounted(async () => {
  auth.init()
  if (!auth.isAuthenticated) {
    router.replace({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  await booksStore.loadBooks()
})

const bookId = computed(() => route.params.id)
const book = computed(() => booksStore.currentBook(bookId.value))
const pdfUrl = computed(() => book.value?.pdf_url)
</script>

<template>
  <div class="page-shell">
    <div class="mb-4">
      <router-link class="text-decoration-none text-muted text-white-50" :to="`/book/${bookId}`"
        >← Voltar ao livro</router-link
      >
    </div>

    <div v-if="!book" class="card shadow-sm border-0 p-4">
      <h2>Livro não disponível</h2>
      <p>O livro selecionado não pode ser encontrado no catálogo.</p>
    </div>

    <div v-else class="card shadow-sm border-0 p-4">
      <div class="d-flex flex-column gap-3 mb-4">
        <div>
          <h1 class="h4 mb-1">{{ book.title }}</h1>
          <p class="text-muted mb-0">Por {{ book.author }} · {{ book.category }}</p>
        </div>
        <div>
          <a
            class="btn btn-outline-secondary btn-sm text-white-50 btn-dark"
            :href="pdfUrl"
            target="_blank"
            rel="noopener"
            download
            >Baixar PDF</a
          >
        </div>
      </div>
      <div v-if="pdfUrl">
        <iframe class="reader-frame" :src="pdfUrl" title="Online book reader"></iframe>
      </div>
      <p v-else class="text-muted">Nenhum arquivo PDF disponível para este livro.</p>
    </div>
  </div>
</template>
