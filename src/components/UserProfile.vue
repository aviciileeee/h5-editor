<script setup>
import { message,defineProps} from 'ant-design-vue'
import { useUserStore } from '@/store/User'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      isLogin: false,
      userName: ''
    })
  }
})
const handleLogin = () => {
  message.success('登录成功')
  userStore.user.userName = 'avicii2'
}
const handleLogout = () => {
  userStore.user.isLogin  = false
  message.success('退出成功')
  router.push('/')
}
</script>
<template>
<div>
  <a-button v-if="!props.user.isLogin" type="primary" @click="handleLogin">登录</a-button>
  <div v-if="props.user.isLogin" class="username">{{ props.user.userName }}</div>
  <a-button v-if="props.user.isLogin" class="logout" @click="handleLogout">登出</a-button>
</div>
</template>

<style lang="scss" scoped>
</style>