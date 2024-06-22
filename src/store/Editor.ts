import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { TextComponentProps } from '../defaultProps'
export interface EditorProps<T> {
  components: ComponentData<T>[];
  currentElement: ComponentData<T>;
}

export interface ComponentData<T> {
  props: T;
  id: string;
  name: string;
}

export const testComponents: ComponentData<Partial<TextComponentProps>>[] = [
  { id: uuidv4(), name: 'l-text',props: { text:'hello', lineHeight: '1', fontSize: '20px', color: 'red', textAlign: 'center', fontFamily: 'FangSon'} },
  { id: uuidv4(), name: 'l-text',props: { text:'hello2', fontSize: '15px',lineHeight: '1', fontWeight: 'bold', textAlign: 'right '} },
  { id: uuidv4(), name: 'l-text',props: { text:'hello3', fontSize: '10px', actionType: 'url', url: 'https://www.baidu.com/'} }
]

export const useEditorStore = defineStore('editorStore', () => {
  const components = ref(testComponents)
  const currentElement = ref<ComponentData<Partial<TextComponentProps>>>()
  const addComponent = (props: Partial<TextComponentProps>) => {
    components.value.push({ id: uuidv4(), name: 'l-text', props})
  }
  const setActive = (id: string) => {
    const activeElement = components.value.find(item => item.id === id)
    currentElement.value = activeElement
  }
  const updateComponent = ({key, value}: {key: keyof TextComponentProps; value: any}) => {
    if(currentElement.value) {
      currentElement.value.props[key] = value
    }
  }
  return {
    components,
    currentElement,
    addComponent,
    setActive,
    updateComponent
  }
})

