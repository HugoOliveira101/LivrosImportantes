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

const description = 'Pesquise e explore uma coleção de livros importantes em diversas categorias.'

const categories = computed(() => booksStore.categories)
const pagedBooks = computed(() => booksStore.pagedBooks)
const totalPages = computed(() => booksStore.totalPages)
</script>

<template>
  <div class="page-shell">
    <NavBar />

    <section class="mb-4">
      <div class="hero-panel p-4 p-md-5">
        <p class="text-uppercase text-muted mb-2 small text-white-50">Catálogo de Livros</p>
        <p class="mb-0 text-white-50">{{ description }}</p>
      </div>
    </section>

    <section>
      <div class="row g-3 align-items-center mb-4">
        <div class="col-12 col-lg-7">
          <SearchBar v-model="booksStore.query" />
        </div>
        <div class="col-12 col-lg-5">
          <div class="d-flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              @click="booksStore.setCategory(cat)"
              :class="[
                'btn btn-sm',
                booksStore.category === cat ? 'btn-primary' : 'btn-outline-secondary',
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="booksStore.status === 'loading'" class="alert alert-info">Carregando livros…</div>
      <div v-else-if="booksStore.error" class="alert alert-danger">{{ booksStore.error }}</div>
      <div v-else-if="pagedBooks.length === 0" class="alert alert-secondary">
        Nenhum livro encontrado para sua pesquisa.
      </div>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        <div class="col" v-for="book in pagedBooks" :key="book.id">
          <BookCard :book="book" />
        </div>
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
