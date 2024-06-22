import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
export interface EditorProps {
  components: ComponentData[];
  currentElemet: string;
}

export interface ComponentData {
  props: {
    [key: string]: any;
  };
  id: string;
  name: string;
}

export const testComponents: ComponentData[] = [
  { id: uuidv4(), name: 'l-text',props: { text:'hello', fontSize: '20px', color: 'red'} },
  { id: uuidv4(), name: 'l-text',props: { text:'hello2', fontSize: '15px', fontWeight: 'bold'} },
  { id: uuidv4(), name: 'l-text',props: { text:'hello3', fontSize: '10px', actionType: 'url', url: 'https://www.baidu.com/'} }
]

export const useEditorStore = defineStore('editorStore', () => {
  const components = ref(testComponents)
  const currentElement = ref('')
  const addComponent = (props: {[key: string]: any}) => {
    components.value.push({ id: uuidv4(), name: 'l-text', props})
  }
  return {
    components,
    currentElement,
    addComponent
  }
})

