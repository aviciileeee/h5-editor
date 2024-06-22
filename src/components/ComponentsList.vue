<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import LText from './LText.vue'
const props = defineProps({
  list: {
    type: Array,
    required: true
  }
})

const emits = defineEmits(['on-item-click'])
const onItemClick = (data: any) => {
  emits('on-item-click', data)
}
</script>
<template>
<div class="create-component-list">
  <div  v-for="(item,index) in list" :key="index"  class="component-item" @click="onItemClick(item)">
    <l-text v-bind="item"></l-text>
  </div>
</div>
</template>

<style lang="scss" scoped>
</style>