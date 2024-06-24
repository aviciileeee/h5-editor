import { setActivePinia, createPinia } from 'pinia'
import { VueWrapper, mount } from '@vue/test-utils'
import { message } from 'ant-design-vue'
import Userprofile from '@/components/UserProfile.vue'
import { useUserStore } from '@/store/User'
jest.mock('ant-design-vue', () => ({
  message: {
    success: jest.fn()
  }
}))
// jest.mock('pinia')
const mockRoutes: string[] = []
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: (url: string) => mockRoutes.push(url)
  })
}))
const mockComponents = {
   template: '<div><slot></slot></div>'
}
let wrapper: VueWrapper<any>

describe('UserProfile Component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    setActivePinia(createPinia())
    wrapper = mount(Userprofile, {
      props: {
        user: {
          isLogin: false
        }
      },
      global: {
        components: {
          'a-button': mockComponents
        }
      }
    },
)
  })
  it('should render login button when login is false', async() => {
    const userStore = useUserStore()
    expect(wrapper.get('div').text()).toBe('登录')
    await wrapper.get('div[type]').trigger('click')
    console.log(wrapper.get('div').html())
    expect(message.success).toHaveBeenCalled()
    expect(userStore.user.userName).toBe('avicii2')
  })
  it('should render username when login is true', async () => {
    await wrapper.setProps({
      user: {
        isLogin: true,
        userName: 'avicii '
      }
    })
    console.log(wrapper.html())
    expect(wrapper.get('div.username').text()).toBe('avicii')
    expect(wrapper.find('div.username').exists()).toBeTruthy()
  })

  it('should call logout and show message, call router.push after timeout', async () => {
    const userStore = useUserStore()
    await wrapper.setProps({
      user: {
        isLogin: true,
        userName: 'avicii '
      }
    })
    await wrapper.get('div.logout').trigger('click')
    expect(userStore.user.isLogin).toBeFalsy()
    expect(message.success).toHaveBeenCalledTimes(1)
    jest.runAllTimers()
    expect(mockRoutes).toEqual(['/'])
  })

  afterEach(() => {
    (message as jest.Mocked<typeof message>).success.mockReset()
  })
})