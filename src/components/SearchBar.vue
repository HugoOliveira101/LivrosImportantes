<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="mb-3">
    <label class="form-label visually-hidden" for="search-input">Pesquisar</label>
    <input
      id="search-input"
      class="form-control form-control-lg"
      type="search"
      :value="modelValue"
      @input="updateValue"
      placeholder="Pesquisar por título, autor ou categoria"
    />
  </div>
</template>

<style scoped></style>
