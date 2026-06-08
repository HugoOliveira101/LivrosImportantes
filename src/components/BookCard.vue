<script setup>
import { defineProps, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  book: { type: Object, required: true },
})

const auth = useAuthStore()
const canDownload = computed(() => props.book?.pdf_url)
</script>

<template>
  <article class="card h-100 border-0 shadow-sm">
    <div class="card-body d-flex flex-column">
      <div class="mb-3">
        <span class="badge bg-secondary text-uppercase">{{ book.category }}</span>
      </div>
      <h3 class="card-title h5">{{ book.title }}</h3>
      <p class="text-muted mb-2">{{ book.author }}</p>
      <p class="card-text text-body-secondary flex-grow-1">{{ book.description }}</p>
      <div class="mt-4 d-flex flex-wrap gap-2">
        <router-link class="btn btn-primary btn-sm btn-dark" :to="`/book/${book.id}`"
          >Ver detalhes</router-link
        >
        <a
          v-if="canDownload"
          class="btn btn-outline-secondary btn-sm text-white-50 btn-dark"
          :href="book.pdf_url"
          target="_blank"
          rel="noopener"
          download
        >
          Download
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped></style>
