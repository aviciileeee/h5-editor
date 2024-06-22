<script lang="ts" setup>
import LText from '@/components/LText.vue'
import { defineOptions } from 'vue'
import ComponentsList from '@/components/ComponentsList.vue'
import EditorWrapper from '@/components/EditorWrapper.vue'
import PropsTable from '@/components/PropsTable.vue'
import { defaultTextTemplates } from '../defaultTemplates'
import { useEditorStore } from '../store/Editor'
import { TextComponentProps } from '@/defaultProps'
defineOptions({
  components: {
    LText
  }
})
const editorStore = useEditorStore()
const addItem = (props: any) => {
  editorStore.addComponent(props)
}
const handleChange = (e: {key: keyof TextComponentProps; value: any}) => {
  editorStore.updateComponent(e)
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
    <a-layout-sider width="300" :style="{backgroundColor: '#fff'}">
      <div class="slider-container">
        组件列表
        <ComponentsList :list="defaultTextTemplates" @onItemClick="addItem"/>
      </div>
    </a-layout-sider>
    <a-layout :style="{padding: '0 24px 24px'}">
      <a-layout-content class="preview-container">
        <p>画布区域:</p>
        <div class="preview-list" id="canvas-area">
           <editor-wrapper 
            v-for="component in editorStore.components" 
            :key="component.id"
            :id="component.id"
            :active="editorStore.currentElement?.id === component.id"
            @setActive="editorStore.setActive"
            >
            <component :is="component.name" v-bind="component.props"></component>
          </editor-wrapper>
        </div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="300" :style="{backgroundColor: '#fff'}" class="settings">
      组件属性
        <props-table 
        v-if="editorStore.currentElement && editorStore.currentElement.props" 
        :props="editorStore.currentElement.props"
        @change="handleChange">
        </props-table>
        <pre>
          {{ editorStore.currentElement && editorStore.currentElement.props}}
        </pre>
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
  .settings {
    text-align: left;
  }
</style>