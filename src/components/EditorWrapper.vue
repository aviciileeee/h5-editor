<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['set-active'])
const onItemClick = (id: string) => {
  emits('set-active', id)
}
</script>
<template>
<div class="editor-wrapper" @click="onItemClick(id)" :class="{active: active}">
  <slot></slot>
</div>
</template>

<style scoped>
.editor-wrapper {
  padding: 0;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
}
.editor-wrapper:hover {
  border: 1px solid #ccc
}
.editor-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
</style>