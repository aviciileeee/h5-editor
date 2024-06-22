<script setup lang="ts">
import { TextComponentProps } from '@/defaultProps'
import { mapPropsToForms, PropsToForms } from '@/propsMap'
import { reduce } from 'lodash-es'
import { computed, defineProps,PropType, defineEmits } from 'vue'
interface FormProps {
  component: string;
  subComponent?: string;
  value: string | number;
  extraProps?: {
    [key: string]: any;
  };
  text?: string;
  options?: {text: string; value: any}[]; 
  initialTransform?: (v: any) => any; 
  valueProp?: string;
  eventName: string;
  events: {[key: string]: (e: any) => void};
}
const props = defineProps({
  props: {
    type: Object as PropType<TextComponentProps>,
    required: true
  }
})
const emits = defineEmits(['change'])
const finalProps = computed(() => {
  return reduce(props.props, (result, value, key) => {
    const newKey = key as keyof TextComponentProps
    const item = mapPropsToForms[newKey]
    if(item) {
      const {valueProp = 'value', eventName = 'change', initialTransform, afterTransform } = item
      const newItem: FormProps = {
        ...item,
        value: initialTransform ? initialTransform(value) : value,
        valueProp,
        eventName,
        events: {
          [eventName]: (e: any) => { emits('change', {key, value: afterTransform ? afterTransform(e) : e})}
        }
      }
      // item.value = item.initialTransform ? item.initialTransform(value) : value
      // item.valueProp = item.valueProp ? item.valueProp : 'value'
      result[newKey] = newItem
    }
    return result
  }, {} as {[key: string]: FormProps})
})
</script>
<template>
<div class="props-table">
  <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
    <span class="label" v-if="value?.text">{{ value.text }}</span>
    <div class="prop-component">
      <component v-if="value" :is="value.component" v-on="value.events" :[value.valueProp!]="value.value" v-bind="value.extraProps">
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