<template>
    <Uploader action="https://jsonplaceholder.typicode.com/posts/"/>

 <a-layout style="display: flex;minHeight: 100%;">
  <a-layout-header :style="headerStyle">
    <h1 @click="router.push('/')">编辑器</h1>
  </a-layout-header>
  <a-layout-content :style="contentStyle">
    <RouterView/>
  </a-layout-content>
  <a-layout-footer :style="footerStyle">CopyRight Info</a-layout-footer>
</a-layout>
</template>

<script lang="ts" setup>
import Uploader from './components/Uploader.vue'
import type { CSSProperties } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const headerStyle: CSSProperties = {
  textAlign: 'left',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
}

const contentStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  flex: 1,
  backgroundColor: '#fff'
}

const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#000',
  backgroundColor: '#eeeeee',
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
