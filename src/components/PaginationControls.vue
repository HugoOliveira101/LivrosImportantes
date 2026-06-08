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
  <div class="d-flex align-items-center justify-content-center gap-3 py-3">
    <button
      class="btn btn-outline-secondary btn-sm text -white-50"
      @click="changePage(page - 1)"
      :disabled="page === 1"
    >
      Anterior
    </button>
    <span class="text-muted text-white-50">Página {{ page }} de {{ totalPages }}</span>
    <button
      class="btn btn-outline-secondary btn-sm text-white-50"
      @click="changePage(page + 1)"
      :disabled="page === totalPages"
    >
      Próxima
    </button>
  </div>
</template>

<style scoped></style>
