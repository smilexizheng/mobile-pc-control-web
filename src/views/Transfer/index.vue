<script setup>
import {onMounted, ref} from 'vue';
import {useSocketStore} from "@/stores/socket.js";
import {generateUUID} from "@/utils/common.js";
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import {showNotify, showToast} from '@nutui/nutui'
import {Uploader} from '@nutui/icons-vue'

const socket = useSocketStore()

const uploadFiles = ref({});

onMounted(() => {
  // 监听进度
  socket.on(CE.FILE_PROGRESS, ({fileId, progress}) => {
    const target = uploadFiles.value[fileId];
    if (target) target.progress = progress;
    if (parseInt(progress) === 100) socket.emit(CE.FILE_END, {fileId});
  });

  socket.on(CE.FILE_ACK, async ({fileId}) => {
    const fileObj = uploadFiles.value[fileId];
    if (!fileObj) return;

    const CHUNK_SIZE = 1024 * 1024 * (navigator.connection?.downlink || 10); // 1MB 分片大小
    const file = fileObj.file;

    if (fileObj.offset === undefined) {
      fileObj.offset = 0;
      fileObj.chunkIndex = 0;
      fileObj.totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    }
    const reader = new FileReader();
    const end = Math.min(fileObj.offset + CHUNK_SIZE, file.size);
    reader.onload = (e) => {
      socket.emit(CE.FILE_CHUNK, {
        fileId,
        chunk: e.target.result,
        chunkIndex: fileObj.chunkIndex,
        totalChunks: fileObj.totalChunks,
        fileName: file.name,
        fileType: file.type
      });
      fileObj.offset = end;
      fileObj.chunkIndex++;
      if (fileObj.chunkIndex < fileObj.totalChunks) {
        readAsArrayBuffer(fileObj.chunkIndex * CHUNK_SIZE);
      }
    };

    reader.onerror = (error) => {
      showToast.text(`文件[${fileId}]分片读取失败:`, error);
    };

    function readAsArrayBuffer(start) {
      const chunk = file.slice(start, start + CHUNK_SIZE);
      reader.readAsArrayBuffer(chunk);
    }

    readAsArrayBuffer(0)
  });


  // 传输完成
  socket.on(CE.FILE_COMPLETE, (fileId) => {
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
  const maxSize = 1024 * 1024 * 5000; // 300MB
  const isOverSize = file.size >= maxSize;
  if (isOverSize) {
    showNotify.danger(file.name + '超过5GB!');
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