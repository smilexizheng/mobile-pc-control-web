<script setup>
import {ref, onMounted} from 'vue';
import {useSocketStore} from "@/stores/socket.js";
import {generateUUID} from "@/utils/common.js";
import Message from "@/components/Message/UseMessage.js";
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";

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
    Message.success('上传成功');
  });
})

const handleFileSelect = async (files) => {
  if (Array.isArray(files) && files.length) {
    //多选
    for (const file of files) {
      await handleUpload(file);
    }
  } else { //单选
    await handleUpload(files);
  }
};

const handleUpload = async (file) => {
  const fileData = {
    id: generateUUID(),
    name: file.file.name,
    size: file.file.size,
    file: file.file,
    progress: 0
  };

  uploadFiles.value[fileData.id] = fileData;

  // 开始传输
  socket.emit(CE.FILE_START, {
    fileId: fileData.id,
    fileName: file.file.name,
    fileSize: file.file.size
  });


}

const isOverSize = (file) => {
  const maxSize = 500 * 1024 * 1024; // 500MB
  const isOverSize = file.size >= maxSize;
  if (isOverSize) {
    Message.error(file.name + '超出大小限制');
  }
  return isOverSize;
};
</script>


<template>
  <div class="upload-container">
    <van-uploader
        :after-read="handleFileSelect"
        :max-size="isOverSize"
        accept="*"
        multiple
    >
      <van-button icon="plus" type="primary">上传文件</van-button>
    </van-uploader>

    <div v-for="file in Object.values(uploadFiles)" :key="file.id" class="file-item">
      <van-cell :title="file.name" :value="`${file.progress}%`"/>
      <van-progress :percentage="file.progress" stroke-width="4"/>
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