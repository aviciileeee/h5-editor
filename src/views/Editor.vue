<script lang="ts">
import LText from '../components/LText.vue'
export default {
  components: {
    LText
  }
}
</script>
<script setup lang="ts">
import ComponentsList from '../components/ComponentsList.vue'
import { defaultTextTemplates } from '../defaultTemplates'
import { useEditorStore } from '../store/Editor'
const editorStore = useEditorStore()
const addItem = (props: any) => {
  editorStore.addComponent(props)
}
</script>
<template>
<div class="editor" id="editor-layout-main">
  <a-layout :style="{backgroundColor: '#fff'}">
    <a-layout-header class="header" :style="{color: '#fff'}">
      编辑器
    </a-layout-header>
  </a-layout>
  <a-layout>
    <a-layout-sider width="300" :style="{backgroundColor: 'yellow'}">
      <div class="slider-container">
        组件列表
        <ComponentsList :list="defaultTextTemplates" @onItemClick="addItem"/>
      </div>
    </a-layout-sider>
    <a-layout :style="{padding: '0 24px 24px'}">
      <a-layout-content class="preview-container">
        <p>画布区域</p>
        <div class="preview-list" id="canvas-area">
          <!-- <div v-for="item in editorStore.components" :key="item.id">{{ item.props.text }}</div> -->
           <component 
            v-for="component in editorStore.components" 
            :key="component.id"
            :is="component.name"
            v-bind="component.props"></component>
        </div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="300" :style="{backgroundColor: 'purple'}" class="settings">
        组件属性
    </a-layout-sider>
  </a-layout>

</div>
</template>

<style  scoped>
.preview-list {
  color: #000;
  position: relative;
  min-height: 500px;
}
::v-deep .l-text-component {
    position: relative !important;
  }
</style>