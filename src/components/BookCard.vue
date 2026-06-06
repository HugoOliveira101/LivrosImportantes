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
  <article class="book-card">
    <div class="book-card__meta">
      <span class="book-category">{{ book.category }}</span>
    </div>
    <h3>{{ book.title }}</h3>
    <p class="book-author">{{ book.author }}</p>
    <p class="book-description">{{ book.description }}</p>
    <div class="book-actions">
      <router-link class="button button--primary" :to="`/book/${book.id}`"
        >Ver detalhes</router-link
      >
      <a
        v-if="canDownload"
        class="button button--secondary"
        :href="book.pdf_url"
        target="_blank"
        rel="noopener"
        download
      >
        Download
      </a>
    </div>
  </article>
</template>

<style scoped></style>
