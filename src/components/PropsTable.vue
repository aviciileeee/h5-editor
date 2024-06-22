<script setup lang="ts">
import { TextComponentProps } from '@/defaultProps'
import { mapPropsToForms, PropsToForms } from '@/propsMap'
import { reduce } from 'lodash-es'
import { computed, defineProps,PropType } from 'vue'
const props = defineProps({
  props: {
    type: Object as PropType<TextComponentProps>,
    required: true
  }
})
const finalProps = computed(() => {
  return reduce(props.props, (result, value, key) => {
    const newKey = key as keyof TextComponentProps
    const item = mapPropsToForms[newKey]
    if(item) {
      item.value = item.initialTransform ? item.initialTransform(value) : value
      item.valueProp = item.valueProp ? item.valueProp : 'value'
      result[newKey] = item
    }
    return result
  }, {} as PropsToForms)
})
// finalProps.value
</script>
<template>
<div class="props-table">
  <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
    <span class="label" v-if="value?.text">{{ value.text }}</span>
    <div class="prop-component">
      <component v-if="value" :is="value.component" :[value.valueProp!]="value.value" v-bind="value.extraProps">
        <template v-if="value.options">
            <component :is="value.subComponent" v-for="(option, k) in value.options" :key="k" :value="option.value">{{ option.text }}</component>
        </template>
      </component>
    </div>
  </div>
</div>
</template>

<style  scoped>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  width: 28%;
}
.prop-component {
  width: 70% ;
}
</style>