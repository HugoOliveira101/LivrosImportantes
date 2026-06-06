<script setup>
import { onMounted, computed } from 'vue'
import { useBooksStore } from '../stores/books'
import NavBar from '../components/NavBar.vue'
import SearchBar from '../components/SearchBar.vue'
import BookCard from '../components/BookCard.vue'
import PaginationControls from '../components/PaginationControls.vue'

const booksStore = useBooksStore()

onMounted(() => {
  booksStore.loadBooks()
})

const heading = 'Livros Importantes'
const description = 'Pesquise e explore uma coleção de livros importantes em diversas categorias.'

const categories = computed(() => booksStore.categories)
const pagedBooks = computed(() => booksStore.pagedBooks)
const totalPages = computed(() => booksStore.totalPages)
</script>

<template>
  <div class="page-shell">
    <NavBar />

    <section class="hero-panel">
      <div>
        <p class="eyebrow">Catálogo de Livros</p>
        <h1>{{ heading }}</h1>
        <p class="hero-text">{{ description }}</p>
      </div>
    </section>

    <section class="catalog-grid">
      <div class="catalog-controls">
        <SearchBar v-model="booksStore.query" />

        <div class="category-list">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="['category-button', { active: booksStore.category === cat }]"
            @click="booksStore.setCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div v-if="booksStore.status === 'loading'" class="status-message">Carregando livros…</div>
      <div v-else-if="booksStore.error" class="status-message status-error">
        {{ booksStore.error }}
      </div>
      <div v-else-if="pagedBooks.length === 0" class="status-message">
        Nenhum livro encontrado para sua pesquisa.
      </div>

      <div v-else class="cards-grid">
        <BookCard v-for="book in pagedBooks" :key="book.id" :book="book" />
      </div>

      <PaginationControls
        v-if="booksStore.totalPages > 1"
        :page="booksStore.page"
        :totalPages="totalPages"
        @page-change="booksStore.setPage"
      />
    </section>
  </div>
</template>
