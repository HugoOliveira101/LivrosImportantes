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
    <div class="reader-header">
      <router-link class="back-link" :to="`/book/${bookId}`">← Voltar ao livro</router-link>
    </div>

    <div v-if="!book" class="reader-empty">
      <h2>Livro não disponível</h2>
      <p>O livro selecionado não pode ser encontrado no catálogo.</p>
    </div>

    <div v-else class="reader-frame-wrapper">
      <h1>{{ book.title }}</h1>
      <p class="reader-meta">Por {{ book.author }} · {{ book.category }}</p>
      <div class="reader-actions">
        <a class="button button--secondary" :href="pdfUrl" target="_blank" rel="noopener" download
          >Baixar PDF</a
        >
      </div>
      <iframe class="reader-frame" v-if="pdfUrl" :src="pdfUrl" title="Online book reader"></iframe>
      <p v-else class="reader-empty">Nenhum arquivo PDF disponível para este livro.</p>
    </div>
  </div>
</template>

