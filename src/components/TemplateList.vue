<script setup>
</script>
<template>
<div class="list">
  <a-row :gutter="16">
    <a-col :span="6" v-for="item in 10" :key="item">
      <a-card hoverable>
        <template #cover>
      <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
    </template>
    <a-card-meta title="Europe Street beat">
      <template #description>www.instagram.com</template>
    </a-card-meta>
      </a-card>
    </a-col>
  </a-row>
</div>
</template>

<style scoped>
.list {
  padding: 20px 40px;
}
</style>