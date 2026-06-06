<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <label class="search-label" for="search-input">Pesquisar</label>
    <input
      id="search-input"
      class="search-input"
      type="search"
      :value="modelValue"
      @input="updateValue"
      placeholder="por título, autor ou categoria"
    />
  </div>
</template>

<style scoped></style>
