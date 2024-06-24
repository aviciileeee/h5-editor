<script setup lang="ts">
import axios from 'axios'
import { reactive, computed, PropType } from 'vue'
import { ref,defineProps } from 'vue'
import { v4 as uuidv4 } from 'uuid'
// import {  last } from 'lodash-es'
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  resp?: any;
}
type CheckUpload = (file: File) => boolean | Promise<File>
const props = defineProps({
  action: {
    type: String,
    required: true,
  },
  beforeUpload: {
    type: Function as PropType<CheckUpload>

  }
})
const fileRef = ref<null | HTMLInputElement>(null)
const uploadedFiles = ref<UploadFile[]>([])
const isUploading = computed(() => {
  return uploadedFiles.value.some(uploadFile => uploadFile.status === 'loading')
})
const lastFileData = computed(() => {
  const lastFile = uploadedFiles.value[uploadedFiles.value.length - 1]
  if(lastFile) {
    return {
      loaded: lastFile.status === 'success',
      data: lastFile.resp
    }
  }
  return null
})
const triggerUpload = () => {
  fileRef.value?.click()
}
const postFile = (uploadFile: File)  =>{
  const formData = new FormData()
    formData.append(uploadFile.name, uploadFile)
    const fileObj = reactive<UploadFile>({
      uid: uuidv4(),
      size: uploadFile.size,
      name: uploadFile.name,
      status: 'loading',
      raw: uploadFile
    })
    uploadedFiles.value.push(fileObj)
    axios.post(props.action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(resp => {
      fileObj.status = 'success'
      fileObj.resp = resp.data

    }).catch(error => {
      fileObj.status = 'error'

    }).finally(() => {
      if(fileRef.value) {
        fileRef.value.value = ''
      }
    })
}
const handleFileChange =  (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if(files) { 
    const uploadFile = files[0]
    if(props.beforeUpload) {
      const result = props.beforeUpload(uploadFile)
      if(result && result instanceof Promise) {
        result.then(processedFile => {
          if(processedFile instanceof File) {
            postFile(processedFile)
          } else {
            throw new Error('before upload promise should return file Object ')
          }
        }).catch(e => {
          console.error(e)
        })
      } else if(result === true) {
        postFile(uploadFile)
      }
    }  else {
      postFile(uploadFile)
    }
  }
}
const removeFile = (uid: string) => {
  uploadedFiles.value = uploadedFiles.value.filter(item => item.uid !== uid)
}
</script>
<template>
<div class="file-upload">
  <div class="upload-area"  @click="triggerUpload">
    <slot v-if="isUploading" name="loading">
      <button disabled>正在上传</button>
    </slot>
    <slot v-else-if="lastFileData && lastFileData.loaded" :uploadedData="lastFileData.data" name="uploaded">
      <button>点击上传</button>
    </slot>
    <slot v-else name="default">
      <button>点击上传</button>
    </slot>
  </div>
  <input type="file" ref="fileRef" @change="handleFileChange" hidden>
  <ul class="upload-list">
    <li :class="`uploaded-file upload-${file.status}`" v-for="file in uploadedFiles" :key="file.uid">
      <span v-if="file.status === 'loading'" class="file-icon"
        ><LoadingOutlined
      /></span> 
      <span v-else class="file-icon"><FileOutlined /></span>
      <span class="filename">{{ file.name }}</span>
      <span @click="removeFile(file.uid)" class="delete-icon"><DeleteOutlined/></span>
    </li>
  </ul>
</div>
</template>

<style scoped lang="scss">
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.upload-list li {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
  &:first-child {
    margin-top: 10px;
  }
  .upload-list-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    background-color: #fff;
    object-fit: cover;
  }
  .file-icon {
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .filename {
    margin-left: 5px;
    margin-right: 40px;
  }
  &.upload-error {
    color: #f5222d;
    svg {
      color: #f5222d;
    }
  }
  .file-status {
    display: block;
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
  }
  .delete-icon {
    display: none;
    position: absolute;
    right: 7px;
    top: 0;
    line-height: inherit;
    cursor: pointer;
  }
  &:hover {
    background-color: #efefef;
    .file-status {
      display: none;
    }
    .delete-icon {
      display: block;
    }
  }
}
</style>