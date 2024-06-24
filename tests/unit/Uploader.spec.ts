import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import Uploader from '@/components/Uploader.vue'
import { flushPromises } from '@vue/test-utils'
import axios from 'axios'
import { Upload } from 'ant-design-vue'
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue'
const mockComponent = {
  template: '<div><slot></slot></div>'
}
const mockComponents = {
  "DeleteOutlined": mockComponent,
  "LoadingOutlined": mockComponent,
  "FileOutlined": mockComponent
}
let wrapper: VueWrapper<any>
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const testFile = new File(['xyz'],'test.png',{ type: 'image/png'})
const setInputValue = (input: HTMLInputElement) => {
  const files = [testFile] as any
    Object.defineProperty(input,'files', {
      value: files,
      writable: false
    })
}
describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: 'https://jsonplaceholder.typicode.com/posts/'
      },
      global: {
        stubs: mockComponents
      }
    })
  })
  it('basic layout before upload', () => {
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.get('button').text()).toBe('点击上传')
    expect(wrapper.get('input').isVisible()).toBeFalsy()
  })

  it('upload process should works files', async () => {
    mockedAxios.post.mockImplementationOnce(async () => Promise.resolve({data: 'success'}))
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    // const files = [testFile] as any
    // Object.defineProperty(fileInput,'files', {
    //   value: files,
    //   writable: false
    // })
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').text()).toBe('正在上传')
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')
    expect(wrapper.findAll('li').length).toBe(1)
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-loading')
    await flushPromises()
    expect(wrapper.get('button').text()).toBe('点击上传')
    expect(firstItem.classes()).toContain('upload-success')
    expect(firstItem.get('.filename').text()).toBe(testFile.name)

  })
  it('should return error text when post is rejected', async () => {
    mockedAxios.post.mockImplementationOnce(async () =>  Promise.reject('上传失败'))
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').text()).toBe('正在上传')
    expect(wrapper.get('button').attributes()).toHaveProperty("disabled")
    await flushPromises() 
    expect(wrapper.get('button').text()).toBe('点击上传')
    expect(wrapper.findAll('li').length).toBe(2)
    const lastItem = wrapper.get('li:last-child')
    expect(lastItem.classes()).toContain('upload-error')
    await lastItem.get('.delete-icon').trigger('click')
    expect(wrapper.findAll('li').length).toBe(1)
  })
  it('should show the correct frame when using custom slot',async () => {
    mockedAxios.post.mockImplementationOnce(async () => Promise.resolve({data: {url: 'dummy.url'}}))
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url'
      },
      slots: {
        default: '<button>custom button</button>',
        loading: '<div class="loading">custom loading</div>',
        uploaded: `<template #uploaded="{uploadedData}">
          <div class="custom-loaded">{{ uploadedData.url }}</div>
        </template>`
      },
      global: {
        stubs: mockComponents
      }
    })
    expect(wrapper.get('button').text()).toBe('custom button')
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('.loading').text()).toBe('custom loading')
    await flushPromises()
    expect(wrapper.get('.custom-loaded').text()).toBe('dummy.url')
  })
  it('before upload check', async () => {
    const callback = jest.fn()
    mockedAxios.post.mockImplementationOnce(async () => Promise.resolve({data: {url: 'dummy.url'}}))
    const checkFileSize = (file: File) => {
      if(file.size > 2) {
        callback()
        return false
      }
      return true
    }
    const wrapper = mount(Uploader, {
      props: {
         action: 'test.url',
         beforeUpload: checkFileSize
      }
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
    expect(callback).toHaveBeenCalled()

  })
  it('before upload check using Promise', async () => { 
    mockedAxios.post.mockImplementationOnce(async () => Promise.resolve({ data: {url: 'dummy.url'}}))
    const failedPromise = (file: File) => {
      return Promise.reject('wrong type')
    }
    const successPromise = (file: File) => {
      const newFile = new File([file], 'new_name.docx', {type: file.type})
      return Promise.resolve(newFile)
    }
    const successPromiseWithWrongType = () => {
      return Promise.resolve('abcd') 
    }
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: failedPromise
      },
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)

    // success promise
     // success promise with wrong file
     await wrapper.setProps({ beforeUpload: successPromiseWithWrongType })
     await wrapper.get('input').trigger('change')
     await flushPromises()
     expect(mockedAxios.post).not.toHaveBeenCalled()
     expect(wrapper.findAll('li').length).toBe(0)
     // success promise with file
     await wrapper.setProps({beforeUpload: successPromise})
     await wrapper.get('input').trigger('change')
     await flushPromises()
     expect(mockedAxios.post).toHaveBeenCalled()
     const firstItem = wrapper.get('li:first-child')
     expect(firstItem.classes()).toContain('upload-success')
     expect(firstItem.get('.filename').text()).toBe('new_name.docx') 
  })
  afterEach(() => {
    mockedAxios.post.mockReset()
  })
})
