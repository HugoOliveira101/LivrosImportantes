<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})
const emit = defineEmits(['page-change'])

function changePage(value) {
  if (value < 1 || value > props.totalPages) return
  emit('page-change', value)
}
</script>

<template>
  <div class="pagination-controls">
    <button @click="changePage(page - 1)" :disabled="page === 1">Anterior</button>
    <span>Página {{ page }} of {{ totalPages }}</span>
    <button @click="changePage(page + 1)" :disabled="page === totalPages">Próxima</button>
  </div>
</template>

<style scoped></style>
