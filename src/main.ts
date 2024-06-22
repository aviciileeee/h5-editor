import { createApp } from "vue"
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'
import router from './router'
import App from "./App.vue"

const pinia = createPinia()
createApp(App).use(Antd).use(router).use(pinia).mount("#app")
