<script setup>
import {ref, onMounted} from 'vue';
import {useSocketStore} from "@/stores/socket.js";
import {generateUUID} from "@/utils/common.js";
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import {showToast, showNotify} from '@nutui/nutui'
import {Uploader} from '@nutui/icons-vue'

const socket = useSocketStore()

const uploadFiles = ref({});

onMounted(() => {
  // 监听进度
  socket.on(CE.FIlE_PROGRESS, ({fileId, progress}) => {
    const target = uploadFiles.value[fileId];
    if (target) target.progress = progress;
    if (parseInt(progress) === 100) socket.emit(CE.FIlE_END, {fileId});
  });

  socket.on(CE.FIlE_ACK, async ({fileId}) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const chunk = e.target.result;
      socket.emit(CE.FIlE_CHUNK, {fileId, chunk});
    };
    // 分片读取文件（可选分块逻辑）
    reader.readAsArrayBuffer(uploadFiles.value[fileId].file);
  });

  // 传输完成
  socket.on(CE.FIlE_COMPLETE, (fileId) => {
    // const target = uploadFiles.value[fileId];
    showToast.text('上传完成')
  });
})

const handleFileSelect = async (files) => {
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      handleUpload(files[i]);
    }
  }
  return files;
};

const handleUpload = (file) => {
  if (overSize(file)) return;
  const fileData = {
    id: generateUUID(),
    name: file.name,
    size: file.size,
    file: file,
    progress: 0
  };

  uploadFiles.value[fileData.id] = fileData;

  // 开始传输
  socket.emit(CE.FILE_START, {
    fileId: fileData.id,
    fileName: file.name,
    fileSize: file.size
  });


}

const overSize = (file) => {
  const maxSize = 1024 * 1024 * 500; // 300MB
  const isOverSize = file.size >= maxSize;
  if (isOverSize) {
    showNotify.danger(file.name + '超过500MB!');
  }
  return isOverSize;
};
</script>


<template>
  <div class="upload-container">
    <nut-uploader
        :auto-upload="false"
        :before-upload="handleFileSelect"
        multiple
    >
      <nut-button icon="plus" type="success">上传文件
        <template #icon>
          <Uploader/>
        </template>
      </nut-button>
    </nut-uploader>

    <div v-for="file in Object.values(uploadFiles)" :key="file.id" class="file-item">
      <nut-cell :title="file.name" :desc="`${file.progress}%`"/>
      <nut-progress :percentage="file.progress" stroke-width="4"/>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  padding: 16px;
}

.file-item {
  margin-top: 12px;
}
</style>